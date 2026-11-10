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
    ids = [p['id'] for p in players]
    if len(ids) != len(set(ids)) or any(not i for i in ids):
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
    seen = set()
    for match in matches:
        key = (match['id'], int(match['matchday']))
        if match['id'] not in ids or key in seen or key[1] <= 0:
            raise ValueError('Verwaister Join, doppelter oder ungültiger Spieltag')
        seen.add(key)
        value = float(match['points']) if match['points'] else None
        if value is not None and (not math.isfinite(value) or value < 0):
            raise ValueError('Ungültige Spieltagspunkte')
        match['points'] = value
        match['matchday'] = key[1]
    payload = {'as_of': as_of, 'source': 'synthetic-learning-fixture',
               'players': [dict(p, matchdays=sorted([m for m in matches if m['id'] == p['id']], key=lambda m: m['matchday'])) for p in players]}
    output = Path(output_dir)
    output.mkdir(parents=True, exist_ok=True)
    destination = output / (as_of + '.json')
    # Exklusives Anlegen schützt bestehende historische Stände.
    with destination.open('x', encoding='utf-8') as target:
        json.dump(payload, target, ensure_ascii=False, indent=2, allow_nan=False)
    return destination


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--players', type=Path, default=ROOT / 'data/players.csv')
    parser.add_argument('--matches', type=Path, default=ROOT / 'data/matchdays.csv')
    parser.add_argument('--output', type=Path, default=ROOT / 'history')
    parser.add_argument('--as-of', required=True)
    args = parser.parse_args()
    print(import_snapshot(args.players, args.matches, args.output, args.as_of))
