from __future__ import annotations

import hashlib
import json
import os
import platform
import shutil
import socket
import subprocess
import sys
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

VERSION = "0.1.0-alpha.0"
MCP_PROTOCOL_VERSION = "2024-11-05"
SETUP_TARGETS = ["generic", "claude", "codex", "cursor", "hermes", "openclaw"]
TARGET_LABELS = {
    "generic": "Generic MCP-aware agent",
    "claude": "Claude / Claude Code",
    "codex": "Codex CLI",
    "cursor": "Cursor",
    "hermes": "Hermes Agent",
    "openclaw": "OpenClaw",
}
LICENSE_FEATURES = ["founder-brief", "open-loops", "meeting-prep", "mcp"]


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")


def repo_root() -> Path:
    return Path(__file__).resolve().parents[2]


def print_json(value: Any) -> None:
    print(json.dumps(value, indent=2))


def config_dir(cwd: Path | None = None) -> Path:
    override = os.environ.get("LAURELINOS_CONFIG_DIR")
    if override:
        return Path(override).expanduser().resolve()
    return (cwd or Path.cwd()).joinpath(".laurelinos").resolve()


def ensure_local_config(cwd: Path | None = None) -> dict[str, str]:
    root = config_dir(cwd)
    logs = root / "logs"
    state = root / "state"
    logs.mkdir(parents=True, exist_ok=True)
    state.mkdir(parents=True, exist_ok=True)

    config_path = root / "config.json"
    if not config_path.exists():
        config_path.write_text(json.dumps({
            "version": 1,
            "mode": "local",
            "createdAt": utc_now(),
            "machine": {
                "hostname": socket.gethostname(),
                "platform": sys.platform,
                "arch": platform.machine(),
            },
            "safety": {
                "externalActionsRequireApproval": True,
                "indexDiscoveredPathsAutomatically": False,
                "secretsAllowedInLogs": False,
            },
        }, indent=2) + "\n")

    sources_path = root / "sources.json"
    if not sources_path.exists():
        sources_path.write_text(json.dumps({"sources": []}, indent=2) + "\n")

    audit_path = logs / "audit.jsonl"
    if not audit_path.exists():
        audit_path.write_text("")

    return {
        "configDir": str(root),
        "configPath": str(config_path),
        "sourcesPath": str(sources_path),
        "auditPath": str(audit_path),
    }


def read_sources(cwd: Path | None = None) -> dict[str, Any]:
    paths = ensure_local_config(cwd)
    return json.loads(Path(paths["sourcesPath"]).read_text())


def write_sources(data: dict[str, Any], cwd: Path | None = None) -> None:
    paths = ensure_local_config(cwd)
    Path(paths["sourcesPath"]).write_text(json.dumps(data, indent=2) + "\n")


def append_audit_event(event_type: str, details: dict[str, Any] | None = None, cwd: Path | None = None) -> dict[str, Any]:
    paths = ensure_local_config(cwd)
    event = {
        "id": str(uuid.uuid4()),
        "type": event_type,
        "createdAt": utc_now(),
        "actor": "local-user",
        "details": details or {},
    }
    with Path(paths["auditPath"]).open("a", encoding="utf-8") as handle:
        handle.write(json.dumps(event, separators=(",", ":")) + "\n")
    return event


def read_audit_events(cwd: Path | None = None) -> list[dict[str, Any]]:
    paths = ensure_local_config(cwd)
    content = Path(paths["auditPath"]).read_text().strip()
    if not content:
        return []
    return [json.loads(line) for line in content.splitlines()]


def command_status(command: str, version_args: list[str] | None = None) -> dict[str, Any]:
    version_args = version_args or ["--version"]
    if not shutil.which(command):
        return {"command": command, "available": False, "version": None}
    try:
        result = subprocess.run([command, *version_args], text=True, capture_output=True, check=False, timeout=4)
        version = (result.stdout or result.stderr).strip().splitlines()[0] if (result.stdout or result.stderr).strip() else None
        return {"command": command, "available": result.returncode == 0, "version": version}
    except Exception:
        return {"command": command, "available": False, "version": None}


def load_demo_brain(root: Path | None = None) -> dict[str, Any]:
    demo_path = (root or repo_root()) / "examples" / "demo-data" / "demo-brain.json"
    return json.loads(demo_path.read_text())


