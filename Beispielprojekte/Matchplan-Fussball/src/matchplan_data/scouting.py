"""Fachrechnung ohne Dateizugriff: eine Auswahl, keine Transferempfehlung."""
from dataclasses import dataclass


@dataclass(frozen=True)
class Player:
    player_id: str
    name: str
    position: str
    minutes: int
    progressive_passes: int


def shortlist(players: list[Player], minimum: int = 450) -> list[dict]:
    if minimum < 0:
        raise ValueError("Die Mindestspielzeit darf nicht negativ sein.")
    rows = [
        {"player_id": p.player_id, "name": p.name,
         "minutes": p.minutes, "progressive_passes_p90": round(90 * p.progressive_passes / p.minutes, 3)}
        for p in players if p.position == "MF" and p.minutes >= minimum and p.minutes > 0
    ]
    return sorted(rows, key=lambda row: (-row["progressive_passes_p90"], row["player_id"]))
