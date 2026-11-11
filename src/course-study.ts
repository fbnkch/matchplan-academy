import { learningResources, type LearningResource } from './course/resources';
import { foundationEnrichment, foundationSources } from './course/reference-foundations';
import { sportEnrichment, sportSources, extensionChapters } from './course/reference-sport-ai';
import { localProjectsByChapter, type LocalProject } from './course/local-projects';
import { gitStudyChapters } from './course/git-study';

export interface StudySection {
  title: string;
  paragraphs: string[];
  example?: { code: string; expected: string; explanation: string; language?: 'python' | 'shell' };
  diagram?: { title: string; url: string; summary: string; steps: string[] };
  selfCheck?: { question: string; answer: string };
  commands?: { command: string; purpose: string }[];
}
export interface StudySource {
  title: string;
  url: string;
  chapters: string[];
  focus: string;
  license: string;
  inspected: string[];
}

export interface StudyChapter {
  id: string;
  trackId: string;
  title: string;
  lead: string;
  sections: StudySection[];
  references?: StudySource[];
  optional?: boolean;
  localProjects?: LocalProject[];
  questions: string[];
  build: { title: string; url: string; brief: string; acceptance: string[] };
  media: LearningResource[];
  practiceIds: string[];
  projectId?: string;
}
const handbook = 'https://github.com/devinpleuler/analytics-handbook';
const tracking = 'https://github.com/Friends-of-Tracking-Data-FoTD/LaurieOnTracking';
const guide: LearningResource = {
  title: 'The Football Analysis Guy: Einstieg und Workbook',
  url: 'https://thefootballanalysisguy.com/portal/get-started-in-football-analysis/',
  action:
    'Bearbeite die Aufgaben zum Berufsbild und notiere, welche technische, taktische und kommunikative Kompetenz dein Portfolio zeigen soll.',
  environment:
    'Externe Leseseite mit angebotenem Guide/Workbook; Downloadbedingungen auf der Originalseite',
  kind: 'Tutorial',
};
const report: LearningResource = {
  title: 'The Football Analysis Guy: einen Spielbericht aufbauen',
  url: 'https://thefootballanalysisguy.com/portal/build-your-first-match-report/',
  action:
    'Erstelle eine Berichtsseite zu einem konkreten Spielmechanismus. Trenne Beobachtung, Beleg und Handlungsvorschlag.',
  environment: 'Externe Lektion und Vorlage; Quellenmaterial bleibt beim Anbieter',
  kind: 'Transferprojekt',
};

