# Nutzerressourcen: Kurzreview

Stand: 27.10.2026. Primärquellen wurden lesend geprüft; Notebooks/Skripte wurden nicht ausgeführt und Abhängigkeiten nicht installiert.

## Basketball_Analytics — optionaler Transfer, `analysis`

**Einordnung:** Praxisnahe Sammlung persönlicher NBA-Analyse-Notebooks, keine lineare Einführung oder allgemeine Forschungssammlung. README nennt unter anderem Shotcharts/Zonenhäufigkeit, Play-by-Play-Assists und Alley-oop-Kombinationen. Repräsentative Notebook-Titel/Abschnitte umfassen „ISOs and Off Rtg“ und „Year by year“. Übertragbar sind Fragestellungsbildung, Aggregation nach Spiel-/Spieler-Kontext, Vergleich von Raten sowie Visualisierung und Plausibilitätsprüfung. Basketballspezifisch bleiben Wurfzonen, Assists, Rebounds und NBA-Play-by-Play-Semantik; die Kennzahlen sind nicht direkt Fußballmetriken. **Übung:** Eine Shotchart-Frage auf Fußball-Schüsse übertragen: Zonen nach Schussanzahl und Trefferquote darstellen; Akzeptanz: Nenner/Zeitraum dokumentiert, mindestens zwei Zonen gegen Rohereignisse geprüft, Schlussfolgerung benennt Selektions-/Stichprobenlimit. Vorausgesetzt wird Python/Jupyter und passende Daten. README listet keine reproduzierbare, fixierte Umgebung oder Requirements; Notebook-Alter und externe Datenquellen können Kompatibilitätsarbeit erfordern. Als optionalen Transfer in `analysis` empfehlen, nicht als Kernkurs.

Quellen: [README](https://github.com/danchyy/Basketball_Analytics#readme), [Notebook: Box-outs/DRB%](https://github.com/danchyy/Basketball_Analytics/blob/master/Scripts/2021_22_season/box_outs_drb_pct.ipynb), [Notebook: real/fake assists](https://github.com/danchyy/Basketball_Analytics/blob/master/Scripts/2021_22_season/real_fake_assists.ipynb).

## volleyball_analytics — optionaler Transfer, `advanced`

**Einordnung:** End-to-end-Computer-Vision-Projekt und Codebeispiel für Deep Learning, kein Einstieg in Daten-Scouting. README beschreibt Videozustand, Aktions-/Ballerkennung, Court-Segmentierung, annotierte Ausgabe und optionale FastAPI. Übertragbar sind Pipeline-Bausteine, Inferenz-/Datenfluss und die Idee, Videoereignisse in strukturierte Daten/KPIs zu überführen. Volleyballaktionen (Aufschlag/Annahme/Block), Feldgeometrie und Volleyball-Labels sind sportartspezifisch; Fußball bräuchte andere Daten, Klassen und Modelle. **Übung:** Nur als fortgeschrittene Architekturlektüre einordnen: Pipeline skizzieren und ein Modul samt Eingabe/Ausgabe, Modellgewicht und Fehlergrenze erklären; Akzeptanz: Ablauf vom Video zum Ereignis nachvollziehbar, mindestens eine sportartspezifische Übertragungsgrenze benannt. Voraussetzungen sind hoch: Python >=3.12, Git-Submodule, Jupyter, vortrainierte Gewichte und Video-/CV-/DL-Stack. `pyproject.toml` verlangt unter anderem Torch >=2.12, Transformers >=5.12, Ultralytics >=8.4.67, OpenCV und PyTorch CUDA-Index cu132; das ist eine umfangreiche, stark versionsgebundene Umgebung, Setup lädt Modelle/Daten. Geeignet höchstens als optionaler Einblick in `advanced`, nicht als Kernressource oder Data-Scouting-Einstieg.

Quellen: [README/Setup](https://github.com/masouduut94/volleyball_analytics#readme), [Dependencies und Python-Anforderung](https://github.com/masouduut94/volleyball_analytics/blob/main/pyproject.toml), [Setup-Notebook-Überschriften](https://github.com/masouduut94/volleyball_analytics/blob/main/notebooks/setup.ipynb).

## YouTube-Playlist — direkte Videoergänzung

Der erste Web-Abruf scheiterte. Ein anschließender direkter Abruf der öffentlich ausgelieferten YouTube-Seite bestätigte **The Complete Football Analytics Course in Python**, Kanal **McKay Johns**, und 47 sichtbare Einträge. Die Metadaten nennen Python, Datenbeschaffung, Visualisierung, Datenanalyse, Machine Learning und Projektteile; Titel/Kanal sind damit primär belegt. Die Videos wurden nicht vollständig angesehen oder fachlich auditiert. Die Zuordnung zu Kursen folgt den Eintragstiteln. Prüfbeleg: `test-results/user-playlist-metadata.json` (lokales Testartefakt). [Playlist](https://www.youtube.com/playlist?list=PL10a1_q15Hwpjw9bPoks8S6IFUVDO0PE7).

## Analytics Handbook — direkte Fußballvertiefung

Das [Handbook](https://github.com/devinpleuler/analytics-handbook) verbindet Erläuterungen, Literatur und ein [Notebook](https://github.com/devinpleuler/analytics-handbook/blob/master/soccer_analytics_handbook.ipynb). Die geprüften Notebook-Abschnitte behandeln Karten, Clustering, Passschwierigkeit und Tracking. Als externe Transferaufträge in analysis, scouting, science-practice und advanced eingebunden. Die Anforderungen pinnen ältere Versionen von mplsoccer, kloppy und statsbombpy; sie wurden nicht installiert oder auf aktuelle Kompatibilität getestet. Versions- und API-Anpassung bleibt Teil der lokalen Arbeit.

## Awesome Soccer Analytics — Rechercheverzeichnis

Die [Sammlung](https://github.com/matiasmascioto/awesome-soccer-analytics) ordnet Datenquellen, Werkzeuge, Forschung und Ausbildung. Sie ersetzt weder eine didaktische Reihenfolge noch die Prüfung jedes verlinkten Angebots. Auftrag im Scouting-Kurs: eine Quelle bis zur Originaldokumentation verfolgen und Datenabdeckung/Nutzung für eine konkrete Frage bewerten. Nicht alle Unterlinks wurden überprüft.

## Sport Analytics Tools — selektive Engineering-Vertiefung

Das [Repository](https://github.com/shufinskiy/sport_analytics_tools) enthält ID-Mapping, einen Fußball-Eventabruf und einen FIFA-Berichtsparser. Für engineering wurden ID-Zuordnung mit manueller Konfliktprüfung und ein Audit des programmatischen Parsers aufgenommen. Dieser ist an ein bestimmtes PDF-Layout gebunden; rekonstruierte Werte benötigen Gegenprüfung. Der WhoScored-Abruf wird vom Autor ausdrücklich nicht für Bulk- oder Produktionseinsatz vorgesehen und wurde nicht als zuverlässige Pipelinebasis aufgenommen. Keine Installation und keine Ausführung der Fremdskripte.

## Empfohlene Verwendung

1. Playlist parallel zum jeweiligen Einstieg/Aufbau; danach eine eigene Variante ohne Video schreiben.
2. Handbook als direktes Transferprojekt auf neuen Daten, mit unabhängigen Tests und Evaluation.
3. Die beiden Sammlungen gezielt für eine definierte Frage nutzen, statt alle verlinkten Werkzeuge zu installieren.
4. Basketball nach den Fußballgrundlagen als Methodentransfer; Volleyball-CV erst bei einer eigenen Videoanalyse-Frage.
