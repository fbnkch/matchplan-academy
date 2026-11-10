# Eigenes xG-Modell

Torwahrscheinlichkeiten schätzen und an zurückgehaltenen Spielen prüfen

## Auftrag

Wie gut schätzt ein Modell aus Distanz und Winkel die Torwahrscheinlichkeit in Spielen, die es im Training nicht gesehen hat?

Berechne zunächst Distanz und Torwinkel und verwende sie für eine logistische Regression. Das Feld misst hier 105 × 68 Meter, die Tormitte liegt bei (105, 34), das Tor ist 7,32 Meter breit. Prüfe diese Konvention vor der Berechnung: StatsBomb verwendet mit 120 × 80 eine andere Skala.

Der Probelauf enthält 192 synthetische Schüsse aus 16 fiktiven Spielen. Ein einfacher Generator hat die Torlabels erzeugt. Damit kannst du die Verarbeitung und Bewertung durchspielen; eine gemessene Modellgüte gilt zunächst nur für diese erzeugten Daten.

Verwende die Spiele 1 bis 12 zum Training und die Spiele 13 bis 16 zum Test. In dieser Aufgabe sind Distanz und Winkel die Modellmerkmale. Anbieter-xG bleibt für einen separaten Vergleich reserviert; Schussergebnis und erst nach dem Abschluss bekannte Angaben dürfen nicht in die Vorhersage eingehen.

Vergleiche Brier-Score und Kalibration mit einer konstanten Vorhersage aus der Torquote des Trainingsbestands. Notiere auch Ansätze, die nicht funktioniert haben. Übertrage den Ablauf danach auf einen ausreichend großen realen Schussbestand und dokumentiere dessen Nutzungsrechte.

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

1. **Schüsse und Merkmale definieren**
   Dokumentiere Datenauswahl und Koordinatensystem. Rechne Distanz und Öffnungswinkel selbst aus.
   Ergebnis: Merkmalstabelle und Plausibilitätsbeispiele für zentralen und seitlichen Abschluss.
   Prüfung: Sind Einheiten und Torposition korrekt? / Enthalten Merkmale keine Information nach dem Schuss?

2. **Testspiele festlegen**
   Lege den Split vor der Modellbewertung fest. Kontrolliere, dass kein Spiel in beiden Teilmengen vorkommt.
   Ergebnis: Train-/Test-IDs und Assertion zur Überschneidungsfreiheit.
   Prüfung: Sind ganze Spiele getrennt? / Bleiben Testlabels außerhalb des Trainings?

3. **Baseline und einfaches Modell**
   Fit die logistische Regression nur auf Trainingsdaten. Speichere die Trainings-Torquote als konstante Baseline.
   Ergebnis: Modell, Baseline und Testwahrscheinlichkeiten.
   Prüfung: Liefern alle Vorhersagen Werte zwischen 0 und 1? / Ist die Baseline unabhängig von den Testlabels?

4. **Wahrscheinlichkeiten bewerten**
   Berechne Brier-Score und eine Kalibrierungstabelle mit Fallzahlen je Bin. Diskutiere Unsicherheit statt nur eine Kurve zu zeigen.
   Ergebnis: Vergleichstabelle und Kalibrierungsgrafik.
   Prüfung: Werden Testdaten nicht zur Modellwahl missbraucht? / Stehen Stichprobengrößen bei der Kalibrierung?

5. **Modellkarte schreiben**
   Schreibe Zweck, Daten, Merkmale, Prüfung, Fehlversuche und Einsatzgrenzen auf. Nenne fehlende Merkmale wie Gegnerdruck oder Torwartposition.
   Ergebnis: dein Bericht als verständliche Modellkarte.
   Prüfung: Wird 0,2 xG als Wahrscheinlichkeit und nicht als Torversprechen erklärt? / Wird synthetische Güte nicht auf echte Vereine übertragen?

6. **Auf neue reale Daten übertragen**
   Trainiere auf einem größeren öffentlichen Schussbestand und prüfe eine zeitlich spätere Partieauswahl.
   Ergebnis: Explizite Trainings-/Validierungs-/Test-Matchlisten; Reproduzierbares Modell und unabhängige Referenzprüfung; Model Card mit Datenlücken, erlaubtem Einsatz und klaren Nicht-Aussagen
   Prüfung: Definiere die Zielpopulation, zulässige Vor-Schuss-Merkmale und ausgeschlossene Informationen. Halte Spiel- und Datumsgrenzen ein. / Fitte Preprocessing und Modell ausschließlich auf Trainingsdaten. Vergleiche Dummy-Baseline, logistische Regression und höchstens ein begründetes alternatives Modell. / Berichte Brier, Logloss, Kalibration mit Binbesetzung und Match-Cluster-Unsicherheit. Untersuche Fehlergruppen; optimiere nicht auf dem finalen Testset.