def days_between(start_date: str, end_date: str) -> int:
    start = datetime.fromisoformat(start_date).date()
    end = datetime.fromisoformat(end_date).date()
    return max(0, (end - start).days)


def source_by_id(brain: dict[str, Any]) -> dict[str, dict[str, Any]]:
    return {item["id"]: item for item in brain["artefacts"]}


def enrich_commitment(item: dict[str, Any], sources: dict[str, dict[str, Any]], current_date: str) -> dict[str, Any]:
    source = sources.get(item["source_id"], {})
    return {
        "id": item["id"],
        "description": item["description"],
        "owner": item["owner"],
        "counterparty": item["counterparty"],
        "counterpartyCompany": item["counterparty_company"],
        "createdAt": item["created_at"],
        "dueAt": item["due_at"],
        "daysOpen": days_between(item["created_at"], current_date),
        "severity": item["severity"],
        "nextStepType": item["next_step_type"],
        "sourceId": item["source_id"],
        "sourceTitle": source.get("title", item["source_id"]),
        "recommendedAction": item["recommended_action"],
        "approvalRequiredBeforeExternalAction": True,
    }


def open_commitments(brain: dict[str, Any]) -> list[dict[str, Any]]:
    sources = source_by_id(brain)
    current_date = brain["demo_current_date"]
    return [enrich_commitment(item, sources, current_date) for item in brain["commitments"] if item.get("status") == "open"]


def build_daily_brief(brain: dict[str, Any]) -> dict[str, Any]:
    commitments = open_commitments(brain)
    upcoming_meetings = []
    for item in brain["artefacts"]:
        if item.get("type") != "calendar_event":
            continue
        prep = next((prep for prep in brain["meeting_preps"] if prep["meeting_id"] == item["id"]), None)
        upcoming_meetings.append({
            "title": item["title"],
            "date": item["date"],
            "summary": item["summary"],
            "sourceId": item["id"],
            "prep": prep,
        })
    return {
        "organisation": brain["organisation"]["name"],
        "generatedAt": utc_now(),
        "demoCurrentDate": brain["demo_current_date"],
        "operatingContext": brain["operating_context"],
        "topPriorities": [item for item in commitments if item["severity"] == "high"],
        "openCommitments": commitments,
        "changesSinceLastBrief": brain["daily_changes"],
        "upcomingMeetings": upcoming_meetings,
        "meetingPrep": brain["meeting_preps"],
        "approvalRequired": True,
        "sourceIds": sorted({item["sourceId"] for item in commitments}),
    }


def detect_open_loops(brain: dict[str, Any]) -> list[dict[str, Any]]:
    return open_commitments(brain)


def build_meeting_prep(brain: dict[str, Any], query: str | None = None) -> dict[str, Any]:
    preps = brain["meeting_preps"]
    if query:
        needle = query.casefold()
        preps = [prep for prep in preps if needle in prep["title"].casefold() or any(needle in participant.casefold() for participant in prep.get("participants", []))]
    return {
        "organisation": brain["organisation"]["name"],
        "demoCurrentDate": brain["demo_current_date"],
        "meetingPrep": preps,
        "approvalRequiredBeforeExternalAction": True,
        "syntheticDataOnly": True,
    }


def format_days_open(days_open: int) -> str:
    return f"{days_open} {'day' if days_open == 1 else 'days'} open"


