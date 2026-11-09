import type { Lesson } from '../types';
import {
  EVENT_SETUP,
  GOAL_SETUP,
  MATCH_EVENTS,
  MATPLOTLIB_SCATTER_DOCS,
  PASS_SETUP,
  STATSBOMB_DOCS,
  check,
} from './fixtures';

const common = { trackId: 'analysis', packages: [] as string[] };

const nordstadtShots = MATCH_EVENTS.filter(
  (event) => event.type === 'Shot' && event.team === 'Nordstadt',
).map((event) => ({ x: event.x, y: event.y, xg: event.xg ?? 0 }));

export const analysisLessons: Lesson[] = [
  {
    ...common,
    id: 'analyse-richtung',
    title: 'Alle Schüsse in dieselbe Richtung drehen',
    minutes: 30,
    concept: 'Koordinatensysteme und Spielrichtung',
    objective:
      'Rohkoordinaten anhand der Angriffsrichtung normalisieren, damit Schüsse vergleichbar werden.',
    prerequisites: ['data-review'],
    explanation: [
      'Ein Schuss wird durch x und y beschrieben. Die Rohkoordinaten sind absolut: x läuft von 0 (linkes Tor) bis 120 (rechtes Tor), y von 0 bis 80 (Seitenlinie zu Seitenlinie), unabhängig davon, welche Mannschaft gerade angreift. Deshalb liegt ein Schuss eines nach links angreifenden Teams bei kleinen x-Werten, denn sein Angriffsziel ist das linke Tor.',
      'In den Daten steht attacks = "right" oder "left". Damit ist gemeint, in welche Richtung das Team im absoluten Koordinatensystem angreift. Für einen Vergleich drehen wir alle Schüsse so, dass jedes Team nach rechts (Richtung x = 120) angreift: Bei "left" wird x zu 120 - x und y zu 80 - y. Die y-Spiegelung ist nötig, weil eine Drehung um 180 Grad beide Achsen betrifft.',
      'Vergleiche die Schusskarten und Mittelwerte erst nach dieser Drehung. Sie richtet die Darstellung einheitlich aus, ohne die Schussqualität zu verändern. Kontrolliere die Rechnung an einem bekannten Punkt: Aus (18, 50) bei einem Angriff nach links wird (102, 30). Der Punkt liegt danach nahe dem rechten Tor, dem Angriffsziel im normalisierten System.',
    ],
    example: `def flip_point(x, y, attacks):
    if attacks == "left":
        return [120 - x, 80 - y]
    return [x, y]

print(flip_point(18, 50, "left"))  # [102, 30]`,
    task: 'Schreibe normalize_shots(events). Berücksichtige nur Ereignisse mit type == "Shot". Gib in der ursprünglichen Reihenfolge [team, x, y] zurück, wobei x und y auf eine Nachkommastelle gerundet sind. Bei attacks == "left" gilt x = 120 - x und y = 80 - y, sonst bleiben die Werte unverändert.',
    starter: `def normalize_shots(events):
    result = []
    for event in events:
        if event["type"] == "Shot":
            # Richtung fehlt noch.
            result.append([event["team"], event["x"], event["y"]])
    return result

print(normalize_shots(events)[:3])`,
    solution: `def normalize_shots(events):
    result = []
    for event in events:
        if event["type"] != "Shot":
            continue
        x = event["x"]
        y = event["y"]
        if event["attacks"] == "left":
            x = 120 - x
            y = 80 - y
        result.append([event["team"], round(x, 1), round(y, 1)])
    return result

print(normalize_shots(events)[:3])`,
    hints: [
      'Die Fallunterscheidung gehört pro Ereignis in die Schleife. Nur bei "left" werden beide Koordinaten gespiegelt. Die Rohwerte sind absolut, nicht teamrelativ.',
      'Lies das Beispiel oben. Prüfe danach die erste Hafenstadt-Zeile: Aus (18, 50) muss (102, 30) werden.',
      'Der Kern:\n\nif event["attacks"] == "left":\n    x = 120 - x\n    y = 80 - y\n\nDanach round(x, 1) und round(y, 1) in die Ergebnisliste.',
    ],
    checks: [
      check('Erste fünf normalisierte Schüsse', 'normalize_shots(events)[:5]', [
        ['Nordstadt', 108, 40],
        ['Hafenstadt', 102, 30],
        ['Nordstadt', 99, 52],
        ['Nordstadt', 114, 34],
        ['Hafenstadt', 110, 44],
      ]),
      check('Erster Hafenstadt-Schuss gespiegelt', 'normalize_shots(events)[1]', [
        'Hafenstadt',
        102,
        30,
      ]),
      check(
        'Alle x-Werte liegen im Feld',
        'bool(all(0 <= row[1] <= 120 for row in normalize_shots(events)))',
        true,
      ),
      check('Nur Schüsse, keine Pässe', 'len(normalize_shots(events))', 23),
    ],
    reflection:
      'Warum reicht es nicht, nur die Mannschaft umzurechnen, wenn dieselbe Mannschaft in verschiedenen Spielen oder Halbzeiten in unterschiedliche Richtungen angreift?',
    rubric: [
      'Erkläre, warum die Richtung an das Ereignis und nicht nur an den Teamnamen gebunden ist.',
      'Nenne eine Prüfung mit einem bekannten Punkt.',
    ],
    setup: EVENT_SETUP,
    variants: [
      {
        label: 'Neue Ereignisse',
        setup: `events = [
  {"team": "West", "type": "Shot", "x": 15, "y": 50, "attacks": "left"},
  {"team": "Ost", "type": "Shot", "x": 100, "y": 40, "attacks": "right"},
  {"team": "West", "type": "Pass", "x": 50, "y": 50, "attacks": "left"},
  {"team": "West", "type": "Shot", "x": 30, "y": 20, "attacks": "left"},
]`,
        checks: [
          check('Richtung in neuen Daten', 'normalize_shots(events)', [
            ['West', 105, 30],
            ['Ost', 100, 40],
            ['West', 90, 60],
          ]),
        ],
      },
    ],
    sources: [STATSBOMB_DOCS],
  },
  {
    ...common,
    id: 'analyse-aggregat',
    title: 'Ein Spiel kompakt zusammenfassen',
    minutes: 40,
    concept: 'Ereignisse zu Mannschaftskennzahlen aggregieren',
    objective:
      'Zählregeln für Schüsse, Schüsse aufs Tor, Tore und Pässe festlegen und pro Mannschaft auswerten.',
    prerequisites: ['analyse-richtung'],
    explanation: [
      'Eine Aggregation ersetzt viele Ereigniszeilen durch wenige Kennzahlen. Dafür muss jede Kennzahl eine klare Regel haben: shots zählt alle Shot-Ereignisse, on_target zählt Goal und Saved, goals nur Goal, passes alle Pass-Ereignisse und completed nur Pass mit outcome "Complete". "Off" ist ein Schuss, aber kein Schuss aufs Tor.',
      'Lege die Zählregeln vor der Berechnung fest. In diesen Daten liefert "alles außer Off" denselben Wert für on_target wie Goal plus Saved. Würdest du nur Tore zählen und gehaltene Schüsse auslassen, wäre on_target zu klein. Die genaue Ereignisdefinition entscheidet also, was die Kennzahl erfasst.',
      'Viele Pässe können auf Dominanz hinweisen, aber auch auf häufige Querpässe. Wenige Schüsse können zu einem effizienten oder einem passiven Auftritt gehören. Die Funktion zählt daher Ereignisse und erstellt keine Leistungsrangliste. Zur Bewertung musst du den Spielverlauf einbeziehen und prüfen, ob die Ereignisse vollständig und nach denselben Regeln erfasst sind.',
    ],
    example: `def count_goals(events, team):
    total = 0
    for event in events:
        if event["team"] == team and event["type"] == "Shot" and event["outcome"] == "Goal":
            total += 1
    return total

print(count_goals(events, "Nordstadt"))`,
    task: 'Schreibe summarize(events, team). Gib [shots, on_target, goals, passes, completed] zurück. shots zählt alle Shot-Ereignisse, on_target die Ergebnisse "Goal" und "Saved", goals nur "Goal". passes zählt alle Pass-Ereignisse, completed nur Pass mit "Complete". Ein unbekanntes Team liefert fünf Nullen.',
    starter: `def summarize(events, team):
    shots = 0
    on_target = 0
    goals = 0
    passes = 0
    completed = 0
    for event in events:
        if event["team"] == team and event["type"] == "Shot":
            shots += 1
            # on_target und goals fehlen.
    return [shots, on_target, goals, passes, completed]

print(summarize(events, "Nordstadt"))`,
    solution: `def summarize(events, team):
    shots = 0
    on_target = 0
    goals = 0
    passes = 0
    completed = 0
    for event in events:
        if event["team"] != team:
            continue
        if event["type"] == "Shot":
            shots += 1
            if event["outcome"] in ("Goal", "Saved"):
                on_target += 1
            if event["outcome"] == "Goal":
                goals += 1
        elif event["type"] == "Pass":
            passes += 1
            if event["outcome"] == "Complete":
                completed += 1
    return [shots, on_target, goals, passes, completed]

print(summarize(events, "Nordstadt"))`,
    hints: [
      'Trenne zuerst nach Ereignistyp. Innerhalb der Schüsse brauchst du zwei unabhängige Bedingungen für on_target und goals.',
      'Lies die Beispiel-Funktion und ergänze die fehlenden Zähler. Prüfe, ob "Off" weder on_target noch goals erhöht.',
      'Die Bedingungen:\n\nif event["outcome"] in ("Goal", "Saved"):\n    on_target += 1\nif event["outcome"] == "Goal":\n    goals += 1\n\nPässe werden im elif-Zweig gezählt.',
    ],
    checks: [
      check('Nordstadt vollständig', 'summarize(events, "Nordstadt")', [10, 8, 7, 3, 2]),
      check('Hafenstadt vollständig', 'summarize(events, "Hafenstadt")', [7, 5, 1, 4, 2]),
      check('Weststadt vollständig', 'summarize(events, "Weststadt")', [6, 4, 2, 2, 1]),
      check('Unbekanntes Team bleibt bei null', 'summarize(events, "Oststadt")', [0, 0, 0, 0, 0]),
    ],
    reflection:
      'Welche deiner fünf Kennzahlen wäre am ehesten irreführend, wenn ein Team nur wenige, aber sehr gefährliche Angriffe hatte?',
    rubric: [
      'Nenne die genaue Definition von on_target.',
      'Erkläre den Unterschied zwischen Volumen und Qualität.',
    ],
    setup: EVENT_SETUP,
    variants: [
      {
        label: 'Neue Ereignisse',
        setup: `events = [
  {"team": "A", "type": "Shot", "outcome": "Goal"},
  {"team": "A", "type": "Shot", "outcome": "Off"},
  {"team": "A", "type": "Pass", "outcome": "Complete"},
  {"team": "A", "type": "Pass", "outcome": "Incomplete"},
  {"team": "B", "type": "Shot", "outcome": "Saved"},
]`,
        checks: [check('Neue Mannschaft A', 'summarize(events, "A")', [2, 1, 1, 2, 1])],
      },
    ],
    sources: [STATSBOMB_DOCS],
  },
  {
    ...common,
    id: 'analyse-schusskarte',
    title: 'Eine Schusskarte zeichnen',
    minutes: 40,
    concept: 'Matplotlib: Streudiagramm mit Größe als dritte Information',
    objective:
      'Schusspositionen als Streudiagramm darstellen und xG über die Punktgröße sichtbar machen.',
    prerequisites: ['analyse-aggregat'],
    explanation: [
      'Im Streudiagramm bestimmen x und y die Position eines Schusses. Die Punktgröße stellt eine weitere Information dar, hier xG: Je höher der Wert, desto größer der Punkt. Die Grafik berechnet damit keine zusätzliche Kennzahl. Prüfe die zugrunde liegenden Daten und die Achsengrenzen, bevor du aus dem Bild Schlüsse ziehst.',
      'Die Achsen müssen beschriftet und begrenzt sein. Ohne feste Grenzen schneidet Matplotlib automatisch zu und ein Schuss am Rand wirkt weiter innen. set_xlim(0, 120) und set_ylim(0, 80) halten das Feld vollständig sichtbar. Die Reihenfolge der Punkte ändert die Darstellung nicht, kann aber bei Überlappung beeinflussen, welcher Punkt oben liegt.',
      'Prüfe bei einer Schusskarte, ob sie Schussqualität und Spielrichtung berücksichtigt und Tore von Fehlschüssen unterscheidet. Diese Karte zeigt Position und xG. Ob der Schuss aus einem Konter, nach einem Standard oder unter Druck entstand, bleibt offen. Für den Spielbericht musst du das im Video oder in weiteren Ereignisdaten nachsehen.',
    ],
    example: `import matplotlib.pyplot as plt

fig, ax = plt.subplots()
ax.scatter([100, 108], [40, 35], s=[80, 200])
ax.set_xlim(0, 120)
ax.set_ylim(0, 80)
ax.set_xlabel("x (m)")
ax.set_ylabel("y (m)")`,
    task: 'Erzeuge fig und ax mit plt.subplots(). Zeichne alle Schüsse aus shots als Streudiagramm: x auf die x-Achse, y auf die y-Achse, Punktgröße s = xg * 800. Setze xlim auf 0 bis 120 und ylim auf 0 bis 80. Beschrifte die Achsen mit "x (m)" und "y (m)" und setze den Titel "Schüsse Nordstadt".',
    starter: `import matplotlib.pyplot as plt

fig, ax = plt.subplots()
xs = [shot["x"] for shot in shots]
ys = [shot["y"] for shot in shots]
# Die Punkte fehlen noch.
ax.set_xlim(0, 120)
ax.set_ylim(0, 80)`,
    solution: `import matplotlib.pyplot as plt

fig, ax = plt.subplots()
xs = [shot["x"] for shot in shots]
ys = [shot["y"] for shot in shots]
sizes = [shot["xg"] * 800 for shot in shots]
ax.scatter(xs, ys, s=sizes)
ax.set_xlim(0, 120)
ax.set_ylim(0, 80)
ax.set_xlabel("x (m)")
ax.set_ylabel("y (m)")
ax.set_title("Schüsse Nordstadt")`,
    hints: [
      'Die Positionen hast du schon. Für die Größe brauchst du eine dritte Liste, die zu jedem Punkt gehört.',
      'Lies die Matplotlib-Dokumentation zu scatter. Achte darauf, dass s eine Liste mit einem Wert pro Punkt ist.',
      'Der Aufruf:\n\nsizes = [shot["xg"] * 800 for shot in shots]\nax.scatter(xs, ys, s=sizes)',
    ],
    checks: [
      check('Alle Schüsse als Punkte', 'len(ax.collections[0].get_offsets())', 10),
      check(
        'Größter xG-Wert bestimmt die erste Punktgröße',
        'round(float(ax.collections[0].get_sizes()[0]), 1)',
        280.0,
      ),
      check(
        'Feldgrenzen vollständig',
        'list(ax.get_xlim()) + list(ax.get_ylim())',
        [0, 120, 0, 80],
      ),
      check('Achsen und Titel beschriftet', '[ax.get_xlabel(), ax.get_ylabel(), ax.get_title()]', [
        'x (m)',
        'y (m)',
        'Schüsse Nordstadt',
      ]),
      check(
        'Kleinster x-Wert liegt bei 99',
        'round(float(ax.collections[0].get_offsets()[:, 0].min()), 1)',
        99.0,
      ),
    ],
    reflection:
      'Welche Information fehlt in dieser Karte, um zu beurteilen, ob die vielen Schüsse aus guten oder nur aus aussichtslosen Situationen entstanden sind?',
    rubric: [
      'Nenne mindestens zwei fehlende Kontextinformationen, etwa Druck, Spielsituation oder Schussart.',
      'Erkläre, warum Punktgröße allein keine Qualitätsaussage über das Team ist.',
    ],
    setup: `import matplotlib.pyplot as plt
shots = ${JSON.stringify(nordstadtShots)}`,
    packages: ['matplotlib'],
    sources: [MATPLOTLIB_SCATTER_DOCS, STATSBOMB_DOCS],
  },
  {
    ...common,
    id: 'analyse-passnetz',
    title: 'Die häufigste Passverbindung finden',
    minutes: 40,
    concept: 'Passnetzwerke: Paare zählen und sortieren',
    objective:
      'Abgeschlossene Pässe zu Paaren aggregieren und die häufigste Verbindung eines Teams bestimmen.',
    prerequisites: ['analyse-schusskarte'],
    explanation: [
      'Ein Passnetzwerk behandelt Spieler als Knoten und Pässe als gerichtete Kanten. Die einfachste Kennzahl ist die Anzahl abgeschlossener Pässe von A nach B. Dafür zählst du Paare, nicht einzelne Spieler. Ein Pass von Ada zu Mira und einer von Mira zu Ada sind zwei verschiedene gerichtete Kanten.',
      'Zähle nur abgeschlossene Pässe mit bekanntem Empfänger. Andernfalls könnte ein unvollständiger Pass als Verbindung zu None auftauchen. In diesen Daten folgt completed == 1 bereits daraus, dass ein Empfänger vorhanden ist. Prüfe trotzdem beides: So bleibt die Auswahlregel im Code erkennbar und verwirft auch widersprüchliche Einträge.',
      'Kurze Sicherheitspässe können die häufigste Verbindung bilden, obwohl andere Pässe mehr Raum gewinnen. Ergänze für eine Bewertung deshalb Passrichtung, Raumgewinn, Druck und Spielzeit. In dieser Übung zählst du zunächst die Verbindungen. Ein Tie-Breaker, also ein zusätzlicher Sortierschlüssel bei Gleichstand, legt ihre Reihenfolge eindeutig fest.',
    ],
    example: `from collections import Counter

pairs = Counter()
for p in passes:
    if p["completed"] == 1 and p["receiver"] is not None:
        pairs[(p["passer"], p["receiver"])] += 1
print(pairs.most_common(1))`,
    task: 'Schreibe top_link(passes, team). Zähle nur Pässe mit completed == 1 und einem bekannten receiver. Bestimme die häufigste gerichtete Verbindung als [passer, receiver, count]. Bei Gleichstand sortiere aufsteigend nach passer und dann nach receiver. Gibt es keine gültige Verbindung, liefere [].',
    starter: `def top_link(passes, team):
    counts = {}
    for p in passes:
        if p["team"] == team:
            # Filter und Zählung fehlen.
            pass
    return []`,
    solution: `def top_link(passes, team):
    counts = {}
    for p in passes:
        if p["team"] != team:
            continue
        if p["completed"] != 1 or p["receiver"] is None:
            continue
        key = (p["passer"], p["receiver"])
        counts[key] = counts.get(key, 0) + 1
    if not counts:
        return []
    best = sorted(counts.items(), key=lambda item: (-item[1], item[0][0], item[0][1]))[0]
    return [best[0][0], best[0][1], best[1]]`,
    hints: [
      'Zähle pro Paar, nicht pro Spieler. Ein Dictionary mit (passer, receiver) als Schlüssel ist passend.',
      'Lies die Python-Dokumentation zu sorted und zu Dictionary-Methoden. Überlege, wie du bei gleicher Anzahl alphabetisch entscheidest.',
      'Der Sortierschlüssel:\n\nkey=lambda item: (-item[1], item[0][0], item[0][1])\n\nDas negative Vorzeichen macht die Anzahl absteigend.',
    ],
    checks: [
      check('Nordstadt: häufigste Verbindung', 'top_link(passes, "Nordstadt")', ['Ada', 'Mira', 2]),
      check('Hafenstadt: häufigste Verbindung', 'top_link(passes, "Hafenstadt")', [
        'Nora',
        'Lea',
        2,
      ]),
      check('Weststadt: häufigste Verbindung', 'top_link(passes, "Weststadt")', ['Ria', 'Sina', 2]),
      check('Unbekanntes Team ohne Verbindung', 'top_link(passes, "Oststadt")', []),
    ],
    reflection:
      'Warum ist die häufigste Passverbindung eines Teams noch kein Beleg für gutes Aufbauspiel?',
    rubric: [
      'Unterscheide Passvolumen von Raumgewinn und Druckresistenz.',
      'Nenne eine zusätzliche Kennzahl, die du zur Bewertung bräuchtest.',
    ],
    setup: PASS_SETUP,
    variants: [
      {
        label: 'Neue Pässe',
        setup: `passes = [
  {"team": "A", "passer": "Ida", "receiver": "Jona", "completed": 1},
  {"team": "A", "passer": "Ida", "receiver": "Jona", "completed": 1},
  {"team": "A", "passer": "Jona", "receiver": "Ida", "completed": 1},
  {"team": "A", "passer": "Kai", "receiver": None, "completed": 0},
  {"team": "B", "passer": "Lea", "receiver": "Mia", "completed": 1},
]`,
        checks: [check('Gleiche Regel, neue Paare', 'top_link(passes, "A")', ['Ida', 'Jona', 2])],
      },
    ],
    sources: [STATSBOMB_DOCS],
  },
  {
    ...common,
    id: 'analyse-stichprobe',
    title: 'Wie stabil ist ein Schussmittel?',
    minutes: 35,
    concept: 'Stichprobenumfang und Streuung zwischen Spielen',
    objective:
      'Mittelwerte pro Spiel berechnen und den Unterschied zum gepoolten Mittelwert erklären.',
    prerequisites: ['analyse-passnetz'],
    explanation: [
      'Ein Mittelwert über alle Schüsse ist ein gepooltes Mittel: Jeder Schuss zählt gleich, unabhängig davon, zu welchem Spiel er gehört. Ein Mittel der Spielmittel gibt jedem Spiel das gleiche Gewicht. Bei unterschiedlich vielen Schüssen pro Spiel sind die beiden Zahlen nicht identisch.',
      'Die Schussqualität kann sich von Spiel zu Spiel ändern, etwa durch Gegner, Spielverlauf, Heimrecht oder Unterschiede in der Datenerfassung. Ein einzelner Spielmittelwert beschreibt deshalb keine dauerhafte Teameigenschaft. Bei fünf Spielen und 23 Schüssen bleibt die Unsicherheit groß. Die Zahlen dienen als Rechenbeispiel und erlauben keine Schätzung der langfristigen Schussqualität.',
      'Berichte neben dem Mittelwert auch den Umfang und die Verteilung der Daten. Prüfe außerdem, wie stark ein einzelnes Spiel das Gesamtergebnis verschiebt. Dazu zählst du hier die Schüsse pro Spiel, berechnest overall als gepoolten Mittelwert und weist die Spannweite der Spielmittel aus.',
    ],
    example: `values = [0.2, 0.1, 0.3]
print(sum(values) / len(values))
print(max(values) - min(values))`,
    task: 'Berechne aus events pro Spiel (match) die Anzahl der Schüsse und das durchschnittliche xG. Speichere per_match als Liste [match, shots, mean_xg] aufsteigend nach match, wobei mean_xg auf drei Nachkommastellen gerundet ist. Berechne overall als gepoolten Mittelwert aller Schuss-xG, ebenfalls auf drei Stellen gerundet. Berechne spread als max(mean_xg) - min(mean_xg) über die Spielmittel, gerundet auf drei Stellen. Speichere die match_ids des höchsten und niedrigsten Spielmittels in best_match und worst_match.',
    starter: `from collections import defaultdict

by_match = defaultdict(list)
for event in events:
    if event["type"] == "Shot":
        by_match[event["match"]].append(event["xg"])

overall = 0
per_match = []
spread = 0
best_match = ""
worst_match = ""
print(by_match)`,
    solution: `from collections import defaultdict

by_match = defaultdict(list)
for event in events:
    if event["type"] == "Shot":
        by_match[event["match"]].append(event["xg"])

per_match = []
for match in sorted(by_match):
    values = by_match[match]
    per_match.append([match, len(values), round(sum(values) / len(values), 3)])

all_values = [value for values in by_match.values() for value in values]
overall = round(sum(all_values) / len(all_values), 3)
means = [row[2] for row in per_match]
spread = round(max(means) - min(means), 3)
best_match = max(per_match, key=lambda row: row[2])[0]
worst_match = min(per_match, key=lambda row: row[2])[0]
print(per_match, overall, spread, best_match, worst_match)`,
    hints: [
      'Sammle zuerst die xG-Werte pro match. Der gepoolte Mittelwert nutzt alle Werte, nicht den Mittelwert der Spielmittel.',
      'Lies die Python-Dokumentation zu defaultdict und max/min mit key. Achte darauf, dass du die gerundeten oder ungerundeten Spielmittel für spread verwendest; hier ist die Reihenfolge eindeutig.',
      'Der gepoolte Mittelwert:\n\nall_values = [value for values in by_match.values() for value in values]\noverall = round(sum(all_values) / len(all_values), 3)',
    ],
    checks: [
      check('Spielmittel und Schussanzahl', 'per_match', [
        ['M1', 5, 0.164],
        ['M3', 7, 0.126],
        ['M5', 3, 0.217],
        ['M7', 4, 0.177],
        ['M8', 4, 0.2],
      ]),
      check('Gepoolter Mittelwert', 'overall', 0.168),
      check('Spannweite der Spielmittel', 'spread', 0.091),
      check('Spiel mit dem höchsten Mittel', 'best_match', 'M5'),
      check('Spiel mit dem niedrigsten Mittel', 'worst_match', 'M3'),
    ],
    reflection:
      'Warum kann ein Team mit einem hohen gepoolten xG-Mittel pro Schuss trotzdem in den meisten Spielen unterdurchschnittlich abgeschlossen haben?',
    rubric: [
      'Unterscheide gepooltes Mittel und Mittel der Spielmittel.',
      'Nenne mindestens einen Kontextfaktor, der die Spielmittel verschiebt.',
    ],
    setup: EVENT_SETUP,
    sources: [STATSBOMB_DOCS],
  },
  {
    ...common,
    id: 'analyse-spielbericht',
    title: 'Beobachtung, Zahl und Grenze im Spielbericht',
    minutes: 40,
    concept: 'Befunde strukturieren und Limitationen benennen',
    objective:
      'Aus Ereignissen belegte Kennzahlen ableiten und sie von Interpretation und Limitation trennen.',
    prerequisites: ['analyse-stichprobe'],
    explanation: [
      'Ein brauchbarer Spielbericht trennt drei Ebenen: die Beobachtung (was steht in den Daten), die Interpretation (was könnte das bedeuten) und die Grenze (was kann daraus nicht folgen). "Nordstadt hatte 10 Schüsse und 7 Tore" ist eine Beobachtung. "Nordstadt war eiskalt" ist eine Interpretation. "Das belegt keine stabile Abschlussstärke" ist eine Grenze.',
      'Kennzahlen müssen aus derselben Datenbasis stammen. Wenn du Tore aus der Tabelle und xG aus einer anderen Quelle nimmst, können unterschiedliche Spieldauern oder Ereignisdefinitionen die Differenz erzeugen. In dieser Übung kommt alles aus events; trotzdem bleibt die Stichprobe klein und fiktiv.',
      'Prüfe jede Berechnung, bevor du sie in den Bericht übernimmst. Nenne die Zahl samt Definition, erläutere eine mögliche Deutung und benenne anschließend die Grenze dieser Deutung. Für die Reflexion gilt die Rubrik. Die automatischen Prüfungen kontrollieren die Kennzahlen und ob ein Limitationstext vorhanden ist; seine fachliche Qualität musst du selbst prüfen.',
    ],
    example: `shots = [e for e in events if e["type"] == "Shot" and e["team"] == "Nordstadt"]
goals = [e for e in shots if e["outcome"] == "Goal"]
text = f"{len(shots)} Schüsse, {len(goals)} Tore."
print(text)`,
    task: 'Berechne für Nordstadt shots, on_target, goals und die Summe der xG. Speichere summary als [team, shots, on_target, goals, round(xg, 2)]. Speichere goals_minus_xg = round(goals - xg, 2). Schreibe in caveat einen deutschen Satz mit mindestens 8 Wörtern, der eine Grenze der Aussage nennt. Die Zahlen müssen aus events stammen.',
    starter: `shots = []
goals = []
summary = []
goals_minus_xg = 0
caveat = ""
print("Bericht fehlt noch")`,
    solution: `shots = [e for e in events if e["type"] == "Shot" and e["team"] == "Nordstadt"]
goals = [e for e in shots if e["outcome"] == "Goal"]
on_target = [e for e in shots if e["outcome"] in ("Goal", "Saved")]
xg = sum(e["xg"] for e in shots)
summary = ["Nordstadt", len(shots), len(on_target), len(goals), round(xg, 2)]
goals_minus_xg = round(len(goals) - xg, 2)
caveat = "Die kleine fiktive Stichprobe erlaubt keine Aussage über stabile Abschlussqualität."
print(summary, goals_minus_xg, caveat)`,
    hints: [
      'Filtere zuerst Nordstadt-Schüsse, dann daraus Tore und Schüsse aufs Tor. Die xG-Summe braucht alle Schüsse, nicht nur die Tore.',
      'Lies das Beispiel. Achte darauf, dass summary fünf Elemente hat und die xG-Summe auf zwei Stellen gerundet ist.',
      'Die Kernzeilen:\n\nxg = sum(e["xg"] for e in shots)\nsummary = ["Nordstadt", len(shots), len(on_target), len(goals), round(xg, 2)]\ngoals_minus_xg = round(len(goals) - xg, 2)',
    ],
    checks: [
      check('Zahlen aus den Ereignissen', 'summary', ['Nordstadt', 10, 8, 7, 2.18]),
      check('Tore minus xG', 'goals_minus_xg', 4.82),
      check('Limitation ist ein echter Satz', 'len(caveat.split()) >= 8', true),
      check('Limitation hat Substanz', 'len(caveat) >= 60', true),
    ],
    reflection:
      'Formuliere für denselben Befund eine vorsichtige Interpretation und eine Gegenbeobachtung, die du im Video prüfen würdest.',
    rubric: [
      'Trenne Beobachtung, Interpretation und Limitation sprachlich.',
      'Nenne eine konkrete Video- oder Kontextprüfung, die den Befund stützen oder entkräften könnte.',
    ],
    setup: EVENT_SETUP,
    sources: [STATSBOMB_DOCS],
  },
  {
    ...common,
    id: 'analyse-video',
    title: 'Szenen für die Videosichtung vorbereiten',
    minutes: 35,
    concept: 'Ereigniszeit in Clip-Fenster übersetzen',
    objective:
      'Aus Toren und Vor-/Nachlauf kontrollierte Video-Clip-Fenster berechnen und Randfälle behandeln.',
    prerequisites: ['analyse-spielbericht'],
    explanation: [
      'Ein Ereignis hat eine Spielminute, das Video eine Zeitachse. Für die Sichtung brauchst du ein Fenster vor und nach dem Ereignis, damit du Entstehung und Folge siehst. Aus minute 12 mit 10 Minuten Vorlauf und 10 Minuten Nachlauf wird [2, 22].',
      'Begrenze den Start des Fensters auf 0: Bei einem Tor in Minute 5 ergibt max(0, 5 - 10) = 0. Das Ende kann über das Spielende hinausreichen, sofern das Video entsprechend lang ist. Die Clip-Erzeugung muss das berücksichtigen. Hier begrenzen wir nur den Anfang und halten ausdrücklich fest, dass das Ende ungeprüft bleibt.',
      'Die Clip-Liste legt fest, welche Szenen du sichtest. Eine Spielerbewertung ergibt sich daraus erst nach der Sichtung. Sortiere die Einträge nach Minute, damit du dem Spielverlauf folgen kannst. Halte beim Arbeiten auch die Ereignis-ID oder den Spieler fest, um einen Clip später zuordnen zu können.',
    ],
    example: `goals = [{"minute": 12, "player": "Ada"}]
for goal in goals:
    print([goal["player"], max(0, goal["minute"] - 10), goal["minute"] + 10])`,
    task: 'Schreibe clip_windows(goals, pre=10, post=10). goals ist eine Liste von Dictionaries mit minute, player und team. Berücksichtige nur Tore des Teams "Nordstadt". Gib eine nach minute aufsteigende Liste [minute, start, end] zurück, wobei start = max(0, minute - pre) und end = minute + post ist. Bei gleicher Minute entscheidet der Spielername.',
    starter: `def clip_windows(goals, pre=10, post=10):
    result = []
    for goal in goals:
        if goal["team"] == "Nordstadt":
            # Start, Ende und Sortierung fehlen.
            pass
    return result`,
    solution: `def clip_windows(goals, pre=10, post=10):
    result = []
    for goal in goals:
        if goal["team"] != "Nordstadt":
            continue
        start = max(0, goal["minute"] - pre)
        end = goal["minute"] + post
        result.append([goal["minute"], start, end])
    return sorted(result, key=lambda row: (row[0], row[1]))`,
    hints: [
      'Baue pro Tor ein Fenster und sortiere erst am Ende. Der Vorlauf wird mit max(0, ...) abgesichert.',
      'Lies die Python-Dokumentation zu max und sorted. Überlege, was bei einem Tor in Minute 5 passiert.',
      'Das Fenster:\n\nstart = max(0, goal["minute"] - pre)\nend = goal["minute"] + post\nresult.append([goal["minute"], start, end])',
    ],
    checks: [
      check('Chronologische Clip-Fenster für Nordstadt', 'clip_windows(goals, 10, 10)', [
        [5, 0, 15],
        [10, 0, 20],
        [12, 2, 22],
        [22, 12, 32],
        [49, 39, 59],
        [72, 62, 82],
        [81, 71, 91],
      ]),
      check('Anderer Vorlauf', 'clip_windows(goals, 5, 10)[:3]', [
        [5, 0, 15],
        [10, 5, 20],
        [12, 7, 22],
      ]),
    ],
    reflection:
      'Warum sollte die Clip-Liste nicht nur Tore enthalten, wenn du die Entstehung eines Gegentors verstehen willst?',
    rubric: [
      'Nenne mindestens zwei zusätzliche Szenentypen, etwa Ballverlust, Pressing oder Standard.',
      'Erkläre, warum ein Clip allein noch keine Bewertung ist.',
    ],
    setup: GOAL_SETUP,
    variants: [
      {
        label: 'Andere Torliste',
        setup: `goals = [
  {"team": "Nordstadt", "minute": 3, "player": "Ada"},
  {"team": "Hafenstadt", "minute": 4, "player": "Nora"},
  {"team": "Nordstadt", "minute": 55, "player": "Mira"},
]`,
        checks: [
          check('Randfall in Minute 3', 'clip_windows(goals, 10, 5)', [
            [3, 0, 8],
            [55, 45, 60],
          ]),
        ],
      },
    ],
    sources: [STATSBOMB_DOCS],
  },
  {
    ...common,
    id: 'analyse-review',
    title: 'Wiederholung: Richtung normalisieren und zählen',
    minutes: 40,
    concept: 'Wiederholung: Koordinaten und Aggregation',
    objective:
      'Neue Ereignisse normalisieren, Schüsse und Schüsse aufs Tor zählen und den mittleren x-Wert je Team bilden.',
    prerequisites: ['analyse-video'],
    reviewOf: 'analyse-richtung',
    explanation: [
      'Hier verbindest du die Normalisierung der Spielrichtung mit der Aggregation pro Team. Die Ereignisse und Teamnamen sind neu; die Angriffsrichtung steht weiterhin in jedem Ereignis. Leite daraus die nötigen Schritte ab, bevor du die frühere Lösung heranziehst.',
      'Achte darauf, dass der Mittelwert der normalisierten x-Werte nur für Schüsse gebildet wird. Pässe haben ebenfalls Koordinaten, gehören aber nicht in die Schusskennzahl. on_target zählt Goal und Saved, nicht Off.',
      'Du gibst für jedes Team eine Liste aus: Teamname, Schusszahl, Schüsse aufs Tor und mittlere normalisierte x-Position. Ein DataFrame ist dafür nicht nötig. Sortiere alphabetisch nach Team, damit du die Ergebnisse in einer festen Reihenfolge vergleichen kannst.',
    ],
    example: `def score(events, team):
    xs = [e["x"] for e in events if e["team"] == team and e["type"] == "Shot"]
    return [team, len(xs), round(sum(xs) / len(xs), 1)] if xs else [team, 0, 0.0]`,
    task: 'Schreibe normalize_and_count(events). Normalisiere alle Schüsse wie in der Lektion (bei attacks == "left": x = 120 - x, y = 80 - y). Gruppiere nach team und gib eine alphabetisch sortierte Liste [team, shots, on_target, mean_x] zurück. mean_x ist der Mittelwert der normalisierten x-Werte, gerundet auf eine Nachkommastelle. Teams ohne Schüsse kommen nicht vor.',
    starter: `def normalize_and_count(events):
    teams = {}
    for event in events:
        if event["type"] != "Shot":
            continue
        # Normalisierung und Gruppierung fehlen.
        pass
    return []`,
    solution: `def normalize_and_count(events):
    teams = {}
    for event in events:
        if event["type"] != "Shot":
            continue
        x = event["x"]
        if event["attacks"] == "left":
            x = 120 - x
        row = teams.setdefault(event["team"], {"shots": 0, "on_target": 0, "xs": []})
        row["shots"] += 1
        if event["outcome"] in ("Goal", "Saved"):
            row["on_target"] += 1
        row["xs"].append(x)
    result = []
    for team in sorted(teams):
        row = teams[team]
        result.append([team, row["shots"], row["on_target"], round(sum(row["xs"]) / len(row["xs"]), 1)])
    return result`,
    hints: [
      'Normalisiere zuerst x, bevor du es in die Gruppensammlung aufnimmst. Für jedes Team brauchst du Zähler und eine Liste der x-Werte.',
      'Lies noch einmal die Lektion zur Richtung und die Aggregationsregeln. Prüfe, ob Off korrekt aus on_target herausfällt.',
      'Die Gruppierung:\n\nrow = teams.setdefault(event["team"], {"shots": 0, "on_target": 0, "xs": []})\nrow["shots"] += 1\nrow["xs"].append(x)',
    ],
    checks: [
      check('Neue Teams normalisiert und gezählt', 'normalize_and_count(events)', [
        ['Nord', 2, 2, 105.0],
        ['Süd', 2, 1, 87.5],
      ]),
      check('Pässe werden nicht mitgezählt', 'len(normalize_and_count(events))', 2),
    ],
    reflection:
      'Welche Annahme über die Daten machst du, wenn du für den Mittelwert einfach alle normalisierten x-Werte eines Teams addierst?',
    rubric: [
      'Nenne die Normalisierung und die Aggregationsregel getrennt.',
      'Erkläre, warum ein Team mit zwei Schüssen keine stabile mittlere Position hat.',
    ],
    setup: `events = [
  {"team": "Nord", "type": "Shot", "outcome": "Goal", "minute": 10, "x": 100, "y": 40, "attacks": "right", "xg": 0.2},
  {"team": "Süd", "type": "Shot", "outcome": "Saved", "minute": 20, "x": 25, "y": 50, "attacks": "left", "xg": 0.1},
  {"team": "Nord", "type": "Shot", "outcome": "Saved", "minute": 30, "x": 110, "y": 50, "attacks": "right", "xg": 0.3},
  {"team": "Süd", "type": "Shot", "outcome": "Off", "minute": 40, "x": 40, "y": 60, "attacks": "left", "xg": 0.05},
  {"team": "Nord", "type": "Pass", "outcome": "Complete", "minute": 50, "x": 60, "y": 40, "attacks": "right"},
]`,
    sources: [STATSBOMB_DOCS],
  },
];
