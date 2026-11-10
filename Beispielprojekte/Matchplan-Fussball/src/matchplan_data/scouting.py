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
    shortlisted_players = [
        {"player_id": player.player_id, "name": player.name,
         "minutes": player.minutes, "progressive_passes_p90": round(90 * player.progressive_passes / player.minutes, 3)}
        for player in players if player.position == "MF" and player.minutes >= minimum and player.minutes > 0
    ]
    return sorted(shortlisted_players, key=lambda row: (-row["progressive_passes_p90"], row["player_id"]))
