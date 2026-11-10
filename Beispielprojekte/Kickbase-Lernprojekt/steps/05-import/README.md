# 5 - Ein Import als eigener Entwurf

Erstelle exercises/import_data.py, keine Schritt-für-Schritt-Schablone.
CLI: --players CSV --matches CSV --output ORDNER --as-of YYYY-MM-DD.
Nach der Implementierung aus dem Projektordner starten:
`python -m exercises.import_data --players data/players.csv --matches data/matchdays.csv --output history --as-of 2026-01-01`.
Prüfe eindeutige IDs, Fremdschlüssel, numerische Werte und zusammengesetzte Spieltagsschlüssel.
Schreibe erst nach erfolgreicher Prüfung einen Snapshot mit Quelle und Datum.
Ein existierender Stand muss einen Fehler auslösen; neue Stände ergänzen die Historie.
Referenz zum späteren Vergleich: `python pipeline.py --as-of 2026-01-01`.
Erweitere tests/test_my_import.py um doppelte und verwaiste IDs sowie Wiederholungsläufe.
