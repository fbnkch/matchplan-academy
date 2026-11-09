# Fußballanalyse als kleines Python-Projekt

Dies ist eigener Matchplan-Code. Die unveränderten fremden Originale stehen getrennt unter `../Originale`. Alle fünf Spielerprofile sind synthetisch. Das Ranking ist eine Übungsrechnung für progressive Pässe und keine Empfehlung für einen Transfer.

## In deiner IDE starten

Öffne diesen Ordner als Projekt. Du brauchst Python ab 3.11. Die Berechnung selbst benötigt nur die Standardbibliothek.

```powershell
python -m venv .venv
.venv\Scripts\python -m pip install -e .
.venv\Scripts\python -m matchplan_data.pipeline --input data/players.csv --output reports
.venv\Scripts\python -m unittest discover -s tests -v
```

Unter macOS/Linux lautet der Interpreter `.venv/bin/python`. Die Installation benötigt bei nicht vorhandenen Build-Werkzeugen Internet für setuptools. In der IDE kannst du alternativ `src` zum Python-Pfad hinzufügen und das Modul ohne Installation starten. Die Tests funktionieren auch direkt mit `python -m unittest discover -s tests -v`.

## Die Struktur lesen

- `pyproject.toml` beschreibt Paket, Python-Version und CLI-Einstieg.
- `src/matchplan_data/scouting.py` berechnet die Auswahl ohne Dateizugriff.
- `src/matchplan_data/pipeline.py` liest und prüft CSV und schreibt Ergebnisse.
- `data/players.csv` ist der unveränderte Eingabestand für diesen Probelauf.
- `tests/test_pipeline.py` prüft Ergebnis, Wiederholung, leere Auswahl und Fehler.
- `reports/` entsteht beim Ausführen und enthält `shortlist.csv` sowie `manifest.json`.

Lies zuerst die Tests und sage die Rangfolge voraus. Setze danach einen Haltepunkt in `read_players` und folge einer Zeile bis zur Ausgabe. Erwartet sind Lina (2,6), Nora (2,25) und Ada (2,0 Pässe pro 90 Minuten). Jona liegt unter 450 Minuten, Mira gehört zur Gruppe FW.

## Eigene Erweiterung

1. Kopiere das Projekt in einen eigenen Arbeitsordner.
2. Ergänze eine zweite Kennzahl und einen Test mit von Hand berechnetem Ergebnis.
3. Ändere die Minutengrenze und erkläre, warum Jona in der Auswahl auftaucht.
4. Füge eine Spielerzeile mit doppelter ID hinzu und prüfe die Fehlermeldung.
5. Schreibe einen kurzen Bericht: Was sagt das Ranking, welchen Team-/Rollenkontext ignoriert es?

Die Eingabedatei wird vollständig geprüft, bevor Ausgabe beginnt. Die beiden Ausgabedateien bilden aber keine atomare Transaktion: Ein Schreibfehler kann einen teilweise aktualisierten Bericht hinterlassen. Ein sinnvoller nächster Engineering-Schritt ist deshalb das Schreiben in ein temporäres Verzeichnis mit anschließender Freigabe. Im Manifest ist `data_kind` bewusst auf `synthetic` gesetzt; bei eigenen realen Daten musst du diesen Vertrag, Quellenangaben und Nutzungsrechte anpassen.
