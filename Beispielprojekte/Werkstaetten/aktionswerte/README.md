# Aktionswerte & Vereinspraxis

Zonenwerte berechnen und die Rangfolge unter anderen Annahmen prüfen

## Auftrag

Welche erfolgreichen Ballaktionen erhöhen den vorgegebenen Zonenwert, und wie ändert sich das Ergebnis bei anderen Spielen oder Modellannahmen?

Formuliere einen Vereinsauftrag, etwa zu progressiven Aktionen im Aufbau. Für den Probelauf stehen ein 4 × 3-Raster mit vorgegebenen synthetischen Zonenwerten und 36 fiktive Aktionen bereit.

Berechne für erfolgreiche Aktionen den Endwert minus den Startwert. Damit untersuchst du das Rechenprinzip von xT. Die Rasterwerte sind vorgegeben; in dieser Aufgabe lernst du kein Expected-Threat-Modell aus realen Übergängen.

Prüfe Koordinaten und Spielrichtung. Zeige auch negative Beiträge und vergleiche die Ergebnisse einzelner Spiele. Stelle neben den Summenwert eine einfache Aktionsanzahl: Wer länger spielt oder häufiger am Ball ist, hat mehr Gelegenheiten, Wert zu sammeln.

Kläre bei einer Vereinsarbeit mit dem Trainerstab die Frage, Datenrechte, erwartete Entscheidung und das Berichtsformat. Gib einen einseitigen Bericht ab und dokumentiere Feedback samt Überarbeitung. Ohne Trainerkontakt bearbeitest du denselben Ablauf als Probelauf und hältst fest, dass die externe Prüfung noch fehlt.

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

1. **Vereinsauftrag und Hypothese**
   Grenze die Frage ein und beschreibe, welche Entscheidung mit der Auswertung vorbereitet werden soll.
   Ergebnis: Einseitiges Briefing mit Ansprechpartner oder deutlich benanntem Dry Run.
   Prüfung: Ist eine sportliche Entscheidung benannt? / Sind Datenrechte und Umfang geklärt?

2. **Reproduzierbare Pipeline**
   Validiere Koordinaten, Ergebnisstatus und Spielrichtung. Trenne Laden, Aufbereitung, Bewertung und Bericht.
   Ergebnis: Startbarer Code mit Datenqualitätsprüfungen und dokumentierter Rasterkonvention.
   Prüfung: Ist x=120 bzw. y=80 am Rand gültig? / Werden fehlgeschlagene Aktionen bewusst behandelt?

3. **Aktionen bewerten**
   Berechne Endwert minus Startwert und aggregiere pro Spieler und Spiel. Zeige auch negative Beiträge.
   Ergebnis: Aktionswerttabelle und Grafik mit Quelle und Methodengrenze.
   Prüfung: Bleiben negative Werte erhalten? / Wird das Spielzeugraster nicht als gelerntes xT verkauft?

4. **Den Einfluss der Annahmen prüfen**
   Prüfe die Rangfolge ohne ein einzelnes Spiel, mit anderen Rasterwerten und neben einer einfachen Passzählung.
   Ergebnis: Sensitivitätstabelle und mindestens zwei Gründe, die eine Empfehlung widerlegen könnten.
   Prüfung: Wird Spielzeitkontext berücksichtigt? / Werden Methodenannahmen sichtbar?

5. **Bericht und externe Prüfung**
   Schreibe einen knappen Bericht und einen konkreten nächsten Prüfschritt. Hole möglichst Trainerfeedback ein und überarbeite. Falls kein Feedback vorliegt, dokumentiere das statt es zu erfinden.
   Ergebnis: dein Bericht mit Feedbackprotokoll oder offen markiertem Dry Run.
   Prüfung: Versteht ein Trainer den Befund? / Wurde Feedback nachvollziehbar eingearbeitet oder sein Fehlen benannt?

6. **Auf neue reale Daten übertragen**
   Prüfe ein Aktionswertmodell an vollständigen Sequenzen eines neuen Spiels.
   Ergebnis: Fünf von Hand geprüfte Sequenzen mit Roh- und Ergebniswerten; Versioniertes Aktionsschema und Tests für Grenzfälle; Einseitiger Vereinsbericht mit Robustheitsprüfung und Grenzen
   Prüfung: Vergleiche die eigenen Zonenregeln mit SPADL/xT oder VAEP. Dokumentiere, welche Events verworfen, umgewandelt oder ergänzt werden. / Prüfe Aktionsketten und Spielgrenzen. Fitte gelernte Werte nur auf dem Trainingsbestand, nicht auf dem später bewerteten Spiel. / Untersuche die Stabilität von Team-/Spielerwerten unter anderen Gittern oder Modellannahmen. Vermeide kausale Zuschreibungen an einzelne Spieler.

