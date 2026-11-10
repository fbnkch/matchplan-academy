# Kickbase-Lernprojekt

Ein eigenes, kleines Fußball-Datenprojekt für Python 3.10 oder neuer. Alle Namen,
Spieler und Werte sind **synthetisch** für diesen Kurs erzeugt. Es gibt keine echten
Kickbase-Daten, keine Prognosen, keine übernommenen Logos und keine Verbindung zu
Kickbase. Das Projekt ist unabhängig und unter MIT nutzbar; siehe LICENSE.

## In der IDE starten

1. Den gesamten ZIP-Inhalt entpacken; den Ordner Kickbase-Lernprojekt in VS Code,
   PyCharm oder einer anderen IDE öffnen. VS Code kann die beigefügte Workspace-Datei öffnen.
2. Ein Terminal **in diesem Ordner** öffnen. `python --version` prüfen (mindestens 3.10).
   Wenn Windows nur `py` kennt, in allen Befehlen `python` durch `py` ersetzen.
3. `python app.py` ausführen. http://127.0.0.1:8000 im Browser öffnen. Strg+C beendet den Server.
   Bei belegtem Port: `python app.py --port 8001` und Port 8001 öffnen.

Keine Installation mit pip, kein API-Schlüssel und keine Internetverbindung nötig.
`python app.py --export bericht.json` schreibt denselben berechneten Bericht als JSON.
`/data.json` liefert die Daten bei laufendem Server. Der Server bindet nur an localhost.

## Erst ausführen, dann verändern, schließlich selbst entwickeln

| Schritt | Einstieg                                 | Unterstützung                             |
| ------- | ---------------------------------------- | ----------------------------------------- |
| 1       | steps/01-verstehen/README.md             | Vollständiges Dashboard erklären          |
| 2       | steps/02-filtern/main.py                 | Lauffähigen Filter verändern              |
| 3       | exercises/metrics.py: points_per_million | Fehlende Funktion mit vorgegebenem Test   |
| 4       | exercises/metrics.py: rolling_form       | Eigene Tests und Implementierung          |
| 5       | Eigene exercises/import_data.py anlegen  | Nur Datenvertrag und CLI vorgegeben       |
| 6       | exercises/metrics.py: profile_distance   | Eigenständiger Entwurf und Evidenzbericht |

Die Ordner steps enthalten Aufträge und erwartete Ergebnisse. solutions/metrics.py
und pipeline.py sind **fertige Referenzlösungen** zur späteren Kontrolle. app.py
verwendet diese Referenzen, damit das Dashboard auch vor deinen Übungen funktioniert.
Wenn du deine Funktionen darin erproben möchtest, ändere den Import in metrics.py
von solutions.metrics zu exercises.metrics. Erst tun, wenn deine Tests grün sind.

## Tests: Referenz und Übungen bewusst getrennt

Die vollständige Referenz muss grün sein:

```
python -m unittest discover -s tests -p "test_*.py" -v
```

Die folgende **explizite Übungssuite ist anfangs absichtlich rot** (NotImplementedError):

```
python -m unittest tests.learner_suite -v
```

Einzeln, passend zu Schritt 3/4/6:

```
python -m unittest tests.learner_suite.LearnerMetricTests.test_value -v
python -m unittest tests.learner_suite.LearnerMetricTests.test_form -v
python -m unittest tests.learner_suite.LearnerMetricTests.test_profile -v
```

Eigene Tests heißen etwa tests/test_my_form.py. Sie gehören zu deiner Arbeit und
können während der Entwicklung rot sein. Die Referenztests prüfen echte Randfälle,
kein stures Kopieren von Dashboard-Ausgaben.

## Datenvertrag und Grenzen

- data/players.csv: id (eindeutig), name, role (GK/DEF/MID/FWD), points
  (durchschnittliche Punkte **je Einsatz**), market_value (Euro), minutes (gesamte
  Einsatzminuten). Punkte und Marktwerte sind synthetische Momentaufnahmen.
- data/matchdays.csv: (id, matchday) ist eindeutig; id verweist auf players.id.
  Leere points bedeuten fehlenden Einsatz, 0 einen beobachteten Einsatz ohne Punkte.
  Die Demodatei enthält drei Spieltage; ihre Mittelwerte entsprechen players.points.
- points_per_million liefert bei fehlenden/nicht endlichen Werten oder Marktwert 0
  None. Negative Werte lösen im Lernvertrag ValueError aus. Dies bildet keine
  vollständigen Regeln eines echten Fantasy-Spiels ab.
- rolling_form nimmt die letzten N **Spieltage**, danach werden fehlende und nicht
  endliche Beobachtungen ausgeschlossen. Keine Werte ergibt None; N muss positiv
  und ganzzahlig sein. Ein fehlender Einsatz zieht keinen älteren Spieltag nach.
- profile_distance schließt Spieler unter minimum_minutes (Standard 450) sowie
  fehlende/NaN-Features aus. Nur gleiche Positionen werden gemeinsam standardisiert.
  Features sind points und market_value. Populationsstandardabweichung (pstdev),
  konstante Features erhalten z=0, dann euklidischer Abstand. Kein Selbstvergleich.
  Ungültiger Zielspieler liefert []. Sortierung nach Abstand, dann ID. Jede Ausgabe
  nennt features, delta_z, cohort_size und minimum_minutes als überprüfbare Evidenz.
  Die winzige synthetische Kohorte rechtfertigt keine Kauf- oder Leistungsprognose.

## Import und Historie (Schritt 5)

Eigene Umsetzung: exercises/import_data.py. Referenzaufruf:

```
python pipeline.py --players data/players.csv --matches data/matchdays.csv --output history --as-of 2026-01-01
```

Datum im ISO-Format; Snapshot history/2026-01-01.json enthält as_of, source und
players mit zugeordneten matchdays. Bestehende Stände werden nie überschrieben.
Ungültige oder doppelte Schlüssel, unbekannte Positionen, negative/nicht endliche
Werte und verwaiste Spieltage werden vor dem Schreiben abgewiesen. Ein weiterer
Stand braucht ein anderes Datum. Dies ist eine Lern-Pipeline für kleine Dateien.

## Quellen zum Nachschlagen und mögliche Erweiterung

Die Umsetzung und Fixtures sind eigenes Kursmaterial; es wird kein fremdes Repository
kopiert. Python-Originaldokumentation erklärt die verwendeten Bausteine:

- CSV: https://docs.python.org/3/library/csv.html
- Lokaler HTTP-Server: https://docs.python.org/3/library/http.server.html
- Tests: https://docs.python.org/3/library/unittest.html
- Standardabweichung: https://docs.python.org/3/library/statistics.html#statistics.pstdev
- CLI: https://docs.python.org/3/library/argparse.html

Ein echter Datenanschluss ist eine spätere, eigenständige Erweiterung: Nutze nur
rechtmäßig verfügbare Exporte oder ausdrücklich dokumentierte und autorisierte
Schnittstellen, prüfe deren Einheiten und Nutzungsbedingungen und ersetze erst dann
den CSV-Adapter. Hier ist keine private oder inoffizielle Kickbase-API implementiert.