def print_brief(brief: dict[str, Any]) -> None:
    print(f"# Daily Founder Brief — {brief['organisation']}")
    print()
    print(f"Generated: {brief['generatedAt']}")
    print(f"Demo date: {brief['demoCurrentDate']}")
    print()
    print("## Founder operating context")
    for item in brief["operatingContext"]:
        print(f"- {item['area']}: {item['status']}")
        print(f"  - Sources: {', '.join(item['source_ids'])}")
    print()
    print("## Top priorities")
    for item in brief["topPriorities"]:
        print(f"- {item['description']}")
        print(f"  - Owner: {item['owner']}")
        print(f"  - Counterparty: {item['counterparty']} ({item['counterpartyCompany']})")
        print(f"  - Due: {item['dueAt']}")
        print(f"  - Source: {item['sourceId']} — {item['sourceTitle']}")
        print(f"  - Recommended action: {item['recommendedAction']}")
        print("  - Approval required before external action: yes")
    print()
    print("## Open commitments")
    for item in brief["openCommitments"]:
        print(f"- [{item['severity']}] {item['description']}")
        print(f"  - Owner: {item['owner']}")
        print(f"  - Age: {format_days_open(item['daysOpen'])}")
        print(f"  - Due: {item['dueAt']}")
        print(f"  - Source: {item['sourceId']}")
    print()
    print("## Changes since last brief")
    for change in brief["changesSinceLastBrief"]:
        print(f"- {change}")
    print()
    print("## Upcoming meetings and prep")
    for meeting in brief["upcomingMeetings"]:
        print(f"- {meeting['date']}: {meeting['title']}")
        print(f"  - {meeting['summary']}")
        print(f"  - Source: {meeting['sourceId']}")
        if meeting.get("prep"):
            prep = meeting["prep"]
            print(f"  - Objective: {prep['objective']}")
            print("  - Suggested agenda:")
            for agenda_item in prep["suggested_agenda"]:
                print(f"    - {agenda_item}")
            print("  - Likely questions:")
            for question in prep["likely_questions"]:
                print(f"    - {question}")
            print(f"  - Sources: {', '.join(prep['source_ids'])}")
    print()
    print("External actions require approval: yes")


def print_open_loops(loops: list[dict[str, Any]]) -> None:
    print("# Open Loops")
    print()
    for loop in loops:
        print(f"- [{loop['severity']}] {loop['description']}")
        print(f"  - Owner: {loop['owner']}")
        print(f"  - Counterparty: {loop['counterparty']} ({loop['counterpartyCompany']})")
        print(f"  - Age: {format_days_open(loop['daysOpen'])}")
        print(f"  - Due: {loop['dueAt']}")
        print(f"  - Source: {loop['sourceId']} — {loop['sourceTitle']}")
        print(f"  - Next-step type: {loop['nextStepType']}")
        print(f"  - Recommended action: {loop['recommendedAction']}")
        print("  - Approval required before external action: yes")


def print_meeting_prep(result: dict[str, Any]) -> None:
    print(f"# Meeting Prep — {result['organisation']}")
    print()
    print(f"Demo date: {result['demoCurrentDate']}")
    print("Synthetic data only: yes")
    print()
    for prep in result["meetingPrep"]:
        print(f"- {prep['date']}: {prep['title']}")
        print(f"  - Participants: {', '.join(prep['participants'])}")
        print(f"  - Objective: {prep['objective']}")
        print("  - Suggested agenda:")
        for agenda_item in prep["suggested_agenda"]:
            print(f"    - {agenda_item}")
        print("  - Likely questions:")
        for question in prep["likely_questions"]:
            print(f"    - {question}")
        print(f"  - Sources: {', '.join(prep['source_ids'])}")
        print("  - Approval required before external action: yes")


def license_path(cwd: Path | None = None) -> Path:
    paths = ensure_local_config(cwd)
    return Path(paths["configDir"]) / "license.json"


def read_license_status(cwd: Path | None = None) -> dict[str, Any]:
    path = license_path(cwd)
    if not path.exists():
        return {
            "status": "demo",
            "product": "LaurelinOS",
            "plan": "free-demo",
            "licensePath": str(path),
            "paidFeaturesActive": False,
            "demoCommandsAvailable": True,
            "licenseRequiredForDemo": False,
            "features": ["doctor", "init-local", "sources", "audit", "brief-demo", "open-loops-demo", "meeting-prep-demo", "mcp-stdio"],
            "notes": [
                "No local license file found.",
                "Synthetic demo commands remain available without a license.",
                "Paid FounderOS pilots should use a Laurelin-issued activation token later.",
            ],
        }
    license_data = json.loads(path.read_text())
    return {
        "status": license_data["status"],
        "product": license_data["product"],
        "plan": license_data["plan"],
        "subject": license_data["subject"],
        "licensePath": str(path),
        "activatedAt": license_data["activatedAt"],
        "paidFeaturesActive": license_data["status"] == "local-activated",
        "demoCommandsAvailable": True,
        "licenseRequiredForDemo": False,
        "features": license_data.get("features", []),
        "notes": license_data.get("notes", []),
    }