7. **Reproduzierbar ausliefern und erklären**
   Führe den lokalen Ablauf aus dem Export durch und dokumentiere die Prüfung.
   Ergebnis: Startkommando, Fehlerprotokoll und fünfminütige fachliche Erklärung.
   Prüfung: Frischer Datenstand ohne manuelle Anpassung. / Datenquelle, Abdeckung, Tests und Grenzen dokumentiert. / Eigene Entscheidungen ohne Musterlösung begründet.

## Bewertungsrubrik

- Du kannst die berechnete Distanz und den Winkel an einzelnen Schüssen nachrechnen.
- Trainings- und Testlisten enthalten keine gemeinsamen Spiel-IDs.
- Der Bericht vergleicht Modell und Baseline und erklärt die Kalibration anhand der Fallzahlen.
- Anbieter-xG fließt nicht als Merkmal in dieses Modell ein; ein separater Vergleich ist gekennzeichnet.

## Grenzen

- Der Generator ist stark vereinfacht; das Modell kann daraus keine reale Chancenqualität lernen.
- Eine kleine Kalibrierungstabelle ist instabil. Für echte Bewertung braucht es deutlich mehr ungesehene Spiele und Schüsse.

## Reale Daten und Quellen

Die mitgelieferten Daten sind synthetisch. Reale Daten findest du beispielsweise unter https://github.com/hudl/open-data. Prüfe dort Wettbewerbe, Saisons und Match-IDs sowie die Definitionen der Events. Dokumentiere Quelle, Abrufdatum, Auswahl und Nutzungsbedingungen samt vorgeschriebener Quellenangabe. Kontrolliere die Spielabdeckung, bevor du Aussagen über eine ganze Liga machst.

Pandas: https://pandas.pydata.org/docs/
Matplotlib: https://matplotlib.org/stable/users/index.html
scikit-learn: https://scikit-learn.org/stable/

## Reproduzierbarkeit

analyse.py und reference_solution.py suchen die Daten ausgehend von ihrem eigenen Verzeichnis. Prüfe bei der lokalen Ausführung die Paketversionen, denn sie können sich von der WebAssembly-Umgebung unterscheiden. Ergebnisse auf synthetischen Daten beschreiben diesen Probelauf und belegen keine Modellgüte bei echten Vereinen. Halte deine Methodenentscheidungen im Bericht fest; eine Vorlage steht unten. Die Checkliste dokumentiert deine eigene Bearbeitung; eine fachliche Zertifizierung ist damit nicht verbunden.

## Praxis mit neuen Daten

[Gemeinsamer Arbeitsablauf](../../README.md#eigene-analysen-mit-realen-daten)

Trainiere auf einem größeren öffentlichen Schussbestand und prüfe eine zeitlich spätere Partieauswahl.

1. Definiere die Zielpopulation, zulässige Vor-Schuss-Merkmale und ausgeschlossene Informationen. Halte Spiel- und Datumsgrenzen ein.
2. Fitte Preprocessing und Modell ausschließlich auf Trainingsdaten. Vergleiche Dummy-Baseline, logistische Regression und höchstens ein begründetes alternatives Modell.
3. Berichte Brier, Logloss, Kalibration mit Binbesetzung und Match-Cluster-Unsicherheit. Untersuche Fehlergruppen; optimiere nicht auf dem finalen Testset.

## Nachweise

- Explizite Trainings-/Validierungs-/Test-Matchlisten
- Reproduzierbares Modell und unabhängige Referenzprüfung
- Model Card mit Datenlücken, erlaubtem Einsatz und klaren Nicht-Aussagen

<details>
<summary>Vorlage für deinen Bericht</summary>

## Modellkarte: Distanz und Winkel

### Zweck und Daten

[Synthetischer Probelauf oder echte Daten mit Quelle]

### Merkmale und Annahmen

[Koordinaten, Distanz, Winkel, ausgeschlossene Merkmale]

### Train-/Test-Design

[Spiel-IDs, Split-Regel, Leakage-Prüfung]

### Ergebnis im Test

[Baseline-Brier, Modell-Brier, Kalibrierung mit Fallzahlen]

### Fehlversuche und Unsicherheit

[Was wurde verworfen, warum, was ist unklar?]

### Einsatzgrenzen

[Was das Modell nicht beantworten kann]

## Annahmen und Entscheidungen

| Entscheidung          | Begründung | Alternative | Auswirkung   |
| --------------------- | ---------- | ----------- | ------------ |
| [z. B. Minutenfilter] | [warum]    | [was sonst] | [wie prüfen] |

### KI-Nutzung und eigene Prüfung

[Welche Hilfe wurde genutzt? Was wurde danach ohne Vorlage geprüft?]

</details>
