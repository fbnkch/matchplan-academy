"""Referenz für Schritt 5: geprüfter Join und unveränderlicher Tages-Snapshot."""
import argparse
import csv
from datetime import date
import json
import math
from pathlib import Path
from app import load_players, ROOT


def import_snapshot(players_path, matches_path, output_dir, as_of):
    date.fromisoformat(as_of)
    players = load_players(players_path)
    player_ids = [player['id'] for player in players]
    if len(player_ids) != len(set(player_ids)) or any(not player_id for player_id in player_ids):
        raise ValueError('Spieler-IDs müssen eindeutig und gefüllt sein')
    for player in players:
        if player['role'] not in ('GK', 'DEF', 'MID', 'FWD'):
            raise ValueError('Unbekannte Position')
        for field in ('points', 'market_value', 'minutes'):
            value = player[field]
            if value is None or not math.isfinite(value) or value < 0:
                raise ValueError('Ungültiger Wert: ' + field)
    with Path(matches_path).open(encoding='utf-8-sig', newline='') as source:
        matches = list(csv.DictReader(source))
    seen_matchday_keys = set()
    for match in matches:
        matchday_key = (match['id'], int(match['matchday']))
        if match['id'] not in player_ids or matchday_key in seen_matchday_keys or matchday_key[1] <= 0:
            raise ValueError('Verwaister Join, doppelter oder ungültiger Spieltag')
        seen_matchday_keys.add(matchday_key)
        value = float(match['points']) if match['points'] else None
        if value is not None and (not math.isfinite(value) or value < 0):
            raise ValueError('Ungültige Spieltagspunkte')
        match['points'] = value
        match['matchday'] = matchday_key[1]
    snapshot = {
        'as_of': as_of,
        'source': 'synthetic-learning-fixture',
        'players': [
            dict(player, matchdays=sorted(
                [matchday for matchday in matches if matchday['id'] == player['id']],
                key=lambda matchday: matchday['matchday'],
            ))
            for player in players
        ],
    }
    output_directory = Path(output_dir)
    output_directory.mkdir(parents=True, exist_ok=True)
    snapshot_path = output_directory / (as_of + '.json')
    # Exklusives Anlegen schützt bestehende historische Stände.
    with snapshot_path.open('x', encoding='utf-8') as target:
        json.dump(snapshot, target, ensure_ascii=False, indent=2, allow_nan=False)
    return snapshot_path


if __name__ == '__main__':
    argument_parser = argparse.ArgumentParser(description=__doc__)
    argument_parser.add_argument('--players', type=Path, default=ROOT / 'data/players.csv')
    argument_parser.add_argument('--matches', type=Path, default=ROOT / 'data/matchdays.csv')
    argument_parser.add_argument('--output', type=Path, default=ROOT / 'history')
    argument_parser.add_argument('--as-of', required=True)
    arguments = argument_parser.parse_args()
    print(import_snapshot(arguments.players, arguments.matches, arguments.output, arguments.as_of))
