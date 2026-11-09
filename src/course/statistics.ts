import type { Lesson } from '../types';
import {
  DATA_NOTE,
  MATH_ATAN2_DOCS,
  NUMPY_MEDIAN_DOCS,
  NUMPY_VAR_DOCS,
  SKLEARN_BRIER_DOCS,
  SKLEARN_CALIBRATION_DOCS,
  SKLEARN_LEAKAGE_DOCS,
  SKLEARN_LOGISTIC_DOCS,
  SKLEARN_SPLIT_DOCS,
  check,
} from './fixtures';

const common = { trackId: 'statistics', packages: [] as string[] };

export const statisticsLessons: Lesson[] = [
  {
    ...common,
    id: 'stat-kennzahlen',
    title: 'Mittelwert, Median und Streuung lesen',
    minutes: 35,
    concept: 'Lagemaße und Stichprobenvarianz',
    objective:
      'Mittelwert, Median und Stichprobenvarianz berechnen und den Unterschied bei Ausreißern erklären.',
    prerequisites: ['analyse-review'],
    explanation: [
      'Für den Mittelwert addierst du alle Werte und teilst durch ihre Anzahl. Für den Median sortierst du sie und nimmst den mittleren Wert. Bei gerader Anzahl berechnest du das Mittel der beiden mittleren Werte. Beide Kennzahlen beschreiben typische Tore pro Spiel, reagieren aber unterschiedlich auf einzelne hohe Werte.',
      'Die Varianz misst die mittlere quadratische Abweichung vom Mittelwert. Mit ddof=1 teilst du durch n-1 statt durch n. Das ist die Stichprobenvarianz: Sie schätzt die Streuung in einer größeren Grundgesamtheit und ist bei kleinen Stichproben etwas größer als die Populationsvarianz. Die Wurzel daraus ist die Standardabweichung.',
      'Ein Spiel mit 4 Toren hebt den Mittelwert an und verändert den Median kaum. mean - median kann deshalb auf eine schiefe Verteilung hinweisen. Einen Ausreißer weist die Differenz allein jedoch nicht nach. Auch sie schwankt bei sieben oder zehn Spielen und beschreibt hier nur die fiktive Stichprobe, nicht die zugrunde liegende Torverteilung.',
      DATA_NOTE,
    ],
    example: `import numpy as np

goals = [0, 1, 1, 2, 3]
print(round(float(np.mean(goals)), 2))
print(round(float(np.median(goals)), 2))
print(round(float(np.var(goals, ddof=1)), 2))`,
    task: 'Berechne aus goals den Mittelwert mean, den Median median, die Stichprobenvarianz variance mit ddof=1 und die Differenz outlier_effect = mean - median. Runde alle vier Werte auf drei Nachkommastellen.',
    starter: `import numpy as np

mean = 0
median = 0
variance = 0
outlier_effect = 0
print(mean, median, variance, outlier_effect)`,
    solution: `import numpy as np

mean = round(float(np.mean(goals)), 3)
median = round(float(np.median(goals)), 3)
variance = round(float(np.var(goals, ddof=1)), 3)
outlier_effect = round(mean - median, 3)
print(mean, median, variance, outlier_effect)`,
    hints: [
      'Nutze np.mean, np.median und np.var. Bei np.var gehört ddof=1 zur Stichprobenvarianz.',
      'Lies die NumPy-Dokumentation zu var und ddof. Überlege, warum mean - median bei einem hohen Ausreißer positiv wird.',
      'Die Berechnungen:\n\nmean = round(float(np.mean(goals)), 3)\nvariance = round(float(np.var(goals, ddof=1)), 3)\noutlier_effect = round(mean - median, 3)',
    ],
    checks: [
      check('Mittelwert', 'mean', 1.4),
      check('Median', 'median', 1.0),
      check('Stichprobenvarianz', 'variance', 1.822),
      check('Mittelwert minus Median', 'outlier_effect', 0.4),
    ],
    reflection:
      'Warum kann ein Trainer aus mean - median allein nicht schließen, dass ein einzelnes Spiel die Saison verzerrt hat?',
    rubric: [
      'Erkläre, wie ein einzelner hoher Wert Mittelwert und Median unterschiedlich beeinflusst.',
      'Nenne die kleine Stichprobe als Grenze.',
    ],
    setup: `import numpy as np

goals = [3, 0, 1, 2, 0, 1, 4, 2, 1, 0]`,
    packages: ['numpy'],
    variants: [
      {
        label: 'Vier Spiele mit einem Ausreißer',
        setup: `import numpy as np

goals = [0, 0, 0, 4]`,
        checks: [
          check('Mittelwert der neuen Stichprobe', 'mean', 1.0),
          check('Median der neuen Stichprobe', 'median', 0.0),
          check('Varianz der neuen Stichprobe', 'variance', 4.0),
          check('Abweichung der Lage', 'outlier_effect', 1.0),
        ],
      },
    ],
    sources: [NUMPY_VAR_DOCS, NUMPY_MEDIAN_DOCS],
  },
  {
    ...common,
    id: 'stat-binomial',
    title: 'Wie unsicher ist eine Torquote?',
    minutes: 35,
    concept: 'Anteil, Standardfehler und Intervall',
    objective:
      'Den Standardfehler eines Anteils berechnen und als grobes Unsicherheitsintervall interpretieren.',
    prerequisites: ['stat-kennzahlen'],
    explanation: [
      'Die Torquote ist der Anteil goals / shots. Bei 6 Toren aus 40 Schüssen ergibt sich p = 0,15. Für diese Stichprobe stimmt die Zahl exakt. Die Trefferwahrscheinlichkeit für weitere Schüsse kennst du damit noch nicht; eine neue Stichprobe würde eine andere Quote liefern.',
      'Der Standardfehler eines Anteils ist sqrt(p * (1 - p) / n). Er wird kleiner, wenn n wächst, und ist bei p nahe 0 oder 1 kleiner als in der Mitte. Das Intervall p ± 1,96 * se ist die übliche Normalapproximation für etwa 95 Prozent. Bei kleinen n oder extremen Anteilen ist diese Näherung unzuverlässig.',
      'Berichte im Scouting neben der Quote, aus wie vielen Schüssen sie stammt und wie unsicher die Schätzung ist. 15 Prozent aus 20 Schüssen haben eine andere Unsicherheit als 15 Prozent aus 200 Schüssen. Das hier berechnete Intervall übt diesen Zusammenhang. Es erklärt keine Ursache der Abschlussqualität, denn Gegner, Schussposition und Spielzeit berücksichtigt es nicht.',
    ],
    example: `import math

p = 9 / 60
se = math.sqrt(p * (1 - p) / 60)
print(round(p, 3), round(se, 3))`,
    task: 'Berechne p = goals / shots, se = sqrt(p * (1 - p) / shots), low = p - 1.96 * se und high = p + 1.96 * se. Berechne zusätzlich se_small für dieselbe Quote, aber mit n = 10. Runde p, se, low, high und se_small auf drei Nachkommastellen. Klammere das Intervall nicht künstlich auf 0 bis 1.',
    starter: `import math

p = 0
se = 0
low = 0
high = 0
se_small = 0
print(p, se, low, high, se_small)`,
    solution: `import math

p_raw = goals / shots
se_raw = math.sqrt(p_raw * (1 - p_raw) / shots)
p = round(p_raw, 3)
se = round(se_raw, 3)
low = round(p_raw - 1.96 * se_raw, 3)
high = round(p_raw + 1.96 * se_raw, 3)
se_small = round(math.sqrt(p_raw * (1 - p_raw) / 10), 3)
print(p, se, low, high, se_small)`,
    hints: [
      'Der Nenner unter der Wurzel ist die Anzahl der Versuche, nicht die Anzahl der Tore.',
      'Lies die Python-Dokumentation zu math.sqrt und das Beispiel. Prüfe, ob dein Intervall um p zentriert ist.',
      'Der Standardfehler:\n\nse_raw = math.sqrt(p_raw * (1 - p_raw) / shots)\nlow = p_raw - 1.96 * se_raw\nhigh = p_raw + 1.96 * se_raw\n\nRunde erst ganz am Ende; gerundete Zwischenwerte verschieben die Intervallgrenzen.',
    ],
    checks: [
      check('Beobachtete Quote', 'p', 0.15),
      check('Standardfehler bei 40 Schüssen', 'se', 0.056),
      check('Untere Grenze', 'low', 0.039),
      check('Obere Grenze', 'high', 0.261),
      check('Standardfehler bei nur 10 Schüssen', 'se_small', 0.113),
    ],
    reflection:
      'Warum ist die Aussage "Spieler A ist besser" unzulässig, wenn sich die Intervalle zweier kleiner Stichproben überlappen?',
    rubric: [
      'Erkläre, dass ein Intervall die Unsicherheit der Schätzung beschreibt.',
      'Nenne mindestens einen fehlenden Kontextfaktor jenseits der Stichprobengröße.',
    ],
    setup: `import math

shots = 40
goals = 6`,
    variants: [
      {
        label: 'Mehr Schüsse, gleiche Quote',
        setup: `import math

shots = 100
goals = 15`,
        checks: [
          check('Quote bleibt gleich', 'p', 0.15),
          check('Kleinerer Standardfehler', 'se', 0.036),
          check('Engeres Intervall unten', 'low', 0.08),
          check('Engeres Intervall oben', 'high', 0.22),
        ],
      },
    ],
    sources: [
      {
        title: 'OpenStax: Binomialverteilung',
        url: 'https://openstax.org/books/introductory-statistics/pages/4-2-binomial-distribution',
      },
      { title: 'Python: math.sqrt', url: 'https://docs.python.org/3/library/math.html#math.sqrt' },
    ],
  },
  {
    ...common,
    id: 'stat-xg-geometrie',
    title: 'Distanz und Schusswinkel berechnen',
    minutes: 45,
    concept: 'Geometrie: euklidische Distanz und atan2',
    objective: 'Distanz zum Tor und den Winkel zwischen den Torpfosten stabil mit atan2 berechnen.',
    prerequisites: ['stat-binomial'],
    explanation: [
      'Ein Schuss hat eine Position (x, y) auf einem 120 mal 80 großen Feld. Das Tor steht bei x = 120, die Pfosten bei y = 36 und y = 44. Die Distanz zum Torzentrum (120, 40) ist die euklidische Länge des Vektors (120 - x, 40 - y).',
      'Der Schusswinkel ist der Winkel zwischen den beiden Vektoren zu den Pfosten. Mit atan2(y, x) bekommst du einen gerichteten Winkel ohne Division durch null; atan2 ist deshalb stabiler als arctan(y/x). Für Punkte hinter der Torlinie kann die Differenz größer als 180 Grad werden; dann ist der kleinere Winkel 360 - Differenz.',
      'Distanz und Winkel beschreiben die Schussposition. Für sich genommen ergeben sie noch kein xG-Modell. Bei gleicher Distanz können Schüsse unterschiedliche Torwinkel haben; ebenso unterscheiden sich ein zentraler Schuss aus 30 Metern und ein Schuss aus spitzem Winkel aus 10 Metern. Für ein xG-Modell müsstest du auch Schussart, Druck, Vorlagengeber und Torwartposition berücksichtigen.',
    ],
    example: `import math

x, y = 108, 40
distance = math.hypot(120 - x, 40 - y)
a1 = math.atan2(36 - y, 120 - x)
a2 = math.atan2(44 - y, 120 - x)
angle = abs(math.degrees(a2 - a1))
print(round(distance, 2), round(angle, 2))`,
    task: 'Schreibe geometry(x, y). Berechne die Distanz zum Torzentrum (120, 40) mit math.hypot und den Winkel zwischen den Vektoren zu den Pfosten (120, 36) und (120, 44) mit math.atan2. Wandle den Winkel in Grad um; ist er größer als 180, verwende 360 - Winkel. Gib [round(distance, 2), round(angle, 2)] zurück.',
    starter: `import math

def geometry(x, y):
    distance = 0
    angle = 0
    return [distance, angle]

print(geometry(108, 40))`,
    solution: `import math

def geometry(x, y):
    distance = math.hypot(120 - x, 40 - y)
    a1 = math.atan2(36 - y, 120 - x)
    a2 = math.atan2(44 - y, 120 - x)
    angle = abs(math.degrees(a2 - a1))
    if angle > 180:
        angle = 360 - angle
    return [round(distance, 2), round(angle, 2)]

print(geometry(108, 40))`,
    hints: [
      'Beide Pfosten haben denselben x-Wert. Die Winkel entstehen aus den y-Abständen zu 36 und 44.',
      'Lies die Python-Dokumentation zu math.atan2. Achte darauf, dass atan2 den Quadranten berücksichtigt und deshalb auch hinter dem Tor funktioniert.',
      'Der Winkel:\n\na1 = math.atan2(36 - y, 120 - x)\na2 = math.atan2(44 - y, 120 - x)\nangle = abs(math.degrees(a2 - a1))',
    ],
    checks: [
      check('Zentraler Schuss aus 12 Metern', 'geometry(108, 40)', [12.0, 36.87]),
      check('Schräger Schuss aus 28 Metern', 'geometry(100, 20)', [28.28, 11.53]),
      check('Schuss hinter der Torlinie', 'geometry(121, 40)', [1.0, 151.93]),
      check('Weiter Schuss aus zentraler Position', 'geometry(60, 40)', [60.0, 7.63]),
    ],
    reflection:
      'Warum ist ein Schuss aus 12 Metern und 37 Grad nicht automatisch gefährlicher als ein Schuss aus 18 Metern und 25 Grad?',
    rubric: [
      'Nenne weitere Faktoren außer Distanz und Winkel.',
      'Erkläre, was atan2 gegenüber einer einfachen Steigungsformel leistet.',
    ],
    setup: `import math

pitch_length = 120
pitch_width = 80
goal_center = (120, 40)`,
    variants: [
      {
        label: 'Neue Schusspositionen',
        setup: `import math

pitch_length = 120
pitch_width = 80
goal_center = (120, 40)`,
        checks: [
          check('Zentral aus 10 Metern', 'geometry(110, 40)', [10.0, 43.6]),
          check('Schräg aus 29 Metern', 'geometry(95, 25)', [29.15, 13.49]),
          check('Kurze Distanz, flacher Winkel', 'geometry(115, 30)', [11.18, 20.15]),
        ],
      },
    ],
    sources: [
      MATH_ATAN2_DOCS,
      {
        title: 'Python: math.hypot',
        url: 'https://docs.python.org/3/library/math.html#math.hypot',
      },
    ],
  },
  {
    ...common,
    id: 'stat-logistik',
    title: 'Ein kleines xG-Modell trainieren',
    minutes: 55,
    concept: 'Logistische Regression und Trennung nach Spielen',
    objective:
      'Ein logistisches Modell auf Trainingsspielen fitten und die Trefferquote auf ungesehenen Spielen prüfen.',
    prerequisites: ['stat-xg-geometrie'],
    explanation: [
      'Eine logistische Regression schätzt aus Merkmalen die Wahrscheinlichkeit eines Tores. Ihre Koeffizienten beschreiben Zusammenhänge auf der Logit-Skala, also der Skala des logarithmierten Chancenverhältnisses. Bei einer kleinen, fiktiven Stichprobe sind die Koeffizienten instabil und können stark schwanken. Wenn Merkmale korrelieren und nur wenige Fälle vorliegen, kann sogar ein Vorzeichen der geometrischen Erwartung widersprechen.',
      'Für den Test auf neue Spiele teilen wir den Datensatz nach ganzen Spielen auf. Bei einer zufälligen Aufteilung einzelner Schüsse können Besonderheiten desselben Spiels sowohl im Training als auch im Test landen. Das kann die Bewertung zu günstig ausfallen lassen. GroupShuffleSplit hält alle Zeilen einer match-Gruppe zusammen. Daraus folgt allerdings nicht, dass ein Gruppensplit bei jedem Datensatz einen schlechteren Testwert liefern muss.',
      'Die 24 synthetischen Fälle sind absichtlich leicht trennbar: Die Tore liegen näher am Tor und haben größere Torwinkel als die Fehlschüsse. Deshalb kann hier auch ein zufälliger Schusssplit sehr hohe Trefferquoten erreichen; dieses Beispiel demonstriert die Split-Technik, nicht den Unterschied beider Prüfverfahren. Die perfekte Trennbarkeit ist unrealistisch. Trefferquote allein belegt weder gute Wahrscheinlichkeiten noch brauchbare xG-Qualität; die nächsten Lektionen prüfen Baseline und Kalibrierung.',
    ],
    example: `from sklearn.linear_model import LogisticRegression

model = LogisticRegression(max_iter=1000)
model.fit(X_train, y_train)
print(model.predict_proba(X_test[:2]))`,
    task: 'Nutze die vorbereiteten Arrays X, y und groups. Erzeuge mit GroupShuffleSplit(n_splits=1, test_size=0.34, random_state=7) die Indizes train_idx und test_idx. Fitte ein LogisticRegression(max_iter=1000) nur auf X[train_idx] und y[train_idx]. Speichere n_train und n_test sowie test_acc = gerundete Trefferquote auf dem Testset. Speichere test_probs als Liste der gerundeten Torwahrscheinlichkeiten für die Testzeilen (zweite Spalte von predict_proba).',
    starter: `import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import GroupShuffleSplit

splitter = GroupShuffleSplit(n_splits=1, test_size=0.34, random_state=7)
train_idx, test_idx = next(splitter.split(X, y, groups))
model = LogisticRegression(max_iter=1000)
# Training und Auswertung fehlen.
n_train = 0
n_test = 0
test_acc = 0
test_probs = []`,
    solution: `import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import GroupShuffleSplit

splitter = GroupShuffleSplit(n_splits=1, test_size=0.34, random_state=7)
train_idx, test_idx = next(splitter.split(X, y, groups))
model = LogisticRegression(max_iter=1000)
model.fit(X[train_idx], y[train_idx])
n_train = len(train_idx)
n_test = len(test_idx)
test_acc = round(float((model.predict(X[test_idx]) == y[test_idx]).mean()), 3)
test_probs = [round(float(value), 3) for value in model.predict_proba(X[test_idx])[:, 1]]
print(n_train, n_test, test_acc, test_probs)`,
    hints: [
      'Fitte das Modell ausschließlich mit den Trainingsindizes. Die Testzeilen dürfen im fit nicht vorkommen.',
      'Lies die scikit-learn-Dokumentation zu LogisticRegression und GroupShuffleSplit. Achte auf die Reihenfolge der Spalten distance und angle sowie auf predict_proba.',
      'Die Auswertung:\n\nmodel.fit(X[train_idx], y[train_idx])\ntest_acc = round(float((model.predict(X[test_idx]) == y[test_idx]).mean()), 3)\ntest_probs = [round(float(value), 3) for value in model.predict_proba(X[test_idx])[:, 1]]',
    ],
    checks: [
      check(
        'Trainings- und Testmenge sind disjunkt',
        'bool(set(train_idx).isdisjoint(set(test_idx)))',
        true,
      ),
      check('Zwölf Trainingsschüsse', 'n_train', 12),
      check('Zwölf Testschüsse', 'n_test', 12),
      check('Trefferquote auf ungesehenen Spielen', 'test_acc >= 0.8', true),
      check('Eine Wahrscheinlichkeit pro Testschuss', 'len(test_probs) == n_test', true),
      check(
        'Alle Wahrscheinlichkeiten liegen zwischen 0 und 1',
        'bool(all(0 <= value <= 1 for value in test_probs))',
        true,
      ),
      check('Das Modell unterscheidet Testfälle', 'len(set(test_probs)) > 1', true),
    ],
    reflection:
      'Warum wählen wir eine Trennung nach Spielen, obwohl in diesem absichtlich leicht trennbaren Beispiel auch ein zufälliger Schusssplit sehr hohe Trefferquoten liefern kann?',
    rubric: [
      'Erkläre, warum Schüsse aus demselben Spiel nicht unabhängig sind.',
      'Nenne mindestens eine Kennzahl, die zusätzlich zur Trefferquote nötig wäre.',
    ],
    setup: `import math
import numpy as np
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import GroupShuffleSplit

def shot_geometry(x, y):
    distance = math.hypot(120 - x, 40 - y)
    a1 = math.atan2(36 - y, 120 - x)
    a2 = math.atan2(44 - y, 120 - x)
    angle = abs(math.degrees(a2 - a1))
    if angle > 180:
        angle = 360 - angle
    return distance, angle

rows = [
  ("A", 108, 40, 1), ("A", 104, 38, 1), ("A", 99, 30, 0), ("A", 94, 42, 0),
  ("A", 112, 46, 1), ("A", 85, 50, 0),
  ("B", 109, 36, 1), ("B", 106, 44, 1), ("B", 100, 28, 0), ("B", 96, 55, 0),
  ("B", 113, 38, 1), ("B", 90, 24, 0),
  ("C", 107, 42, 1), ("C", 102, 34, 1), ("C", 98, 44, 0), ("C", 92, 30, 0),
  ("C", 111, 50, 1), ("C", 88, 60, 0),
  ("D", 110, 40, 1), ("D", 105, 30, 1), ("D", 101, 50, 0), ("D", 95, 36, 0),
  ("D", 112, 34, 1), ("D", 87, 45, 0),
]
data = pd.DataFrame(
    [(match, *shot_geometry(x, y), goal) for match, x, y, goal in rows],
    columns=["match", "distance", "angle", "goal"],
)
X = data[["distance", "angle"]].to_numpy()
y = data["goal"].to_numpy()
groups = data["match"].to_numpy()`,
    packages: ['numpy', 'pandas', 'scikit-learn'],
    sources: [SKLEARN_LOGISTIC_DOCS, SKLEARN_SPLIT_DOCS],
  },
  {
    ...common,
    id: 'stat-baseline-brier',
    title: 'Ein Modell gegen die einfache Basis prüfen',
    minutes: 40,
    concept: 'Brier-Score und Baseline',
    objective:
      'Den Brier-Score einer konstanten Basis mit dem eines Modells auf denselben Testdaten vergleichen.',
    prerequisites: ['stat-logistik'],
    explanation: [
      'Der Brier-Score ist der mittlere quadratische Abstand zwischen vorhergesagter Wahrscheinlichkeit und tatsächlichem Ergebnis (0 oder 1). Kleiner ist besser. Eine Vorhersage von 0,7 für ein Tor ergibt (0,7 - 1)^2 = 0,09; für ein Nicht-Tor (0,7 - 0)^2 = 0,49. Der Score bestraft sichere falsche Aussagen stärker.',
      'Als Baseline dient eine einfache Vorhersage ohne die Merkmale des Modells. Hier geben wir für jeden Testschuss dieselbe Wahrscheinlichkeit aus: die Torquote aus den Trainingsdaten. Vergleiche beide auf denselben Testfällen. Wenn das Modell keinen niedrigeren Brier-Score erreicht, zeigt dieser Vergleich keinen zusätzlichen Nutzen. Die Testdaten dürfen nicht in die Schätzung der Baseline eingehen.',
      'Der Brier-Score mittelt über sämtliche Testfälle. Ein kleiner Wert garantiert daher nicht, dass die Wahrscheinlichkeiten in jedem Bereich gut kalibriert sind. Bei nur 10 Testfällen kann zudem ein einzelner Fall den Score deutlich verändern. Prüfe vor einer Empfehlung auch die Verteilung der Vorhersagen, die Kalibrierungskurve und die Trennung nach Spielen.',
    ],
    example: `from sklearn.metrics import brier_score_loss

print(brier_score_loss([1, 0, 1], [0.7, 0.2, 0.6]))`,
    task: 'Berechne base_rate als Torquote in train_labels, gerundet auf drei Stellen. Erzeuge baseline_probs als Liste mit base_rate für jeden Testschuss. Berechne brier_base und brier_model mit brier_score_loss auf test_labels und den jeweiligen Wahrscheinlichkeiten. Berechne improvement = brier_base - brier_model. Runde die drei Scores auf drei Nachkommastellen.',
    starter: `from sklearn.metrics import brier_score_loss

base_rate = 0
baseline_probs = []
brier_base = 0
brier_model = 0
improvement = 0`,
    solution: `from sklearn.metrics import brier_score_loss

base_rate = round(sum(train_labels) / len(train_labels), 3)
baseline_probs = [base_rate] * len(test_labels)
brier_base = round(float(brier_score_loss(test_labels, baseline_probs)), 3)
brier_model = round(float(brier_score_loss(test_labels, model_probs)), 3)
improvement = round(brier_base - brier_model, 3)
print(base_rate, brier_base, brier_model, improvement)`,
    hints: [
      'Die Baseline ist konstant. Ihre Wahrscheinlichkeit kommt aus den Trainingsdaten, nicht aus den Testdaten.',
      'Lies die scikit-learn-Dokumentation zu brier_score_loss. Achte darauf, dass die Reihenfolge von Labels und Wahrscheinlichkeiten übereinstimmt.',
      'Die Baseline:\n\nbase_rate = round(sum(train_labels) / len(train_labels), 3)\nbaseline_probs = [base_rate] * len(test_labels)',
    ],
    checks: [
      check('Basisrate aus dem Training', 'base_rate', 0.444),
      check('Brier-Score der konstanten Basis', 'brier_base', 0.253),
      check('Brier-Score des Modells', 'brier_model', 0.12),
      check('Verbesserung gegenüber der Basis', 'improvement', 0.133),
      check('Baseline ist konstant', 'len(set(baseline_probs)) == 1', true),
    ],
    reflection:
      'Was bedeutet es fachlich, wenn ein Modell den Brier-Score der Baseline nur um 0,01 verbessert, aber auf einem kleinen Testset gewinnt?',
    rubric: [
      'Erkläre, warum die Baseline aus Trainingsdaten stammt.',
      'Nenne die Unsicherheit durch die kleine Testmenge.',
    ],
    setup: `from sklearn.metrics import brier_score_loss

train_labels = [0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 0, 1, 0]
test_labels = [1, 0, 1, 0, 1, 0, 1, 0, 1, 0]
model_probs = [0.62, 0.18, 0.55, 0.31, 0.71, 0.22, 0.48, 0.36, 0.66, 0.27]`,
    packages: ['scikit-learn'],
    variants: [
      {
        label: 'Andere Testwahrscheinlichkeiten',
        setup: `from sklearn.metrics import brier_score_loss

train_labels = [0, 1, 0, 1, 1, 0]
test_labels = [1, 0, 1, 1, 0]
model_probs = [0.7, 0.2, 0.6, 0.4, 0.3]`,
        checks: [
          check('Neue Basisrate', 'base_rate', 0.5),
          check('Neue Basis', 'brier_base', 0.25),
          check('Neues Modell', 'brier_model', 0.148),
          check('Neue Verbesserung', 'improvement', 0.102),
        ],
      },
    ],
    sources: [SKLEARN_BRIER_DOCS, SKLEARN_CALIBRATION_DOCS],
  },
  {
    ...common,
    id: 'stat-kalibrierung',
    title: 'Sind 70 Prozent auch 70 Prozent?',
    minutes: 40,
    concept: 'Kalibrierung und Expected Calibration Error',
    objective:
      'Vorhergesagte Wahrscheinlichkeiten in Bins auf ihre beobachtete Trefferquote prüfen.',
    prerequisites: ['stat-baseline-brier'],
    explanation: [
      'Kalibrierung fragt, ob eine vorhergesagte Wahrscheinlichkeit zur beobachteten Häufigkeit passt. Wenn alle Fälle mit etwa 70 Prozent Vorhersage in Wirklichkeit zu 70 Prozent eintreten, ist das Modell in diesem Bereich kalibriert. Ein Modell kann gut sortieren und trotzdem schlecht kalibriert sein.',
      'Teile die Vorhersagen dazu in Intervalle, sogenannte Bins, etwa 0 bis 0,3, 0,3 bis 0,7 und 0,7 bis 1. Berechne in jedem Bin die mittlere Vorhersage und die beobachtete Trefferquote. Der Expected Calibration Error (ECE) fasst die absoluten Abstände beider Werte zusammen. Dabei zählt jeder Bin entsprechend seinem Anteil an den Fällen.',
      'Mit den Bin-Grenzen legst du fest, welche Fälle du zusammenfasst. Mehr Bins zeigen feinere Unterschiede, enthalten aber weniger Fälle; ihre Trefferquoten schwanken dadurch stärker. Ein ECE von 0,136 ist weder eine allgemeine Konstante noch ein Signifikanztest. Die festen, fiktiven Vorhersagen machen hier den Rechenweg nachvollziehbar. Für echte Modelle brauchst du zusätzlich Konfidenzintervalle und eine Prüfung nach Spielen.',
    ],
    example: `preds = [0.1, 0.4, 0.8]
labels = [0, 0, 1]
# Bin 0.3 bis 0.7: mittlere Vorhersage 0.4, beobachtet 0.0
print(0.4, 0.0)`,
    task: 'Teile preds mit bins in drei Gruppen: [0, 0.3), [0.3, 0.7), [0.7, 1.0]. Für jede Gruppe speichere [untere_Grenze, obere_Grenze, n, mean_pred, observed] in cal; runde mean_pred und observed auf drei Stellen. Berechne ece als mit n/N gewichtete Summe von abs(mean_pred - observed), gerundet auf drei Stellen. Die letzte Bin enthält auch den Wert 1.0.',
    starter: `cal = []
ece = 0
for lo, hi in bins:
    # Fälle auswählen, Mittelwerte bilden und ECE ergänzen.
    pass
print(cal, ece)`,
    solution: `cal = []
ece = 0
for lo, hi in bins:
    if hi == 1.0:
        idx = [i for i, p in enumerate(preds) if lo <= p <= hi]
    else:
        idx = [i for i, p in enumerate(preds) if lo <= p < hi]
    mean_pred = sum(preds[i] for i in idx) / len(idx)
    observed = sum(labels[i] for i in idx) / len(idx)
    cal.append([lo, hi, len(idx), round(mean_pred, 3), round(observed, 3)])
    ece += len(idx) / len(preds) * abs(mean_pred - observed)
ece = round(ece, 3)
print(cal, ece)`,
    hints: [
      'Für jede Bin brauchst du die Indizes der passenden Vorhersagen und dieselben Indizes für die Labels.',
      'Lies die scikit-learn-Dokumentation zur Kalibrierung. Überlege, warum die letzte Bin 1.0 einschließen muss.',
      'Der ECE-Beitrag:\n\nece += len(idx) / len(preds) * abs(mean_pred - observed)',
    ],
    checks: [
      check('Drei Kalibrierungsbins', 'cal', [
        [0.0, 0.3, 4, 0.182, 0.25],
        [0.3, 0.7, 3, 0.44, 0.667],
        [0.7, 1.0, 3, 0.803, 0.667],
      ]),
      check('Alle Fälle sind in genau einer Bin', 'sum(row[2] for row in cal)', 10),
      check('Expected Calibration Error', 'ece', 0.136),
    ],
    reflection:
      'Warum kann ein Modell mit guter Trefferquote schlecht kalibriert sein, und warum ist das für eine Entscheidung über Transferkandidaten relevant?',
    rubric: [
      'Erkläre den Unterschied zwischen Ranking und Kalibrierung.',
      'Nenne die Abhängigkeit von Bin-Grenzen und Stichprobengröße.',
    ],
    setup: `preds = [0.08, 0.12, 0.25, 0.28, 0.35, 0.42, 0.55, 0.72, 0.78, 0.91]
labels = [0, 0, 0, 1, 0, 1, 1, 1, 1, 0]
bins = [(0.0, 0.3), (0.3, 0.7), (0.7, 1.0)]`,
    variants: [
      {
        label: 'Andere Vorhersagen',
        setup: `preds = [0.1, 0.2, 0.4, 0.6, 0.8, 0.9]
labels = [0, 0, 1, 0, 1, 1]
bins = [(0.0, 0.3), (0.3, 0.7), (0.7, 1.0)]`,
        checks: [
          check('Neue Kalibrierungsbins', 'cal', [
            [0.0, 0.3, 2, 0.15, 0.0],
            [0.3, 0.7, 2, 0.5, 0.5],
            [0.7, 1.0, 2, 0.85, 1.0],
          ]),
          check('Neuer ECE', 'ece', 0.1),
        ],
      },
    ],
    sources: [SKLEARN_CALIBRATION_DOCS],
  },
  {
    ...common,
    id: 'stat-leakage',
    title: 'Ein Merkmal, das zu viel weiß',
    minutes: 45,
    concept: 'Datenleckage bei Modellmerkmalen',
    objective:
      'Ein Modell mit zulässigen Merkmalen mit einem Modell mit Datenleckage vergleichen und den Unterschied im Testergebnis erklären.',
    prerequisites: ['stat-kalibrierung'],
    explanation: [
      'Bei Leakage, also Datenleckage, erhält das Modell Informationen, die zum Vorhersagezeitpunkt noch nicht verfügbar sind oder direkt aus dem Zielwert stammen. Es kann dann im Test sehr gut abschneiden, weil die Antwort bereits in den Merkmalen steckt. In realen Daten ist das oft schwerer zu erkennen als bei einer ausdrücklich mit "Tor" beschrifteten Spalte.',
      'In dieser Übung ist goal_derived_xg_pct absichtlich aus dem Ergebnis konstruiert: ein nachträglicher xG-Wert in Prozent, niedrig bei Fehlschüssen, hoch bei Toren (4 entspricht 0.04). Ein Modell auf diesem Merkmal trennt die Testfälle perfekt. Das ist keine Leistung des Modells, sondern eine Eigenschaft der Datenkonstruktion. Wichtig: Ein echtes Anbieter-xG, das vor dem Schuss aus der Schussposition berechnet wurde, wäre kein Label-Leak, sondern ein legitimer externer Benchmark. Dass wir es hier nicht verwenden, ist eine Aufgabenbedingung: Wir wollen prüfen, was reine Geometrie lernt.',
      'Das Modell mit Distanz und Winkel macht auf ungesehenen Spielen Fehler, weil die Geometrie nicht jeden Schuss erklärt. An diesen Fehlern kannst du seine Grenzen untersuchen. Vergleiche es mit einer Baseline, die nur zulässige Informationen verwendet, und prüfe für jedes Merkmal, ob es vor der Aktion bekannt war. Ein aus dem späteren Ergebnis erzeugtes Merkmal darf nicht in die Vorhersage eingehen. Ohne diese Prüfung lässt sich auch ein hoher Testscore nicht bewerten.',
    ],
    example: `from sklearn.linear_model import LogisticRegression

honest = LogisticRegression(max_iter=1000).fit(X_honest, y)
leaky = LogisticRegression(max_iter=1000).fit(X_leaky, y)
print(honest.score(X_honest, y), leaky.score(X_leaky, y))`,
    task: 'Fitte zwei LogisticRegression(max_iter=1000)-Modelle auf denselben train_idx: honest_model mit X[["distance", "angle"]], leaky_model mit X[["goal_derived_xg_pct"]]. Berechne honest_acc und leaky_acc auf test_idx, gerundet auf drei Stellen. Speichere gap = leaky_acc - honest_acc, gerundet auf drei Stellen, und leaky_features als Liste ["goal_derived_xg_pct"].',
    starter: `from sklearn.linear_model import LogisticRegression

honest_model = LogisticRegression(max_iter=1000)
leaky_model = LogisticRegression(max_iter=1000)
# Training und Auswertung fehlen.
honest_acc = 0
leaky_acc = 0
gap = 0
leaky_features = []`,
    solution: `from sklearn.linear_model import LogisticRegression

honest_model = LogisticRegression(max_iter=1000)
honest_model.fit(X[["distance", "angle"]].to_numpy()[train_idx], y[train_idx])
leaky_model = LogisticRegression(max_iter=1000)
leaky_model.fit(X[["goal_derived_xg_pct"]].to_numpy()[train_idx], y[train_idx])
honest_acc = round(float(honest_model.score(X[["distance", "angle"]].to_numpy()[test_idx], y[test_idx])), 3)
leaky_acc = round(float(leaky_model.score(X[["goal_derived_xg_pct"]].to_numpy()[test_idx], y[test_idx])), 3)
gap = round(leaky_acc - honest_acc, 3)
leaky_features = ["goal_derived_xg_pct"]
print(honest_acc, leaky_acc, gap)`,
    hints: [
      'Beide Modelle sehen dieselben Trainings- und Testindizes. Nur die Merkmalsmatrix unterscheidet sich.',
      'Lies die scikit-learn-Seite zu Common Pitfalls und Data Leakage. Frage bei jedem Merkmal: War dieser Wert vor dem Schuss bekannt?',
      'Die beiden Merkmalsmatrizen:\n\nX[["distance", "angle"]]\nX[["goal_derived_xg_pct"]]',
    ],
    checks: [
      check('Faires Modell ist nicht perfekt', 'honest_acc < 1.0', true),
      check('Leckendes Modell trennt perfekt', 'leaky_acc == 1.0', true),
      check('Scheinbarer Vorsprung ist groß', 'gap >= 0.1', true),
      check('Nur das leckende Merkmal ist benannt', 'leaky_features', ['goal_derived_xg_pct']),
    ],
    reflection:
      'Welches Merkmal in einem echten Scouting-Datensatz könnte erst nach der Aktion entstehen und deshalb Leakage erzeugen?',
    rubric: [
      'Nenne ein konkretes Merkmal und den Zeitpunkt seiner Entstehung.',
      'Erkläre, warum ein hoher Testscore allein kein Beleg für ein gutes Modell ist.',
    ],
    setup: `import numpy as np
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import GroupShuffleSplit

rows = [
  ("A", 12, 30, 4, 0), ("A", 14, 24, 6, 0), ("A", 16, 20, 8, 0), ("A", 18, 18, 12, 0),
  ("A", 20, 15, 15, 0), ("A", 9, 10, 30, 1), ("A", 11, 14, 45, 1), ("A", 18, 30, 35, 1),
  ("B", 13, 28, 5, 0), ("B", 15, 22, 7, 0), ("B", 17, 19, 9, 0), ("B", 20, 16, 11, 0),
  ("B", 22, 14, 13, 0), ("B", 8, 8, 25, 1), ("B", 10, 12, 40, 1), ("B", 9, 7, 55, 1),
  ("C", 14, 26, 3, 0), ("C", 16, 21, 6, 0), ("C", 19, 17, 10, 0), ("C", 22, 14, 13, 0),
  ("C", 11, 13, 40, 1), ("C", 13, 16, 60, 1), ("C", 24, 28, 30, 1), ("C", 8, 6, 2, 0),
  ("D", 12, 29, 5, 0), ("D", 15, 23, 8, 0), ("D", 18, 18, 9, 0), ("D", 21, 15, 14, 0),
  ("D", 9, 11, 33, 1), ("D", 12, 14, 50, 1), ("D", 8, 9, 28, 1),
]
X = pd.DataFrame(rows, columns=["match", "distance", "angle", "goal_derived_xg_pct", "goal"])
y = X["goal"].to_numpy()
groups = X["match"].to_numpy()
splitter = GroupShuffleSplit(n_splits=1, test_size=0.34, random_state=7)
train_idx, test_idx = next(splitter.split(X, y, groups))`,
    packages: ['numpy', 'pandas', 'scikit-learn'],
    sources: [SKLEARN_LEAKAGE_DOCS, SKLEARN_LOGISTIC_DOCS],
  },
  {
    ...common,
    id: 'stat-review',
    title: 'Wiederholung: Lage und Anteil mit neuen Daten',
    minutes: 35,
    concept: 'Wiederholung: Lagemaße und Binomialunsicherheit',
    objective:
      'Lagemaße und ein Unsicherheitsintervall für einen neuen Datensatz selbstständig berechnen.',
    prerequisites: ['stat-leakage'],
    reviewOf: 'stat-kennzahlen',
    explanation: [
      'Rechne dieselben Verfahren mit den neuen Zahlen durch. neu_goals enthält Tore pro Spiel; neu_shots und neu_goals_total gehören zu einer separaten Torquote. Halte diese Datensätze auseinander: Die Lagemaße beschreiben die Tore je Spiel, der Anteil die Tore je Schuss.',
      'Berechne die Varianz wieder als Stichprobenvarianz mit ddof=1. Für den Anteil nutzt du denselben Standardfehler wie zuvor, aber mit dem neuen n. Ein Intervall, das über 0 hinausgeht, wird nicht auf 0 gekappt; das wäre eine andere Modellannahme.',
      'Auch diese Daten sind klein und fiktiv. Ein Median von 2 Toren oder eine Quote von 15 Prozent reichen hier nicht aus, um eine Saison zu beschreiben. In der Prüfung zählt, ob du die Rechenregeln auf die neuen Werte überträgst. Eine sportliche Empfehlung lässt sich daraus nicht ableiten.',
    ],
    example: `import numpy as np

werte = [0, 1, 2]
print(np.mean(werte), np.median(werte), np.var(werte, ddof=1))`,
    task: 'Berechne aus neu_goals den Mittelwert new_mean, den Median new_median, die Stichprobenvarianz new_variance und new_diff = new_mean - new_median, alle auf drei Stellen gerundet. Berechne aus neu_goals_total / neu_shots den Anteil new_p und den Standardfehler new_se mit neu_shots; beide auf drei Stellen gerundet.',
    starter: `import math
import numpy as np

new_mean = 0
new_median = 0
new_variance = 0
new_diff = 0
new_p = 0
new_se = 0`,
    solution: `import math
import numpy as np

new_mean = round(float(np.mean(neu_goals)), 3)
new_median = round(float(np.median(neu_goals)), 3)
new_variance = round(float(np.var(neu_goals, ddof=1)), 3)
new_diff = round(new_mean - new_median, 3)
new_p = round(neu_goals_total / neu_shots, 3)
new_se = round(math.sqrt(new_p * (1 - new_p) / neu_shots), 3)
print(new_mean, new_median, new_variance, new_diff, new_p, new_se)`,
    hints: [
      'Die Lagemaße beziehen sich auf neu_goals, der Anteil auf neu_goals_total und neu_shots. Verwechsle die beiden Datensätze nicht.',
      'Lies bei Bedarf noch einmal die Lektionen zu np.var mit ddof und zum Standardfehler. Prüfe die Rundung erst am Ende.',
      'Der Anteil:\n\nnew_p = round(neu_goals_total / neu_shots, 3)\nnew_se = round(math.sqrt(new_p * (1 - new_p) / neu_shots), 3)',
    ],
    checks: [
      check('Neuer Mittelwert', 'new_mean', 2.0),
      check('Neuer Median', 'new_median', 2.0),
      check('Neue Stichprobenvarianz', 'new_variance', 2.667),
      check('Neue Lagendifferenz', 'new_diff', 0.0),
      check('Neue Quote', 'new_p', 0.15),
      check('Neuer Standardfehler', 'new_se', 0.046),
    ],
    reflection:
      'Welche der beiden Kennzahlen, Lage oder Quote, würdest du in einem Kurzbericht zuerst nennen, und warum?',
    rubric: [
      'Begründe die Wahl mit der Frage, nicht mit der Zahl.',
      'Nenne eine Limitation beider Kennzahlen.',
    ],
    setup: `import math
import numpy as np

neu_goals = [2, 2, 0, 5, 1, 1, 3]
neu_shots = 60
neu_goals_total = 9`,
    packages: ['numpy'],
    sources: [NUMPY_VAR_DOCS, SKLEARN_BRIER_DOCS],
  },
];
