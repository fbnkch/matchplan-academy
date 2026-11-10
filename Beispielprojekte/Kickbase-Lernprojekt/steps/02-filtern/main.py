"""Vollständiges, veränderbares Beispiel für Schritt 2."""
from pathlib import Path
import sys
sys.path.insert(0, str(Path(__file__).resolve().parents[2]))
from app import load_players

budget = 5_000_000
position = "MID"
for player in load_players():
    if player["role"] == position and player["market_value"] <= budget:
        print(player["name"], player["market_value"])
