export interface LearningResource {
  title: string;
  url: string;
  action: string;
  environment: string;
  kind?:
    | 'Tutorial'
    | 'Rechercheverzeichnis'
    | 'Transferprojekt'
    | 'Optionale Vertiefung'
    | 'Noch nicht geprüft';
}
export const learningResources: Record<string, LearningResource[]> = {
  python: [
    {
      title: 'McKay Johns: Football Analytics in Python',
      url: 'https://www.youtube.com/playlist?list=PL10a1_q15Hwpjw9bPoks8S6IFUVDO0PE7',
      action:
        'Nutze Modul 1 als Videoergänzung. Schließe danach das Video und schreibe mit eigenen Daten und Fehlerfällen eine neue Variante. Vergleiche sie erst anschließend mit der Vorlage; so erkennst du, welche Schritte du selbst begründen kannst.',
      environment: 'Externe Videos; Python und Kapitelpakete lokal',
      kind: 'Tutorial',
    },
    {
      title: 'Python-Tutorial: Kontrollfluss und Funktionen',
      url: 'https://docs.python.org/3/tutorial/controlflow.html',
      action:
        'Schreibe einen neuen Kandidatenfilter ohne Musterlösung. Teste drei Grenzfälle und erkläre jeweils, warum ein Kandidat aufgenommen oder ausgeschlossen wird.',
      environment: 'Browser oder lokales Python',
    },
    {
      title: 'Friends of Tracking: Soccermatics for Python',
      url: 'https://github.com/Friends-of-Tracking-Data-FoTD/SoccermaticsForPython',
      action:
        'Rechne ein Beispiel nach und wende es auf ein anderes Spiel an. Halte dabei jede Annahme fest, die du für die Übertragung brauchst.',
      environment: 'Lokal: Python und Daten aus dem Tutorial',
    },
  ],
  data: [
    {
      title: 'McKay Johns: Datenbeschaffung und Aufbereitung',
      url: 'https://www.youtube.com/playlist?list=PL10a1_q15Hwpjw9bPoks8S6IFUVDO0PE7',
      action:
        'Vertiefe Datenzugriff und Bereinigung mit den Modulen 3 und 5. Baue anschließend einen wiederholbaren Import mit Manifest und Tests. Prüfe bei jeder Quelle, welcher Zugriff zulässig ist, und zeige, dass eine wiederholte Lieferung keine zusätzlichen Datensätze erzeugt.',
      environment:
        'Externe Videos und lokale Python-Umgebung; keine stabile Verfügbarkeit jeder gezeigten Website voraussetzen',
      kind: 'Tutorial',
    },
    {
      title: 'pandas: Merge- und Join-Verträge',
      url: 'https://pandas.pydata.org/docs/user_guide/merging.html',
      action:
        'Füge absichtlich eine doppelte ID in die Spielerdimension ein. Sichere den Join mit validate ab und prüfe, ob er den Fehler meldet, bevor vervielfachte Events in eine Kennzahl eingehen.',
      environment: 'Browser: pandas vorhanden',
    },
    {
      title: 'SQLite: Window Functions',
      url: 'https://www.sqlite.org/windowfunctions.html',
      action:
        'Vergleiche ein begrenztes ROWS-Fenster mit einem kumulativen Fenster. Rechne an einem Match nach, welche Zeilen jeweils in die Summe eingehen.',
      environment: 'Browser: SQLite vorhanden',
    },
  ],
  analysis: [
    {
      title: 'Basketball Analytics: sportübergreifender Methodentransfer',
      url: 'https://github.com/danchyy/Basketball_Analytics',
      action:
        'Übertrage eine Frage aus den Shotchart-Notebooks auf Fußball-Schüsse. Nenne Nenner und Zeitraum deiner Kennzahl und rechne zwei Zonen anhand der Rohdaten nach. Erkläre, welche Annahmen sich beim Wechsel der Sportart nicht übertragen lassen.',
      environment:
        'Optional lokal: Jupyter; NBA-Kennzahlen und alte Datenzugriffe nicht ungeprüft übernehmen',
      kind: 'Transferprojekt',
    },
    {
      title: 'Soccer Analytics Handbook: Karten und Heatmaps',
      url: 'https://github.com/devinpleuler/analytics-handbook/blob/master/soccer_analytics_handbook.ipynb',
      action:
        'Übertrage eine Pass- oder Schussdarstellung auf ein unbekanntes Spiel. Gleiche die dargestellten Events mit der Quelle ab und untersuche Abweichungen, bevor du die Darstellung interpretierst.',
      environment: 'Lokal: Jupyter; Paketversionen und Datenzugriff vorab prüfen',
      kind: 'Tutorial',
    },
    {
      title: 'mplsoccer: vollständige Beispielgalerie',
      url: 'https://mplsoccer.readthedocs.io/en/latest/gallery/',
      action:
        'Baue einen Spielbericht mit Shot Map und Passdarstellung. Gleiche fünf dargestellte Aktionen mit den Rohdaten ab, damit fehlerhafte Filter oder Positionen im Bericht auffallen.',
      environment: 'Externes Tutorial; mplsoccer lokal installieren',
    },
    {
      title: 'Kloppy: Event- und Trackingdaten',
      url: 'https://kloppy.pysport.org/user-guide/getting-started/',
      action:
        'Lade ein Beispiel und dokumentiere Koordinaten sowie Spielrichtung. Prüfe, ob Frames fehlen, bevor du Bewegungen aus den Daten ableitest.',
      environment: 'Lokal; kloppy ist nicht in der Browser-Laufzeit',
    },
  ],
  statistics: [
    {
      title: 'Soccermatics: mathematische Fußballanalyse',
      url: 'https://soccermatics.readthedocs.io/en/latest/',
      action:
        'Bearbeite die Abschnitte zu Schussgeometrie und xG. Führe ein Protokoll der Modellannahmen und notiere, an welchen Beispielen sie zu Fehlern führen.',
      environment: 'Offene Kursnotizen und lokale Übungen',
    },
    {
      title: 'scikit-learn: Datenlecks und Pipelines',
      url: 'https://scikit-learn.org/stable/common_pitfalls.html',
      action:
        'Vergleiche absichtlich auf allen Daten gelernte Vorverarbeitung mit einer Pipeline, die nur im Training lernt. Benenne dabei, welche Testinformationen die erste Variante vorzeitig verwendet.',
      environment: 'Browser: scikit-learn vorhanden',
    },
  ],
  scouting: [
    {
      title: 'Soccer Analytics Handbook: Clustering',
      url: 'https://github.com/devinpleuler/analytics-handbook/blob/master/soccer_analytics_handbook.ipynb',
      action:
        'Wiederhole K-Means und GMM mit anderen Seeds und vergleiche die Zuordnungen. Begründe, warum auch ein stabiles Cluster allein keine Spielerrolle belegt.',
      environment: 'Lokal; zusätzliche Bibliotheken aus dem Notebook',
      kind: 'Optionale Vertiefung',
    },
    {
      title: 'Awesome Soccer Analytics',
      url: 'https://github.com/matiasmascioto/awesome-soccer-analytics',
      action:
        'Wähle eine Datenquelle und prüfe Verfügbarkeit, Nutzungsbedingungen, Definitionen und Abdeckung an der Originalquelle. Halte fest, für welche Scouting-Frage ihre Definitionen und Abdeckung ausreichen.',
      environment: 'Rechercheverzeichnis; verlinkte Angebote einzeln prüfen',
      kind: 'Rechercheverzeichnis',
    },
    {
      title: 'mplsoccer: Perzentile und Vergleiche',
      url: 'https://mplsoccer.readthedocs.io/en/latest/gallery/',
      action:
        'Erstelle einen rollenbezogenen Vergleich. Ändere Minutenschwelle und Gewichte. Dokumentiere die Rangwechsel und erkläre, welche durch eine andere Vergleichsgruppe entstehen.',
      environment: 'Lokal für mplsoccer; Kennzahlen im Browser',
    },
    {
      title: 'socceraction: Aktionsdaten mit SPADL',
      url: 'https://socceraction.readthedocs.io/en/latest/documentation/spadl/spadl.html',
      action:
        'Prüfe vor einem Spielervergleich, wie SPADL die jeweiligen Provider-Aktionen konvertiert oder ergänzt. Halte fest, welche Unterschiede dadurch in die Vergleichsdaten eingehen.',
      environment: 'Lokal; socceraction ist kein Browserpaket',
    },
  ],
  engineering: [
    {
      title: 'Sport Analytics Tools: Spieler-IDs abgleichen',
      url: 'https://github.com/shufinskiy/sport_analytics_tools/tree/main/mapping_nba_ids',
      action:
        'Untersuche das NBA-ID-Mapping und entwirf einen Fußball-ID-Vertrag. Prüfe Fälle mit gleichen Namen sowie fehlende Zuordnungen. Sammle unsichere Treffer in einer manuellen Prüfliste, damit sie nicht ungeprüft in den Join gelangen.',
      environment: 'Optional lokal; sport- und quellenspezifische Logik überprüfen',
      kind: 'Transferprojekt',
    },
    {
      title: 'Sport Analytics Tools: FIFA-Berichte strukturieren',
      url: 'https://github.com/shufinskiy/sport_analytics_tools/tree/main/fifa_wc',
      action:
        'Prüfe den programmatischen Parser an einem passenden Bericht. Vergleiche Stichproben mit einer manuell erstellten Referenz. Dokumentiere Fehler durch abweichende Berichtsvorlagen und Stellen, die der Parser nur unvollständig rekonstruiert.',
      environment:
        'Lokal: PyMuPDF; festes FIFA-2026-Layout, keine Browser-Laufzeit oder KI-Nutzung nötig',
      kind: 'Optionale Vertiefung',
    },
    {
      title: 'StatsBomb: offene Daten und Datenstruktur',
      url: 'https://github.com/hudl/open-data',
      action:
        'Erweitere den fixierten Snapshot um eine neue Partie. Prüfe Match-IDs, Datenabdeckung und Nutzungsbedingungen. Halte fest, welchen Datenstand die erweiterte Auswahl enthält.',
      environment: 'Browser-Snapshot vorhanden; Download-Skript lokal',
    },
    {
      title: 'Airflow: wiederholbare Datentasks',
      url: 'https://airflow.apache.org/docs/apache-airflow/stable/best-practices.html',
      action:
        'Übertrage die Idempotenzregeln auf einen lokalen CLI-Import. Simuliere einen Abbruch und wiederhole den Import. Prüfe, ob das Ergebnis mit einem ununterbrochenen Lauf übereinstimmt. Airflow selbst ist optional.',
      environment: 'Lokales Abschlussprojekt; keine Cloud erforderlich',
    },
    {
      title: 'dbt: Datenprüfungen',
      url: 'https://docs.getdbt.com/docs/build/data-tests',
      action:
        'Schreibe eigene SQL- oder Python-Tests für unique, not_null, relationships und Wertebereiche. Erzeuge für jeden Test einen fehlerhaften Datensatz und prüfe, ob er erkannt wird.',
      environment: 'Konzept im Browser; dbt optional lokal',
    },
  ],
  'science-practice': [
    {
      title: 'McKay Johns: Modelle und Projektbeispiele',
      url: 'https://www.youtube.com/playlist?list=PL10a1_q15Hwpjw9bPoks8S6IFUVDO0PE7',
      action:
        'Nutze Modul 6 und die Projektteile als Vergleich nach dem eigenen Entwurf. Ergänze eine eigene Baseline und eine zeitliche Evaluation mit ganzen Spielen. Halte im Fehlerprotokoll fest, welche Fehler du prüfst und warum sie die Auswertung beeinflussen.',
      environment:
        'Externe Videos; Modellbibliotheken lokal, Beispiele nicht vollständig fachlich auditiert',
      kind: 'Transferprojekt',
    },
    {
      title: 'Soccer Analytics Handbook: Passschwierigkeit',
      url: 'https://github.com/devinpleuler/analytics-handbook/blob/master/soccer_analytics_handbook.ipynb',
      action:
        'Reproduziere den Modellansatz. Ergänze eine eigene Baseline, einen zeitlichen Split nach ganzen Matches und eine Kalibrationsprüfung. Begründe den Evaluationsaufbau selbst, bevor du Ergebnisse aus dem Notebook übernimmst.',
      environment: 'Lokal: Notebook und zusätzliche Pakete, unter anderem XGBoost',
      kind: 'Transferprojekt',
    },
    {
      title: 'scikit-learn: Cross-Validation und Gruppen',
      url: 'https://scikit-learn.org/stable/modules/cross_validation.html',
      action:
        'Begründe einen zeitlichen Split nach ganzen Spielen. Beschreibe, für welchen späteren Zeitraum und welche Spiele er eine Prognoseaufgabe nachbildet.',
      environment: 'Browser: scikit-learn vorhanden',
    },
    {
      title: 'scikit-learn: Wahrscheinlichkeiten kalibrieren',
      url: 'https://scikit-learn.org/stable/modules/calibration.html',
      action:
        'Berichte Brier und Logloss zusammen mit der Zahl der Beobachtungen je Bin. Reserviere das spätere Testset vor der Kalibration; es darf nicht zum Lernen der Kalibrationsfunktion dienen.',
      environment: 'Browser: pandas, NumPy, scikit-learn',
    },
  ],
  advanced: [
    {
      title: 'Volleyball Analytics: vom Video zum Datenprodukt',
      url: 'https://github.com/masouduut94/volleyball_analytics',
      action:
        'Lies die Pipeline als Architekturfallstudie. Beschreibe für ein Modul Eingabe, Ausgabe, benötigte Gewichte und Fehlerfälle. Erkläre, welche Labels und Geometrien du für Fußball neu entwickeln müsstest und weshalb die Volleyballdefinitionen dafür nicht ausreichen.',
      environment:
        'Optional: fortgeschrittene Computer Vision. Ausführung benötigt separaten Video-/Deep-Learning-Stack; Architekturlektüre ohne Installation möglich',
      kind: 'Optionale Vertiefung',
    },
    {
      title: 'Soccer Analytics Handbook: Tracking',
      url: 'https://github.com/devinpleuler/analytics-handbook/blob/master/soccer_analytics_handbook.ipynb',
      action:
        'Prüfe einen Tracking-Ausschnitt auf Zeitbasis, Koordinaten und Abdeckung. Halte für eine Bewegungs- oder Intercept-Auswertung fest, welche Annahmen du aus diesen Prüfungen ableitest und wo Datenlücken ihre Aussage begrenzen.',
      environment: 'Lokal: Notebook, Kloppy und passende Trackingdaten',
      kind: 'Optionale Vertiefung',
    },
    {
      title: 'socceraction: VAEP',
      url: 'https://socceraction.readthedocs.io/en/latest/documentation/vaep/index.html',
      action:
        'Rechne eine Aktionsbewertung nach. Prüfe an Spielgrenzen, ob Merkmals- oder Label-Fenster versehentlich Aktionen aus dem nächsten Spiel einbeziehen.',
      environment: 'Lokal; Tutorial und zusätzliche Pakete',
    },
    {
      title: 'Friends of Tracking: Tracking-Tutorials',
      url: 'https://github.com/Friends-of-Tracking-Data-FoTD/LaurieOnTracking',
      action:
        'Rechne eine Pitch-Control-Sequenz nach und variiere Geschwindigkeit sowie Reaktionszeit. Beschreibe, wie sich das Ergebnis verändert und welche Modellgrenzen dabei sichtbar werden.',
      environment: 'Lokal mit öffentlichem Metrica-Beispiel',
    },
  ],
};
