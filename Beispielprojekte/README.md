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

`Matchplan-Fussball/` ist ein eigener, mit der Python-Standardbibliothek prüfbarer Lernstart. `Werkstaetten/` enthält die vier Matchplan-Projekte ohne persönlichen Lernstand. Jede README bündelt Startanleitung, Praxisauftrag und Berichtsvorlage. Dort ist `analyse.py` der unvollständige Starter; `reference_solution.py` ist die zugehörige vollständige Musterlösung. Beispielberichte sind Vorlagen. Die enthaltenen Daten sind synthetisch.

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

## Eigene Analysen mit realen Daten

Die Browserprüfung kontrolliert deinen Code mit dem vorbereiteten Datensatz. Für dein Portfolio überträgst du die Analyse auf neue reale Daten und begründest deine Entscheidungen im Bericht. Lass eine andere Person den Ablauf ausführen und die Aussagen prüfen. Die Checkliste hält deinen Bearbeitungsstand fest; eine fachliche Beurteilung braucht die ausgearbeitete Analyse.

## Lokaler Arbeitsablauf

1. Lege ein Projekt mit README, requirements.txt, data/raw, data/processed, src, tests und reports an. Schreibe auf, welche Python-Version du verwendest. Beginne mit den Bibliotheken und Versionen aus dem Export, damit du Fehler in der Umgebung von Fehlern in deiner Analyse unterscheiden kannst.
2. Speichere Rohdaten unverändert. Halte Quelle, Abrufdatum, Revision, Nutzungsbedingungen und SHA-256 in einem Manifest fest. StatsBomb verlangt bei veröffentlichten Analysen Quellenangabe und Logo; prüfe die aktuellen Bedingungen.
3. Schreibe ein Skript, das du über die Kommandozeile startest. Es soll mit einem Aufruf Daten einlesen, prüfen, aufbereiten und den Bericht erzeugen. Führe es zweimal aus und teste anschließend eine unterbrochene oder fehlerhafte Lieferung. Halte fest, wie du danach wieder einen vollständigen Datenstand herstellst.
4. Schreibe Tests für unbekannte IDs, doppelte Schlüssel, fehlende Werte, Spielgrenzen und eine von Hand gerechnete Kennzahl. Verwende pytest oder die Python-Standardbibliothek; ein separates Testsystem ist nicht zwingend.
5. Lege Trainings-, Validierungs- und Testspiele fest und speichere die Listen. Halte dabei jedes Spiel vollständig zusammen. Passe die Vorverarbeitung nur auf Trainingsdaten an. Verwende die Validierung zur Modellauswahl und den abschließenden Test erst für das gewählte Vorgehen; dokumentiere die Modellannahmen.
6. Lass eine zweite Person die README von einer frischen Umgebung aus befolgen. Notiere Fehler und Korrekturen. Plane Versionsverwaltung und automatisierte Checks als eigene lokale Übung ein; die Plattform verändert kein Git-Repository für dich.
7. Stelle die Analyse in fünf Minuten vor, ohne den Quellcode abzulesen. Erkläre die Frage und Datenbasis, begründe deine wichtigste Methodenentscheidung und zeige das Ergebnis. Nenne auch das stärkste Gegenargument und die nächste Prüfung. Bitte um fachliche Rückmeldung, etwa von Analysten oder einem lokalen Verein.

## Qualitätsprüfung

- Du kannst einen neuen Datenstand mit demselben Schema verarbeiten, ohne den Code von Hand anzupassen.
- Ein fehlendes Spiel erscheint als fehlende Abdeckung, nicht als null Leistung.
- Ein unabhängig berechneter Kontrollwert stimmt. Fehler brechen die Verarbeitung ab oder erscheinen mit Grund in einer getrennten Quarantänetabelle.
- Der Bericht behauptet nicht mehr, als die Auswahl und das Validierungsdesign hergeben.
- Du kannst den Code ohne Musterlösung verändern und deine Entscheidungen begründen.
- Cloud und Airflow kannst du später ergänzen, wenn der Betrieb sie erfordert. Zeige zuerst, dass dein lokaler Ablauf auch nach einem Fehler oder mit neuen Daten funktioniert.
