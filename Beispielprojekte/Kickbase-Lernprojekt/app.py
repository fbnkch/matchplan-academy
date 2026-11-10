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
        rows = list(csv.DictReader(source))
    for row in rows:
        for key in ('points', 'market_value', 'minutes'):
            row[key] = float(row[key]) if row[key] else None
    return rows


def dashboard_data():
    rows = load_players()
    with (ROOT / 'data' / 'matchdays.csv').open(encoding='utf-8-sig', newline='') as source:
        matches = list(csv.DictReader(source))
    for row in rows:
        history = sorted((m for m in matches if m['id'] == row['id']), key=lambda m: int(m['matchday']))
        row['points_per_million'] = points_per_million(row['points'], row['market_value'])
        row['form_last_3'] = rolling_form([float(m['points']) if m['points'] else None for m in history])
        row['similar_profiles'] = profile_distance(rows, row['id'])
    return rows


def render():
    body = ''.join('<tr>' + ''.join(f'<td>{html.escape(str(r[k]))}</td>' for k in
                   ('name', 'role', 'points', 'market_value', 'points_per_million', 'form_last_3')) + '</tr>'
                   for r in dashboard_data())
    return ('<!doctype html><html lang="de"><meta charset="utf-8"><title>Mein Lern-Dashboard</title>'
            '<style>body{font:18px system-ui;max-width:1100px;margin:3rem auto;padding:1rem;background:#f4f5ef}'
            'table{border-collapse:collapse;width:100%;background:white}td,th{padding:1rem;text-align:left;border-bottom:1px solid #ccc}</style>'
            '<h1>Mein Kickbase-Lernprojekt</h1><p>Alle Namen und Werte sind synthetisch. Kein offizielles Kickbase-Produkt.</p>'
            '<p>Punkte = Durchschnitt je Einsatz; Marktwert in Euro. Profilabstände im <a href="/data.json">JSON-Bericht</a>.</p>'
            '<table><thead><tr><th>Name</th><th>Position</th><th>Ø Punkte</th><th>Marktwert €</th><th>Punkte / Mio. €</th><th>Form (3 Spieltage)</th></tr></thead><tbody>'
            + body + '</tbody></table></html>')


class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path not in ('/', '/data.json'):
            self.send_error(404)
            return
        is_json = self.path == '/data.json'
        content = json.dumps(dashboard_data(), ensure_ascii=False, allow_nan=False) if is_json else render()
        self.send_response(200)
        self.send_header('Content-Type', 'application/json; charset=utf-8' if is_json else 'text/html; charset=utf-8')
        self.end_headers()
        self.wfile.write(content.encode('utf-8'))


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--export', metavar='JSON_DATEI')
    parser.add_argument('--port', type=int, default=8000)
    args = parser.parse_args()
    if args.export:
        Path(args.export).write_text(json.dumps(dashboard_data(), ensure_ascii=False, indent=2, allow_nan=False), encoding='utf-8')
    else:
        print(f'Dashboard: http://127.0.0.1:{args.port} (Strg+C beendet)', flush=True)
        HTTPServer(('127.0.0.1', args.port), Handler).serve_forever()