7. **Reproduzierbar ausliefern und erklären**
   Führe den lokalen Ablauf aus dem Export durch und dokumentiere die Prüfung.
   Ergebnis: Startkommando, Fehlerprotokoll und fünfminütige fachliche Erklärung.
   Prüfung: Frischer Datenstand ohne manuelle Anpassung. / Datenquelle, Abdeckung, Tests und Grenzen dokumentiert. / Eigene Entscheidungen ohne Musterlösung begründet.

## Bewertungsrubrik

- Die Verarbeitung prüft ihre Eingaben, und die einzelnen Berechnungsschritte lassen sich nachvollziehen.
- Der Bericht unterscheidet Aktionswert und Aktionsanzahl und berücksichtigt die Gelegenheiten durch Spielzeit und Ballbeteiligung.
- Du zeigst, wie sich das Ergebnis unter anderen Annahmen verändert und welche Unsicherheit bleibt.
- Aus dem Bericht geht hervor, welche konkrete Frage als Nächstes geprüft werden soll.

## Grenzen

- Die Rasterwerte sind vorgegeben und nicht aus realen Übergängen geschätzt.
- Die 36 Aktionen reichen für einen Probelauf, mit dem du Berechnung und Bericht übst. Für eine Spielerbewertung brauchst du mehr Beobachtungen aus passenden Spielsituationen.

## Reale Daten und Quellen

Die mitgelieferten Daten sind synthetisch. Reale Daten findest du beispielsweise unter https://github.com/hudl/open-data. Prüfe dort Wettbewerbe, Saisons und Match-IDs sowie die Definitionen der Events. Dokumentiere Quelle, Abrufdatum, Auswahl und Nutzungsbedingungen samt vorgeschriebener Quellenangabe. Kontrolliere die Spielabdeckung, bevor du Aussagen über eine ganze Liga machst.

Pandas: https://pandas.pydata.org/docs/
Matplotlib: https://matplotlib.org/stable/users/index.html
scikit-learn: https://scikit-learn.org/stable/

## Reproduzierbarkeit

analyse.py und reference_solution.py suchen die Daten ausgehend von ihrem eigenen Verzeichnis. Prüfe bei der lokalen Ausführung die Paketversionen, denn sie können sich von der WebAssembly-Umgebung unterscheiden. Ergebnisse auf synthetischen Daten beschreiben diesen Probelauf und belegen keine Modellgüte bei echten Vereinen. Halte deine Methodenentscheidungen im Bericht fest; eine Vorlage steht unten. Die Checkliste dokumentiert deine eigene Bearbeitung; eine fachliche Zertifizierung ist damit nicht verbunden.

## Praxis mit neuen Daten

[Gemeinsamer Arbeitsablauf](../../README.md#eigene-analysen-mit-realen-daten)

Prüfe ein Aktionswertmodell an vollständigen Sequenzen eines neuen Spiels.

1. Vergleiche die eigenen Zonenregeln mit SPADL/xT oder VAEP. Dokumentiere, welche Events verworfen, umgewandelt oder ergänzt werden.
2. Prüfe Aktionsketten und Spielgrenzen. Fitte gelernte Werte nur auf dem Trainingsbestand, nicht auf dem später bewerteten Spiel.
3. Untersuche die Stabilität von Team-/Spielerwerten unter anderen Gittern oder Modellannahmen. Vermeide kausale Zuschreibungen an einzelne Spieler.

## Nachweise

- Fünf von Hand geprüfte Sequenzen mit Roh- und Ergebniswerten
- Versioniertes Aktionsschema und Tests für Grenzfälle
- Einseitiger Vereinsbericht mit Robustheitsprüfung und Grenzen

<details>
<summary>Vorlage für deinen Bericht</summary>

## Aktionswerte: Projektbericht

### Auftrag und erwartete Entscheidung

[Trainerfrage oder als Dry Run gekennzeichnetes Briefing]

### Daten und Methode

[Quelle, Abdeckung, Raster, Koordinaten und Definitionen]

### Ergebnis und einfache Baseline

[Aktionswerte neben Aktionsanzahl und Spielzeit]

### Robustheit und Gegenargumente

[Andere Spiele, andere Rasterwerte, mögliche Widerlegung]

### Empfehlung und nächster Prüfschritt

[Konkrete Handlung mit Unsicherheit]

### Feedback und Überarbeitung

[Datum, Rückmeldung, Änderung oder offen benanntes fehlendes Feedback]

## Annahmen und Entscheidungen

| Entscheidung          | Begründung | Alternative | Auswirkung   |
| --------------------- | ---------- | ----------- | ------------ |
| [z. B. Minutenfilter] | [warum]    | [was sonst] | [wie prüfen] |

### KI-Nutzung und eigene Prüfung

[Welche Hilfe wurde genutzt? Was wurde danach ohne Vorlage geprüft?]

</details>