def activate_license(token: str, cwd: Path | None = None) -> dict[str, Any]:
    if not token or len(token) < 16:
        raise ValueError("Activation token is required and must be at least 16 characters.")
    token_hash = hashlib.sha256(token.encode("utf-8")).hexdigest()
    activated_at = utc_now()
    path = license_path(cwd)
    license_data = {
        "licenseVersion": 1,
        "product": "FounderOS",
        "subject": "local-pilot",
        "plan": "founderos-pilot",
        "status": "local-activated",
        "activatedAt": activated_at,
        "entitlementSource": "manual-local-token",
        "tokenHash": token_hash,
        "features": LICENSE_FEATURES,
        "notes": [
            "Local-only activation record for manual FounderOS pilots.",
            "This token was not validated against Stripe or a hosted entitlement service.",
            "The raw activation token is not stored.",
        ],
    }
    path.write_text(json.dumps(license_data, indent=2) + "\n")
    path.chmod(0o600)
    event = append_audit_event("license_activated_local", {
        "product": license_data["product"],
        "plan": license_data["plan"],
        "status": license_data["status"],
        "tokenHash": token_hash,
    }, cwd)
    return {"license": license_data, "licensePath": str(path), "auditEvent": event}


def bin_path(root: Path | None = None) -> Path:
    return (root or repo_root()) / "bin" / "laurelinos.py"


def build_mcp_server_spec(root: Path | None = None) -> dict[str, Any]:
    return {
        "name": "laurelinos",
        "transport": "stdio",
        "command": "python3",
        "args": [str(bin_path(root)), "mcp", "serve"],
        "env": {},
        "notes": [
            "Use the direct python3 command, not npm run, so stdout remains valid JSON-RPC.",
            "Use an absolute path during local development.",
            "The v0 server is local stdio only and must not be exposed as a public network service.",
        ],
    }


def build_agent_setup_plan(target: str, root: Path | None = None) -> dict[str, Any]:
    target = (target or "generic").lower()
    if target not in SETUP_TARGETS:
        raise ValueError(f"Unknown setup target: {target}. Expected one of: {', '.join(SETUP_TARGETS)}")
    cli_path = bin_path(root)
    return {
        "product": "LaurelinOS",
        "target": target,
        "targetLabel": TARGET_LABELS[target],
        "purpose": "Configure LaurelinOS as a local company-brain substrate for an existing agent runtime.",
        "runtime": "python",
        "modelStrategy": "The existing agent runtime owns model calls and provider credentials. LaurelinOS owns state, source policy, approvals, audit, and workflows.",
        "mcpServer": build_mcp_server_spec(root),
        "setupCommands": [
            f"python3 {json.dumps(str(cli_path))} doctor",
            f"python3 {json.dumps(str(cli_path))} init --local",
            f"python3 {json.dumps(str(cli_path))} license status",
            f"python3 {json.dumps(str(cli_path))} brief --demo",
            f"python3 {json.dumps(str(cli_path))} open-loops --demo",
            f"python3 {json.dumps(str(cli_path))} prepare-meeting --demo",
        ],
        "smokeTest": {
            "description": "Verify the MCP server responds over stdio with tool metadata.",
            "command": f"printf '%s\\n' '{{\"jsonrpc\":\"2.0\",\"id\":1,\"method\":\"initialize\",\"params\":{{}}}}' '{{\"jsonrpc\":\"2.0\",\"id\":2,\"method\":\"tools/list\",\"params\":{{}}}}' | python3 {json.dumps(str(cli_path))} mcp serve",
            "expectedTools": ["get_status", "get_daily_brief", "get_open_loops", "prepare_meeting"],
        },
        "agentPrompt": f"Install LaurelinOS into this {TARGET_LABELS[target]} environment as a local stdio MCP server. Do not install Hermes or OpenClaw. Do not ask for model-provider credentials. Run only synthetic demo commands. Configure the LaurelinOS MCP server using the host agent's documented config format. Verify tools/list includes get_status, get_daily_brief, get_open_loops, and prepare_meeting. Do not add, approve, read, or index real source folders unless I explicitly choose a path and approve it. Report exactly what files you changed.",
        "safetyConstraints": [
            "Do not install, download, run, vendor, or supervise Hermes/OpenClaw from LaurelinOS.",
            "Do not ask for or store raw model-provider credentials in LaurelinOS.",
            "Do not expose LaurelinOS MCP over a public port or remote endpoint.",
            "Do not read or index real local folders until the user adds and approves a source explicitly.",
            "Do not mutate email, calendar, CRM, GitHub, Stripe, DNS, cloud, or customer systems without explicit approval.",
            "Report every host-agent config file changed during setup.",
        ],
        "nextSteps": [
            "Copy the mcpServer object into the host agent MCP configuration using that host agent's documented format.",
            "Restart or reload the host agent if required.",
            "Run the smoke test or ask the host agent to list LaurelinOS MCP tools.",
            "Keep demo mode synthetic until a user explicitly approves real sources.",
        ],
    }


