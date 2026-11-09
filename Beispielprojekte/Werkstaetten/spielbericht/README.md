# Spielbericht

Abschlüsse auswerten und drei Befunde für den Trainerbericht formulieren

## Auftrag
Wo entstehen Nordstadts Abschlüsse, und zeigt sich das Muster in mehreren Spielen?

Grenze ein, welche Frage zu den Abschlüssen du beantworten willst. Die vier fiktiven Spiele dienen dazu, den Ablauf zu prüfen. Aus den Ergebnissen kannst du keine Aussage über die Qualität einer echten Mannschaft ableiten.

Prüfe zuerst Koordinaten, Angriffsrichtung und Ereignistypen. Das Feld reicht hier von 0 bis 120 in x- und von 0 bis 80 in y-Richtung. Auch gehaltene oder geblockte Shot-Ereignisse zählen als Schüsse. Die Pässe in der CSV helfen dir zu kontrollieren, ob der Schussfilter arbeitet.

Erstelle eine Schusskarte, eine Verteilung nach Zonen und einen Vergleich der einzelnen Spiele. Formuliere daraus drei Befunde auf höchstens zwei Seiten für den Trainerstab. Zeige zu jedem Befund, wie du ihn gegengeprüft hast und welche Aussage die Daten offenlassen.

Übertrage den fertigen Probelauf anschließend auf zwei bis vier passende Spiele aus StatsBomb Open Data. Lade Matchdaten, Events und Aufstellungen. Notiere Wettbewerb, Saison, Match-IDs, Abrufdatum und Nutzungsrechte, bevor du den Beispieldatensatz ersetzt.

## Starten

Verwende Python 3.14 oder eine kompatible aktuelle Version. Lege eine eigene virtuelle Umgebung an und installiere darin die Pakete:

```sh
python -m venv .venv
# Windows: .venv\Scripts\activate
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
python analyse.py
```

analyse.py enthält deinen Arbeitsstand zum Zeitpunkt des Exports. Wenn du die Aufgabe noch nicht fertig bearbeitet hast, ist auch dieses Skript unvollständig. Mit reference_solution.py kannst du den Ablauf anhand der Referenzlösung nachvollziehen. Prüfe das Schema, bevor du die CSV unter data/ durch eigene Daten ersetzt, und kläre deren Nutzungsrechte.

## Meilensteine
1. **Frage und Datenumfang festlegen**
   Definiere Team, Spiele, Wettbewerb und genau eine Frage. Halte fest, welche Spiele oder Ereignisse fehlen.
   Ergebnis: Fragestellung und Datentabelle mit Quelle, Saison, Match-IDs und Koordinatenkonvention.
   Prüfung: Ist die Frage mit Eventdaten beantwortbar? / Sind echte und synthetische Daten deutlich getrennt?

2. **Ereignisse prüfen**
   Prüfe fehlende Werte, Duplikate, Teamnamen, Wertebereiche und Richtung. Kontrolliere die Zahl der Shot-Ereignisse je Spiel.
   Ergebnis: Kleine Qualitätsprüfung mit mindestens drei Assertions und einer Kontrollzählung.
   Prüfung: Zählen gehaltene Schüsse mit? / Wurden Pässe ausgeschlossen?

3. **Drei Grafiken erstellen**
   Zeichne Schusskarte, Zonenbalken und Spielvergleich mit Achsen, Einheiten, Legende und Datenhinweis.
   Ergebnis: Drei exportierbare Grafiken und reproduzierbarer Analysecode.
   Prüfung: Entspricht die Karte der dokumentierten Spielrichtung? / Stimmen Grafikzahlen mit der Tabelle überein?

4. **Befunde und Gegenargumente**
   Beschreibe drei Beobachtungen. Prüfe jeden Befund pro Spiel statt nur in der Gesamtsumme.
   Ergebnis: Drei konkrete Befunde mit Bezug auf Daten und einem möglichen Gegenargument.
   Prüfung: Wird aus wenigen Spielen kein stabiler Spielstil behauptet? / Ist jede Zahl nachvollziehbar?

