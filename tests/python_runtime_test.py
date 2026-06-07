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

    def test_setup_agent_points_to_python_mcp_server(self) -> None:
        output = run_cli("setup", "agent", "hermes", "--json")
        parsed = json.loads(output)
        self.assertEqual(parsed["runtime"], "python")
        self.assertEqual(parsed["mcpServer"]["command"], "python3")
        self.assertEqual(parsed["mcpServer"]["args"][-2:], ["mcp", "serve"])
        self.assertIn("Do not install Hermes or OpenClaw", parsed["agentPrompt"])

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
        prep = json.loads(responses[2]["result"]["content"][0]["text"])
        self.assertEqual(prep["meetingPrep"][0]["title"], "Northstar partner meeting")


if __name__ == "__main__":
    unittest.main()
