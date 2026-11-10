# Beispielprojekte für deine IDE

## Dein Einstieg: Kickbase-Lernprojekt

[Kickbase-Lernprojekt](Kickbase-Lernprojekt/README.md) ist der Projektweg der Website:
ein sofort lauffähiges Python-Dashboard, sechs Arbeitsaufträge und getrennte
Übungs- und Referenzlösungen. Es verwendet fiktive Spieler und braucht keine
Zugangsdaten. Im Projektordner mit `python app.py` starten.

Öffne diesen Ordner in der IDE deiner Wahl. Für VS Code kannst du auch `Beispielprojekte.code-workspace` öffnen. Die Beispiele sind eigene Projekte; du musst sie nicht in die React-Anwendung einbauen oder deren npm-Abhängigkeiten verändern.

## Wo anfangen?

| Ordner                           | Zweck                                                                        | Einstieg                                                       |
| -------------------------------- | ---------------------------------------------------------------------------- | -------------------------------------------------------------- |
| `Matchplan-Fussball/`            | Kleines vollständiges Python-Paket mit CLI, CSV-Vertrag und Tests            | README, dann Tests, dann `src/matchplan_data/pipeline.py`      |
| `Werkstaetten/spielbericht/`     | Daten und Starter für den Spielbericht aus dem Kurs                          | README, `analyse.py`, `reference_solution.py`                  |
| `Werkstaetten/xg-modell/`        | Synthetischer xG-Probelauf mit getrennter Trainings-/Testauswertung          | README und Referenzlösung                                      |
| `Werkstaetten/scouting-app/`     | Scouting-Analyse und Streamlit-Oberfläche                                    | README, Referenzlösung, `app.py`                               |
| `Werkstaetten/aktionswerte/`     | Aktionsbewertung mit vorgegebenem Raster                                     | README und Referenzlösung                                      |
| `Originale/patchy-agentic-rag/`  | Unverändertes Upstream-Beispiel für Retrieval und Agentenstruktur            | `Originale/README.md` für Voraussetzungen und Grenzen          |
| `Originale/patchy-colivara-rag/` | Unverändertes Upstream-Beispiel mit externen Retrieval-/Modelldiensten       | Zunächst nur lesen; Einrichtung und Dienste sind separat nötig |
| `Originale/adil-hybrid-rag/`     | Unverändertes strukturiertes RAG-Gerüst mit Quellcode und Evaluationsdateien | Platzhalter erkennen und die Trennung der Module untersuchen   |

## Originale und eigene Arbeit auseinanderhalten

Die Dateien in `Originale/` werden an festen Revisionen unverändert übernommen. Die zugehörigen MIT-Lizenzen bleiben erhalten. `Originale/manifest.json` enthält Herkunft und SHA-256 für jede übernommene Datei. Die Auswahl enthält nicht die kompletten Repositories; ausgelassene Assets und benötigte Dienste sind im Begleittext dokumentiert. Der heruntergeladene Fremdcode wurde nicht ausgeführt. Es gibt keine Zusage, dass die eingefrorenen Beispiele mit heutigen Diensten unverändert funktionieren.

Repositories ohne nachgewiesene Nachnutzungsfreigabe sind als Quellen im Kurs verlinkt, aber hier nicht als Originalcode kopiert. Das betrifft insbesondere den bisher geprüften Stand von Football Video Analysis, Data Engineering Lab und Zero to Mastery ML. Eigene Fußball-Beispiele sind ausdrücklich keine Originalprojekte dieser Autoren.

`Matchplan-Fussball/` ist ein eigener, mit der Python-Standardbibliothek prüfbarer Lernstart. `Werkstaetten/` enthält unveränderte Exporte der vier lokalen Matchplan-Projekte ohne persönlichen Lernstand. Dort ist `analyse.py` der unvollständige Starter; `reference_solution.py` ist die zugehörige vollständige Musterlösung. Beispielberichte sind Vorlagen. Die enthaltenen Daten sind synthetisch.

## Lernablauf

1. Lies README und Paketdatei, bevor du Code startest. Notiere Eingaben, Ausgaben und externe Abhängigkeiten.
2. Suche den Einstiegspunkt und verfolge einen kleinen Datensatz durch die Module.
3. Sage ein Ergebnis voraus und prüfe es zuerst an den lokalen Fußball-Tests.
4. Kopiere ein passendes Projekt in einen eigenen Arbeitsordner. Halte das Original als Vergleich unverändert.
5. Ändere genau eine Fachfrage oder ein Merkmal und ergänze einen Test mit unabhängig berechnetem Ergebnis.

Installiere jedes Beispiel in einer eigenen Umgebung. API-Schlüssel gehören in deine lokale Umgebung, nicht in Quellcode oder Notebooks. Bevor du ein Notebook ausführst, lies alle Zellen und prüfe Datei-, Netzwerk- und Modellzugriffe. Die Workspace-Datei installiert keine Erweiterungen und startet keine Programme automatisch.

## Originaldateien prüfen

Aus dem Hauptverzeichnis der Website:

```powershell
python scripts/verify-example-projects.py
python -m unittest discover -s Beispielprojekte/Matchplan-Fussball/tests -v
```

Der erste Befehl prüft die lokalen Dateien gegen das Herkunftsmanifest, ohne Internetzugriff oder Ausführung der Beispiele. Er schützt vor unbeabsichtigten Änderungen nach dem Import. Die ursprüngliche Herkunft wird beim Import gegen den festgehaltenen Upstream-Stand abgeglichen.