5. **Trainerbericht abschließen**
   Fasse die Frage, Grafiken, Befunde, Grenzen und einen sinnvollen nächsten Prüfschritt zusammen.
   Ergebnis: BERICHT.md bzw. daraus ein Bericht von höchstens zwei Seiten.
   Prüfung: Versteht ein Trainer die Aussage ohne Code? / Stehen Grenzen neben der Empfehlung?

6. **Auf neue reale Daten übertragen**
   Übertrage deinen Bericht auf ein vollständiges, vorher nicht bearbeitetes Spiel.
   Ergebnis: Rohdatenquelle mit Revision/Hash und Abdeckung; Ein Kommando für den vollständigen Bericht; Kurzes Memo: Befund, Gegenargument und nächste Video-Prüfung
   Prüfung: Wähle ein öffentlich verfügbares Spiel und formuliere vor der Auswertung eine konkrete Fußballfrage. / Baue Import, Datenvertrag und Abdeckungsbericht. Prüfe Koordinatenkonvention und fünf Eventsequenzen manuell. / Erstelle höchstens drei begründete Grafiken. Trenne Beobachtung, Interpretation und die Frage an eine Videoanalyse.

7. **Reproduzierbar ausliefern und erklären**
   Führe den lokalen Ablauf aus dem Export durch und dokumentiere die Prüfung.
   Ergebnis: Startkommando, Fehlerprotokoll und fünfminütige fachliche Erklärung.
   Prüfung: Frischer Datenstand ohne manuelle Anpassung. / Datenquelle, Abdeckung, Tests und Grenzen dokumentiert. / Eigene Entscheidungen ohne Musterlösung begründet.

## Bewertungsrubrik
- Der Bericht nennt Quelle, Datenauswahl und die verwendeten Ereignisdefinitionen.
- Jede der drei Grafiken trägt zur Antwort auf die festgelegte Fußballfrage bei.
- Die Schlussfolgerungen beziehen sich auf die ausgewählten Spiele; weitergehende Vermutungen sind als solche erkennbar.
- Eine andere Person kann die Analyse starten und die Zählungen mit den dokumentierten Daten nachrechnen.

## Grenzen
- Die 48 Beispielereignisse sind synthetisch und nicht vollständig wie ein echtes Spiel.
- Die Koordinaten sind bereits auf eine Angriffsrichtung vereinheitlicht. Echte Rohdaten müssen nach Anbieterdefinition geprüft werden.

## Reale Daten und Quellen

Die mitgelieferten Daten sind synthetisch. Reale Daten findest du beispielsweise unter https://github.com/hudl/open-data. Prüfe dort Wettbewerbe, Saisons und Match-IDs sowie die Definitionen der Events. Dokumentiere Quelle, Abrufdatum, Auswahl und Nutzungsbedingungen samt vorgeschriebener Quellenangabe. Kontrolliere die Spielabdeckung, bevor du Aussagen über eine ganze Liga machst.

Pandas: https://pandas.pydata.org/docs/
Matplotlib: https://matplotlib.org/stable/users/index.html
scikit-learn: https://scikit-learn.org/stable/

## Reproduzierbarkeit

analyse.py und reference_solution.py suchen die Daten ausgehend von ihrem eigenen Verzeichnis. Prüfe bei der lokalen Ausführung die Paketversionen, denn sie können sich von der WebAssembly-Umgebung unterscheiden. Ergebnisse auf synthetischen Daten beschreiben diesen Probelauf und belegen keine Modellgüte bei echten Vereinen. Halte deine Methodenentscheidungen in ANNAHMEN.md fest. Die Checkliste dokumentiert deine eigene Bearbeitung; eine fachliche Zertifizierung ist damit nicht verbunden.
