import type { StudyChapter } from '../course-study';

// Original teaching material. Repository observations and pinned sources live in
// docs/research/REPO-RESEARCH-SPORT-AI.md. Examples use invented observations, never real players.
export const sportEnrichment: Record<
  string,
  {
    title: string;
    paragraphs: string[];
    example?: { code: string; expected: string; explanation: string };
  }[]
> = {
  'study-analysis': [
    {
      title: 'Eine Sequenz systematisch beobachten',
      paragraphs: [
        'Formuliere vor der Sichtung ein beobachtbares Kriterium: Nach einem Rückpass auf den rechten Innenverteidiger läuft der gegnerische Stürmer bogenförmig an und versperrt den zentralen Passweg. Pro Sequenz protokollierst du Spielzeit, Ausgangslage, sichtbare Spieler, erste Anschlussaktion und das Ergebnis. "Aggressives Pressing" allein lässt sich zwischen zwei Beobachtern kaum zuverlässig vergleichen.',
        'Erfasse auch passende Situationen ohne den vermuteten Mechanismus. Drei gelungene Ballgewinne aus einem Highlightvideo zeigen keine Erfolgsquote. Für eine Rate brauchst du alle nach derselben Regel ausgewählten Versuche, einen klaren Nenner und eine Kategorie für nicht beurteilbare Szenen. Kameraschnitte können gerade die entscheidende Bewegung verdecken.',
      ],
    },
    {
      title: 'Videouhr und Eventuhr zusammenführen',
      paragraphs: [
        'Ein Event bei 12:10 Spielzeit muss nicht bei Sekunde 730 der Videodatei liegen. Vorspann, Wiederholungen, Nachspielzeit und getrennte Halbzeiten verändern die Zuordnung. Setze mindestens zwei gut erkennbare Anker je zusammenhängendem Videoabschnitt und prüfe einen dritten Anker. Ein konstanter Versatz reicht nur, solange beide Zeitachsen gleich laufen.',
        'Speichere match_id, period, event_id, video_id, video_seconds und die verwendete Synchronisationsregel. Nutze für eine Sichtung ein Zeitfenster vor und nach der Aktion. Bei einem Schnitt oder unbekannten Versatz bleibt der Clip ungeklärt. Ein exakt aussehender Zeitstempel ersetzt keine geprüfte Zuordnung.',
      ],
      example: {
        code: '# Python 3, nur Standardbibliothek\nanchors = [(120, 135), (240, 255)]\noffsets = [video - event for event, video in anchors]\nassert len(set(offsets)) == 1\nevent_second = 190\nprint(event_second + offsets[0])',
        expected: '205',
        explanation:
          'Die erfundenen Anker ergeben jeweils 15 Sekunden Versatz. 190 Sekunden auf der Eventuhr werden zu 205 Sekunden auf der Videouhr. Ein abweichender zweiter Versatz würde die Annahme stoppen; Schnittwechsel oder Drift benötigen weitere Regeln.',
      },
    },
    {
      title: 'Beobachtung, Interpretation und Empfehlung getrennt schreiben',
      paragraphs: [
        'Ein nachvollziehbarer Befund lautet: In vier von sechs beurteilbaren Aufbauaktionen folgte auf den Rückpass ein langer Ball. Die Interpretation könnte sein, dass der zentrale Anschluss versperrt war. Dafür brauchst du sichtbare Passoptionen und Gegenbeispiele. Dieselbe Verteilung könnte auch zu einer bewussten Vorgabe für zweite Bälle passen.',
        'Die Empfehlung enthält eine nächste Prüfung: Vergleiche dieselbe Ausgangslage bei tieferem gegnerischem Anlaufen und schaue nach dem freien Sechser. Schreibe neben die sechs beurteilbaren Szenen auch die Zahl ausgeschlossener Situationen. So kann ein Trainer die Aussage prüfen, ohne deine gesamte Analyse zu übernehmen.',
      ],
    },
  ],
  'study-scouting': [
    {
      title: 'Eine Shortlist wird zu einem Sichtungsprotokoll',
      paragraphs: [
        'Für einen Außenverteidiger mit inverser Rolle reicht eine hohe Passquote nicht. Leite Kriterien aus der Aufgabe ab: Orientierung vor der Ballannahme, Positionierung neben dem Sechser, Anschluss unter Druck und Absicherung nach Ballverlust. Notiere pro Kriterium, was das Video zeigen müsste und was du aus den vorhandenen Daten überhaupt auswählen kannst.',
        'Sichte ganze Phasen einschließlich erfolgloser Aktionen. Halte Spielstand, Gegnerdruck, Rolle und Beobachtungsdauer fest. Ein Kandidat mit vielen Ballkontakten im dominanten Team erhält sonst mehr sichtbare positive Aktionen als ein Spieler mit wenigen Gelegenheiten. Fehlende Gelegenheit wird als unbekannt erfasst, nicht als mangelnde Fähigkeit.',
      ],
    },
    {
      title: 'Identität ist eine eigene Datenaufgabe',
      paragraphs: [
        'Eine Tracking-ID benennt zunächst eine algorithmisch zusammengehaltene Bildspur. Sie ist noch keine Spieler-ID. Nach Verdeckung oder Kameraschnitt kann derselbe Spieler eine neue Nummer erhalten; beim Kreuzen können zwei Spieler ihre Nummern tauschen. Eine Mannschaftsfarbe ordnet oft ein Team zu, bestätigt aber ebenfalls keine Person.',
        'Verknüpfe Spuren mit einer Aufstellung und überprüften Szenen. Speichere Zuordnung, Beleg, Gültigkeitsintervall und Status wie bestätigt oder ungeklärt separat. Vermische ungeklärte Spuren nicht mit individuellen Saisonprofilen. Ein langer, falsch zusammengesetzter Track kann schlechter sein als zwei ausdrücklich unverbundene Fragmente.',
      ],
    },
    {
      title: 'Unsicherheit in der Empfehlung sichtbar machen',
      paragraphs: [
        'Ein Sichtungsbericht unterscheidet wiederholte Beobachtung, einzelne Szene und offene Frage. Vergleiche Berichte zweier Beobachter anhand derselben Szenen und derselben Definition. Wenn beide "druckresistent" unterschiedlich verwenden, muss zuerst das Kriterium präzisiert werden. Eine sprachlich überzeugende Zusammenfassung löst diese Uneinigkeit nicht.',
        'Das kleine Beispiel zählt dokumentierte Sichtungen, keine Wahrscheinlichkeit für Spielereignung. Kandidat A hat mehr positive Beobachtungen, aber auch mehr nicht beurteilbare Szenen. Ein nächster Sichtungsauftrag sollte die fehlenden Situationen gezielt ergänzen. Eine automatische Rangfolge aus diesen Bruchteilen wäre fachlich verfrüht.',
      ],
      example: {
        code: '# Python 3, nur Standardbibliothek\nlabels = ["positiv", "unklar", "negativ", "positiv", "unklar"]\nknown = [label for label in labels if label != "unklar"]\nprint(len(known), len(labels) - len(known))\nprint(round(known.count("positiv") / len(known), 2))',
        expected: '3 2\n0.67',
        explanation:
          'Drei von fünf erfundenen Szenen sind beurteilbar, zwei davon positiv. 0.67 gilt nur innerhalb dieser ausgewählten drei Szenen. Die zwei unbekannten Fälle bleiben im Bericht sichtbar und die Auswahl ist keine repräsentative Leistungsstichprobe.',
      },
    },
  ],
  'study-advanced': [
    {
      title: 'Pixel sind noch keine Meter',
      paragraphs: [
        'Eine Detektion liefert eine Box im Kamerabild. Zum Projizieren auf die Spielfeldebene wird häufig ein Fußpunkt angenähert. Eine Homographie bildet Punkte einer Ebene anhand bekannter Referenzpunkte ab. Dafür müssen die Referenzen zur aktuellen Kameraeinstellung passen; bei Schwenk und Zoom braucht es eine aktualisierte oder überprüfte Kalibrierung.',
        'Die geprüfte Football_Video_Analysis-Implementierung schätzt dagegen einen Maßstab aus angenommener Körpergröße und geglätteter Boxhöhe. Das ist ein anschauliches Experiment, aber keine vollwertige Spielfeldkalibrierung. Körperhaltung, Perspektive und Kamerabewegung verändern den Maßstab. Übernimm deshalb keine in Metern beschriftete Heatmap oder Spitzengeschwindigkeit ungeprüft als Leistungsnachweis.',
      ],
    },
    {
      title: 'Geschwindigkeit braucht Zeit und durchgängige Identität',
      paragraphs: [
        'Für zwei kalibrierte Bodenpositionen gilt mittlere Geschwindigkeit gleich Distanz geteilt durch verstrichene Zeit. Bei ausgelassenen Frames darfst du nicht einfach durch ein Frameintervall teilen. Verwende echte Zeitstempel oder die geprüfte Bildrate und Frame-Differenz. Gleiche oder rückläufige Zeitstempel sind ein Fehlerfall.',
        'Das Beispiel setzt korrekte Meterkoordinaten und dieselbe Person voraus. Eine Lücke von einer Sekunde wird hier bewusst nicht ausgewertet, weil der Unterrichtsvertrag nur Abstände bis 0,2 Sekunden zulässt. Das ist eine Beispielregel, kein universeller Sportstandard. Glätten kann Rauschen verringern und gleichzeitig kurze Spitzen dämpfen; dokumentiere beide Folgen.',
      ],
      example: {
        code: '# Python 3, nur Standardbibliothek\nfrom math import hypot\npoints = [(0.00, 0.0, 0.0), (0.04, 0.12, 0.16), (1.04, 3.0, 4.0)]\nspeeds = []\nfor a, b in zip(points, points[1:]):\n    dt = b[0] - a[0]\n    speeds.append(round(hypot(b[1]-a[1], b[2]-a[2])/dt, 2) if 0 < dt <= 0.2 else None)\nprint(speeds)',
        expected: '[5.0, None]',
        explanation:
          '0,2 Meter in 0,04 Sekunden ergeben 5 m/s. Der zweite Abstand überschreitet die selbst gesetzte Lückengrenze. None bedeutet hier nicht null Bewegung, sondern keine freigegebene Messung.',
      },
    },
    {
      title: 'Messqualität vor sportlicher Deutung prüfen',
      paragraphs: [
        'Lege getrennte Qualitätsmerkmale an: Sichtbarkeit, Detektionsgüte, Identitätskontinuität, räumliche Kalibrierung und Zeitabdeckung. Viele Beobachtungen können alle aus einer ungeeigneten Perspektive stammen. Eine vom Detektor gelieferte Konfidenz misst weder sichere Spieleridentität noch die Genauigkeit einer daraus berechneten Laufdistanz.',
        'Ein sinkender Geschwindigkeitsmittelwert in einem kurzen Track beschreibt zunächst genau diesen Ausschnitt. Spielunterbrechung, andere Aufgabe, Kameraschnitt oder ID-Wechsel sind alternative Ursachen. Daraus lässt sich weder physiologische Ermüdung noch ein individuelles Verletzungsrisiko belegen. Solche Schlussfolgerungen benötigen zusätzliche unabhängige Messungen und fachliche Validierung; die Portfolioaufgabe bleibt eine Prüfung der Messpipeline.',
      ],
    },
  ],
};

