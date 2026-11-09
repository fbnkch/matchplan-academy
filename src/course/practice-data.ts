import eventRows from './datasets/practice-events.json';
import shotRows from './datasets/practice-shots.json';
import provenance from './datasets/provenance.json';

const pythonJson = (value: unknown) => `json.loads(${JSON.stringify(JSON.stringify(value))})`;
export const PRACTICE_EVENTS_SETUP = `import json, copy
raw_events = ${pythonJson(eventRows)}
events = copy.deepcopy(raw_events)
expected_matches = ${pythonJson(provenance.matches.map((m) => m.match_id))}
source_revision = ${JSON.stringify(provenance.revision)}
`;
export const PRACTICE_SHOTS_SETUP = `import json
import pandas as pd
shots = pd.DataFrame(${pythonJson(shotRows)})
`;
export const PRACTICE_SQL_SETUP = `${PRACTICE_SHOTS_SETUP}
import sqlite3
conn = sqlite3.connect(':memory:')
conn.execute('CREATE TABLE shots (match_id INTEGER, event_id TEXT PRIMARY KEY, team TEXT, shot_order INTEGER, xg REAL)')
for shot_order, row in enumerate(shots.to_dict('records')):
    conn.execute('INSERT INTO shots VALUES (?,?,?,?,?)', (row['match_id'], row['event_id'], row['team'], shot_order, row['provider_xg']))
buffers = {}
expected = []
for row in conn.execute('SELECT match_id,event_id,team,shot_order,xg FROM shots ORDER BY match_id,team,shot_order'):
    key = (row[0], row[2])
    buffers.setdefault(key, []).append(row[4])
    expected.append([row[0], row[1], round(sum(buffers[key][-3:]), 6)])
`;
export const practiceDataSummary = `Matchplan · fiktive synthetische Lehrdaten
${eventRows.length} generierte Events aus zwei vollständig simulierten Spielen.
${shotRows.length} generierte Schüsse aus zwölf fiktiven Spielen mit geordneten Datumsgruppen.
Teams, Spieler, IDs, Koordinaten und Ergebnisse sind unabhängig erzeugt, keine echten Spielbeobachtungen.
Verschachtelte Eventfelder und das 120×80-Raster bilden einen providerinspirierten Lehrvertrag ab.
goal enthält generierte Torlabels; provider_xg enthält generierte Wahrscheinlichkeiten, keine echten Anbieterwerte.
Revision: ${provenance.revision}
Python-Variablen: events (Eventliste), raw_events (unveränderte Ausgangskopie), expected_matches (zwölf Match-IDs).
Data-Science-Aufgaben: shots (DataFrame mit event_id, match_id, match_date, team, player, x, y, goal, body_part, shot_type, provider_xg).
Vorschau eines Events:
${JSON.stringify(
  eventRows.find((e) => e.type.name === 'Pass'),
  null,
  2,
)}
Vorschau eines Schusses:
${JSON.stringify(shotRows[0], null, 2)}
Quelle: scripts/generate-teaching-data.py (fester Seed, ohne Netzwerk oder fremde Datensätze)
Die Eventliste deckt nur zwei der zwölf Spiele ab. Fehlende Spiele sind keine Nullwerte!`;
