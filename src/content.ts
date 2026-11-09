import type { Lesson, Track } from './types';
import { newLessons } from './course';
import { engineeringLessons } from './course/engineering';
import { sciencePracticeLessons } from './course/science-practice';
import {
  PRACTICE_SHOTS_SETUP,
  PRACTICE_EVENTS_SETUP,
  practiceDataSummary,
} from './course/practice-data';
const introduction: Lesson[] = [
  {
    id: 'anpfiff',
    title: 'Dein erster Scouting-Auftrag',
    minutes: 10,
    concept: 'Variablen und Text',
    explanation: [
      'Mit einer Variablen gibst du einem Wert einen Namen. team = "Nordstadt" ordnet den Vereinsnamen der Variablen team zu. Die Anführungszeichen kennzeichnen den Wert als Text.',
      'print(team) gibt den aktuellen Wert aus. Das Zeichen = weist einen Wert zu. Wenn du die Zuweisung änderst und den Code erneut ausführst, ändert sich auch die Ausgabe.',
      'Für den ersten Auftrag legst du fest, für welchen Verein du Kandidaten suchst. Ändere nur den Vereinsnamen im Editor. So kannst du direkt verfolgen, welche Zeile die Ausgabe beeinflusst.',
    ],
    example: 'team = "Hafenstadt"\nprint(team)',
    task: 'Speichere den Text "Nordstadt" in der Variablen team und gib team mit print aus.',
    starter: 'team = "Hafenstadt"\nprint(team)',
    solution: 'team = "Nordstadt"\nprint(team)',
    hints: [
      'Die Variable heißt bereits team. Welchen Text soll sie enthalten?',
      'Vergleiche die Zuweisung mit der Ausgabe im Beispiel. In team steht der Name; print liest diesen Wert. Das verlinkte Python-Tutorial erklärt die Schreibweise genauer.',
      'Text braucht Anführungszeichen. Ändere "Hafenstadt" in den gefragten Vereinsnamen.\n\nTeilbeispiel:\nteam = "Vereinsname"\nprint(team)',
    ],
    checks: [
      {
        label: 'Dein Auftrag gehört zu Nordstadt',
        expression: 'team',
        expected: 'Nordstadt',
      },
      {
        label: 'Vereinsname ausgegeben',
        expression: '',
        source: 'stdout',
        expected: 'Nordstadt',
      },
    ],
    reflection: 'Welche Information über einen Verein sagt der Name allein noch nicht aus?',
    rubric: [
      'Unterscheide den Namen von sportlichen Eigenschaften.',
      'Nenne eine weitere Information, die für Scouting nötig wäre.',
    ],
    objective: 'Einen Vereinsnamen als Text speichern und mit print ausgeben.',
    prerequisites: [],
    sources: [
      {
        title: 'Python-Tutorial: Einführung',
        url: 'https://docs.python.org/3/tutorial/introduction.html',
      },
    ],
  },
  {
    id: 'spielzeit',
    title: 'Einsatzminuten in volle Spiele umrechnen',
    minutes: 15,
    concept: 'Zahlen und Berechnungen',
    explanation: [
      'Zahlen stehen in Python ohne Anführungszeichen. Du kannst sie mit + addieren oder mit / dividieren. Klammern legen fest, welche Rechnung zuerst ausgeführt wird.',
      'Teilst du 270 Einsatzminuten durch 90, erhältst du den Zeitumfang von drei vollen Spielen. Das sagt noch nicht, wie oft die Person eingesetzt wurde: Die Minuten können sich auch auf mehrere kürzere Einsätze verteilen.',
    ],
    example: 'minutes = 270\nfull_matches = minutes / 90\nprint(full_matches)',
    task: 'minutes ist mit 540 vorbereitet. Berechne full_matches aus minutes / 90. Die Prüfung wiederholt deinen Code mit anderer Spielzeit.',
    starter: 'full_matches = 0\nprint(full_matches)',
    solution: 'full_matches = minutes / 90\nprint(full_matches)',
    hints: [
      'Die gesuchte Größe ist Spielzeit in Einheiten von 90 Minuten.',
      'Im Beispiel sind die Einsatzminuten die Eingabe und volle Spiele das Ergebnis. Übertrage die Rechnung auf die vorbereitete Variable minutes. Die Rechenoperatoren findest du auch im verlinkten Tutorial.',
      'Nutze / für die Division: full_matches = minutes / 90.\n\nTeilbeispiel:\nfull_matches = minutes / 90',
    ],
    checks: [
      {
        label: 'Spielzeit gespeichert',
        expression: 'minutes',
        expected: 540,
      },
      {
        label: 'Sechs volle Spiele als Zeitäquivalent',
        expression: 'full_matches',
        expected: 6,
      },
    ],
    reflection:
      'Warum können sechs volle Spiele als Zeitäquivalent auch aus mehr als sechs Einsätzen stammen?',
    rubric: [
      'Berücksichtige Einwechslungen und Auswechslungen.',
      'Verwechsle Einsatzminuten nicht mit Einsätzen.',
    ],
    setup: 'minutes = 540',
    variants: [
      {
        label: 'Andere Spielzeit',
        setup: 'minutes = 270',
        checks: [
          {
            label: 'Zeitäquivalent aus Eingabe berechnet',
            expression: 'full_matches',
            expected: 3,
          },
        ],
      },
    ],
    objective:
      'Einsatzminuten durch 90 teilen und das Ergebnis von der Zahl der Einsätze unterscheiden.',
    prerequisites: ['anpfiff'],
    sources: [
      {
        title: 'Python-Tutorial: Einführung',
        url: 'https://docs.python.org/3/tutorial/introduction.html',
      },
    ],
  },
  {
    id: 'kandidaten',
    title: 'Eine Liste von Kandidaten',
    minutes: 15,
    concept: 'Listen und Index',
    explanation: [
      'Eine Liste hält mehrere Werte in einer Reihenfolge fest. Du schreibst die Werte in eckige Klammern und trennst sie durch Kommas. len(players) zählt die Einträge der Liste players.',
      'players[0] liest den ersten Eintrag, players[1] den zweiten. Der Index beginnt bei 0. Bei drei Einträgen ist deshalb 2 der letzte gültige Index.',
      'Die Reihenfolge dieser Übungsliste ist vorgegeben. Aus dem ersten Platz lässt sich keine sportliche Bewertung ableiten. Dafür bräuchtest du eine begründete Sortierregel.',
    ],
    example: 'players = ["Ada", "Mira"]\nprint(len(players))\nprint(players[0])',
    task: 'Erstelle players mit "Ada", "Mira" und "Lea" in dieser Reihenfolge. Speichere die Anzahl in candidate_count und den ersten Namen in first_player.',
    starter:
      'players = ["Ada", "Mira"]\ncandidate_count = 0\nfirst_player = ""\nprint(candidate_count, first_player)',
    solution:
      'players = ["Ada", "Mira", "Lea"]\ncandidate_count = len(players)\nfirst_player = players[0]\nprint(candidate_count, first_player)',
    hints: [
      'Ergänze einen dritten Eintrag in der Liste. len(players) zählt alle Namen.',
      'Zähle zuerst die Namen im Beispiel und prüfe die Ausgabe von len. Verfolge dann, welchen Namen der Index 0 liefert. Im Python-Tutorial kannst du den Zugriff auf Listen nachlesen.',
      'Der erste Index ist 0: first_player = players[0].\n\nTeilbeispiel:\nfirst_player = players[0]',
    ],
    checks: [
      {
        label: 'Drei Kandidatinnen',
        expression: 'players',
        expected: ['Ada', 'Mira', 'Lea'],
      },
      {
        label: 'Anzahl auslesen',
        expression: 'candidate_count',
        expected: 3,
      },
      {
        label: 'Erste Kandidatin auslesen',
        expression: 'first_player',
        expected: 'Ada',
      },
    ],
    reflection: 'Warum ist die erste Spielerin einer Liste nicht automatisch die beste?',
    rubric: ['Erkläre den Unterschied zwischen Reihenfolge und Bewertung.'],
    objective:
      'Namen in einer Liste speichern, ihre Anzahl bestimmen und den ersten Eintrag auslesen.',
    prerequisites: ['spielzeit'],
    sources: [
      {
        title: 'Python-Tutorial: Datenstrukturen',
        url: 'https://docs.python.org/3/tutorial/datastructures.html',
      },
    ],
  },
  {
    id: 'profil',
    title: 'Ein Spielerprofil lesen',
    minutes: 20,
    concept: 'Dictionaries und Schlüssel',
    explanation: [
      'Ein Dictionary ordnet benannten Schlüsseln Werte zu. In {"name": "Ada", "minutes": 720} gehört zum Schlüssel "name" der Text "Ada" und zu "minutes" die Zahl 720. Der Doppelpunkt verbindet jeweils Schlüssel und Wert.',
      'player["minutes"] liest die Minuten aus dem Dictionary player. Die Schreibweise des Schlüssels muss stimmen. Fehlt der Schlüssel, meldet Python einen KeyError; das ist ein Hinweis, zuerst die vorhandenen Felder zu prüfen.',
      'Namen und Profile sind hier fiktiv. Das Feld position enthält nur eine grobe Positionsgruppe. Welche Aufgaben eine Person auf dieser Position übernimmt, beschreibt es noch nicht.',
    ],
    example: 'player = {"name": "Ada", "minutes": 720}\nprint(player["name"])',
    task: 'Das Profil ist vorbereitet. Lies aus player die Minuten in minutes und den Namen in player_name aus.',
    starter: 'minutes = 0\nplayer_name = ""\nprint(player_name, minutes)',
    solution:
      'minutes = player["minutes"]\nplayer_name = player["name"]\nprint(player_name, minutes)',
    hints: [
      'Die Schlüssel heißen "minutes" und "name".',
      'Suche im vorbereiteten Profil die Felder für Name und Spielzeit. Lies ihre Werte mit derselben Schreibweise wie im Beispiel aus. Das verlinkte Tutorial erklärt Dictionaries und Schlüssel.',
      'Mit player["minutes"] greifst du auf den Minutenwert zu.\n\nTeilbeispiel:\nminutes = player["minutes"]',
    ],
    checks: [
      {
        label: 'Minuten gelesen',
        expression: 'minutes',
        expected: 810,
      },
      {
        label: 'Name gelesen',
        expression: 'player_name',
        expected: 'Mira',
      },
    ],
    reflection: 'Welche Information fehlt diesem Profil für eine sinnvolle Transferempfehlung?',
    rubric: [
      'Nenne eine sportliche Anforderung oder einen fehlenden Kontext.',
      'Ein Name und Minuten sind noch kein Qualitätsbeleg.',
    ],
    setup: 'player = {"name": "Mira", "minutes": 810, "position": "MF"}',
    variants: [
      {
        label: 'Anderes Profil',
        setup: 'player = {"name":"Ada","minutes":270,"position":"MF"}',
        checks: [
          {
            label: 'Minuten aus neuem Profil',
            expression: 'minutes',
            expected: 270,
          },
          {
            label: 'Name aus neuem Profil',
            expression: 'player_name',
            expected: 'Ada',
          },
        ],
      },
    ],
    objective: 'Name und Spielzeit über die Schlüssel eines Spielerprofils auslesen.',
    prerequisites: ['kandidaten'],
    sources: [
      {
        title: 'Python-Tutorial: Datenstrukturen',
        url: 'https://docs.python.org/3/tutorial/datastructures.html',
      },
    ],
  },
  {
    id: 'vergleich',
    title: 'Wer hat genug gespielt?',
    minutes: 20,
    concept: 'Vergleiche und Bedingungen',
    explanation: [
      'Ein Vergleich wie minutes >= 450 liefert True oder False. >= bedeutet größer oder gleich. Mit == prüfst du, ob zwei Werte gleich sind; = weist dagegen einen Wert zu.',
      'Ein if-Block läuft, wenn seine Bedingung True ergibt. Nach dem Doppelpunkt rückst du die zugehörigen Zeilen mit vier Leerzeichen ein. Der else-Block behandelt den Fall, in dem die Bedingung nicht erfüllt ist.',
      'Die 450 Minuten sind eine Vorgabe dieser Aufgabe. Bevor du einen solchen Filter für eine Sichtungsliste nutzt, musst du begründen, warum du gerade diese Grenze wählst und welche Spieler du damit ausschließt.',
    ],
    example:
      'minutes = 500\nif minutes >= 450:\n    eligible = True\nelse:\n    eligible = False\nprint(eligible)',
    task: 'Prüfe die vorbereiteten 360 Minuten. Setze eligible mit if/else auf True bei mindestens 450 Minuten, sonst False.',
    starter: 'eligible = True\n# Prüfe die vorbereitete Spielzeit minutes.\nprint(eligible)',
    solution:
      'if minutes >= 450:\n    eligible = True\nelse:\n    eligible = False\nprint(eligible)',
    hints: [
      '360 liegt unter der Mindestspielzeit. Was sollte eligible bedeuten?',
      'Prüfe am Beispiel beide Fälle: einmal unter 450 Minuten und einmal genau auf der Grenze. Verfolge, welcher Block eligible setzt. Falls die Einrückung unklar ist, lies den if-Abschnitt im verlinkten Tutorial.',
      'Der if-Block setzt True, der else-Block False. Die eingerückten Zeilen gehören zum jeweiligen Block.\n\nTeilbeispiel:\nif minutes >= 450:\n    # eingerückter Fall\n    pass',
    ],
    checks: [
      {
        label: 'Zu geringe Spielzeit wird erkannt',
        expression: 'eligible',
        expected: false,
      },
    ],
    reflection: 'Welchen Nachteil hat eine feste Mindestspielzeit für junge Spieler?',
    rubric: [
      'Bedenke, dass wenig Spielzeit nicht automatisch geringe Qualität bedeutet.',
      'Nenne die ausgeschlossene Spielergruppe.',
    ],
    setup: 'minutes = 360',
    variants: [
      {
        label: 'Genau die Grenze',
        setup: 'minutes = 450',
        checks: [
          {
            label: 'Grenze eingeschlossen',
            expression: 'eligible',
            expected: true,
          },
        ],
      },
      {
        label: 'Knapp unter der Grenze',
        setup: 'minutes = 449',
        checks: [
          {
            label: 'Knapp darunter ausgeschlossen',
            expression: 'eligible',
            expected: false,
          },
        ],
      },
    ],
    objective: 'Mit if/else prüfen, ob eine Person die vorgegebene Mindestspielzeit erreicht.',
    prerequisites: ['profil'],
    sources: [
      {
        title: 'Python-Tutorial: Kontrollfluss',
        url: 'https://docs.python.org/3/tutorial/controlflow.html',
      },
    ],
  },
  {
    id: 'schleife',
    title: 'Die gesamte Spielzeit zählen',
    minutes: 20,
    concept: 'for-Schleifen',
    explanation: [
      'for minutes in appearances: geht die Einsätze der Reihe nach durch. Bei jedem Durchlauf enthält minutes den nächsten Wert aus der Liste appearances.',
      'Lege total vor der Schleife mit 0 an. Die eingerückte Zeile total = total + minutes addiert dann den jeweiligen Einsatz zur bisherigen Summe.',
      'Steht total = 0 innerhalb der Schleife, löschst du die bisherige Summe bei jedem Durchlauf. Rechne das Beispiel zunächst von Hand durch: Nach jedem Einsatz muss die Summe um dessen Minuten wachsen.',
    ],
    example:
      'appearances = [90, 30]\ntotal = 0\nfor minutes in appearances:\n    total = total + minutes\nprint(total)',
    task: 'Addiere alle Minuten aus appearances mit einer Schleife in total.',
    starter: 'total = 0\n# Addiere die Minuten aus appearances.\nprint(total)',
    solution: 'total = 0\nfor minutes in appearances:\n    total = total + minutes\nprint(total)',
    hints: [
      'Der Zähler total ist schon vorbereitet. Gehe nacheinander durch appearances.',
      'Verfolge im Beispiel den Wert von total nach jedem Einsatz. Initialisierung und Addition haben unterschiedliche Aufgaben und stehen deshalb vor beziehungsweise in der Schleife. Die for-Schleife kannst du im Tutorial nachlesen.',
      'for minutes in appearances: startet die Schleife. Darunter addierst du eingerückt den aktuellen Wert.\n\nTeilbeispiel:\nfor minutes in appearances:\n    total = total + minutes',
    ],
    checks: [
      {
        label: 'Gesamte Einsatzzeit: 270 Minuten',
        expression: 'total',
        expected: 270,
      },
    ],
    reflection: 'Was würde ein fehlender Einsatz in der Datenliste an deinem Ergebnis ändern?',
    rubric: [
      'Bedenke Vollständigkeit der Daten.',
      'Unterscheide korrekte Berechnung von korrekten Ausgangsdaten.',
    ],
    setup: 'appearances = [90, 60, 30, 90]',
    variants: [
      {
        label: 'Andere Einsätze',
        setup: 'appearances = [15, 25]',
        checks: [
          {
            label: 'Alle Einsätze addiert',
            expression: 'total',
            expected: 40,
          },
        ],
      },
      {
        label: 'Keine Einsätze',
        setup: 'appearances = []',
        checks: [
          {
            label: 'Leere Liste ergibt null Minuten',
            expression: 'total',
            expected: 0,
          },
        ],
      },
    ],
    objective: 'Die Einsatzminuten einer Liste mit einer Schleife aufsummieren.',
    prerequisites: ['vergleich'],
    sources: [
      {
        title: 'Python-Tutorial: Kontrollfluss',
        url: 'https://docs.python.org/3/tutorial/controlflow.html',
      },
    ],
  },
  {
    id: 'rollenfilter',
    title: 'Das Mittelfeld eingrenzen',
    minutes: 25,
    concept: 'Listen filtern',
    explanation: [
      'Hier enthält die Liste mehrere Dictionaries. Die Schleife liefert mit jedem Durchlauf ein player-Profil.',
      'Eine neue Liste beginnt mit []. Mit shortlist.append(player["name"]) fügst du einen Namen hinzu.',
      'and verbindet zwei Bedingungen: Beide müssen wahr sein. Wir suchen MF und mindestens 450 Minuten. Das ist nur ein erster Filter, keine Empfehlung.',
    ],
    example:
      'shortlist = []\nfor player in players:\n    if player["position"] == "MF":\n        shortlist.append(player["name"])',
    setup:
      'players = [{"name":"Ada","position":"MF","minutes":720},{"name":"Mira","position":"FW","minutes":810},{"name":"Lea","position":"MF","minutes":180},{"name":"Nora","position":"MF","minutes":450}]',
    task: 'players ist bereits geladen (siehe Beispieldaten). Erstelle shortlist mit den Namen aller MF-Spielerinnen mit mindestens 450 Minuten. Behalte die Reihenfolge.',
    starter:
      'shortlist = []\nfor player in players:\n    # Prüfe Position und Minuten.\n    pass\nprint(shortlist)',
    solution:
      'shortlist = []\nfor player in players:\n    if player["position"] == "MF" and player["minutes"] >= 450:\n        shortlist.append(player["name"])\nprint(shortlist)',
    hints: [
      'Vergleiche player["position"] mit "MF" und player["minutes"] mit 450.',
      'Prüfe für jedes Profil Position und Minuten. Der Name kommt nur in die Ergebnisliste, wenn beide Bedingungen erfüllt sind. Vergleiche mit dem Beispiel und lies Schleifen und Bedingungen bei Bedarf im Tutorial nach.',
      'Verbinde beide Prüfungen mit and. append gehört eingerückt in den if-Block.\n\nTeilbeispiel:\nif player["position"] == "MF" and player["minutes"] >= 450:\n    # Name ergänzen\n    pass',
    ],
    checks: [
      {
        label: 'Nur passende Position und Spielzeit',
        expression: 'shortlist',
        expected: ['Ada', 'Nora'],
      },
    ],
    reflection: 'Warum ist die Bezeichnung MF noch kein ausreichendes Rollenprofil?',
    rubric: [
      'Nenne unterschiedliche Aufgaben im Mittelfeld.',
      'Erkläre, warum Spielstil und Rolle zusätzliche Kriterien brauchen.',
    ],
    variants: [
      {
        label: 'Neue Kandidatinnen',
        setup:
          'players = [{"name":"Pia","position":"MF","minutes":600},{"name":"Uta","position":"DF","minutes":800},{"name":"Ria","position":"MF","minutes":449}]',
        checks: [
          {
            label: 'Aus neuen Profilen gefiltert',
            expression: 'shortlist',
            expected: ['Pia'],
          },
        ],
      },
      {
        label: 'Keine Profile',
        setup: 'players = []',
        checks: [
          {
            label: 'Leere Auswahl',
            expression: 'shortlist',
            expected: [],
          },
        ],
      },
    ],
    objective:
      'Profile einer Positionsgruppe auswählen und ihre Namen in einer neuen Liste sammeln.',
    prerequisites: ['schleife'],
    sources: [
      {
        title: 'Python-Tutorial: Kontrollfluss',
        url: 'https://docs.python.org/3/tutorial/controlflow.html',
      },
    ],
  },
  {
    id: 'funktion',
    title: 'Kennzahlen pro 90 Minuten',
    minutes: 25,
    concept: 'Funktionen und return',
    explanation: [
      'Eine Funktion bündelt eine Berechnung. def per90(actions, minutes): definiert sie. Die Namen in den Klammern sind Parameter: Sie werden beim Aufruf durch Werte ersetzt.',
      'return gibt das Ergebnis zurück. print zeigt etwas an, ersetzt return aber nicht. Nach return endet der Funktionsaufruf.',
      'actions / minutes * 90 macht Häufigkeiten bei unterschiedlicher Spielzeit vergleichbarer. Bei 0 Minuten ist die Rate nicht definiert: Wir geben None zurück. Das ist Python für keinen Wert.',
    ],
    example: 'def double(value):\n    return value * 2\n\nprint(double(4))',
    task: 'Schreibe per90(actions, minutes). Bei minutes <= 0 liefere None, sonst actions / minutes * 90. Die Prüfung ruft deine Funktion mit verschiedenen Werten auf.',
    starter:
      'def per90(actions, minutes):\n    # Erst die Spielzeit prüfen, dann die Rate berechnen.\n    return 0\n\nprint(per90(12, 360))',
    solution:
      'def per90(actions, minutes):\n    if minutes <= 0:\n        return None\n    return actions / minutes * 90\n\nprint(per90(12, 360))',
    hints: [
      'Teste die Spielzeit vor der Division, damit kein ZeroDivisionError entsteht.',
      'Verfolge im Beispiel, welche Werte die Funktion erhält und welchen Wert return zurückgibt. Tausche die Eingabe gedanklich aus, bevor du die Funktion ausführst. Das Tutorial erklärt Parameter und Rückgabewerte.',
      'Zuerst if minutes <= 0: return None. Sonst return actions / minutes * 90.\n\nTeilbeispiel:\ndef per90(actions, minutes):\n    if minutes <= 0:\n        return None\n    # gültige Spielzeit berechnen',
    ],
    checks: [
      {
        label: '12 Aktionen in 360 Minuten',
        expression: 'per90(12, 360)',
        expected: 3,
      },
      {
        label: 'Andere Einsatzzeit',
        expression: 'per90(5, 90)',
        expected: 5,
      },
      {
        label: 'Keine Einsatzzeit ist kein Nullwert',
        expression: 'per90(2, 0)',
        expected: null,
      },
      {
        label: 'Keine Aktionen bei vorhandener Spielzeit',
        expression: 'per90(0, 180)',
        expected: 0,
      },
    ],
    reflection:
      'Warum macht eine Kennzahl pro 90 Minuten einen Vergleich noch nicht vollständig fair?',
    rubric: [
      'Nenne Ballbesitz, Rolle oder Mannschaftskontext.',
      'Bedenke Unsicherheit bei wenig Spielzeit.',
    ],
    objective:
      'Eine wiederverwendbare Berechnung als Funktion mit Parametern und Rückgabewert schreiben.',
    prerequisites: ['rollenfilter'],
    sources: [
      {
        title: 'Python-Tutorial: Kontrollfluss',
        url: 'https://docs.python.org/3/tutorial/controlflow.html',
      },
    ],
  },
  {
    id: 'schussfilter',
    title: 'Schüsse sind noch keine Tore',
    minutes: 30,
    concept: 'Funktionen mit Eventdaten',
    explanation: [
      'Eine Ereigniszeile beschreibt eine Aktion. type sagt hier Shot oder Pass; outcome beschreibt das Ergebnis. Ein gehaltenes Shot-Ereignis zählt auch als Schuss.',
      'Du verbindest nun Funktion, Schleife und zwei Bedingungen. Die Prüfung übergibt jeweils eine neue Liste und einen Teamnamen.',
      'Der Zähler muss bei jedem Funktionsaufruf neu bei 0 beginnen. Dann funktioniert die Funktion auch für eine leere Liste.',
    ],
    setup:
      'events = [{"team":"Nordstadt","type":"Shot","outcome":"Saved"},{"team":"Nordstadt","type":"Pass","outcome":"Complete"},{"team":"Hafenstadt","type":"Shot","outcome":"Goal"},{"team":"Nordstadt","type":"Shot","outcome":"Goal"}]',
    example: 'for event in events:\n    print(event["team"], event["type"])',
    task: 'Schreibe count_shots(events, team), die die Anzahl der Shot-Ereignisse des übergebenen Teams zurückgibt. Verwende die Parameter statt fest eingetragener Teamnamen.',
    starter:
      'def count_shots(events, team):\n    return 0\n\nprint(count_shots(events, "Nordstadt"))',
    solution:
      'def count_shots(events, team):\n    total = 0\n    for event in events:\n        if event["team"] == team and event["type"] == "Shot":\n            total = total + 1\n    return total\n\nprint(count_shots(events, "Nordstadt"))',
    hints: [
      'Prüfe sowohl event["team"] == team als auch event["type"] == "Shot".',
      'Lies im Beispiel zuerst Team und Typ jeder Aktion ab. Überlege dann, bei welchen Aktionen du den Zähler erhöhen musst. Die Schleife und die Bedingungen kannst du im verlinkten Tutorial nachlesen.',
      'Zähle mit total = total + 1 im if-Block. return total steht nach der Schleife, noch innerhalb der Funktion.\n\nTeilbeispiel:\ndef count_shots(events, team):\n    total = 0\n    # Schleife und Bedingungen\n    return total',
    ],
    checks: [
      {
        label: 'Nordstadt: gehaltene Schüsse zählen mit',
        expression: 'count_shots(events, "Nordstadt")',
        expected: 2,
      },
      {
        label: 'Anderes Team',
        expression: 'count_shots(events, "Hafenstadt")',
        expected: 1,
      },
      {
        label: 'Leere Liste',
        expression: 'count_shots([], "Nordstadt")',
        expected: 0,
      },
      {
        label: 'Neue Daten und neues Team',
        expression:
          'count_shots([{"team":"West","type":"Shot"},{"team":"West","type":"Pass"},{"team":"West","type":"Shot"}], "West")',
        expected: 2,
      },
      {
        label: 'Team kommt nicht vor',
        expression: 'count_shots(events, "Ost")',
        expected: 0,
      },
    ],
    reflection:
      'Warum reichen Schussanzahl und Tore eines Spiels nicht für eine Spielerempfehlung?',
    rubric: [
      'Unterscheide Häufigkeit und Chancenqualität.',
      'Bedenke die kleine Stichprobe und den Mannschaftskontext.',
    ],
    objective: 'Schussereignisse aus einer Liste von Aktionen auswählen.',
    prerequisites: ['funktion'],
    sources: [
      {
        title: 'Python-Tutorial: Kontrollfluss',
        url: 'https://docs.python.org/3/tutorial/controlflow.html',
      },
    ],
  },
  {
    id: 'transfer',
    title: 'Dein erster eigenständiger Filter',
    minutes: 35,
    concept: 'Transferaufgabe',
    transfer: true,
    explanation: [
      'Du hast alle Bausteine für einen ersten Kandidatenfilter kennengelernt. Diese neue Aufgabe ist eine Gelegenheit, sie ohne Vorlage zusammenzusetzen.',
      'Die Daten sind neu. Schreibe die Funktion so, dass sie mit anderen Profilen und einer anderen Minutengrenze arbeitet. Ihre Ausgabe zeigt, wer diese Auswahlregel erfüllt. Welche Person zur gesuchten Rolle passt, braucht weitere Prüfung.',
      'Wenn du Hilfen brauchst, nutze sie. Die Aufgabe wird dann als mit Hilfe geübt eingeordnet. Eine spätere Wiederholung kann dir zeigen, was du selbst behalten hast.',
    ],
    setup:
      'candidates = [{"name":"Ida","position":"MF","minutes":900},{"name":"Jona","position":"DF","minutes":1000},{"name":"Lina","position":"MF","minutes":450},{"name":"Sina","position":"MF","minutes":449}]',
    example:
      '# Neue Übungsdaten: candidates\n# Erwartete Namen bei Mindestspielzeit 450: ["Ida", "Lina"]',
    task: 'Schreibe select_candidates(players, min_minutes). Gib eine Liste der Namen zurück, deren position "MF" ist und deren minutes mindestens min_minutes beträgt. Behalte die Reihenfolge. Die Ausgabe soll auch bei einer leeren Liste funktionieren.',
    starter:
      'def select_candidates(players, min_minutes):\n    # Deine eigene Lösung.\n    return []\n\nprint(select_candidates(candidates, 450))',
    solution:
      'def select_candidates(players, min_minutes):\n    names = []\n    for player in players:\n        if player["position"] == "MF" and player["minutes"] >= min_minutes:\n            names.append(player["name"])\n    return names\n\nprint(select_candidates(candidates, 450))',
    hints: [
      'Lege in der Funktion eine neue Ergebnisliste an. Gehe alle Profile durch und prüfe beide Kriterien.',
      'Schreibe zuerst für ein Profil auf, ob Position und Minuten die Vorgaben erfüllen. Übertrage diese Entscheidung in die Funktion und sammle die passenden Namen. Nutze die vorherigen Beispiele oder das Tutorial für die Syntax.',
      'Nutze min_minutes aus dem Parameter statt der festen Zahl 450. Ergänze passende Namen mit append und gib die Liste nach der Schleife zurück.\n\nTeilbeispiel:\ndef select_candidates(players, min_minutes):\n    names = []\n    # Profile durchgehen, prüfen und ergänzen\n    return names',
    ],
    checks: [
      {
        label: 'Grenzwert eingeschlossen',
        expression: 'select_candidates(candidates, 450)',
        expected: ['Ida', 'Lina'],
      },
      {
        label: 'Andere Mindestspielzeit',
        expression: 'select_candidates(candidates, 800)',
        expected: ['Ida'],
      },
      {
        label: 'Leere Liste',
        expression: 'select_candidates([], 450)',
        expected: [],
      },
      {
        label: 'Neue Namen und Positionen',
        expression:
          'select_candidates([{"name":"A","position":"FW","minutes":900},{"name":"B","position":"MF","minutes":100},{"name":"C","position":"MF","minutes":90}], 100)',
        expected: ['B'],
      },
      {
        label: 'Keine passenden Profile',
        expression: 'select_candidates(candidates, 2000)',
        expected: [],
      },
    ],
    reflection:
      'Schreibe ein kurzes Scouting-Fazit: Was leistet dein Filter, was sagt er nicht aus und was würdest du als Nächstes prüfen?',
    rubric: [
      'Beschreibe die Auswahlregel präzise.',
      'Behaupte keine Qualität oder Eignung allein aus Position und Minuten.',
      'Nenne mindestens einen nächsten Prüfschritt, etwa Spielstil, Video oder weitere Daten.',
    ],
    objective:
      'Einen Kandidatenfilter selbst schreiben und erklären, welche Aussage seine Auswahl erlaubt.',
    prerequisites: ['schussfilter'],
    sources: [
      {
        title: 'Python-Tutorial: Kontrollfluss',
        url: 'https://docs.python.org/3/tutorial/controlflow.html',
      },
    ],
  },
];
export const lessons: Lesson[] = [
  ...introduction.map((lesson) => ({ ...lesson, trackId: 'python', level: 'Einstieg' as const })),
  ...newLessons
    .filter((l) => l.trackId !== 'advanced')
    .map((lesson) => ({ ...lesson, level: 'Aufbau' as const })),
  ...[...engineeringLessons, ...sciencePracticeLessons].map((lesson) => ({
    ...lesson,
    level: 'Praxis' as const,
    dataPreview:
      practiceDataSummary +
      '\n\nWeitere vorbereitete Variablen:\n' +
      (lesson.setup ?? '').replace(PRACTICE_SHOTS_SETUP, '').replace(PRACTICE_EVENTS_SETUP, ''),
  })),
  ...newLessons
    .filter((l) => l.trackId === 'advanced')
    .map((lesson) => ({ ...lesson, level: 'Aufbau' as const })),
];
export const tracks: Track[] = [
  {
    id: 'python',
    title: 'Python im Fußballkontext',
    description: 'Von Variablen zum eigenen Kandidatenfilter.',
    available: true,
    outcome: 'Du schreibst kleine Auswertungen selbst und erklärst ihre Grenzen.',
  },
  {
    id: 'data',
    title: 'SQL & Datenaufbereitung',
    description: 'Abfragen, bereinigen und Daten verknüpfen.',
    available: true,
    outcome: 'Du baust eine verlässliche Datenbasis für Analysen.',
  },
  {
    id: 'analysis',
    title: 'Spielanalyse & Visualisierung',
    description: 'Eventdaten lesen und Muster korrekt darstellen.',
    available: true,
    outcome: 'Du erstellst einen nachvollziehbaren Spielbericht.',
    projectId: 'spielbericht',
  },
  {
    id: 'statistics',
    title: 'Statistik & xG',
    description: 'Unsicherheit, Wahrscheinlichkeiten und Modellbewertung.',
    available: true,
    outcome: 'Du prüfst ein eigenes Modell an ungesehenen Spielen.',
    projectId: 'xg-modell',
  },
  {
    id: 'scouting',
    title: 'Datenscouting',
    description: 'Rollenprofile, faire Vergleiche und Shortlists.',
    available: true,
    outcome: 'Du begründest Kandidaten und prüfst die Stabilität der Auswahl.',
    projectId: 'scouting-app',
  },
  {
    id: 'engineering',
    title: 'Data Engineering im Sport',
    description: 'Echte Eventfeeds, Datenverträge und wiederholbare Pipelines.',
    available: true,
    outcome: 'Du lieferst eine geprüfte Datengrundlage mit Quarantäne, Abdeckung und Herkunft.',
  },
  {
    id: 'science-practice',
    title: 'Data Science: Praxistransfer',
    description: 'Reale Schüsse, zeitliche Evaluation und robuste Entscheidungen.',
    available: true,
    outcome: 'Du entwickelst und prüfst eine eigene Analyse ohne vorgegebene Lösungsschritte.',
  },
  {
    id: 'advanced',
    title: 'Vertiefung & Vereinspraxis',
    description: 'Aktionswerte, Raum und reproduzierbare Berichte.',
    available: true,
    outcome: 'Du beantwortest eine Vereinsfrage und dokumentierst Unsicherheit.',
    projectId: 'aktionswerte',
  },
];