def verify_agentic_setup(root: Path | None = None) -> dict[str, Any]:
    cli_path = bin_path(root)
    node_major = 0
    try:
        node_major = int(platform.python_version_tuple()[0])
    except Exception:
        node_major = 0
    return {
        "product": "LaurelinOS",
        "ready": cli_path.exists(),
        "cliPath": str(cli_path),
        "runtime": "python",
        "pythonVersion": sys.version.split()[0],
        "mcpServer": build_mcp_server_spec(root),
        "checks": [
            {"name": "cli_exists", "ok": cli_path.exists(), "detail": str(cli_path)},
            {"name": "python_major_at_least_3", "ok": node_major >= 3, "detail": sys.version.split()[0]},
            {"name": "mcp_command_available", "ok": cli_path.exists(), "detail": f"python3 {json.dumps(str(cli_path))} mcp serve"},
        ],
        "safeToProceedWithSyntheticDemo": cli_path.exists() and node_major >= 3,
        "reminder": "This verification does not install third-party agents, read real sources, expose remote MCP, or contact model providers.",
    }


MCP_TOOLS = [
    {"name": "get_status", "description": "Return local LaurelinOS runtime status.", "inputSchema": {"type": "object", "properties": {}, "additionalProperties": False}},
    {"name": "get_daily_brief", "description": "Return a synthetic daily founder brief.", "inputSchema": {"type": "object", "properties": {}, "additionalProperties": False}},
    {"name": "get_open_loops", "description": "Return synthetic open loops.", "inputSchema": {"type": "object", "properties": {}, "additionalProperties": False}},
    {"name": "prepare_meeting", "description": "Return synthetic meeting-prep context.", "inputSchema": {"type": "object", "properties": {"query": {"type": "string"}}, "additionalProperties": False}},
]


def rpc_result(message_id: Any, result: Any) -> dict[str, Any]:
    return {"jsonrpc": "2.0", "id": message_id, "result": result}


def rpc_error(message_id: Any, code: int, message: str) -> dict[str, Any]:
    return {"jsonrpc": "2.0", "id": message_id, "error": {"code": code, "message": message}}


def text_content(value: Any) -> dict[str, Any]:
    return {"content": [{"type": "text", "text": json.dumps(value, indent=2)}]}


def handle_mcp_message(message: dict[str, Any], root: Path | None = None) -> dict[str, Any] | None:
    message_id = message.get("id")
    method = message.get("method")
    params = message.get("params") or {}
    if method == "initialize":
        return rpc_result(message_id, {"protocolVersion": MCP_PROTOCOL_VERSION, "serverInfo": {"name": "laurelinos", "version": VERSION}, "capabilities": {"tools": {}}})
    if method == "tools/list":
        return rpc_result(message_id, {"tools": MCP_TOOLS})
    if method == "notifications/initialized":
        return None
    if method == "tools/call":
        brain = load_demo_brain(root)
        name = params.get("name")
        arguments = params.get("arguments") or {}
        if name == "get_status":
            return rpc_result(message_id, text_content({
                "status": "ok",
                "mode": "local-first MVP",
                "runtime": "python",
                "repo": "Finberg-Laurelin-CEO/laurelinos",
                "transport": "stdio",
                "readOnly": True,
                "syntheticDataOnly": True,
                "externalActionsRequireApproval": True,
                "tools": [tool["name"] for tool in MCP_TOOLS],
            }))
        if name == "get_daily_brief":
            return rpc_result(message_id, text_content(build_daily_brief(brain)))
        if name == "get_open_loops":
            return rpc_result(message_id, text_content({"openLoops": detect_open_loops(brain)}))
        if name == "prepare_meeting":
            return rpc_result(message_id, text_content(build_meeting_prep(brain, arguments.get("query"))))
        return rpc_error(message_id, -32602, f"Unknown tool: {name}")
    return rpc_error(message_id, -32601, f"Unknown method: {method}")