export const extensionChapters: StudyChapter[] = [
  {
    id: 'study-video',
    trackId: 'advanced',
    title: 'Optional: Video in überprüfbare Beobachtungen übersetzen',
    lead: 'Voraussetzungen: Python-Funktionen, Tabellen, Koordinaten und das Tracking-Kapitel. Du lernst hier den gesamten Prüfablauf mit kleinen eigenen Beispielen. Eine echte Video-Pipeline ist eine optionale lokale Erweiterung mit rechtmäßigem Videozugang, Python-Umgebung, Modellgewichten und gegebenenfalls GPU; diese Lernseite führt keine Video-Detektion aus.',
    sections: [
      {
        title: '1. Mit einem kleinen Beobachtungsvertrag beginnen',
        paragraphs: [
          'Wähle eine Frage, die ein kurzer Ausschnitt beantworten kann: Wie häufig bleibt nach einem Rückpass ein zentraler Anschluss sichtbar? Definiere Start und Ende einer Sequenz, Sichtbarkeitsanforderungen und Kategorien vor der Auswertung. Erzeuge zuerst sechs erfundene Protokollzeilen mit clip_id, Startzeit, Endzeit, Kriterium und Urteil. Damit kannst du die Auswertung ohne Videodatei prüfen.',
          'Ein geeigneter Testbestand enthält eine positive Szene, eine negative, eine Verdeckung, einen Schnitt und eine unklare Spielsituation. "Nicht sichtbar" bleibt eine eigene Kategorie. Erst danach sichtest du autorisiertes Material nach denselben Regeln. Beobachtete Ausgänge dürfen nicht nachträglich bestimmen, welche Szenen in den Bestand kommen.',
        ],
      },
      {
        title: '2. Detektion und Tracking getrennt verstehen',
        paragraphs: [
          'Ein Detektor sucht pro Bild Objekte und liefert Boxen, Klassen und Scores. Ein Tracker ordnet Beobachtungen über mehrere Bilder zu. Der Detektor kann eine Person korrekt finden, während der Tracker ihre Identität falsch fortsetzt. Protokolliere daher Detektionsfehler und Identitätsfehler getrennt. Eine hohe Zahl erkannter Personen belegt keine vollständigen Laufwege.',
          'Zeichne auf Papier zwei Spieler, die sich kreuzen. Vergib vor dem Kreuzungspunkt die IDs 7 und 12 und vertausche sie danach. Die Boxen stimmen weiterhin, aber jede individuelle Distanz wird falsch zugeordnet. Eine Prüfstichprobe sollte gerade Kreuzungen, ähnliche Trikots, Verdeckungen und Wiederauftritte enthalten. Sichere Spieleridentität erfordert zusätzliche Belege wie eindeutig erkennbare Nummer und konsistente Aufstellung.',
        ],
      },
      {
        title: '3. Geometrie und Kamera als Teil der Messung behandeln',
        paragraphs: [
          'Ein im Bild stillstehender Spieler kann durch einen Kameraschwenk scheinbar wandern. Für Bodenpositionen benötigst du eine Abbildung von Bild- zu Spielfeldkoordinaten. Vier geeignete, nicht kollineare Punktzuordnungen können eine planare Homographie bestimmen. Weitere Referenzpunkte dienen zur Fehlerprüfung; schlechte Punktverteilung und falsche Linienzuordnung können die Schätzung instabil machen.',
          'Prüfe nach der Transformation bekannte Linien und zurückgehaltene Referenzpunkte. Notiere Fehler in Metern in mehreren Spielfeldbereichen und prüfe erneut nach Schwenk, Zoom oder Schnitt. Ein Punkt oberhalb der Bodenebene, etwa ein Ball in der Luft, erfüllt diese Ebenenannahme nicht. Spielerboxhöhen allein lösen die Kamerageometrie nicht.',
        ],
      },
      {
        title: '4. Aus Positionen vorsichtige Kennzahlen ableiten',
        paragraphs: [
          'Nimm zwei fiktive Positionen (0,0) und (3,4) Meter mit einer Sekunde Abstand. Der Abstand ist fünf Meter, die mittlere Geschwindigkeit fünf Meter pro Sekunde beziehungsweise 18 km/h. Das ist ein Rechenkontrollwert. Für echte Tracks müssen Zeitbasis, metrische Kalibrierung und Identität zuvor stimmen; sonst multipliziert die Ableitung deren Fehler.',
          'Markiere Lücken und Kameraschnitte, statt sie als beobachtete Bewegung zu behandeln. Berichte Distanz und Beobachtungsdauer gemeinsam. 200 beobachtete Meter aus zwei Minuten sind keine vollständige Halbzeitdistanz. Für Sprintanzahlen brauchst du zusätzlich eine begründete Geschwindigkeitsgrenze, Mindestdauer und Regel für kurze Unterbrechungen. Variiere diese Regeln und zeige, wie stark sich die Anzahl ändert.',
        ],
        example: {
          code: '# Python 3, nur Standardbibliothek\nfrom math import hypot\na = (0.0, 0.0)\nb = (3.0, 4.0)\nseconds = 1.0\ndistance = hypot(b[0] - a[0], b[1] - a[1])\nprint(distance)\nprint(distance / seconds * 3.6)',
          expected: '5.0\n18.0',
          explanation:
            'Der Kontrollweg ist fünf Meter lang und wird in einer Sekunde zurückgelegt. Die Umrechnung von m/s nach km/h multipliziert mit 3,6. Das prüft die Rechnung, setzt aber korrekte Koordinaten und Identität voraus.',
        },
      },
      {
        title: '5. Eine kleine Qualitätsauswertung entwerfen',
        paragraphs: [
          'Lege für zwölf kurze Sequenzen manuelle Referenzspuren an und trenne Entwicklung und Abschlussprüfung nach Sequenz. Für Detektion kannst du Treffer bei einer festgehaltenen Boxüberlappungsregel zählen. Für Identität protokollierst du vertauschte oder neu vergebene IDs und Fragmentierung. Für Geometrie misst du Positionsfehler an unabhängigen Referenzpunkten. Diese Prüfungen beantworten verschiedene Fragen und gehören in getrennte Tabellen.',
          'Ein gutes Gesamtergebnis kann schwierige Szenen verstecken. Vergleiche nah und fern, Verdeckung und freie Sicht, ruhige Kamera und Schwenk. Schreibe zu jeder Kennzahl, welche Szenen ausgeschlossen wurden. Halte einen misslungenen Track im Bericht fest und erkläre seinen Einfluss auf eine nachgelagerte Kennzahl. Das macht die Grenze deines Systems nachvollziehbar.',
        ],
      },
      {
        title: '6. Lokale Reproduktion bewusst abgrenzen',
        paragraphs: [
          'Die untersuchte Beispielpipeline verwendet unter anderem Ultralytics, OpenCV, NumPy und Streamlit; ein Skript lädt YOLO-Gewichte und wählt ein GPU-Gerät. Ein lokaler Nachbau braucht eine eigene geprüfte Umgebung, passende Hardware, Datenpfade und Zugang zu den Videos. Die requirements-Datei ist nicht versioniert fixiert. Öffentliche Quelltexte erlauben nicht automatisch das Weitergeben von Spielvideos oder Modellgewichten.',
          'Deine erste Abgabe kann deshalb vollständig mit erfundenen Trackingzeilen entstehen: Eingabeschema, Zeitlückenprüfung, Rechenkontrollwert und Fehlerbericht. Eine spätere Videoreproduktion erhält ein eigenes Manifest für Gewichte, Versionen, Videorechte und Laufzeit. Speichere keine vertraulichen Clips in öffentlichen Portfolios. Die folgenden Quellen dienen zur optionalen Reproduktion, die Kapitelaufgaben sind hier beschrieben.',
        ],
      },
    ],
    questions: [
      'Wie kann die Box korrekt und die Spieleridentität trotzdem falsch sein?',
      'Welche Prüfung erkennt Kamerabewegung in deiner Geschwindigkeitskurve?',
      'Warum ist beobachtete Distanz keine vollständige Spieldistanz?',
      'Welche Information fehlt für eine belastbare Ermüdungsaussage?',
    ],
    build: {
      title: 'Eigene Video-Messpipeline als Prüfmodell',
      url: '#study-video',
      brief:
        'Erstelle zuerst zwölf erfundene Trackingzeilen mit Zeit, Track-ID, Position und Qualitätsstatus. Prüfe Lücken, einen absichtlichen ID-Wechsel und einen bekannten Distanzwert. Dokumentiere anschließend, welche zusätzlichen Belege eine echte Videoauswertung benötigen würde.',
      acceptance: [
        'Einheiten, Zeitbasis und Identitätsstatus sind explizit.',
        'Ein Kontrollweg von fünf Metern wird korrekt berechnet.',
        'Eine Lücke und ein ID-Wechsel verhindern eine individuelle Kennzahl.',
        'Bericht trennt Rechenrichtigkeit, Messqualität und sportliche Interpretation.',
      ],
    },
    media: [
      {
        title: 'Quellprüfung: Football_Video_Analysis',
        url: 'https://github.com/Matre5/Football_Video_Analysis',
        action:
          'Optional: Vergleiche README und speed_tracks.py. Erkläre, warum die Boxhöhen-Skalierung keine vollständige Homographie ersetzt.',
        environment:
          'Externe lokale Python-Pipeline; Videozugang und Modellgewichte erforderlich; keine Lizenzdatei gefunden',
        kind: 'Optionale Vertiefung',
      },
    ],
    practiceIds: ['adv-pipeline', 'adv-capstone'],
    projectId: 'aktionswerte',
  },
  {
    id: 'study-ai',
    trackId: 'science-practice',
    title: 'Optional: Ein belegbarer KI-Assistent für Analyseberichte',
    lead: 'Voraussetzungen: Python, Datenverträge und das Kapitel zur Modellevaluation. Du entwirfst einen Assistenten für freigegebene Spielnotizen und prüfst ihn mit festen Fällen. Alle Grundaufgaben funktionieren ohne Modellaufruf. Die Seite stellt keinen Chatdienst bereit; eine spätere API- oder lokale Modellintegration ist optional.',
    sections: [
      {
        title: '1. Eine begrenzte Arbeitsaufgabe wählen',
        paragraphs: [
          'Ein sinnvoller Assistent findet freigegebene Beobachtungen und erstellt daraus einen Berichtsentwurf mit Quellen. Die Aufgabe lautet beispielsweise: Welche dokumentierten Probleme gab es beim Aufbau über rechts? Der Assistent darf nur belegte Notizen zusammenfassen und offene Fragen benennen. Spielerqualität, medizinische Zustände oder verborgene Absichten lassen sich dadurch nicht zuverlässig vorhersagen.',
          'Definiere den gewünschten Ausgang: ein Entwurf mit Aussage, notiz_id, Zeitmarke und Unsicherheit, den eine Person prüft. Beginne mit einer manuellen Suchfunktion und einer Vorlage. Wenn diese die Aufgabe ausreichend löst, ist ein Sprachmodell kein notwendiger Bestandteil. Der spätere Nutzen muss sich an Zeitersparnis bei mindestens gleichbleibender Belegqualität zeigen.',
        ],
      },
      {
        title: '2. Einen kleinen, sauberen Wissensbestand anlegen',
        paragraphs: [
          'Schreibe sechs erfundene Notizen mit document_id, match_id, minute, text, version und access_group. Zwei beschreiben Aufbau rechts, eine eine Gegenbeobachtung, eine ein anderes Spiel und zwei andere Themen. Halte jede Notiz so klein, dass eine Aussage mit ihrem unmittelbaren Kontext zusammenbleibt. Ein Chunk ist ein Textabschnitt für die Suche; zu kurze Abschnitte verlieren Bedingungen, zu lange verdrängen andere Belege.',
          'Für die erste Suche reicht ein nachvollziehbarer Wortvergleich mit Filter auf das richtige Spiel. Vergleiche später eine Embeddingsuche mit derselben Aufgabenliste. Metadatenfilter und Zugriffsprüfung erfolgen vor der Übergabe an ein Modell. Eine ähnliche Textbedeutung berechtigt noch nicht zum Zugriff auf einen anderen Teambericht.',
        ],
      },
      {
        title: '3. Retrieval und Antworterzeugung getrennt prüfen',
        paragraphs: [
          'Retrieval bedeutet, passende Quellen zu finden. RAG ergänzt diese Quellen als Kontext einer Antworterzeugung. Lege für jede Testfrage manuell fest, welche Notizen relevant sind. Sind drei Notizen relevant und zwei davon unter den ersten vier Treffern, ist Recall@4 gleich 2/3. Das misst gefundenen Belegumfang; es beweist noch nicht, dass eine erzeugte Antwort die Quellen korrekt wiedergibt.',
          'Prüfe jede Antwortaussage gegen die konkret zitierte Notiz. Eine existierende Quellen-ID genügt nicht, wenn die zitierte Szene etwas anderes zeigt. Die Antwort muss bei fehlendem Beleg ausdrücklich offen bleiben. Widersprechen sich Notizen, soll der Entwurf den Konflikt nennen und die Versionen zeigen. Auch eine korrekt wiedergegebene Quelle kann ursprünglich falsch beobachtet worden sein.',
        ],
        example: {
          code: '# Python 3, nur Standardbibliothek\nrelevant = {"n1", "n3", "n5"}\nretrieved = ["n3", "n2", "n1", "n6"]\nhits = relevant.intersection(retrieved[:4])\nprint(len(hits), len(relevant))\nprint(round(len(hits) / len(relevant), 3))',
          expected: '2 3\n0.667',
          explanation:
            'Zwei der drei vorab als relevant beurteilten Notizen werden gefunden. Recall@4 beträgt 0,667. Ob ein Bericht die Notizen richtig deutet, muss separat geprüft werden. Bei einer Frage ohne relevante Quelle braucht die Metrik eine eigene Regel.',
        },
      },
      {
        title: '4. Ein Testset mit schwierigen Fällen aufbauen',
        paragraphs: [
          'Erstelle zehn feste Fragen: vier beantwortbare, zwei ohne Beleg, eine mit widersprüchlichen Notizen, eine mit veralteter Revision, eine zu einem gesperrten Spiel und eine mit einer Anweisung im Quellentext. Die erwartete Reaktion beschreibst du vor dem Modellaufruf. Entwicklung und Abschlussprüfung verwenden getrennte Szenen oder Dokumentgruppen, damit du nicht die Testantworten in den Prompt einbaust.',
          'Bewerte richtige Quellenwahl, gestützte Aussagen, korrekte Enthaltung, Zugriffsverletzungen und Bearbeitungszeit separat. Eine Wortlistenprüfung kann ein fehlendes Pflichtfeld entdecken, aber keine taktische Richtigkeit garantieren. Zwei fachkundige Leser beurteilen schwierige Aussagen anhand derselben Kriterien; ihre Uneinigkeit wird sichtbar. Eine zweite KI kann Hinweise liefern, ersetzt diese Referenzprüfung jedoch nicht.',
        ],
      },
      {
        title: '5. Strukturierte Ausgabe und sichere Grenzen definieren',
        paragraphs: [
          'Ein Ausgabeobjekt kann die Felder claim, source_ids und status haben. Erlaubte Statuswerte sind belegt, widersprüchlich und offen. Prüfe, dass IDs im zugelassenen Quellenbestand existieren und der Status gültig ist. Das ist eine formale Prüfung. Anschließend braucht jeder Claim eine inhaltliche Belegprüfung; gültiges JSON kann eine falsche Behauptung enthalten.',
          'Ein Text in einer Spielnotiz ist Datenmaterial. Eine dort versteckte Aufforderung wie "ignoriere die Freigaben" darf weder Zugriffsregeln noch Systemverhalten ändern. Für diese Aufgabe braucht der Assistent keine Schreibrechte, keine beliebige Shell und keinen automatischen Versand. Ein Berichtsentwurf wird lokal geprüft; Veröffentlichungen bleiben eine eigene bewusste Handlung.',
        ],
      },
      {
        title: '6. Kosten und Datenschutz in die Bewertung aufnehmen',
        paragraphs: [
          'Berechne Kosten mit den für deinen Versuch geltenden Preisen und dokumentiere Datum und Modellversion. Ein erfundener Rechenfall: 100 Anfragen mit je 2.000 Eingabe- und 300 Ausgabetokens ergeben 200.000 Eingabe- und 30.000 Ausgabetokens. Bei angenommenen 1 und 4 Euro pro Million sind das 0,32 Euro. Embeddings, Speicherung, Wiederholungen und Hardware kommen gegebenenfalls hinzu; dies ist keine Preisangabe eines Anbieters.',
          'Miss zusätzlich Latenz und Fehler auf derselben Fragenliste. Ein Cache kann wiederholte Arbeit sparen, muss aber Dokumentrevision, Modellkonfiguration und Zugriffsgruppe berücksichtigen. Vertrauliche Spielerberichte, personenbezogene Daten und interne Trainingsnotizen gehören nur in ausdrücklich zugelassene Systeme. Entwickle zunächst mit erfundenen Dokumenten und speichere in Logs nur, was du für die Prüfung brauchst.',
        ],
      },
      {
        title: '7. Eine kleine, reproduzierbare Abgabe erstellen',
        paragraphs: [
          'Liefere die sechs erfundenen Notizen, Testfragen, erwarteten Belege, Suchergebnisse und eine Ergebnistabelle. Die manuelle Baseline bleibt sichtbar. Für eine optionale Modellvariante protokollierst du Promptversion, Modellkennung, Parameter, Quellenrevision, Rohantwort und Prüfentscheidung. Wiederholte Aufrufe können abweichen; bewahre tatsächliche Ausgaben auf.',
          'Wähle nach dem Fehlerbild den nächsten Schritt: fehlende Notizen ergänzen, Chunkgrenzen korrigieren, Suche verbessern oder Antwortregeln präzisieren. Mehr Agenten oder Fine-Tuning sind keine automatische Lösung. In der untersuchten GenAI-Roadmap enthält das geprüfte RAG-Projekt noch ein Gerüst mit Platzhalterantwort; nutze solche Quellen als Bauanregung, nicht als Nachweis eines bereits funktionierenden Sportassistenten.',
        ],
      },
    ],
    questions: [
      'Wie unterscheidest du einen Suchfehler von einer unbelegten Antwort?',
      'Welche Frage muss dein Assistent unbeantwortet lassen?',
      'Welche Prüfung entdeckt eine gültige, aber unpassende Quellen-ID?',
      'Wie verändert eine neue Dokumentrevision Cache und Testbestand?',
    ],
    build: {
      title: 'Belegsuche mit prüfbarem Berichtsentwurf',
      url: '#study-ai',
      brief:
        'Baue mit sechs erfundenen Spielnotizen eine lokale Suche und einen manuell ausgefüllten Berichtsentwurf. Bewerte zehn feste Testfälle. Ergänze ein Sprachmodell nur optional und vergleiche mit der vorhandenen Baseline.',
      acceptance: [
        'Jede Aussage hat einen überprüften Beleg oder bleibt ausdrücklich offen.',
        'Testfälle enthalten Widerspruch, fehlende Evidenz und gesperrte Quelle.',
        'Suchqualität und Antwortqualität werden getrennt berichtet.',
        'Kostenannahmen, Datenfreigabe und Grenzen sind nachvollziehbar.',
      ],
    },
    media: [
      {
        title: 'Quellen zur optionalen technischen Vertiefung',
        url: 'https://github.com/AdilShamim8/AI-Engineering',
        action:
          'Optional: Vergleiche das eigene Testprotokoll mit dem Kapitel zur RAG-Evaluation. Der hier beschriebene Sportworkflow bleibt die Aufgabe.',
        environment: 'Externer englischer Leitfaden; keine Modellaufrufe zum Lesen erforderlich',
        kind: 'Optionale Vertiefung',
      },
    ],
    practiceIds: ['ds-temporal', 'ds-review'],
  },
];

