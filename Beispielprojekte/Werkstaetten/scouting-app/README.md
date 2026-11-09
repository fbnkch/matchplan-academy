# Scouting-App

Ein Rollenprofil in eine Liste für die nächste Sichtung übersetzen

## Auftrag
Welche Mittelfeldspielerinnen kommen für eine verbindende Rolle im Ballbesitz infrage, und wie stark hängt die Auswahl von deinen Annahmen ab?

Beschreibe vor dem Blick auf die Rangliste, was die gesuchte Spielerin im Aufbau, im Raumverhalten und gegen den Ball leisten soll. Wähle dafür vier bis sechs Kennzahlen. Halte fest, welche Anforderung jede Kennzahl abbildet und welche Information ihr fehlt.

Die Demo enthält 24 synthetische Profile. Für den Vergleich wählst du MF mit mindestens 900 Minuten aus. Dieses Positionslabel grenzt die Gruppe nur grob ein. Prüfe bei der Interpretation weiterhin Rolle und Teamkontext, auch wenn du alle Werte auf 90 Minuten umgerechnet hast.

Berechne einen gewichteten Score aus den innerhalb der Vergleichsgruppe standardisierten Raten. Ändere mindestens einmal die Gewichtung und prüfe zwei Minutenfilter. Wenige Ballverluste können auch bedeuten, dass eine Spielerin selten riskante Aktionen versucht. Beurteile den Wert deshalb zusammen mit der Ballprogression.

Im Browser prüfst du den Analysekern. Das ZIP enthält zusätzlich eine lokal startbare Streamlit-App. Dort kannst du Daten laden, Position, Minuten und Gewichte ändern, Profile ansehen und die Auswahl als CSV exportieren. Installiere die Pakete mit pip install -r requirements.txt und starte streamlit run app.py.

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

## Streamlit-App

Starte die App nach der Installation mit `streamlit run app.py`. Ändere Position, Mindestminuten und Gewichte und vergleiche die Ergebnisse. Du kannst einzelne Profile ansehen und die Shortlist als CSV herunterladen.

## Meilensteine
1. **Rollenprofil vor der Rangliste**
   Beschreibe die Aufgaben der gesuchten Rolle und übersetze sie in begründete Kennzahlen. Notiere bewusst fehlende Daten.
   Ergebnis: Rollenprofil mit vier bis sechs Kriterien, Bedeutung und Grenzen.
   Prüfung: Sind Kriterien vor dem Blick auf Namen festgelegt? / Stehen riskante und sichere Spielweisen im Kontext?

2. **Faire Vergleichsgruppe**
   Wähle vergleichbare Rollen und eine Mindestspielzeit. Prüfe Datenabdeckung und berechne Raten pro 90.
   Ergebnis: Peer-Tabelle mit Minuten, Raten und Ausschlussgründen.
   Prüfung: Wird nicht zwischen fremden Positionen gerankt? / Ist der Minutenfilter begründet?

3. **Score und Gegenprüfung**
   Standardisiere innerhalb der Peer-Gruppe, nicht über alle Positionen. Dokumentiere Richtung und Gewicht jeder Kennzahl.
   Ergebnis: Shortlist mit drei Kandidatinnen und offenem Rechenweg.
   Prüfung: Führt eine konstante Kennzahl nicht zu Division durch null? / Werden fehlende Werte nicht still als Nullqualität behandelt?

4. **Stabilität untersuchen**
   Variiere Gewichte und Mindestminuten. Untersuche, welche Namen stabil bleiben und warum sich andere verändern.
   Ergebnis: Mindestens drei Szenarien und eine Gegenargument-Spalte pro Kandidatin.
   Prüfung: Werden instabile Rangunterschiede sichtbar? / Wird ein Score nicht als objektive Wahrheit dargestellt?