def handle_mcp_line(line: str, root: Path | None = None) -> dict[str, Any] | None:
    try:
        message = json.loads(line)
    except Exception:
        return rpc_error(None, -32700, "Parse error")
    try:
        return handle_mcp_message(message, root)
    except Exception as exc:
        return rpc_error(message.get("id"), -32000, str(exc))


def usage(exit_code: int = 0) -> None:
    print("""LaurelinOS local-first runtime

Usage:
  laurelinos doctor
  laurelinos init --local
  laurelinos sources list
  laurelinos sources add <name> <path>
  laurelinos sources show <name>
  laurelinos sources approve <name>
  laurelinos audit log
  laurelinos audit show <id>
  laurelinos license status
  laurelinos license activate <token>
  laurelinos setup agent <generic|claude|codex|cursor|hermes|openclaw> [--json]
  laurelinos setup verify [--json]
  laurelinos brain status
  laurelinos brief --demo [--json]
  laurelinos open-loops --demo [--json]
  laurelinos prepare-meeting --demo [--json] [--for <query>]
  laurelinos mcp serve
""")
    raise SystemExit(exit_code)


def has_flag(args: list[str], flag: str) -> bool:
    return flag in args


def value_after(args: list[str], flag: str) -> str | None:
    if flag not in args:
        return None
    index = args.index(flag)
    if index + 1 >= len(args):
        return None
    return args[index + 1]


def cmd_doctor() -> None:
    root = repo_root()
    report = {
        "project": "LaurelinOS",
        "mode": "local-first MVP",
        "runtime": "python",
        "repo": "https://github.com/Finberg-Laurelin-CEO/laurelinos",
        "platform": {
            "os": sys.platform,
            "release": platform.release(),
            "arch": platform.machine(),
            "hostname": socket.gethostname(),
            "python": sys.version.split()[0],
        },
        "paths": {"cwd": str(Path.cwd()), "configDir": str(config_dir()), "repoRoot": str(root)},
        "tools": [
            command_status("git"),
            command_status("gh", ["--version"]),
            command_status("python3", ["--version"]),
            command_status("node", ["--version"]),
            command_status("npm", ["--version"]),
            command_status("gbrain", ["--version"]),
            command_status("claude", ["--version"]),
            command_status("codex", ["--version"]),
        ],
        "warnings": [
            "GBrain, Claude, Codex, Hermes, and OpenClaw are optional for the synthetic demo.",
            "Do not index real folders until a source is explicitly approved.",
            "External actions must remain approval-gated.",
        ],
    }
    print_json(report)


def cmd_init(args: list[str]) -> None:
    if not has_flag(args, "--local"):
        print("Use `laurelinos init --local` for the v0 MVP.", file=sys.stderr)
        raise SystemExit(1)
    paths = ensure_local_config()
    print("Initialised LaurelinOS local config.")
    print(f"Config directory: {paths['configDir']}")
    print("No secrets were created or stored.")


def find_source(data: dict[str, Any], name: str) -> dict[str, Any]:
    for source in data["sources"]:
        if source["name"] == name:
            return source
    print(f"Unknown source: {name}", file=sys.stderr)
    raise SystemExit(1)