export const sportSources: {
  title: string;
  url: string;
  chapters: string[];
  focus: string;
  license: string;
  inspected: string[];
}[] = [
  {
    title: 'Awesome Soccer Analytics',
    url: 'https://github.com/matiasmascioto/awesome-soccer-analytics',
    chapters: ['study-analysis', 'study-scouting'],
    focus:
      'Kuratierte Fußball-Quellensammlung zur Orientierung; kein ausführbares Curriculum. Verlinkte Angebote separat prüfen.',
    license: 'CC0-1.0 für Repository-Inhalte; fremde Zielseiten haben eigene Rechte.',
    inspected: ['README.md', 'LICENSE.txt'],
  },
  {
    title: 'AI Engineering Hub',
    url: 'https://github.com/patchy631/ai-engineering-hub',
    chapters: ['study-ai'],
    focus:
      'Viele eigenständige KI-Demos. Geprüft: bildgestütztes Retrieval mit erstem Suchtreffer und lokalem Modell; keine Sportvalidierung.',
    license: 'MIT im Root; externe Modelle, Daten und Dienste separat prüfen.',
    inspected: [
      'README.md',
      'LICENSE',
      'Colivara-deepseek-website-RAG/rag_code.py',
      'agentic_rag/pyproject.toml',
    ],
  },
  {
    title: 'Football Video Analysis',
    url: 'https://github.com/Matre5/Football_Video_Analysis',
    chapters: ['study-video', 'study-advanced', 'study-scouting'],
    focus:
      'Offline-Videoexperiment zu Detektion, Stitching und Bewegungskennzahlen. Code verwendet Boxhöhen-Skalierung; keine validierte physische Leistungsdiagnostik.',
    license: 'Keine Lizenzdatei im geprüften Baum; keine Weiterverwendungsfreigabe unterstellt.',
    inspected: [
      'README.md',
      'requirements.txt',
      '1st_Half/teterr.py',
      '1st_Half/tracks_scaled.py',
      '1st_Half/speed_tracks.py',
      '1st_Half/stitch.py',
      '1st_Half/fatigue.py',
    ],
  },
  {
    title: 'AI Engineering Field Guide',
    url: 'https://github.com/AdilShamim8/AI-Engineering',
    chapters: ['study-ai'],
    focus:
      'Textcurriculum mit RAG-Evaluationsprotokoll; Recherchegrundlage für getrennte Daten-, Retrieval-, Antwort- und Betriebsprüfung.',
    license: 'MIT; verlinkte Materialien separat prüfen.',
    inspected: [
      'README.md',
      'LICENSE',
      '102_AI-Application-Development/03-RAG/6. RAG Evaluation & Benchmarking (RAGAS, TruLens, DeepEval).md',
      '104_LLMOps/3. Observability/2. Token, Cost & Latency Monitoring.md',
    ],
  },
  {
    title: 'GenAI Roadmap with Notes and Projects',
    url: 'https://github.com/AdilShamim8/GenAI-Roadmap-with-Notes-and-Projects',
    chapters: ['study-ai'],
    focus:
      'Roadmap und Themenartikel; geprüftes Hybrid-RAG-Projekt enthält Implementierungs- und Agentenplatzhalter. Kein fertiger Sportassistent.',
    license: 'MIT; externe API- und Modellbedingungen separat.',
    inspected: [
      'README.md',
      'LICENSE',
      '07-evals/01-golden-datasets.md',
      '08-production/01-cost-engineering.md',
      'projects/02-hybrid-rag-over-notion/src/main.py',
      'projects/02-hybrid-rag-over-notion/pyproject.toml',
      'projects/02-hybrid-rag-over-notion/evals/eval_runner.py',
    ],
  },
  {
    title: '100 AI Machine Learning Deep Learning Projects',
    url: 'https://github.com/AdilShamim8/100-AI-Machine-Learning-Deep-Learnin-Projects',
    chapters: ['study-ai'],
    focus:
      'Projektverzeichnis mit README und HTML-Atlas. Im geprüften Baum keine hundert ausführbaren Projektimplementierungen.',
    license: 'Keine Lizenzdatei im geprüften Baum; verlinkte Projekte separat prüfen.',
    inspected: ['README.md', 'index.html'],
  },
  {
    title: 'Applied ML',
    url: 'https://github.com/eugeneyan/applied-ml',
    chapters: ['study-ai', 'study-advanced'],
    focus:
      'Kuratierte externe Produktionsfallstudien zu Datenqualität, Evaluation und Betrieb. Keine eigene Sportpipeline und kein vollständiger Implementierungskurs.',
    license: 'MIT für Repository-Inhalte; verlinkte Veröffentlichungen haben eigene Rechte.',
    inspected: ['README.md', 'LICENSE'],
  },
];
