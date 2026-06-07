from __future__ import annotations

import json
import os
import subprocess
import tempfile
import unittest
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[1]
CLI = REPO_ROOT / "bin" / "laurelinos.py"


def run_cli(*args: str, cwd: Path | None = None, env: dict[str, str] | None = None) -> str:
    merged_env = os.environ.copy()
    if env:
        merged_env.update(env)
    return subprocess.check_output(["python3", str(CLI), *args], cwd=cwd or REPO_ROOT, env=merged_env, text=True)


class PythonRuntimeTest(unittest.TestCase):
    def test_doctor_reports_python_runtime(self) -> None:
        output = run_cli("doctor")
        parsed = json.loads(output)
        self.assertEqual(parsed["project"], "LaurelinOS")
        self.assertEqual(parsed["runtime"], "python")
        self.assertEqual(parsed["repo"], "https://github.com/Finberg-Laurelin-CEO/laurelinos")

    def test_prepare_meeting_demo_filters_by_query(self) -> None:
        output = run_cli("prepare-meeting", "--demo", "--for", "Beacon", "--json")
        parsed = json.loads(output)
        self.assertEqual(parsed["organisation"], "ArcLight Labs")
        self.assertEqual(parsed["syntheticDataOnly"], True)
        self.assertEqual(len(parsed["meetingPrep"]), 1)
        self.assertEqual(parsed["meetingPrep"][0]["title"], "Beacon design-partner demo")
        self.assertIn("internal_note_2026_06_06_demo_risks", parsed["meetingPrep"][0]["source_ids"])

    def test_source_approval_does_not_index_contents(self) -> None:
        with tempfile.TemporaryDirectory(prefix="laurelinos-py-test-") as tmp_name:
            tmp = Path(tmp_name)
            source = tmp / "source"
            source.mkdir()
            (source / "private.md").write_text("PRIVATE_APPROVAL_TOKEN=do-not-read\n")

            add_output = run_cli("sources", "add", "notes", str(source), cwd=tmp)
            self.assertIn("Indexing remains disabled", add_output)
            approve_output = run_cli("sources", "approve", "notes", cwd=tmp)
            self.assertIn("No indexing was performed", approve_output)

            shown = json.loads(run_cli("sources", "show", "notes", cwd=tmp))
            self.assertEqual(shown["approvedForIndexing"], True)
            self.assertNotIn("PRIVATE_APPROVAL_TOKEN", json.dumps(shown))

    def test_approved_source_index_search_show_and_feedback(self) -> None:
        with tempfile.TemporaryDirectory(prefix="laurelinos-index-test-") as tmp_name:
            tmp = Path(tmp_name)
            source = tmp / "source"
            source.mkdir()
            (source / "northstar.md").write_text("# Northstar Memo\nSam asked for pilot metrics before Monday.\n")
            (source / "secret.txt").write_text("OPENAI_API_KEY=not-real-but-should-skip\n")
            (source / "image.png").write_text("not indexed\n")

            run_cli("init", "--local", cwd=tmp)
            run_cli("sources", "add", "notes", str(source), cwd=tmp)
            denied = subprocess.run(["python3", str(CLI), "sources", "scan", "notes", "--json"], cwd=tmp, text=True, capture_output=True)
            self.assertNotEqual(denied.returncode, 0)
            self.assertIn("not approved", denied.stderr)

            run_cli("sources", "approve", "notes", cwd=tmp)
            scan = json.loads(run_cli("sources", "scan", "notes", "--json", cwd=tmp))
            self.assertEqual(scan["eligibleFileCount"], 2)
            self.assertEqual(scan["skippedFileCount"], 1)

            indexed = json.loads(run_cli("sources", "index", "notes", "--json", cwd=tmp))
            self.assertEqual(indexed["indexedDocumentCount"], 1)
            self.assertEqual(indexed["skippedSecretLikeFiles"], ["secret.txt"])
            document_id = indexed["documents"][0]["id"]

            search = json.loads(run_cli("brain", "search", "pilot", "--json", cwd=tmp))
            self.assertEqual(search["results"][0]["id"], document_id)
            self.assertIn("source IDs", " ".join(search["notes"]))

            shown = json.loads(run_cli("brain", "show", document_id, "--json", cwd=tmp))
            self.assertEqual(shown["title"], "Northstar Memo")
            self.assertIn("pilot metrics", shown["content"])

            feedback = json.loads(run_cli("brain", "feedback", "add", document_id, "Prefer investor summary", "--label", "preference", "--json", cwd=tmp))
            self.assertEqual(feedback["feedback"]["label"], "preference")
            search_after_feedback = json.loads(run_cli("brain", "search", "pilot", "--json", cwd=tmp))
            self.assertEqual(search_after_feedback["results"][0]["feedbackCount"], 1)

    def test_setup_agent_points_to_python_mcp_server(self) -> None:
        output = run_cli("setup", "agent", "hermes", "--json")
        parsed = json.loads(output)
        self.assertEqual(parsed["runtime"], "python")
        self.assertEqual(parsed["mcpServer"]["command"], "python3")
        self.assertEqual(parsed["mcpServer"]["args"][-2:], ["mcp", "serve"])
        self.assertIn("search_memory", parsed["smokeTest"]["expectedTools"])
        self.assertIn("Do not install Hermes or OpenClaw", parsed["agentPrompt"])

    def test_mcp_record_feedback_requires_explicit_approval(self) -> None:
        input_lines = json.dumps({
            "jsonrpc": "2.0",
            "id": 1,
            "method": "tools/call",
            "params": {"name": "record_feedback", "arguments": {"documentId": "src_missing", "note": "remember this", "approved": False}},
        }) + "\n"
        result = subprocess.run(["python3", str(CLI), "mcp", "serve"], cwd=REPO_ROOT, input=input_lines, text=True, capture_output=True, check=True)
        response = json.loads(result.stdout.strip())
        self.assertEqual(response["error"]["code"], -32602)
        self.assertIn("approved: true", response["error"]["message"])

    def test_mcp_stdio_exposes_meeting_prep_tool(self) -> None:
        input_lines = "\n".join([
            json.dumps({"jsonrpc": "2.0", "id": 1, "method": "initialize", "params": {}}),
            json.dumps({"jsonrpc": "2.0", "id": 2, "method": "tools/list", "params": {}}),
            json.dumps({"jsonrpc": "2.0", "id": 3, "method": "tools/call", "params": {"name": "prepare_meeting", "arguments": {"query": "Northstar"}}}),
        ]) + "\n"
        result = subprocess.run(["python3", str(CLI), "mcp", "serve"], cwd=REPO_ROOT, input=input_lines, text=True, capture_output=True, check=True)
        responses = [json.loads(line) for line in result.stdout.strip().splitlines()]
        tool_names = [tool["name"] for tool in responses[1]["result"]["tools"]]
        self.assertIn("prepare_meeting", tool_names)
        self.assertIn("search_memory", tool_names)
        self.assertIn("record_feedback", tool_names)
        prep = json.loads(responses[2]["result"]["content"][0]["text"])
        self.assertEqual(prep["meetingPrep"][0]["title"], "Northstar partner meeting")


if __name__ == "__main__":
    unittest.main()