def cmd_sources(args: list[str]) -> None:
    if len(args) < 2:
        usage(1)
    sub = args[1]
    if sub == "list":
        data = read_sources()
        if not data["sources"]:
            print("No sources configured. Add one with `laurelinos sources add <name> <path>`.")
            return
        print_json(data)
        return
    if sub == "show":
        if len(args) < 3:
            print("Usage: laurelinos sources show <name>", file=sys.stderr)
            raise SystemExit(1)
        print_json(find_source(read_sources(), args[2]))
        return
    if sub == "add":
        if len(args) < 4:
            print("Usage: laurelinos sources add <name> <path>", file=sys.stderr)
            raise SystemExit(1)
        name = args[2]
        source_path = Path(args[3]).resolve()
        if not source_path.exists():
            print(f"Path does not exist: {source_path}", file=sys.stderr)
            raise SystemExit(1)
        data = read_sources()
        record = {
            "name": name,
            "path": str(source_path),
            "addedAt": utc_now(),
            "approvedForIndexing": False,
            "approvalStatus": "candidate",
            "note": "Added as a source candidate. Indexing is disabled until explicitly approved.",
        }
        for index, source in enumerate(data["sources"]):
            if source["name"] == name:
                data["sources"][index] = record
                break
        else:
            data["sources"].append(record)
        write_sources(data)
        event = append_audit_event("source_candidate_added", {"sourceName": name, "path": str(source_path), "approvedForIndexing": False})
        print(f"Added source candidate: {name}")
        print(f"Path: {source_path}")
        print(f"Audit event: {event['id']}")
        print("Indexing remains disabled until explicitly approved.")
        return
    if sub == "approve":
        if len(args) < 3:
            print("Usage: laurelinos sources approve <name>", file=sys.stderr)
            raise SystemExit(1)
        name = args[2]
        data = read_sources()
        source = find_source(data, name)
        if source.get("approvedForIndexing"):
            print(f"Source already approved: {name}")
            print(f"Approval event: {source.get('approvalEventId', 'unknown')}")
            return
        event = append_audit_event("source_approved_for_indexing", {
            "sourceName": source["name"],
            "path": source["path"],
            "previousApprovalStatus": source.get("approvalStatus", "candidate"),
            "approvedForIndexing": True,
        })
        source["approvedForIndexing"] = True
        source["approvalStatus"] = "approved"
        source["approvedAt"] = event["createdAt"]
        source["approvedBy"] = event["actor"]
        source["approvalEventId"] = event["id"]
        source["note"] = "Approved for future indexing by explicit local command. No indexing was performed by this command."
        write_sources(data)
        print(f"Approved source for future indexing: {name}")
        print(f"Path: {source['path']}")
        print(f"Audit event: {event['id']}")
        print("No indexing was performed.")
        return
    usage(1)


def cmd_audit(args: list[str]) -> None:
    if len(args) < 2:
        usage(1)
    if args[1] == "log":
        print_json({"events": read_audit_events()})
        return
    if args[1] == "show":
        if len(args) < 3:
            print("Usage: laurelinos audit show <id>", file=sys.stderr)
            raise SystemExit(1)
        for event in read_audit_events():
            if event["id"] == args[2]:
                print_json(event)
                return
        print(f"Unknown audit event: {args[2]}", file=sys.stderr)
        raise SystemExit(1)
    usage(1)


def cmd_license(args: list[str]) -> None:
    if len(args) < 2:
        usage(1)
    if args[1] == "status":
        print_json(read_license_status())
        return
    if args[1] == "activate":
        if len(args) < 3:
            print("Usage: laurelinos license activate <token>", file=sys.stderr)
            raise SystemExit(1)
        try:
            result = activate_license(args[2])
        except ValueError as exc:
            print(str(exc), file=sys.stderr)
            raise SystemExit(1) from exc
        print("Activated local FounderOS license record.")
        print(f"License path: {result['licensePath']}")
        print(f"Audit event: {result['auditEvent']['id']}")
        print("Raw activation token was not stored.")
        print("No Stripe or hosted entitlement service was contacted.")
        return
    usage(1)


def print_setup_plan(plan: dict[str, Any]) -> None:
    print(f"# LaurelinOS agentic setup plan: {plan['targetLabel']}")
    print()
    print(plan["purpose"])
    print()
    print("## MCP server")
    print(f"- Name: {plan['mcpServer']['name']}")
    print(f"- Transport: {plan['mcpServer']['transport']}")
    print(f"- Command: {plan['mcpServer']['command']}")
    print(f"- Args: {' '.join(plan['mcpServer']['args'])}")
    print()
    print("## Agent prompt")
    print(plan["agentPrompt"])
    print()
    print("## Safety constraints")
    for constraint in plan["safetyConstraints"]:
        print(f"- {constraint}")
    print()
    print("## Smoke test")
    print(plan["smokeTest"]["command"])


