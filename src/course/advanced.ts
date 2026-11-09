import type { Lesson } from '../types';
import {
  DATA_NOTE,
  FOT_DOCS,
  NUMPY_MEDIAN_DOCS,
  PANDAS_DOCS,
  STATSBOMB_DOCS,
  XT_DOCS,
  XT_SETUP,
  check,
} from './fixtures';

const common = { trackId: 'advanced', packages: [] as string[] };

export const advancedLessons: Lesson[] = [
  {
    ...common,
    id: 'adv-xt-lookup',
    title: 'Expected Threat als Raster nachschlagen',
    minutes: 40,
    concept: 'xT-Raster und Aktionswert',
    objective:
      'Ein diskretes xT-Raster per Zellindex nachschlagen und den Wertzuwachs einer Aktion berechnen.',
    prerequisites: ['scout-review'],
    explanation: [
      'Expected Threat (xT) teilt das Feld in Zellen und schätzt für jede Zelle den erwarteten Torbeitrag der nächsten Aktionen. Ein Raster ist eine grobe Karte: Jede Zelle hat einen Wert, und eine Aktion von Zelle A nach Zelle B verändert den Wert um xT(B) - xT(A).',
      'Die Zellzuordnung braucht klare Grenzen. Bei 120 mal 80 Feldeinheiten und 12 mal 8 Zellen ist jede Zelle 10 Einheiten breit und hoch. int(x / 10) liefert den Spaltenindex, int(y / 10) den Zeilenindex. Am Rand muss der Index auf die letzte Zelle begrenzt werden, sonst entsteht ein IndexError.',
      'Der xT-Wert stammt aus historischen Durchschnitten ähnlicher Situationen. Er misst nicht die Torwahrscheinlichkeit dieses einzelnen Spielzugs. Trainingsdaten, Zellgröße und Aktionsdefinition beeinflussen ihn. Das vorbereitete Raster dient zum Üben der Berechnung. Bevor du ein Raster für eine Analyse verwendest, prüfe dessen Dokumentation, Trainingszeitraum und Definition der enthaltenen Aktionen.',
    ],
    example: `col = min(int(60 / 10), len(grid[0]) - 1)
row = min(int(40 / 10), len(grid) - 1)
print(grid[row][col])`,
    task: 'Schreibe xt(x, y), die den Rasterwert der Zelle zurückgibt: Spalte = min(int(x / 10), 11), Zeile = min(int(y / 10), 7). Schreibe action_value(x1, y1, x2, y2), die xt(x2, y2) - xt(x1, y1) auf drei Nachkommastellen rundet. Das Raster ist als grid vorbereitet.',
    starter: `def xt(x, y):
    return 0

def action_value(x1, y1, x2, y2):
    return 0

print(xt(108, 40), action_value(60, 40, 108, 40))`,
    solution: `def xt(x, y):
    col = min(int(x / 10), 11)
    row = min(int(y / 10), 7)
    return grid[row][col]

def action_value(x1, y1, x2, y2):
    return round(xt(x2, y2) - xt(x1, y1), 3)

print(xt(108, 40), action_value(60, 40, 108, 40))`,
    hints: [
      'Zeile und Spalte sind getrennt. y bestimmt die Zeile, x die Spalte; das Raster ist als grid[Zeile][Spalte] gespeichert.',
      'Lies das Beispiel und prüfe die Grenzen: x = 120 würde Spalte 12 ergeben, deshalb min(...).',
      'Die Nachschlagefunktion:\n\ncol = min(int(x / 10), 11)\nrow = min(int(y / 10), 7)\nreturn grid[row][col]',
    ],
    checks: [
      check('Zelle nahe dem Tor', 'xt(108, 40)', 0.27),
      check('Mittelfeld', 'xt(60, 40)', 0.1),
      check('Eigene Hälfte', 'xt(30, 20)', 0.04),
      check('Randzelle', 'xt(119, 79)', 0.15),
      check('Fortschritt von Mittelfeld zum Tor', 'action_value(60, 40, 108, 40)', 0.17),
      check('Rückpass verliert Wert', 'action_value(108, 40, 60, 40)', -0.17),
    ],
    reflection:
      'Warum kann dieselbe Aktion in einem anderen Team oder gegen einen anderen Gegner einen anderen xT-Wert haben, obwohl die Zellen gleich bleiben?',
    rubric: [
      'Erkläre, dass xT ein Durchschnitt über Situationen ist.',
      'Nenne Zellgröße, Trainingsdaten und Aktionsdefinition als Annahmen.',
    ],
    setup: XT_SETUP,
    sources: [XT_DOCS],
  },
  {
    ...common,
    id: 'adv-xt-aktionen',
    title: 'Aktionen mit xT bewerten',
    minutes: 45,
    concept: 'Aktionswerte aggregieren und Spieler vergleichen',
    objective:
      'Mehrere Aktionen eines Spielers zu einem xT-Beitrag summieren und daraus eine Rangfolge bilden.',
    prerequisites: ['adv-xt-lookup'],
    explanation: [
      'Summiere die xT-Gewinne und -Verluste der Aktionen eines Spielers, um seinen gesamten Beitrag in diesen Daten zu erhalten. Ein Rückpass kann einen negativen Wert haben, ein langer Ball nach vorn einen positiven. Ob die Entscheidung in der Szene gut war, lässt sich daran allein nicht erkennen. Dafür zählt auch, aus welcher Ausgangslage der Spieler handelt.',
      'Die Aggregation braucht eine klare Aktionsauswahl. Hier sind es die vorbereiteten Aktionen mit Start- und Endkoordinaten. In einer echten Analyse müsstest du entscheiden, ob Pässe, Dribblings, Schüsse oder Ballverluste alle gleich behandelt werden. Unterschiedliche Aktionsarten haben unterschiedliche Skalen und Risiken.',
      'Viele Aktionen in guten Zonen können zu einer hohen xT-Summe führen. Für einen Vergleich musst du daher auch Aktionszahl und Spielzeit kennen. Im Capstone ergänzt du die Rate pro 90 Minuten und eine Unsicherheitsgrenze. Bis dahin beschreibt die Rangfolge die aufsummierten Beiträge der ausgewählten Aktionen.',
    ],
    example: `total = 0
for action in actions:
    total += action_value(action["x1"], action["y1"], action["x2"], action["y2"])
print(round(total, 3))`,
    task: 'Nutze xt und action_value aus der vorherigen Lektion (du darfst sie neu definieren). Berechne für jede Aktion den xT-Gewinn und summiere ihn pro player. Speichere totals als Liste [player, gerundeter Gesamtwert auf 3 Stellen], sortiert absteigend nach Wert und bei Gleichstand aufsteigend nach player.',
    starter: `def xt(x, y):
    return 0

def action_value(x1, y1, x2, y2):
    return 0

totals = []
print(totals)`,
    solution: `def xt(x, y):
    col = min(int(x / 10), 11)
    row = min(int(y / 10), 7)
    return grid[row][col]

def action_value(x1, y1, x2, y2):
    return round(xt(x2, y2) - xt(x1, y1), 3)

sums = {}
for action in actions:
    gain = action_value(action["x1"], action["y1"], action["x2"], action["y2"])
    sums[action["player"]] = sums.get(action["player"], 0) + gain
totals = [[player, round(value, 3)] for player, value in sorted(sums.items(), key=lambda item: (-item[1], item[0]))]
print(totals)`,
    hints: [
      'Summiere pro Spieler, nicht pro Aktion. Ein Dictionary mit dem Spielernamen als Schlüssel sammelt die Werte.',
      'Lies das Beispiel und überlege, warum negative Aktionswerte erlaubt sind. Prüfe, ob du nach der Summe rundest.',
      'Die Aggregation:\n\nsums[action["player"]] = sums.get(action["player"], 0) + gain\n\nSortiere mit key=lambda item: (-item[1], item[0]).',
    ],
    checks: [
      check('Ria führt die xT-Summe an', 'totals[0]', ['Ria', 0.22]),
      check('Vollständige Rangfolge', 'totals', [
        ['Ria', 0.22],
        ['Ada', 0.17],
        ['Nora', 0.12],
        ['Sina', 0.1],
        ['Mira', 0.06],
      ]),
      check('Fünf Spieler mit Aktionen', 'len(totals)', 5),
    ],
    reflection:
      'Wie kann die Zahl der Aktionen eine xT-Rangfolge beeinflussen, wenn du nur die Summen vergleichst?',
    rubric: [
      'Nenne den Unterschied zwischen Summe und Rate.',
      'Erkläre, warum negative Aktionswerte fachlich sinnvoll sein können.',
    ],
    setup: `${XT_SETUP}

actions = [
    {"player": "Ada", "x1": 60, "y1": 40, "x2": 90, "y2": 40},
    {"player": "Ada", "x1": 90, "y1": 40, "x2": 108, "y2": 40},
    {"player": "Mira", "x1": 100, "y1": 30, "x2": 110, "y2": 40},
    {"player": "Mira", "x1": 110, "y1": 40, "x2": 115, "y2": 40},
    {"player": "Ria", "x1": 50, "y1": 60, "x2": 80, "y2": 20},
    {"player": "Ria", "x1": 80, "y1": 20, "x2": 105, "y2": 45},
    {"player": "Nora", "x1": 70, "y1": 50, "x2": 95, "y2": 35},
    {"player": "Sina", "x1": 40, "y1": 40, "x2": 60, "y2": 40},
    {"player": "Sina", "x1": 100, "y1": 50, "x2": 108, "y2": 44},
]`,
    sources: [XT_DOCS, STATSBOMB_DOCS],
  },
  {
    ...common,
    id: 'adv-transitionen',
    title: 'Transitionen und ihr erwarteter Wert',
    minutes: 40,
    concept: 'Transitionen: Raumgewinn, Schussquote und Stichprobe',
    objective:
      'Umschaltaktionen pro Team auswerten und Raumgewinn, Schussquote und Torquote getrennt berichten.',
    prerequisites: ['adv-xt-aktionen'],
    explanation: [
      'Eine Transition ist der Übergang von Ballgewinn oder Umschalten in eine Angriffsaktion. Hier ist jede Zeile eine abgeschlossene Umschaltaktion mit Start-xT, End-xT, Schuss und Tor. Der Raumgewinn ist end_xt - start_xt; Schuss und Tor sind getrennte binäre Ereignisse.',
      'Bei wenigen Transitionen verändern einzelne Ereignisse den Mittelwert und die Quoten stark. Vier Aktionen mit 25 Prozent Torquote bedeuten genau ein Tor. Für eine stabile Quote reicht das nicht. Berichte deshalb die Anzahl der Aktionen, den mittleren Raumgewinn und die beiden Anteile getrennt. Ein einzelner Wert namens "Transition Quality" würde diese Unterschiede verdecken.',
      'Lege vor der Auswertung fest, welche Transitionen du zählst. Nur Aktionen mit anschließendem Schuss oder auch Ballverluste während des Umschaltens? Diese Auswahl beeinflusst Mittelwerte und Quoten. Die vier Aktionen pro Team dienen hier dazu, den Rechenweg zu üben; für einen Teamvergleich reichen sie nicht.',
      DATA_NOTE,
    ],
    example: `gain = possession["end_xt"] - possession["start_xt"]
print(round(gain, 3))`,
    task: 'Berechne pro team: n (Anzahl Transitionen), mean_gain (Mittelwert von end_xt - start_xt, gerundet auf 3), shot_rate (Anteil mit shot == 1, gerundet auf 3) und goal_rate (Anteil mit goal == 1, gerundet auf 3). Speichere transitions_summary als Liste [team, n, mean_gain, shot_rate, goal_rate], alphabetisch nach team. Speichere best_gain als Team mit dem höchsten mean_gain.',
    starter: `summary = {}
for possession in transitions:
    team = possession["team"]
    # Aggregation fehlt.
    pass
transitions_summary = []
best_gain = ""`,
    solution: `summary = {}
for possession in transitions:
    team = possession["team"]
    row = summary.setdefault(team, {"n": 0, "gain": 0.0, "shots": 0, "goals": 0})
    row["n"] += 1
    row["gain"] += possession["end_xt"] - possession["start_xt"]
    row["shots"] += possession["shot"]
    row["goals"] += possession["goal"]

transitions_summary = []
for team in sorted(summary):
    row = summary[team]
    transitions_summary.append([
        team,
        row["n"],
        round(row["gain"] / row["n"], 3),
        round(row["shots"] / row["n"], 3),
        round(row["goals"] / row["n"], 3),
    ])
best_gain = max(transitions_summary, key=lambda row: row[2])[0]
print(transitions_summary, best_gain)`,
    hints: [
      'Sammle pro Team vier Summen: Anzahl, Raumgewinn, Schüsse und Tore. Die Raten entstehen erst am Ende.',
      'Lies das Beispiel und überlege, warum Schussquote und Torquote getrennt bleiben. Prüfe, ob du durch n teilst.',
      'Die Struktur:\n\nrow = summary.setdefault(team, {"n": 0, "gain": 0.0, "shots": 0, "goals": 0})\nrow["n"] += 1\nrow["gain"] += possession["end_xt"] - possession["start_xt"]',
    ],
    checks: [
      check('Beide Teams vollständig', 'transitions_summary', [
        ['Nord', 4, 0.135, 0.75, 0.25],
        ['Süd', 4, 0.098, 0.25, 0.25],
      ]),
      check('Höchster mittlerer Raumgewinn', 'best_gain', 'Nord'),
    ],
    reflection:
      'Wie stark kann ein einzelnes weiteres Tor die Torquote nach vier Transitionen verändern, und was bedeutet das für den Teamvergleich?',
    rubric: [
      'Nenne die kleine Zahl von Transitionen und das einzelne Tor als Ursache.',
      'Erkläre, warum die Auswahl der Transitionen das Ergebnis verändert.',
    ],
    setup: `transitions = [
    {"team": "Nord", "start_xt": 0.05, "end_xt": 0.22, "shot": 1, "goal": 0},
    {"team": "Nord", "start_xt": 0.08, "end_xt": 0.30, "shot": 1, "goal": 1},
    {"team": "Nord", "start_xt": 0.03, "end_xt": 0.10, "shot": 0, "goal": 0},
    {"team": "Nord", "start_xt": 0.10, "end_xt": 0.18, "shot": 1, "goal": 0},
    {"team": "Süd", "start_xt": 0.06, "end_xt": 0.12, "shot": 0, "goal": 0},
    {"team": "Süd", "start_xt": 0.04, "end_xt": 0.25, "shot": 1, "goal": 1},
    {"team": "Süd", "start_xt": 0.09, "end_xt": 0.15, "shot": 0, "goal": 0},
    {"team": "Süd", "start_xt": 0.02, "end_xt": 0.08, "shot": 0, "goal": 0},
]`,
    sources: [XT_DOCS],
  },
  {
    ...common,
    id: 'adv-tracking',
    title: 'Nächste Verteidiger aus Trackingdaten',
    minutes: 45,
    concept: 'Vektorisierte Distanzen und Drucknäherung',
    objective: 'Aus Koordinaten die nächsten Verteidiger und einen einfachen Druckwert berechnen.',
    prerequisites: ['adv-transitionen'],
    explanation: [
      'Trackingdaten erfassen Spielerpositionen zu vielen Zeitpunkten. Als einfache Näherung für Druck auf den Angreifer verwenden wir den Abstand zum nächsten Verteidiger. NumPy berechnet die Abstände zu allen Verteidigern gleichzeitig, also vektorisiert: Koordinatendifferenzen bilden, ihre Quadrate summieren und die Wurzel ziehen.',
      'Die Einheit muss bekannt sein. Hier sind die Koordinaten in Metern auf einem 105 mal 68 Meter großen Feld angegeben. Ein Abstand von 4,72 Metern ist plausibel; dieselbe Zahl in normierten Feldeinheiten wäre etwas anderes. Die Drucknäherung exp(-d / 5) ist eine glatte Funktion zwischen 0 und 1, kein physikalisches Modell.',
      'Der Abstand erfasst weder Geschwindigkeit und Körperausrichtung noch Torwartposition und Ball. Ein Verteidiger in 5 Metern Entfernung, der in die falsche Richtung läuft, kann weniger Druck ausüben als ein näherer, der auf den Angreifer zuläuft. Prüfe diese Bewegung im Video, bevor du den Druckwert interpretierst. Für eine vollständige Verteidigungsanalyse reicht die Kennzahl nicht.',
    ],
    example: `import numpy as np

diff = defenders - attacker
distances = np.sqrt((diff ** 2).sum(axis=1))
print(np.sort(distances)[:2])`,
    task: 'Berechne mit NumPy die Distanzen zwischen attacker und jedem Verteidiger. Speichere press als [nearest, second_nearest, pressure, nearest_index]: die zwei kleinsten Distanzen auf 2 Stellen gerundet, pressure = exp(-nearest / 5) auf 2 Stellen gerundet und den Index des nächsten Verteidigers in der ursprünglichen Liste als ganze Zahl.',
    starter: `import numpy as np

diff = defenders - attacker
distances = np.sqrt((diff ** 2).sum(axis=1))
press = []
print(distances)`,
    solution: `import numpy as np

diff = defenders - attacker
distances = np.sqrt((diff ** 2).sum(axis=1))
order = np.argsort(distances)
nearest = float(distances[order[0]])
second = float(distances[order[1]])
pressure = float(np.exp(-nearest / 5))
press = [round(nearest, 2), round(second, 2), round(pressure, 2), int(order[0])]
print(press)`,
    hints: [
      'Du brauchst keine Schleife: Eine Differenzmatrix und sum(axis=1) reichen. Danach sortierst du die Indizes, nicht nur die Werte.',
      'Lies die NumPy-Dokumentation zu argsort und exp. Achte darauf, den Index des nächsten Verteidigers zu speichern.',
      'Der Kern:\n\norder = np.argsort(distances)\nnearest = float(distances[order[0]])\npressure = float(np.exp(-nearest / 5))',
    ],
    checks: [
      check('Nächste zwei Abstände und Druck', 'press', [4.72, 6.02, 0.39, 0]),
      check('Druck liegt zwischen 0 und 1', '0 < press[2] <= 1', true),
      check('Vier Werte in der Ausgabe', 'len(press)', 4),
    ],
    reflection:
      'Warum kann ein Verteidiger mit größerem Abstand im Video mehr Druck ausüben als der rechnerisch nächste?',
    rubric: [
      'Nenne Geschwindigkeit, Laufrichtung oder Körperstellung.',
      'Erkläre, warum die Druckformel nur eine Näherung ist.',
    ],
    setup: `import numpy as np

attacker = np.array([52.5, 34.0])
defenders = np.array([
    [55.0, 30.0],
    [58.0, 38.0],
    [48.0, 30.0],
    [60.0, 34.0],
    [70.0, 20.0],
])`,
    packages: ['numpy'],
    variants: [
      {
        label: 'Andere Verteidigerpositionen',
        setup: `import numpy as np

attacker = np.array([60.0, 34.0])
defenders = np.array([
    [62.0, 30.0],
    [64.0, 38.0],
    [58.0, 30.0],
    [70.0, 34.0],
    [50.0, 20.0],
])`,
        checks: [check('Neue Abstände und neuer Index', 'press', [4.47, 4.47, 0.41, 0])],
      },
    ],
    sources: [
      FOT_DOCS,
      {
        title: 'NumPy: argsort',
        url: 'https://numpy.org/doc/stable/reference/generated/numpy.argsort.html',
      },
    ],
  },
  {
    ...common,
    id: 'adv-pitch-control',
    title: 'Raumkontrolle grob annähern',
    minutes: 50,
    concept: 'Einflussfunktionen und Kontrollanteile',
    objective:
      'Eine stark vereinfachte Raumkontrolle mit exponentiell abfallendem Distanzeinfluss berechnen und ihre Grenzen klar benennen.',
    prerequisites: ['adv-tracking'],
    explanation: [
      'Raumkontrolle fragt, welches Team an einem Punkt auf dem Feld wahrscheinlich zuerst den Ball erreichen kann. Echte Modelle berücksichtigen Geschwindigkeit, Reaktionszeit, Ballposition und Bewegungsrichtung. Unsere Näherung nutzt nur Abstände: Ein Spieler übt Einfluss exp(-d / tau) aus, wobei tau die Reichweite steuert. Wir bilden den Mittelwert des Einflusses pro Team, nicht die Summe. Sonst würde allein die Zahl der erfassten Spieler den Kontrollanteil bestimmen: Bei drei Angreifern und fünf Verteidigern wäre die Summe systematisch verteidigerlastig.',
      'Berechne an jedem Punkt den mittleren Einfluss der Angreifer und den der Verteidiger. Ihr Verhältnis Mittelwert_Angreifer / (Mittelwert_Angreifer + Mittelwert_Verteidiger) ergibt den Kontrollanteil. Bei 0,7 entfallen in dieser Näherung 70 Prozent des Einflusses auf die Angreifer. Daraus lassen sich weder 70 Prozent Ballbesitz noch 70 Prozent Siegchance ableiten.',
      'Prüfe, wie sich der Kontrollanteil bei anderem tau verändert. Kleine Werte begrenzen den Einfluss auf die unmittelbare Umgebung, große verteilen ihn über größere Räume. Durch die Mittelwertbildung erhalten beide Teams pro erfasstem Spieler dasselbe Gewicht. Das vereinfacht die Situation: In einem Spiel kann eine größere Zahl von Spielern in Ballnähe tatsächlich mehr Raum kontrollieren. Die vier Punkte und zwei Teams ergeben hier ein Rechenbeispiel, dessen Raumkontrolle nicht an realen Szenen geprüft ist.',
    ],
    example: `d = np.sqrt(((points[:, None, :] - players[None, :, :]) ** 2).sum(axis=2))
influence = np.exp(-d / tau).mean(axis=1)`,
    task: 'Schreibe influence(points, players), die für jeden Punkt den mittleren Einfluss aller Spieler mit exp(-distance / tau) berechnet (Mittel über die Spielerachse, nicht Summe). Berechne attacker_influence für mates und defender_influence für defenders. Speichere shares als Liste der Kontrollanteile attacker / (attacker + defender), gerundet auf 3 Stellen, und mean_share als Mittelwert, gerundet auf 3 Stellen. Nutze tau aus den Daten.',
    starter: `import numpy as np

def influence(points, players):
    return np.zeros(len(points))

attacker_influence = influence(points, mates)
defender_influence = influence(points, defenders)
shares = []
mean_share = 0
print(shares, mean_share)`,
    solution: `import numpy as np

def influence(points, players):
    d = np.sqrt(((points[:, None, :] - players[None, :, :]) ** 2).sum(axis=2))
    return np.exp(-d / tau).mean(axis=1)

attacker_influence = influence(points, mates)
defender_influence = influence(points, defenders)
share = attacker_influence / (attacker_influence + defender_influence)
shares = [round(float(value), 3) for value in share]
mean_share = round(float(share.mean()), 3)
print(shares, mean_share)`,
    hints: [
      'Die Broadcasting-Form erzeugt für jeden Punkt und jeden Spieler einen Abstand. Summiere nicht über die Spieler, sondern bilde den Mittelwert, damit die Teamgröße den Anteil nicht dominiert.',
      'Lies die NumPy-Dokumentation zu Broadcasting und mean(axis=...). Überlege, warum tau die Reichweite der Einflussfunktion steuert.',
      'Der mittlere Einfluss:\n\nd = np.sqrt(((points[:, None, :] - players[None, :, :]) ** 2).sum(axis=2))\nreturn np.exp(-d / tau).mean(axis=1)',
    ],
    checks: [
      check('Kontrollanteile an vier Punkten', 'shares', [0.263, 0.328, 0.446, 0.805]),
      check('Mittlerer Kontrollanteil', 'mean_share', 0.46),
      check(
        'Alle Anteile liegen zwischen 0 und 1',
        'bool(all(0 <= value <= 1 for value in shares))',
        true,
      ),
      check(
        'Mittlerer Einfluss gleicht die Kopfzahl aus',
        'bool(np.allclose(influence(sanity_point, sanity_mates), influence(sanity_point, sanity_defenders)))',
        true,
      ),
      check(
        'Fünf gegen fünf mit gleicher Nähe ergibt 0.5',
        'round(float((influence(sanity_point, sanity_mates_5v5) / (influence(sanity_point, sanity_mates_5v5) + influence(sanity_point, sanity_defenders_5v5)))[0]), 3)',
        0.5,
      ),
    ],
    reflection:
      'Welche Information müsste ein echtes Raumkontrollmodell zusätzlich zu den Positionen berücksichtigen, und warum ist unsere Näherung dafür blind?',
    rubric: [
      'Nenne Geschwindigkeit, Reaktionszeit oder Ballposition.',
      'Erkläre, dass der Kontrollanteil kein Ballbesitz und keine Siegwahrscheinlichkeit ist.',
    ],
    setup: `import numpy as np

points = np.array([[60.0, 34.0], [65.0, 34.0], [70.0, 34.0], [75.0, 40.0]])
mates = np.array([[52.5, 34.0], [60.0, 20.0], [75.0, 45.0]])
defenders = np.array([[55.0, 30.0], [58.0, 38.0], [48.0, 30.0], [60.0, 34.0], [70.0, 20.0]])
tau = 6.0
sanity_point = np.array([[60.0, 34.0]])
sanity_mates = np.array([[60.0, 30.0]])
sanity_defenders = np.array([[56.0, 34.0], [64.0, 34.0], [60.0, 30.0], [60.0, 38.0]])
angles_mates = np.deg2rad(np.arange(18.0, 360.0, 72.0))
angles_defenders = np.deg2rad(np.arange(54.0, 360.0, 72.0))
sanity_mates_5v5 = np.stack(
    [60.0 + 6.0 * np.cos(angles_mates), 34.0 + 6.0 * np.sin(angles_mates)], axis=1
)
sanity_defenders_5v5 = np.stack(
    [60.0 + 6.0 * np.cos(angles_defenders), 34.0 + 6.0 * np.sin(angles_defenders)], axis=1
)`,
    packages: ['numpy'],
    variants: [
      {
        label: 'Größere Reichweite',
        setup: `import numpy as np

points = np.array([[60.0, 34.0], [65.0, 34.0], [70.0, 34.0], [75.0, 40.0]])
mates = np.array([[52.5, 34.0], [60.0, 20.0], [75.0, 45.0]])
defenders = np.array([[55.0, 30.0], [58.0, 38.0], [48.0, 30.0], [60.0, 34.0], [70.0, 20.0]])
tau = 8.0`,
        checks: [
          check('Glattere Kontrollanteile', 'shares', [0.321, 0.378, 0.462, 0.718]),
          check('Neuer Mittelwert', 'mean_share', 0.47),
        ],
      },
      {
        label: 'Ein Angreifer gegen vier gleich nahe Verteidiger',
        setup: `import numpy as np

points = np.array([[60.0, 34.0]])
mates = np.array([[60.0, 30.0]])
defenders = np.array([[56.0, 34.0], [64.0, 34.0], [60.0, 30.0], [60.0, 38.0]])
tau = 6.0`,
        checks: [
          check('Gleiche mittlere Nähe ergibt 0.5', 'shares', [0.5]),
          check('Auch der Mittelwert bleibt bei 0.5', 'mean_share', 0.5),
        ],
      },
    ],
    sources: [FOT_DOCS],
  },
  {
    ...common,
    id: 'adv-pipeline',
    title: 'Eine kleine Pipeline mit Prüfungen',
    minutes: 50,
    concept: 'Datenvertrag, Validierung und reproduzierbarer Report',
    objective:
      'Eine Auswertungsfunktion bauen, die Pflichtspalten und Werte prüft und bei Verstößen mit einer Fehlermeldung abbricht.',
    prerequisites: ['adv-pitch-control'],
    explanation: [
      'Eine Pipeline ist eine feste Reihenfolge von Prüfungen und Berechnungen. Der Datenvertrag beschreibt, welche Spalten vorhanden sein müssen, welche Werte erlaubt sind und was eine Zeile bedeutet. Ohne diesen Vertrag produziert eine Funktion bei fehlerhaften Daten still falsche Ergebnisse.',
      'build_report prüft die Pflichtspalten, die Eindeutigkeit von player_id und minutes > 0. Bei einem Verstoß löst die Funktion einen ValueError aus. fillna oder drop_duplicates würden stattdessen Werte ergänzen oder Zeilen entfernen, ohne die Ursache zu klären. In der früheren Bereinigungsübung war das ausdrücklich vorgegeben. Hier soll die Auswertung abbrechen, damit du den fehlerhaften Eingang prüfst.',
      'Die Funktion soll bei gleicher Eingabe dieselbe Ausgabe liefern. Dafür nutzt sie keine versteckte globale Variable, verändert den Eingabe-DataFrame nicht und arbeitet auf einer Kopie. Ein zusätzlicher Sortierschlüssel entscheidet Gleichstände eindeutig. Der Report besteht hier aus Ergebniszeilen. Eine spätere Darstellung, etwa als PDF, muss diese geprüften Zahlen übernehmen.',
    ],
    example: `def check(df):
    if "minutes" not in df.columns:
        raise ValueError("minutes fehlt")
    if (df["minutes"] <= 0).any():
        raise ValueError("minutes muss positiv sein")`,
    task: 'Schreibe build_report(df). Prüfe zuerst, ob player_id, name, minutes und key_passes vorhanden sind; fehlt eine Spalte, raise ValueError. Prüfe dann, ob player_id eindeutig ist und ob alle minutes > 0 sind; sonst raise ValueError. Berechne in einer Kopie kp90 = key_passes / minutes * 90. Sortiere absteigend nach kp90 und bei Gleichstand aufsteigend nach name. Gib eine Liste [name, gerundete kp90 auf 2 Stellen] zurück. Der Eingabe-DataFrame darf nicht verändert werden.',
    starter: `def build_report(df):
    # Prüfungen und Berechnung fehlen.
    return []

print(build_report(valid_df))`,
    solution: `def build_report(df):
    required = {"player_id", "name", "minutes", "key_passes"}
    if not required.issubset(df.columns):
        raise ValueError("Benötigte Spalten fehlen")
    if df["player_id"].duplicated().any():
        raise ValueError("player_id ist nicht eindeutig")
    if (df["minutes"] <= 0).any():
        raise ValueError("minutes muss positiv sein")
    out = df.copy()
    out["kp90"] = out["key_passes"] / out["minutes"] * 90
    out = out.sort_values(["kp90", "name"], ascending=[False, True])
    return [[row["name"], round(float(row["kp90"]), 2)] for _, row in out.iterrows()]

print(build_report(valid_df))`,
    hints: [
      'Prüfe zuerst die Spalten, dann die Werte. Ein fehlendes Pflichtfeld ist ein anderer Fehler als eine ungültige Minute.',
      'Lies die pandas-Dokumentation zu duplicated und copy. Überlege, warum eine Kopie vor der neuen Spalte nötig ist.',
      'Die Prüfungen:\n\nif not required.issubset(df.columns):\n    raise ValueError("Benötigte Spalten fehlen")\nif df["player_id"].duplicated().any():\n    raise ValueError("player_id ist nicht eindeutig")',
    ],
    checks: [
      check('Report aus gültigen Daten', 'build_report(valid_df)', [
        ['Ria', 2.03],
        ['Ada', 1.8],
        ['Lina', 1.41],
        ['Nora', 1.4],
        ['Mira', 1.0],
      ]),
      check('Nullminuten werden abgelehnt', 'raises(lambda: build_report(bad_minutes))', true),
      check('Doppelte player_id wird abgelehnt', 'raises(lambda: build_report(bad_dupes))', true),
      check('Fehlende Spalte wird abgelehnt', 'raises(lambda: build_report(missing_col))', true),
      check('Eingabe bleibt unverändert', '"kp90" not in valid_df.columns', true),
      check('Eingabezeilen bleiben erhalten', 'len(valid_df)', 5),
    ],
    reflection:
      'Welche fachliche Entscheidung müsstest du bei doppelten IDs treffen, und warum sollte build_report vorher mit einem Fehler abbrechen?',
    rubric: [
      'Erkläre den Datenvertrag und die drei Prüfungen.',
      'Nenne einen Fall, in dem automatisches Bereinigen eine fachliche Entscheidung verdeckt.',
    ],
    setup: `import pandas as pd

valid_df = pd.DataFrame({
    "player_id": [1, 2, 3, 4, 5],
    "name": ["Ada", "Mira", "Nora", "Ria", "Lina"],
    "minutes": [900, 810, 450, 620, 700],
    "key_passes": [18, 9, 7, 14, 11],
})
bad_minutes = pd.DataFrame({
    "player_id": [9], "name": ["Test"], "minutes": [0], "key_passes": [1],
})
bad_dupes = pd.DataFrame({
    "player_id": [1, 1], "name": ["Ada", "Ada"], "minutes": [900, 900], "key_passes": [18, 18],
})
missing_col = pd.DataFrame({
    "player_id": [1], "name": ["Ada"], "minutes": [900],
})

def raises(fn):
    try:
        fn()
        return False
    except (ValueError, KeyError, AssertionError):
        return True`,
    packages: ['pandas'],
    sources: [
      PANDAS_DOCS,
      {
        title: 'Python: Fehler und Ausnahmen',
        url: 'https://docs.python.org/3/tutorial/errors.html',
      },
    ],
  },
  {
    ...common,
    id: 'adv-capstone',
    title: 'Capstone: eine begründete xT-Shortlist',
    minutes: 60,
    concept: 'Capstone: xT, Minuten, Unsicherheit und Grenzen',
    objective:
      'Eine kleine Scouting-Frage Ende-zu-Ende beantworten und die Shortlist mit einer Unsicherheitsgrenze und Limitationen versehen.',
    prerequisites: ['adv-pipeline'],
    explanation: [
      'Im Capstone, der abschließenden Aufgabe, schlägst du Werte im xT-Raster nach, summierst sie pro Spieler und verbindest sie mit den Einsatzminuten. Anschließend berechnest du die Rate pro 90 und eine konservative untere Grenze. Halte für jeden Schritt fest, welche Annahme du dabei verwendest, damit sich die Shortlist im Bericht nachvollziehen lässt.',
      'Für die untere Grenze verwenden wir eine Shrinkage-Heuristik: lower = per90 * minutes / (minutes + 450). Sie reduziert den Wert bei wenig Spielzeit stärker. Die 450 Minuten bestimmen als Prior die Stärke dieser Anpassung; sie sind eine gesetzte Annahme. Die Grenze ist weder ein Konfidenzintervall noch die Poisson-Grenze aus dem Scouting-Kurs.',
      'Nenne im Bericht die konkreten Grenzen der Shortlist: xT beruht auf Durchschnitten, die Aktionen sind ausgewählt, die Minuten saisonal erfasst und die Gegner nicht adjustiert. Zudem sind die Daten fiktiv. Daraus ergibt sich als nächster Schritt die Videosichtung. Eine Verpflichtung lässt sich mit dieser Liste nicht begründen.',
      DATA_NOTE,
    ],
    example: `merged["xt90"] = merged["xt_total"] / merged["minutes"] * 90
merged["lower"] = (merged["xt90"] * merged["minutes"] / (merged["minutes"] + 450)).clip(lower=0)`,
    task: 'Berechne aus grid und actions die xT-Summe pro Spieler. Verbinde sie mit players (name, minutes), behalte nur Spieler mit mindestens 450 Minuten und fülle fehlende xT-Werte mit 0. Berechne xt90 = xt_total / minutes * 90 und lower = xt90 * minutes / (minutes + 450), gekappt bei 0. Behalte Spieler mit lower >= 0.01, sortiere absteigend nach xt90 und bei Gleichstand aufsteigend nach name. Speichere shortlist als Top-Liste [name, minutes als int, xt90 auf 3 Stellen, lower auf 3 Stellen]. Speichere limitations als Liste mit mindestens drei konkreten deutschen Sätzen, die jeweils länger als 20 Zeichen sind.',
    starter: `import pandas as pd

def xt(x, y):
    return 0

totals = {}
shortlist = []
limitations = []`,
    solution: `import pandas as pd

def xt(x, y):
    col = min(int(x / 10), 11)
    row = min(int(y / 10), 7)
    return grid[row][col]

sums = {}
for action in actions:
    gain = xt(action["x2"], action["y2"]) - xt(action["x1"], action["y1"])
    sums[action["player"]] = sums.get(action["player"], 0) + gain

lookup = pd.DataFrame([{"name": name, "xt_total": value} for name, value in sums.items()])
base = players[players["minutes"] >= 450][["name", "minutes"]].copy()
merged = base.merge(lookup, on="name", how="left")
merged["xt_total"] = merged["xt_total"].fillna(0)
merged["xt90"] = merged["xt_total"] / merged["minutes"] * 90
merged["lower"] = (merged["xt90"] * merged["minutes"] / (merged["minutes"] + 450)).clip(lower=0)
short = merged[merged["lower"] >= 0.01].sort_values(["xt90", "name"], ascending=[False, True])
shortlist = [[row["name"], int(row["minutes"]), round(float(row["xt90"]), 3), round(float(row["lower"]), 3)] for _, row in short.iterrows()]
limitations = [
    "Das xT-Raster ist ein grober historischer Durchschnitt und keine Einzelaktionsprognose.",
    "Die ausgewählten Aktionen und die Zellgröße verändern den Wert der Shortlist.",
    "Die Minuten sind saisonal und die Gegnerstärke ist nicht adjustiert.",
]`,
    hints: [
      'Arbeite in Stufen: erst xT pro Spieler, dann Join mit Minuten, dann Rate und Grenze. Prüfe nach jedem Schritt die Zeilenzahl.',
      'Lies die pandas-Dokumentation zu merge und fillna. Überlege, warum ein Spieler ohne Aktionen nicht aus der Basis verschwinden soll.',
      'Die Grenze:\n\nmerged["xt90"] = merged["xt_total"] / merged["minutes"] * 90\nmerged["lower"] = (merged["xt90"] * merged["minutes"] / (merged["minutes"] + 450)).clip(lower=0)',
    ],
    checks: [
      check('Drei Spieler über der konservativen Grenze', 'len(shortlist)', 3),
      check('Shortlist nach xT pro 90', 'shortlist', [
        ['Ria', 620, 0.032, 0.019],
        ['Nora', 450, 0.024, 0.012],
        ['Ada', 900, 0.017, 0.011],
      ]),
      check('Limitationen sind konkret', 'len(limitations) >= 3', true),
      check(
        'Jede Limitation hat Substanz',
        'bool(all(len(text) > 20 for text in limitations))',
        true,
      ),
    ],
    reflection:
      'Schreibe ein kurzes Fazit: Welche zwei Prüfungen würdest du vor einer Empfehlung an den Verein durchführen, und welche Limitation würdest du zuerst kommunizieren?',
    rubric: [
      'Nenne zwei konkrete Prüfungen, etwa Video, Gegneradjustierung oder Live-Sichtung.',
      'Kommuniziere mindestens eine Limitation, ohne die Shortlist als Transferentscheidung zu verkaufen.',
      'Verbinde die Zahlen mit der definierten Rolle.',
    ],
    setup: `import pandas as pd

players = pd.DataFrame({
    "name": ["Ada", "Mira", "Nora", "Pia", "Uta", "Ria", "Tine", "Jona", "Lina"],
    "minutes": [900, 810, 450, 990, 800, 620, 1080, 449, 700],
})

grid = [
  [0.01, 0.01, 0.02, 0.02, 0.03, 0.04, 0.05, 0.06, 0.08, 0.10, 0.12, 0.15],
  [0.01, 0.02, 0.02, 0.03, 0.04, 0.05, 0.06, 0.08, 0.10, 0.13, 0.16, 0.20],
  [0.01, 0.02, 0.03, 0.04, 0.05, 0.06, 0.08, 0.10, 0.13, 0.17, 0.21, 0.26],
  [0.02, 0.03, 0.04, 0.05, 0.06, 0.08, 0.10, 0.13, 0.17, 0.22, 0.27, 0.33],
  [0.02, 0.03, 0.04, 0.05, 0.06, 0.08, 0.10, 0.13, 0.17, 0.22, 0.27, 0.33],
  [0.01, 0.02, 0.03, 0.04, 0.05, 0.06, 0.08, 0.10, 0.13, 0.17, 0.21, 0.26],
  [0.01, 0.02, 0.02, 0.03, 0.04, 0.05, 0.06, 0.08, 0.10, 0.13, 0.16, 0.20],
  [0.01, 0.01, 0.02, 0.02, 0.03, 0.04, 0.05, 0.06, 0.08, 0.10, 0.12, 0.15],
]

actions = [
    {"player": "Ada", "x1": 60, "y1": 40, "x2": 90, "y2": 40},
    {"player": "Ada", "x1": 90, "y1": 40, "x2": 108, "y2": 40},
    {"player": "Mira", "x1": 100, "y1": 30, "x2": 110, "y2": 40},
    {"player": "Mira", "x1": 110, "y1": 40, "x2": 115, "y2": 40},
    {"player": "Ria", "x1": 50, "y1": 60, "x2": 80, "y2": 20},
    {"player": "Ria", "x1": 80, "y1": 20, "x2": 105, "y2": 45},
    {"player": "Nora", "x1": 70, "y1": 50, "x2": 95, "y2": 35},
    {"player": "Sina", "x1": 40, "y1": 40, "x2": 60, "y2": 40},
]`,
    packages: ['pandas'],
    sources: [XT_DOCS, PANDAS_DOCS],
  },
  {
    ...common,
    id: 'adv-review',
    title: 'Wiederholung: xT auf einem neuen Raster',
    minutes: 40,
    concept: 'Wiederholung: Raster nachschlagen und Aktionsgewinne',
    objective: 'Die xT-Logik auf ein kleineres Raster mit anderen Zellgrößen übertragen.',
    prerequisites: ['adv-capstone'],
    reviewOf: 'adv-xt-lookup',
    explanation: [
      'Diese Wiederholung nutzt ein 6 mal 4 großes Raster. Die Zellbreite ist jetzt 20 Feldeinheiten in x und 20 in y. Die Formel bleibt dieselbe, die Grenzen müssen aber an das neue Raster angepasst werden: Spalte = min(int(x / 20), 5), Zeile = min(int(y / 20), 3).',
      'Ein gröberes Raster fasst unter Umständen zwei taktisch unterschiedliche Zonen in derselben Zelle zusammen. Dann bekommt die Aktion einen weniger genau auf ihre Position bezogenen xT-Gewinn. Mit dem Raster ändern sich also die Auflösung und die Werte. Du wählst damit ein anderes Modell, statt einen Fehler des ersten Rasters zu korrigieren.',
      'Leite die Indizes aus Zellgröße und Rastergrenzen dieser Aufgabe ab. Die Funktion für 12 mal 8 Zellen passt hier nicht unverändert. Prüfe insbesondere den Randpunkt (119, 79) und eine Aktion, die eine Zellgrenze überschreitet. So erkennst du, ob die Zuordnung auch außerhalb der ersten Zelle stimmt.',
    ],
    example: `col = min(int(70 / 20), 5)  # 3
row = min(int(30 / 20), 3)  # 1
print(grid[row][col])`,
    task: 'Schreibe xt_alt(x, y) für das neue Raster: Spalte = min(int(x / 20), 5), Zeile = min(int(y / 20), 3). Schreibe action_gain(x1, y1, x2, y2) = round(xt_alt(x2, y2) - xt_alt(x1, y1), 3). Speichere gain_1 = action_gain(10, 10, 70, 30) und gain_2 = action_gain(40, 60, 100, 50).',
    starter: `def xt_alt(x, y):
    return 0

def action_gain(x1, y1, x2, y2):
    return 0

gain_1 = 0
gain_2 = 0`,
    solution: `def xt_alt(x, y):
    col = min(int(x / 20), 5)
    row = min(int(y / 20), 3)
    return grid[row][col]

def action_gain(x1, y1, x2, y2):
    return round(xt_alt(x2, y2) - xt_alt(x1, y1), 3)

gain_1 = action_gain(10, 10, 70, 30)
gain_2 = action_gain(40, 60, 100, 50)`,
    hints: [
      'Die Zellgröße ist 20, nicht 10. Die maximalen Indizes sind 5 und 3.',
      'Lies das Beispiel und prüfe die Zelle für (119, 79). Sie muss in der letzten Spalte und letzten Zeile landen.',
      'Die Indizierung:\n\ncol = min(int(x / 20), 5)\nrow = min(int(y / 20), 3)',
    ],
    checks: [
      check('Zelle oben links', 'xt_alt(10, 10)', 0.02),
      check('Zelle im Mittelfeld', 'xt_alt(70, 30)', 0.09),
      check('Letzte Zelle am Rand', 'xt_alt(119, 79)', 0.15),
      check('Aktion über drei Zellen', 'gain_1', 0.07),
      check('Aktion in die letzte Spalte', 'gain_2', 0.15),
    ],
    reflection:
      'Warum kann ein gröberes xT-Raster eine Shortlist verändern, obwohl die zugrunde liegenden Aktionen gleich bleiben?',
    rubric: [
      'Erkläre den Zusammenhang zwischen Zellgröße und Auflösung.',
      'Nenne eine Folge für die Vergleichbarkeit von Spielern.',
    ],
    setup: `grid = [
  [0.02, 0.03, 0.05, 0.08, 0.12, 0.18],
  [0.03, 0.04, 0.06, 0.09, 0.14, 0.22],
  [0.02, 0.03, 0.05, 0.08, 0.12, 0.19],
  [0.01, 0.02, 0.04, 0.06, 0.10, 0.15],
]`,
    sources: [XT_DOCS],
  },
];