5. **App und Kandidatenberichte**
   Exportiere das Projekt und starte die enthaltene Streamlit-App. Prüfe Filter, leere Auswahl und CSV-Export. Schreibe einen One-Pager pro Kandidatin für die Videosichtung.
   Ergebnis: Startbare App, README und drei begründete Kandidatenprofile.
   Prüfung: Kann eine zweite Person die App starten? / Sind Video-/Livefragen und Gründe gegen die Auswahl benannt?

6. **Auf neue reale Daten übertragen**
   Stelle für eine festgelegte Rolle zusammen, welche Spieler die Videoscouts als Nächstes prüfen sollen.
   Ergebnis: Beschreibung der Quellen, Kennzahlen und Anforderungen an die Rolle; Tabelle mit den Rangfolgen unter verschiedenen Gewichten und Minutenfiltern; Lokal startbare App mit dokumentiertem CSV-Export und Fehlerbehandlung
   Prüfung: Formuliere das Rollenprofil und eine sinnvolle Vergleichsgruppe. Ein Turnier mit wenigen Spielen ist keine ausreichende Saisonbasis. / Sichere Schlüssel und Einsatzzeitdefinitionen; vergleiche Raten, Rollen- und Teamkontext. Variiere Gewichte und Minutenschwellen. / Schreibe je Kandidat eine begründete Hypothese, ein Gegenargument und eine konkrete Video-Prüffrage. Zeige Datenabdeckung und leere Filterzustände in der App.

7. **Reproduzierbar ausliefern und erklären**
   Führe den lokalen Ablauf aus dem Export durch und dokumentiere die Prüfung.
   Ergebnis: Startkommando, Fehlerprotokoll und fünfminütige fachliche Erklärung.
   Prüfung: Frischer Datenstand ohne manuelle Anpassung. / Datenquelle, Abdeckung, Tests und Grenzen dokumentiert. / Eigene Entscheidungen ohne Musterlösung begründet.

## Bewertungsrubrik
- Du begründest die Kennzahlen mit den Aufgaben der gesuchten Rolle, bevor du die Namen vergleichst.
- Der Bericht erklärt den Einfluss von Spielzeit, Position, Teamkontext und Datenlücken auf die Auswahl.
- Du zeigst die Rangfolgen unter anderen Annahmen und erklärst, warum Kandidatinnen auf- oder abrücken.
- In der App lassen sich Rechenweg und Grenzen nachvollziehen; Filter und CSV-Export funktionieren.

## Grenzen
- Positionslabels und drei Übungskennzahlen bilden keine vollständige Rolle ab.
- Die Demo kennt weder Transferbudget, Verletzungskontext noch Vertragsdaten. Empfehlungen bleiben Arbeitsaufträge zur weiteren Prüfung.

## Reale Daten und Quellen

Die mitgelieferten Daten sind synthetisch. Reale Daten findest du beispielsweise unter https://github.com/hudl/open-data. Prüfe dort Wettbewerbe, Saisons und Match-IDs sowie die Definitionen der Events. Dokumentiere Quelle, Abrufdatum, Auswahl und Nutzungsbedingungen samt vorgeschriebener Quellenangabe. Kontrolliere die Spielabdeckung, bevor du Aussagen über eine ganze Liga machst.

Pandas: https://pandas.pydata.org/docs/
Matplotlib: https://matplotlib.org/stable/users/index.html
scikit-learn: https://scikit-learn.org/stable/

## Reproduzierbarkeit

analyse.py und reference_solution.py suchen die Daten ausgehend von ihrem eigenen Verzeichnis. Prüfe bei der lokalen Ausführung die Paketversionen, denn sie können sich von der WebAssembly-Umgebung unterscheiden. Ergebnisse auf synthetischen Daten beschreiben diesen Probelauf und belegen keine Modellgüte bei echten Vereinen. Halte deine Methodenentscheidungen in ANNAHMEN.md fest. Die Checkliste dokumentiert deine eigene Bearbeitung; eine fachliche Zertifizierung ist damit nicht verbunden.
