"""Start: python app.py. Offline, ohne Installation zusätzlicher Pakete."""
import argparse
import csv
import html
import json
from http.server import BaseHTTPRequestHandler, HTTPServer
from pathlib import Path
from metrics import points_per_million, rolling_form, profile_distance

ROOT = Path(__file__).resolve().parent


def load_players(path=ROOT / 'data' / 'players.csv'):
    with Path(path).open(encoding='utf-8-sig', newline='') as source:
        players = list(csv.DictReader(source))
    for player in players:
        for column_name in ('points', 'market_value', 'minutes'):
            player[column_name] = float(player[column_name]) if player[column_name] else None
    return players


def dashboard_data():
    players = load_players()
    with (ROOT / 'data' / 'matchdays.csv').open(encoding='utf-8-sig', newline='') as source:
        matchdays = list(csv.DictReader(source))
    for player in players:
        player_matchdays = sorted(
            (matchday for matchday in matchdays if matchday['id'] == player['id']),
            key=lambda matchday: int(matchday['matchday']),
        )
        player['points_per_million'] = points_per_million(player['points'], player['market_value'])
        player['form_last_3'] = rolling_form([
            float(matchday['points']) if matchday['points'] else None
            for matchday in player_matchdays
        ])
        player['similar_profiles'] = profile_distance(players, player['id'])
    return players


def render():
    table_rows_html = ''.join(
        '<tr>' + ''.join(
            f'<td>{html.escape(str(player[column_name]))}</td>'
            for column_name in (
                'name', 'role', 'points', 'market_value',
                'points_per_million', 'form_last_3',
            )
        ) + '</tr>'
        for player in dashboard_data()
    )
    return ('<!doctype html><html lang="de"><meta charset="utf-8"><title>Mein Lern-Dashboard</title>'
            '<style>body{font:18px system-ui;max-width:1100px;margin:3rem auto;padding:1rem;background:#f4f5ef}'
            'table{border-collapse:collapse;width:100%;background:white}td,th{padding:1rem;text-align:left;border-bottom:1px solid #ccc}</style>'
            '<h1>Mein Kickbase-Lernprojekt</h1><p>Alle Namen und Werte sind synthetisch. Kein offizielles Kickbase-Produkt.</p>'
            '<p>Punkte = Durchschnitt je Einsatz; Marktwert in Euro. Profilabstände im <a href="/data.json">JSON-Bericht</a>.</p>'
            '<table><thead><tr><th>Name</th><th>Position</th><th>Ø Punkte</th><th>Marktwert €</th><th>Punkte / Mio. €</th><th>Form (3 Spieltage)</th></tr></thead><tbody>'
            + table_rows_html + '</tbody></table></html>')


class DashboardRequestHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path not in ('/', '/data.json'):
            self.send_error(404)
            return
        is_json_request = self.path == '/data.json'
        response_body = (
            json.dumps(dashboard_data(), ensure_ascii=False, allow_nan=False)
            if is_json_request else render()
        )
        self.send_response(200)
        self.send_header('Content-Type', 'application/json; charset=utf-8' if is_json_request else 'text/html; charset=utf-8')
        self.end_headers()
        self.wfile.write(response_body.encode('utf-8'))


if __name__ == '__main__':
    argument_parser = argparse.ArgumentParser(description=__doc__)
    argument_parser.add_argument('--export', metavar='JSON_DATEI')
    argument_parser.add_argument('--port', type=int, default=8000)
    arguments = argument_parser.parse_args()
    if arguments.export:
        Path(arguments.export).write_text(json.dumps(dashboard_data(), ensure_ascii=False, indent=2, allow_nan=False), encoding='utf-8')
    else:
        print(f'Dashboard: http://127.0.0.1:{arguments.port} (Strg+C beendet)', flush=True)
        HTTPServer(('127.0.0.1', arguments.port), DashboardRequestHandler).serve_forever()
