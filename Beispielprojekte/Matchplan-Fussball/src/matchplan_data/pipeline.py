"""CSV prüfen, Auswahl berechnen und einen Herkunftsnachweis schreiben."""
import argparse
import csv
import hashlib
import io
import json
from pathlib import Path

from .scouting import Player, shortlist


def read_players(raw: bytes) -> list[Player]:
    reader = csv.DictReader(io.StringIO(raw.decode("utf-8-sig")))
    required = {"player_id", "name", "position", "minutes", "progressive_passes"}
    if not required.issubset(reader.fieldnames or []):
        raise ValueError("Pflichtspalten fehlen.")
    players, seen = [], set()
    for line, row in enumerate(reader, start=2):
        identity = (row.get("player_id") or "").strip()
        name = (row.get("name") or "").strip()
        position = (row.get("position") or "").strip()
        if not identity or identity in seen or not name or position not in {"GK", "DF", "MF", "FW"}:
            raise ValueError(f"Zeile {line}: ID, Name oder Position ungültig.")
        try:
            minutes = int(row["minutes"])
            passes = int(row["progressive_passes"])
        except (TypeError, ValueError) as cause:
            raise ValueError(f"Zeile {line}: Ganzzahlen erforderlich.") from cause
        if minutes <= 0 or passes < 0:
            raise ValueError(f"Zeile {line}: Minuten müssen positiv und Pässe nichtnegativ sein.")
        seen.add(identity)
        players.append(Player(identity, name, position, minutes, passes))
    return players


def run(source: Path, output: Path, minimum: int = 450) -> list[dict]:
    raw = source.read_bytes()
    # Erst den kompletten Datenbestand prüfen; ungültige Eingaben erzeugen keine Ausgabe.
    players = read_players(raw)
    rows = shortlist(players, minimum)
    manifest = {"schema": 1, "source": source.name,
                "sha256": hashlib.sha256(raw).hexdigest(), "input_rows": len(players),
                "selected_rows": len(rows), "minimum_minutes": minimum,
                "data_kind": "synthetic"}
    output.mkdir(parents=True, exist_ok=True)
    with (output / "shortlist.csv").open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=["player_id", "name", "minutes", "progressive_passes_p90"])
        writer.writeheader()
        writer.writerows(rows)
    (output / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    return rows


def main() -> None:
    parser = argparse.ArgumentParser(description="Synthetische Mittelfeldprofile nach einer Rate auswählen.")
    parser.add_argument("--input", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--minimum", type=int, default=450)
    args = parser.parse_args()
    try:
        rows = run(args.input, args.output, args.minimum)
    except (OSError, ValueError) as cause:
        parser.exit(2, f"Verarbeitung abgebrochen: {cause}\n")
    print(f"{len(rows)} Profile ausgewählt. Ausgabe: {args.output}")


if __name__ == "__main__":
    main()