def cmd_setup(args: list[str]) -> None:
    if len(args) < 2:
        usage(1)
    if args[1] == "agent":
        target = args[2] if len(args) >= 3 and not args[2].startswith("--") else "generic"
        try:
            plan = build_agent_setup_plan(target)
        except ValueError as exc:
            print(str(exc), file=sys.stderr)
            raise SystemExit(1) from exc
        print_json(plan) if has_flag(args, "--json") else print_setup_plan(plan)
        return
    if args[1] == "verify":
        result = verify_agentic_setup()
        if has_flag(args, "--json"):
            print_json(result)
        else:
            print("# LaurelinOS agentic setup verification")
            print(f"Ready: {'yes' if result['ready'] else 'no'}")
            print(f"CLI path: {result['cliPath']}")
            print(f"Python: {result['pythonVersion']}")
            for check in result["checks"]:
                print(f"- {check['name']}: {'ok' if check['ok'] else 'failed'} ({check['detail']})")
            print(result["reminder"])
        return
    usage(1)


def cmd_brain(args: list[str]) -> None:
    if len(args) < 2 or args[1] != "status":
        usage(1)
    paths = ensure_local_config()
    sources = read_sources()
    demo_path = repo_root() / "examples" / "demo-data" / "demo-brain.json"
    print_json({
        "status": "local runtime ready",
        "runtime": "python",
        "configDir": paths["configDir"],
        "sourceCount": len(sources["sources"]),
        "approvedSourceCount": len([source for source in sources["sources"] if source.get("approvedForIndexing")]),
        "auditLogAvailable": Path(paths["auditPath"]).exists(),
        "gbrain": command_status("gbrain", ["--version"]),
        "demoDataAvailable": demo_path.exists(),
        "externalActionsRequireApproval": True,
        "notes": [
            "This command does not initialise or mutate GBrain.",
            "Use synthetic demo workflows until real sources are explicitly approved.",
        ],
    })


def cmd_brief(args: list[str]) -> None:
    if not has_flag(args, "--demo"):
        print("The v0 brief command only supports `--demo`.", file=sys.stderr)
        raise SystemExit(1)
    brief = build_daily_brief(load_demo_brain())
    print_json(brief) if has_flag(args, "--json") else print_brief(brief)


def cmd_open_loops(args: list[str]) -> None:
    if not has_flag(args, "--demo"):
        print("The v0 open-loops command only supports `--demo`.", file=sys.stderr)
        raise SystemExit(1)
    loops = detect_open_loops(load_demo_brain())
    print_json({"openLoops": loops}) if has_flag(args, "--json") else print_open_loops(loops)


def cmd_prepare_meeting(args: list[str]) -> None:
    if not has_flag(args, "--demo"):
        print("The v0 prepare-meeting command only supports `--demo`.", file=sys.stderr)
        raise SystemExit(1)
    result = build_meeting_prep(load_demo_brain(), value_after(args, "--for"))
    print_json(result) if has_flag(args, "--json") else print_meeting_prep(result)


def cmd_mcp(args: list[str]) -> None:
    if len(args) < 2 or args[1] != "serve":
        usage(1)
    print("LaurelinOS MCP stdio server started. Synthetic read-only tools only.", file=sys.stderr)
    for raw_line in sys.stdin:
        line = raw_line.strip()
        if not line:
            continue
        response = handle_mcp_line(line)
        if response is not None:
            print(json.dumps(response), flush=True)


def main(argv: list[str] | None = None) -> int:
    args = list(sys.argv[1:] if argv is None else argv)
    if not args or args[0] in {"--help", "-h"}:
        usage(0)
    command = args[0]
    if command == "doctor":
        cmd_doctor()
    elif command == "init":
        cmd_init(args)
    elif command == "sources":
        cmd_sources(args)
    elif command == "audit":
        cmd_audit(args)
    elif command == "license":
        cmd_license(args)
    elif command == "setup":
        cmd_setup(args)
    elif command == "brain":
        cmd_brain(args)
    elif command == "brief":
        cmd_brief(args)
    elif command == "open-loops":
        cmd_open_loops(args)
    elif command == "prepare-meeting":
        cmd_prepare_meeting(args)
    elif command == "mcp":
        cmd_mcp(args)
    else:
        usage(1)
    return 0
