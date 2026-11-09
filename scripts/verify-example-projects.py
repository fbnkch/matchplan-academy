"""Check vendored original bytes offline. Never imports or executes their code."""
import hashlib
import json
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
ORIGINALS = ROOT / "Beispielprojekte" / "Originale"


def verify() -> int:
    manifest = json.loads((ORIGINALS / "manifest.json").read_text(encoding="utf-8-sig"))
    errors, count = [], 0
    identities = set()
    for project in manifest["projects"]:
        if project["id"] in identities:
            raise ValueError("Duplicate project ID")
        identities.add(project["id"])
        base = (ROOT / project["localPath"]).resolve()
        if not base.is_relative_to(ORIGINALS.resolve()) or base == ORIGINALS.resolve():
            raise ValueError("Invalid project directory")
        if project["license"] != "MIT" or not re.fullmatch(r"[0-9a-f]{40}", project["revision"]):
            raise ValueError("Missing pinned revision or expected MIT declaration")
        expected = set()
        for entry in project["files"]:
            target = (base / entry["path"]).resolve()
            if not target.is_relative_to(base) or target in expected:
                raise ValueError("Invalid or duplicate file path")
            expected.add(target)
            count += 1
            if not target.is_file():
                errors.append(f"Missing: {target.relative_to(ROOT)}")
                continue
            raw = target.read_bytes()
            if len(raw) != entry["size"] or hashlib.sha256(raw).hexdigest() != entry["sha256"]:
                errors.append(f"Changed: {target.relative_to(ROOT)}")
            if f"/{project['revision']}/" not in entry["sourceUrl"]:
                errors.append(f"Unpinned source: {entry['path']}")
        if not (base / "LICENSE").resolve() in expected:
            errors.append(f"Missing license record: {project['id']}")
        for target in base.rglob("*"):
            if target.is_file() and target.resolve() not in expected:
                errors.append(f"Unexpected: {target.relative_to(ROOT)}")
    if errors:
        print("\n".join(errors), file=sys.stderr)
        return 1
    print(f"Verified {count} original files in {len(identities)} projects (SHA-256 and size; offline).")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(verify())
    except (OSError, ValueError, KeyError, TypeError) as cause:
        print(f"Verification failed: {cause}", file=sys.stderr)
        raise SystemExit(1)