const baseStudyChapters: StudyChapter[] = [
  {
    id: 'study-foundations',
    trackId: 'python',
    title: 'Eine Fußballfrage in eine Analyse übersetzen',
    lead: 'Was du messen willst, welche Daten du brauchst und wie daraus ein überprüfbares Programm wird.',
    sections: [
      {
        title: 'Die Entscheidung kommt vor der Kennzahl',
        paragraphs: [
          '"Wir brauchen einen guten Mittelfeldspieler" ist noch keine auswertbare Frage. Beschreibe zuerst eine Rolle, eine Spielsituation und die Entscheidung: Wer kann unter hohem Gegnerdruck den Ball nach vorne bringen? Daraus entstehen Beobachtungen wie Raumgewinn, Ballverluste und Anschlussaktionen. Keine einzelne Zahl deckt die gesamte Rolle ab.',
          'Lege die Untersuchungseinheit fest. Eine Zeile kann einen Spieler, eine Saison, ein Spiel oder eine Aktion darstellen. Wenn du Spieleraktionen mit Saisonwerten verknüpfst, wechselst du die Ebene. Schreibe deshalb vor dem ersten Code auf, was genau eine Zeile bedeutet und welche Vergleichsgruppe du verwendest.',
        ],
      },
      {
        title: 'Ein- und Ausgaben einer Funktion festlegen',
        paragraphs: [
          'Ein Kandidatenfilter erhält Spielerprofile und eine Minutengrenze. Als Ergebnis liefert er die passende Auswahl. Lege fest, welche Felder die Profile enthalten müssen und was bei fehlenden Angaben passiert. Mit diesem Vertrag kannst du sowohl eine Schleife als auch eine Tabellenoperation prüfen; verständliche Namen erleichtern den Vergleich.',
          'Beginne mit einem Fall, den du von Hand lösen kannst. Prüfe danach eine leere Eingabe, einen Wert genau auf der Grenze und fehlende Felder. Das gilt auch für Code aus einem Notebook oder von einer KI: Ändere die Eingabe und sage vor dem Ausführen voraus, was sich im Ergebnis ändern muss.',
        ],
      },
      {
        title: 'Deine erste lokale Arbeitsumgebung',
        paragraphs: [
          'Ein Notebook eignet sich zum Untersuchen und Erklären. Wiederverwendbare Funktionen gehören später in ein Python-Modul; ein Skript führt den Ablauf reproduzierbar aus. Halte Datenzugriff, Transformation und Darstellung getrennt, damit du einen Baustein ändern kannst, ohne die gesamte Analyse umzubauen.',
          'Notiere Python- und Paketversionen, die Herkunft der Eingabedatei und ein Startkommando. Deine erste Abgabe ist eine kleine Analyse samt README und zwei selbst geschriebenen Tests. Die optionalen Browserübungen helfen dir, wenn Syntax oder Funktionen noch unsicher sind.',
        ],
      },
    ],
    questions: [
      'Was hast du in den Daten beobachtet, und wie deutest du diese Beobachtung?',
      'Welche Eingabe müsste deinen Filter scheitern lassen?',
      'Kannst du die Funktion mit anderen Daten ohne KI verändern?',
    ],
    build: {
      title: 'Soccermatics for Python',
      url: 'https://github.com/Friends-of-Tracking-Data-FoTD/SoccermaticsForPython',
      brief:
        'Wähle ein kleines Beispiel, erkläre den Datenfluss und lagere eine Berechnung in eine eigene Funktion aus. Verwende anschließend andere Eingaben.',
      acceptance: [
        'Eine konkrete Fußballfrage und eine definierte Untersuchungseinheit.',
        'Eine eigene Funktion mit mindestens zwei Gegenbeispielen.',
        'README mit Quelle, Umgebung und Startkommando.',
      ],
    },
    media: [
      guide,
      {
        title: 'Guide & Workbook als PDF',
        url: 'https://thefootballanalysisguy.com/media/portal/Get-Started-in-Football-Analysis-guide-and-workbook.pdf',
        action:
          'Öffne das vom Autor bereitgestellte PDF parallel zum Kapitel. Halte deine eigenen Antworten in den Kursnotizen fest.',
        environment: 'Externer Originaldownload; PDF-Inhalt nicht separat ausgelesen',
        kind: 'Tutorial',
      },
      ...learningResources.python,
    ],
    practiceIds: ['anpfiff', 'transfer'],
  },
  {
    id: 'study-data',
    trackId: 'data',
    title: 'Daten verstehen, verknüpfen und prüfen',
    lead: 'Von der Providerdatei zu einer Tabelle, deren Bedeutung und Fehler du erklären kannst.',
    sections: [
      {
        title: 'Event-, Tracking- und Aggregatdaten',
        paragraphs: [
          'Eventdaten halten erfasste Aktionen wie Pässe und Schüsse fest. Trackingdaten liefern Positionen in zeitlicher Folge. Saisonaggregate fassen Beobachtungen zu Kennzahlen zusammen. Wähle die Daten passend zur Frage: Aus einem Eventfeed lassen sich keine vollständigen Laufwege ablesen, und ein Saisonwert enthält den Ablauf einer einzelnen Aktion nicht mehr.',
          'Lies das Datendictionary des Anbieters. Fehlendes outcome kann je nach Schema einen erfolgreichen Pass bezeichnen; ein fehlender Datensatz bedeutet dagegen nicht null Pässe. Auch Koordinaten und Spielrichtung müssen nach Anbieterregel interpretiert werden. Unterschiede zwischen Quellen sind oft Definitionsunterschiede.',
        ],
      },
      {
        title: 'Schlüssel und Granularität von Joins',
        paragraphs: [
          'Namen sind keine zuverlässigen Schlüssel. Verwende stabile Spieler- und Match-IDs und dokumentiere ihren Geltungsbereich. Eine Spielerdimension sollte pro Schlüssel genau eine Zeile enthalten. Ein Join mit doppelten Dimensionszeilen vervielfacht deine Aktionen und damit später die Kennzahlen.',
          'Vergleiche vor und nach jedem Join die Zeilenzahl und prüfe, welche Schlüssel mehrfach vorkommen oder keinen Treffer haben. Ein Left Join lässt Aktionen ohne Zuordnung in der Tabelle. Ihre Spieler- oder Teamdaten bleiben trotzdem unbekannt. Lege unsichere Namenszuordnungen in einer Prüfliste ab, damit du den Verlust oder die spätere Zuordnung erklären kannst.',
        ],
      },
      {
        title: 'SQL und pandas beantworten dieselbe Fachfrage',
        paragraphs: [
          'GROUP BY verdichtet Zeilen; eine Window Function kann Kontext berechnen, ohne Zeilen zu verlieren. Bei einem rollierenden Wert bestimmen Partition, Reihenfolge und Fenster gemeinsam die Kennzahl. "Letzte drei Schüsse" ist etwas anderes als "letzte fünf Minuten".',
          'Rechne eine Kennzahl an einem kleinen Beispiel von Hand nach. Prüfe anschließend die erste Aktion eines Spiels, gleiche Zeitstempel, fehlende Spielerzuordnungen und Spiele ohne gelieferte Events. Halte schriftlich fest, was eine Zeile und ein fehlender Wert bedeuten. Die Spaltennamen allein erklären diese Regeln nicht.',
        ],
      },
    ],
    questions: [
      'Welche Spalten machen deine Tabelle eindeutig?',
      'Wie erkennst du eine durch den Join verdoppelte Aktion?',
      'Wann ist ein fehlender Wert fachlich eine Null und wann unbekannt?',
    ],
    build: {
      title: 'StatsBomb Open Data',
      url: 'https://github.com/hudl/open-data',
      brief:
        'Überführe ausgewählte Match- und Eventdateien in getrennte Tabellen. Baue einen Team-Spiel-Bericht in SQL und prüfe ihn unabhängig in Python.',
      acceptance: [
        'Schema und Schlüssel sind beschrieben.',
        'Joins erhalten die erwartete Granularität.',
        'Fehlende Lieferungen und unbekannte IDs erscheinen im Prüfbericht.',
      ],
    },
    media: learningResources.data,
    practiceIds: ['sql-join', 'sql-window', 'data-review'],
  },
  {
    id: 'study-analysis',
    trackId: 'analysis',
    title: 'Ein Spiel lesen und verständlich darstellen',
    lead: 'Aus einer Karte wird erst durch Kontext, Gegenbeispiele und eine klare Aussage ein brauchbarer Bericht.',
    sections: [
      {
        title: 'Eine Darstellung beginnt mit einer Frage',
        paragraphs: [
          'Eine Shot Map beantwortet Fragen zu Abschlüssen, nicht zur gesamten Spielkontrolle. Eine Passkarte hängt davon ab, welche Pässe du auswählst und wie du Spielrichtung und Koordinaten behandelst. Definiere vor dem Plot, was sichtbar werden soll und welche Ereignisse bewusst ausgeschlossen sind.',
          'Schreibe Auswahl, Spielzeitraum und Einheiten an die Grafik. Halte bei Vergleichen die Skala gleich, damit Unterschiede nicht erst durch die Darstellung entstehen. Erkläre, was die Farben bedeuten. Wenn Daten fehlen oder Teams unter ungleichen Bedingungen verglichen werden, gehört das in die Bildunterschrift.',
        ],
      },
      {
        title: 'Vom Befund zum Spielmechanismus',
        paragraphs: [
          '"Viele Aktionen auf links" ist eine Beobachtung. "Der Gegner lenkt uns nach links" ist eine Erklärung, die weitere Belege braucht. Suche Sequenzen und Gegenbeispiele: Entsteht das Muster wiederholt unter ähnlichem Druck? Gibt es Phasen, in denen es ausbleibt?',
          'Verbinde quantitative Muster mit Video, wenn du rechtmäßig darauf zugreifen kannst. Halte Zeitmarken und Beobachtungskriterien fest. Ohne Video formulierst du eine prüfbare Hypothese und die nächste Sichtungsfrage. Behaupte aus Eventkarten keine sicher beobachteten Abstände oder Laufwege.',
        ],
      },
      {
        title: 'Ein Bericht mit einer klaren Entscheidung',
        paragraphs: [
          'Beantworte im Bericht eine konkrete Frage und wähle die Belege aus, die für diese Antwort nötig sind. Für den Trainerstab muss erkennbar sein, was als Nächstes im Video geprüft oder im Training bearbeitet werden soll. Nenne auch eine Beobachtung, bei der du deine Interpretation verwerfen würdest.',
          'Überarbeite die Abgabe nach einem Lesetest: Kann eine andere Person die Kernaussage ohne mündliche Einführung wiedergeben? Entferne Grafiken, die keine zusätzliche Entscheidung unterstützen. Bewahre die vollständige technische Analyse separat auf.',
        ],
      },
    ],
    questions: [
      'Welche Aussage erlaubt die Grafik tatsächlich?',
      'Welche alternative Erklärung passt ebenfalls zu den Daten?',
      'Welche Sequenz würdest du als Nächstes im Video prüfen?',
    ],
    build: {
      title: 'Analytics Handbook: Visualisierung',
      url: handbook,
      brief:
        'Übertrage ein Darstellungsbeispiel auf ein neues Spiel. Schreibe dazu eine eigene Berichtsseite mit Befund, Gegenargument und nächster Prüffrage.',
      acceptance: [
        'Koordinaten und ausgewählte Aktionen sind geprüft.',
        'Drei konkrete Ereignisse sind in der Quelle auffindbar.',
        'Eine Seite verbindet Frage, Belege und begrenzte Schlussfolgerung.',
      ],
    },
    media: [
      report,
      {
        title: 'The Football Analysis Guy: erste Datengrafik',
        url: 'https://thefootballanalysisguy.com/portal/your-first-data-chart/',
        action:
          'Nutze die angebotene Aufgabe als Übung für eine verständliche Grafik und eine kurze schriftliche Aussage.',
        environment: 'Externe Übungsseite; dort angebotene Daten und Vorlagen',
      },
      ...learningResources.analysis,
    ],
    practiceIds: ['analyse-richtung', 'analyse-spielbericht'],
    projectId: 'spielbericht',
  },
  {
    id: 'study-statistics',
    trackId: 'statistics',
    title: 'Wahrscheinlichkeit und Modellannahmen verstehen',
    lead: 'Was eine Torwahrscheinlichkeit bedeutet und warum ein guter Trainingswert noch kein gutes Modell ist.',
    sections: [
      {
        title: 'Zufall, Stichprobe und Zielpopulation',
        paragraphs: [
          'Eine beobachtete Torquote ist Tore geteilt durch Schüsse. Bei wenigen Schüssen schwankt sie stark. Spieler mit hoher Quote können leichter abgeschlossen haben oder einfach günstigen Zufall erlebt haben. Benenne daher die Population, auf die du deine Aussage beziehen willst: diesen Wettbewerb, diese Saison oder zukünftige Spiele?',
          'Aktionen innerhalb eines Spiels sind nicht unabhängig von Kontext und Spielverlauf. Ein Intervall aus vielen einzelnen Schüssen kann zu eng erscheinen, wenn gemeinsame Einflüsse ignoriert werden. Resampling ganzer Spiele kann diese Abhängigkeit teilweise berücksichtigen; eine kleine Turnierauswahl wird dadurch aber nicht repräsentativ.',
        ],
      },
      {
        title: 'Ein xG-Modell als bedingte Wahrscheinlichkeit',
        paragraphs: [
          'Ein einfaches Modell schätzt P(Tor | Distanz, Winkel, weitere verfügbare Merkmale). Bei logistischer Regression wird eine gewichtete Summe z über p = 1 / (1 + exp(−z)) in den Bereich 0 bis 1 überführt. Die Koeffizienten beschreiben Modellzusammenhänge, keine kausalen Wirkungen.',
          'Definiere den Vorhersagezeitpunkt. Informationen, die erst nach dem Schuss feststehen, können die Zukunft unzulässig verraten. Ein vor dem Ergebnis berechneter Provider-xG-Wert ist nicht automatisch Leakage, beantwortet als Modellmerkmal aber eine andere Frage als ein unabhängiges Geometriemodell.',
        ],
      },
      {
        title: 'Das Modell mit einer einfachen Referenz vergleichen',
        paragraphs: [
          'Ein Modell, das immer "kein Tor" sagt, kann wegen seltener Tore hohe Accuracy erreichen. Für Wahrscheinlichkeiten prüfst du etwa Brier Score, den Mittelwert von (p − y)², und Logloss, die selbstsichere Fehlprognosen stark bestraft. Vergleiche mit einer auf Trainingsdaten bestimmten konstanten Torquote.',
          'Wenn du spätere Spiele vorhersagen willst, lege auch den Testbestand zeitlich nach das Training. Passe weder die Merkmalsaufbereitung noch die Modellwahl anhand dieses finalen Tests an. Gib im Kalibrationsdiagramm die Zahl der Schüsse je Bin an: Eine Abweichung aus wenigen Beobachtungen lässt sich anders beurteilen als eine aus vielen.',
        ],
      },
    ],
    questions: [
      'Welche Information wäre zum Vorhersagezeitpunkt noch unbekannt?',
      'Warum kann ein Modell mit hoher Accuracy schlechte Wahrscheinlichkeiten liefern?',
      'Welche Population wird durch deinen Testbestand überhaupt repräsentiert?',
    ],
    build: {
      title: 'Soccermatics: Modelle selbst nachvollziehen',
      url: 'https://soccermatics.readthedocs.io/en/latest/',
      brief:
        'Reproduziere einen einfachen xG-Ansatz und erweitere ihn um eine train-only Baseline sowie ein explizites zeitliches Testdesign.',
      acceptance: [
        'Ziel und erlaubte Merkmale sind schriftlich festgelegt.',
        'Ein kleines Rechenbeispiel für Brier und Logloss stimmt.',
        'Testspiele sind getrennt und Modellgrenzen benannt.',
      ],
    },
    media: learningResources.statistics,
    practiceIds: ['stat-logistik', 'stat-kalibrierung', 'stat-leakage'],
    projectId: 'xg-modell',
  },
  {
    id: 'study-scouting',
    trackId: 'scouting',
    title: 'Rollen, Vergleichsgruppen und Shortlists',
    lead: 'Eine begründete Sichtungsliste entwickeln und erklären, warum eine Rangliste unter anderen Annahmen kippt.',
    sections: [
      {
        title: 'Aus einer Rolle passende Kennzahlen ableiten',
        paragraphs: [
          '"Mittelfeld" beschreibt eine Positionsgruppe, noch keine Rolle. Lege Aufgaben in bestimmten Spielphasen fest und übersetze sie in beobachtbare Merkmale. Prüfe anschließend, ob deine Daten diese Aufgaben tatsächlich abbilden oder nur einen leicht messbaren Ersatz.',
          'Definiere die Vergleichsgruppe vor dem Ranking. Perzentile gelten nur relativ zu dieser Gruppe. Ein hoher Wert in einer sehr kleinen Positionsgruppe ist nicht direkt mit einem Wert aus einer anderen Gruppe vergleichbar. Minuten, Wettbewerb und Mannschaftskontext verändern die Interpretation.',
        ],
      },
      {
        title: 'Raten und zusammengesetzte Scores',
        paragraphs: [
          'Eine Rate pro 90 Minuten lautet 90 × Anzahl / Einsatzminuten. Sie erleichtert den Vergleich verschiedener Spielzeiten, beseitigt aber weder Rollen- noch Ballbesitzunterschiede. Bei wenig Spielzeit kann ein einzelnes Ereignis den Wert stark verschieben.',
          'Mit den Gewichten legst du fest, welche Leistungen dein Score bevorzugt. Die Standardisierung bringt Kennzahlen auf einen gemeinsamen Maßstab; sie begründet die Gewichte noch nicht. Beschreibe für jede Kennzahl, ob hohe oder niedrige Werte erwünscht sind und warum. Prüfe außerdem, ob eng zusammenhängende Merkmale dieselbe Eigenschaft mehrfach belohnen.',
        ],
      },
      {
        title: 'Stabilität als Teil der Empfehlung',
        paragraphs: [
          'Variiere Minutenschwelle, Gewichtung und Vergleichsgruppe. Eine stabile Platzierung erhöht die Nachvollziehbarkeit der Auswahl, beweist jedoch kein Talent. Eine instabile Platzierung zeigt, wo eine Empfehlung besonders von deinen Annahmen abhängt.',
          'Mit der Abgabe legst du fest, wen die Scouts als Nächstes ansehen sollen. Schreibe zu jedem Kandidaten, welche Eignung du vermutest, was dagegenspricht und welche Szene die Videosichtung prüfen soll. Offene Leistungsdaten klären in der Regel weder Vertrag und Verfügbarkeit noch medizinischen Zustand oder persönliche Passung.',
        ],
      },
    ],
    questions: [
      'Welches Rollenmerkmal fehlt deinen Daten?',
      'Welche Annahme verändert die Top drei am stärksten?',
      'Was müsste eine Videosichtung zeigen, damit du einen Kandidaten verwerfen würdest?',
    ],
    build: {
      title: 'Analytics Handbook: Clustering als Ausgangspunkt',
      url: handbook,
      brief:
        'Nutze eine bestehende Auswertung als Basis für rollenbezogene Profile. Ergänze Vergleichsgruppen und eine Sensitivitätstabelle, statt Clusterbezeichnungen als feste Rollen zu übernehmen.',
      acceptance: [
        'Rolle und Peer-Gruppe werden vorab definiert.',
        'Mindestens drei plausible Parameteränderungen werden verglichen.',
        'Für jeden Kandidaten gibt es Beleg, Gegenargument und Sichtungsfrage.',
      ],
    },
    media: learningResources.scouting,
    practiceIds: ['scout-shortlist', 'ds-sensitivity'],
    projectId: 'scouting-app',
  },
  {
    id: 'study-engineering',
    trackId: 'engineering',
    title: 'Aus Dateien ein verlässliches Datenprodukt bauen',
    lead: 'Wie du Daten erneut einlesen, Korrekturen verarbeiten und jeden Bericht seinem Datenstand zuordnen kannst.',
    sections: [
      {
        title: 'Rohdaten und Verarbeitung trennen',
        paragraphs: [
          'Bewahre gelieferte Rohdaten unverändert auf. Die normalisierte Tabelle ist eine abgeleitete Sicht mit einer dokumentierten Schema-Version. Erfasse Quelle, Abrufzeitpunkt, Revision und Inhalts-Hash, damit sich ein Bericht später einem konkreten Datenstand zuordnen lässt.',
          'Ein SHA-256-Hash hilft dir festzustellen, ob sich ein Inhalt geändert hat. Ob die Werte fachlich stimmen, musst du zusätzlich prüfen. Lege fest, welche Bytes in den Hash eingehen: Eine umformatierte Tabelle ergibt einen anderen Hash als die ursprüngliche Datei. Vergleiche die Lieferung außerdem mit den erwarteten Spielen und Feldern.',
        ],
      },
      {
        title: 'Idempotenz und Fehlerbehandlung',
        paragraphs: [
          'Eine wiederholte Lieferung darf Zähler nicht verdoppeln. Ein Upsert verwendet einen stabilen Schlüssel und eine explizite Regel für Korrekturen. "Letzte Zeile gewinnt" ist nur dann sinnvoll, wenn die Reihenfolge eine gültige Revision ausdrückt. Löschungen brauchen ebenfalls eine definierte Semantik.',
          'Lege fest, welche Fehler den gesamten Import stoppen und welche einzelnen Datensätze du mit einem Fehlergrund getrennt ablegst. Diese Ablage heißt hier Quarantäne. Die veröffentlichte Tabelle muss einen vollständigen Verarbeitungsstand zeigen. Teste deshalb auch einen Abbruch, die anschließende Wiederholung und eine spätere Korrektur.',
        ],
      },
      {
        title: 'Ein kleines System produktionsnah prüfen',
        paragraphs: [
          'Baue zuerst einen lokalen Ablauf, den du mit einem Kommando starten kannst. Trenne die Verarbeitungsschritte und schreibe den Prüfbericht in ein maschinenlesbares Format. Bei gleichem Datenstand muss derselbe Bericht entstehen. Erst wenn Datenmenge oder Betrieb es verlangen, brauchst du dafür zusätzliche Cloud-Werkzeuge.',
          'Lass eine andere Person den Ablauf mit einem neuen Datenstand ausführen. Unbekannte Spieler, andere Spaltenreihenfolgen und fehlende Matches dürfen keine unbemerkten Änderungen der Bedeutung erzeugen. Dokumentiere Wiederherstellung und Grenzen, bevor du automatisierst.',
        ],
      },
    ],
    questions: [
      'Welche Eingabe lässt den gesamten Import abbrechen?',
      'Wie werden korrigierte oder gelöschte Events behandelt?',
      'Wie unterscheidest du zehn fehlende Spiele von zehn Spielen ohne relevante Aktionen?',
    ],
    build: {
      title: 'StatsBomb Open Data: eine eigene Importpipeline',
      url: 'https://github.com/hudl/open-data',
      brief:
        'Baue auf dem Datenschema eine lokale CLI-Pipeline mit Raw-, Staging- und Berichtsschritt. Wiederhole die Verarbeitung und simuliere eine fehlerhafte Lieferung.',
      acceptance: [
        'Ein Manifest verbindet Ausgabe und Quelle.',
        'Zweiter Lauf erzeugt keine Duplikate.',
        'Fehler, Quarantäne und fehlende Abdeckung sind sichtbar.',
      ],
    },
    media: learningResources.engineering,
    practiceIds: ['de-contract', 'de-upsert', 'de-review'],
  },
  {
    id: 'study-science',
    trackId: 'science-practice',
    title: 'Eine Modellstudie eigenständig durchführen',
    lead: 'Eine vorhandene Modellstudie erweitern und prüfen, wie gut die Vorhersagen auf späteren Spielen ausfallen.',
    sections: [
      {
        title: 'Vor der Modellauswahl ein Studienprotokoll',
        paragraphs: [
          'Schreibe Zielpopulation, Zielwert, Merkmale und Auswertungsregel auf, bevor du viele Modelle ausprobierst. Bestimme, welche Entscheidung ein besseres Modell unterstützen soll und welche Fehlprognosen besonders problematisch sind.',
          'Ordne jedes Spiel vollständig einem Zeitraum zu. Fehlen genaue Anstoßzeiten, lasse auch alle Spiele eines Datums auf derselben Seite der Grenze. Das Training muss vor dem Testfenster enden. Vergleiche Modelleinstellungen auf früheren Daten und bewerte das gewählte Modell erst abschließend am finalen Testbestand.',
        ],
      },
      {
        title: 'Vorverarbeitung gehört zum Modell',
        paragraphs: [
          'Skalierung, Imputation und Feature-Auswahl lernen Informationen aus Daten. Fitte sie ausschließlich im Trainingsbestand. Eine Pipeline bündelt diese Schritte, sodass neue Beobachtungen dieselbe Transformation erhalten, ohne dass der Testbestand das Training beeinflusst.',
          'Prüfe Leakage nicht nur durch die Modellleistung. Verändere Testmerkmale und Testlabels getrennt: Die Trainingsparameter müssen unverändert bleiben. Vergleiche mit einer unabhängig implementierten Referenz und dokumentiere, welche Merkmale zum Prognosezeitpunkt verfügbar sind.',
        ],
      },
      {
        title: 'Unsicherheit und Fehlergruppen berichten',
        paragraphs: [
          'Untersuche, wo das Modell scheitert: etwa bestimmte Schussarten oder dünn besetzte Räume. Für einen Bootstrap nach Spielen werden ganze Matchcluster mit Zurücklegen gezogen. Wird ein Match mehrfach gezogen, muss es mehrfach in die Berechnung eingehen. Ein isin-Filter auf gezogene IDs würde diese Vielfachheit verlieren.',
          'Zeige die Ergebnisse der Baseline neben denen des Modells. Nutze Bewertungsmaße für Wahrscheinlichkeiten wie Brier Score und Logloss, prüfe die Kalibration und nenne Stichprobengröße sowie Unsicherheit. Auch ein enges Intervall gilt nur für die untersuchte Auswahl. Halte den finalen Test bis zum Schluss zurück und kennzeichne Fragen, die erst beim Betrachten der Ergebnisse entstanden sind.',
        ],
      },
    ],
    questions: [
      'Welche Schritte lernen aus Trainingsdaten?',
      'Welche Ergebnisänderung wäre ein Hinweis auf Leakage?',
      'Welche Abhängigkeiten berücksichtigt dein Bootstrap, und welche bleiben unberücksichtigt?',
    ],
    build: {
      title: 'Analytics Handbook: eigene Evaluationsvariante',
      url: handbook,
      brief:
        'Reproduziere einen Modellansatz auf einer neuen Auswahl. Ersetze das Validierungsdesign begründet und dokumentiere den Unterschied zur Vorlage.',
      acceptance: [
        'Eine konstante Baseline und ein begründetes Modell.',
        'Zeitlich getrennte Matchlisten und train-only Transformation.',
        'Model Card mit Fehlergruppen, Unsicherheit und Einsatzgrenzen.',
      ],
    },
    media: learningResources['science-practice'],
    practiceIds: ['ds-temporal', 'ds-bootstrap', 'ds-review'],
    projectId: 'xg-modell',
  },
  {
    id: 'study-advanced',
    trackId: 'advanced',
    title: 'Aktionswerte, Tracking und deine Projektabgabe',
    lead: 'Fortgeschrittene Methoden einordnen und ein Projekt ausliefern, das andere verstehen und wiederholen können.',
    sections: [
      {
        title: 'Aktionswerte sind modellierte Zustandsänderungen',
        paragraphs: [
          'Ein Aktionswert beschreibt, wie sich ein modellierter Wert zwischen Zuständen verändert. Die Zustandsdefinition entscheidet, welche Informationen berücksichtigt werden. Ein einfacher Zonenwert ignoriert etwa Druck, Mitspielerpositionen und Anschlussoptionen.',
          'Beim Wechsel von Provider-Events zu einem Aktionsschema können Aktionen verworfen, ergänzt oder umgedeutet werden. Prüfe deshalb einzelne Sequenzen von Hand. Eine Änderung der modellierten Torwahrscheinlichkeit ist keine isolierte kausale Messung der Qualität eines Spielers.',
        ],
      },
      {
        title: 'Tracking erfordert räumliche und zeitliche Verträge',
        paragraphs: [
          'Für eine gemeinsame Event-/Trackinganalyse müssen Zeitbasis, IDs, Orientierung und Spielfeldmaß zusammenpassen. Fehlende Frames und Kamerabeschränkungen beeinflussen, welche Räume und Laufwege überhaupt beobachtbar sind.',
          'Pitch Control modelliert Erreichbarkeit unter Annahmen über Geschwindigkeit, Reaktion und Bewegung. Variiere diese Annahmen an derselben Sequenz. Erkläre, welche Information aus den Daten stammt und welche aus dem Modell. Eine anschauliche Fläche bleibt eine Schätzung.',
        ],
      },
      {
        title: 'Eine Analyse zur Prüfung abgeben',
        paragraphs: [
          'Ein Portfolio-Projekt verbindet Fragestellung, Datennachweis, Methode, Ergebnis und Entscheidung. Eine fremde Person sollte den Ablauf mit dokumentierter Umgebung starten und mindestens einen Kontrollwert unabhängig nachvollziehen können.',
          'Notiere Fehlversuche und begründe, warum du dich für einen Ansatz entschieden hast. Erkläre die Kernaussage in fünf Minuten, einschließlich des stärksten Gegenarguments und der nächsten Prüfung. Bitte anschließend um fachliche Rückmeldung. Die Lesemarkierungen helfen dir bei der Lernplanung; wie gut eine Empfehlung trägt, muss jemand an deiner ausgearbeiteten Analyse beurteilen.',
        ],
      },
    ],
    questions: [
      'Was bewertet dein Aktionsmodell ausdrücklich nicht?',
      'Welche Annahme verändert deine Tracking-Auswertung am stärksten?',
      'Kann jemand dein Ergebnis aus einem frischen Datenstand reproduzieren?',
    ],
    build: {
      title: 'LaurieOnTracking: ein Modell gezielt erweitern',
      url: tracking,
      brief:
        'Wähle eine kleine Tracking-Auswertung. Prüfe zuerst die Datenkonventionen und ändere anschließend genau eine begründete Modellannahme.',
      acceptance: [
        'Original und eigene Änderung laufen getrennt reproduzierbar.',
        'Ein Sequenzbeispiel ist von Hand geprüft.',
        'Bericht, Code und README erklären Nutzen und Grenzen.',
      ],
    },
    media: learningResources.advanced,
    practiceIds: ['adv-pipeline', 'adv-capstone'],
    projectId: 'aktionswerte',
  },
];

export const referenceSources: StudySource[] = [...foundationSources, ...sportSources];
export const studyChapters: StudyChapter[] = [
  ...baseStudyChapters,
  ...gitStudyChapters,
  ...extensionChapters.map((chapter) => ({ ...chapter, optional: true })),
].map((chapter) => ({
  ...chapter,
  sections: [
    ...chapter.sections,
    ...(foundationEnrichment[chapter.id] ?? []),
    ...(sportEnrichment[chapter.id] ?? []),
  ],
  references: referenceSources.filter((source) => source.chapters.includes(chapter.id)),
  localProjects: localProjectsByChapter[chapter.id] ?? [],
}));
