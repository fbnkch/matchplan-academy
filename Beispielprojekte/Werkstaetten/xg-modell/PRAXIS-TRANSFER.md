# Vom Browserprojekt zum Portfolio-Nachweis

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

## Dein Auftrag
Trainiere auf einem größeren öffentlichen Schussbestand und prüfe eine zeitlich spätere Partieauswahl.

1. Definiere die Zielpopulation, zulässige Vor-Schuss-Merkmale und ausgeschlossene Informationen. Halte Spiel- und Datumsgrenzen ein.
2. Fitte Preprocessing und Modell ausschließlich auf Trainingsdaten. Vergleiche Dummy-Baseline, logistische Regression und höchstens ein begründetes alternatives Modell.
3. Berichte Brier, Logloss, Kalibration mit Binbesetzung und Match-Cluster-Unsicherheit. Untersuche Fehlergruppen; optimiere nicht auf dem finalen Testset.

## Nachweise
- Explizite Trainings-/Validierungs-/Test-Matchlisten
- Reproduzierbares Modell und unabhängige Referenzprüfung
- Model Card mit Datenlücken, erlaubtem Einsatz und klaren Nicht-Aussagen