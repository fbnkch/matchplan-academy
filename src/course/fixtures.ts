// Gemeinsame, ausdrücklich fiktive Übungsdaten für die Kursteile 2–6.
// Die Zahlen sind synthetisch und dienen der Mechanik, nicht als sportlicher Beleg.
import type { Check } from '../types';

export const DATA_NOTE =
  'Alle Namen, Vereine und Werte in diesem Kurs sind frei erfunden und synthetisch erzeugt. ' +
  'Sie zeigen Rechenwege und Prüfideen; sie belegen keine sportliche Qualität und keine statistische Signifikanz.';

export const SQL_DOCS = {
  title: 'SQLite: SELECT-Anweisung',
  url: 'https://www.sqlite.org/lang_select.html',
};
export const SQL_AGG_DOCS = {
  title: 'SQLite: Aggregatfunktionen',
  url: 'https://www.sqlite.org/lang_aggfunc.html',
};
export const SQL_WINDOW_DOCS = {
  title: 'SQLite: Window Functions',
  url: 'https://www.sqlite.org/windowfunctions.html',
};
export const SQL_NULL_DOCS = {
  title: 'SQLite: NULL-Werte',
  url: 'https://www.sqlite.org/nulls.html',
};
export const PANDAS_DOCS = {
  title: 'pandas: 10 Minuten zum Einstieg',
  url: 'https://pandas.pydata.org/docs/user_guide/10min.html',
};
export const PANDAS_MERGE_DOCS = {
  title: 'pandas: Zusammenführen von Tabellen',
  url: 'https://pandas.pydata.org/docs/user_guide/merge.html',
};
export const PANDAS_MISSING_DOCS = {
  title: 'pandas: Fehlende Daten',
  url: 'https://pandas.pydata.org/docs/user_guide/missing_data.html',
};
export const MATPLOTLIB_SCATTER_DOCS = {
  title: 'Matplotlib: scatter',
  url: 'https://matplotlib.org/stable/api/_as_gen/matplotlib.pyplot.scatter.html',
};
export const NUMPY_MEDIAN_DOCS = {
  title: 'NumPy: median',
  url: 'https://numpy.org/doc/stable/reference/generated/numpy.median.html',
};
export const NUMPY_VAR_DOCS = {
  title: 'NumPy: var (ddof)',
  url: 'https://numpy.org/doc/stable/reference/generated/numpy.var.html',
};
export const SKLEARN_LOGISTIC_DOCS = {
  title: 'scikit-learn: LogisticRegression',
  url: 'https://scikit-learn.org/stable/modules/generated/sklearn.linear_model.LogisticRegression.html',
};
export const SKLEARN_SPLIT_DOCS = {
  title: 'scikit-learn: GroupShuffleSplit',
  url: 'https://scikit-learn.org/stable/modules/generated/sklearn.model_selection.GroupShuffleSplit.html',
};
export const SKLEARN_BRIER_DOCS = {
  title: 'scikit-learn: brier_score_loss',
  url: 'https://scikit-learn.org/stable/modules/generated/sklearn.metrics.brier_score_loss.html',
};
export const SKLEARN_CALIBRATION_DOCS = {
  title: 'scikit-learn: Probability calibration',
  url: 'https://scikit-learn.org/stable/modules/calibration.html',
};
export const SKLEARN_LEAKAGE_DOCS = {
  title: 'scikit-learn: Common pitfalls (Data leakage)',
  url: 'https://scikit-learn.org/stable/common_pitfalls.html',
};
export const PANDAS_RANK_DOCS = {
  title: 'pandas: DataFrame.rank',
  url: 'https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.rank.html',
};
export const PANDAS_GROUPBY_DOCS = {
  title: 'pandas: Group by',
  url: 'https://pandas.pydata.org/docs/user_guide/groupby.html',
};
export const MATH_ATAN2_DOCS = {
  title: 'Python: math.atan2',
  url: 'https://docs.python.org/3/library/math.html#math.atan2',
};
export const XT_DOCS = {
  title: 'Karun Singh: Introducing Expected Threat (xT)',
  url: 'https://karun.in/blog/expected-threat.html',
};
export const FOT_DOCS = {
  title: 'Friends of Tracking: Tracking-Daten und Raumkontrolle',
  url: 'https://github.com/Friends-of-Tracking-Data-FoTD/LaurieOnTracking',
};
export const STATSBOMB_DOCS = {
  title: 'StatsBomb Open Data: Eventdaten-Dokumentation',
  url: 'https://github.com/hudl/open-data',
};

type SqlValue = string | number | null;

const sqlValue = (value: SqlValue): string => {
  if (value === null) return 'NULL';
  if (typeof value === 'number') return String(value);
  return `'${value.replaceAll("'", "''")}'`;
};

const sqlRows = (rows: SqlValue[][]): string =>
  rows.map((row) => `  (${row.map(sqlValue).join(', ')})`).join(',\n');

export const PLAYER_ROWS: SqlValue[][] = [
  [1, 'Ada', 'MF', 'Nordstadt', 900, 4, 3, 18, 42, 3.1, 2.4],
  [2, 'Mira', 'FW', 'Nordstadt', 810, 7, 1, 9, 12, 6.2, 1.1],
  [3, 'Lea', 'MF', 'Hafenstadt', 270, 1, 0, 3, 8, 0.4, 0.3],
  [4, 'Nora', 'MF', 'Hafenstadt', 450, 2, 2, 7, 19, 1.0, 1.6],
  [5, 'Pia', 'DF', 'Nordstadt', 990, 1, 1, 5, 21, 0.6, 0.9],
  [6, 'Uta', 'DF', 'Hafenstadt', 800, 0, 2, 4, 26, 0.2, 1.2],
  [7, 'Ria', 'MF', 'Weststadt', 620, 3, 4, 14, 31, 1.8, 2.9],
  [8, 'Sina', 'FW', 'Weststadt', 360, 3, 0, 4, 5, 2.7, 0.2],
  [9, 'Tine', 'DF', 'Weststadt', 1080, 0, 1, 3, 12, 0.1, 0.7],
  [10, 'Ina', 'GK', 'Nordstadt', 1080, 0, 0, 0, 2, 0.0, 0.0],
  [11, 'Jona', 'MF', 'Nordstadt', 449, 2, 1, 6, 15, 0.9, 1.0],
  [12, 'Lina', 'MF', 'Weststadt', 700, 5, 2, 11, 24, 2.2, 1.5],
];

export const MATCH_ROWS: SqlValue[][] = [
  ['M1', 1, 'Nordstadt', 'Hafenstadt', 2, 1, 1.8, 1.1, 12, 8],
  ['M2', 1, 'Weststadt', 'Nordstadt', 0, 0, 0.9, 0.8, 7, 9],
  ['M3', 2, 'Hafenstadt', 'Weststadt', 3, 2, 2.4, 1.9, 14, 11],
  ['M4', 2, 'Nordstadt', 'Weststadt', 1, 1, 1.2, 1.0, 10, 9],
  ['M5', 3, 'Hafenstadt', 'Nordstadt', 0, 2, 0.7, 2.1, 6, 13],
  ['M6', 3, 'Weststadt', 'Hafenstadt', 1, 0, 1.5, 0.8, 11, 7],
  ['M7', 4, 'Nordstadt', 'Hafenstadt', 3, 0, 2.8, 1.4, 15, 10],
  ['M8', 4, 'Weststadt', 'Nordstadt', 2, 2, 1.6, 1.7, 12, 12],
];

export const SHOT_ROWS: SqlValue[][] = [
  ['S01', 'M1', 'Nordstadt', 'Ada', 12, 108, 40, 0.35, 'Goal'],
  ['S02', 'M1', 'Nordstadt', 'Mira', 30, 99, 52, 0.12, 'Saved'],
  ['S03', 'M1', 'Nordstadt', 'Ada', 67, 114, 34, 0.08, 'Off'],
  ['S04', 'M1', 'Hafenstadt', 'Nora', 22, 102, 30, 0.22, 'Saved'],
  ['S05', 'M1', 'Hafenstadt', 'Lea', 80, 110, 44, 0.05, 'Saved'],
  ['S06', 'M3', 'Hafenstadt', 'Nora', 15, 106, 38, 0.18, 'Goal'],
  ['S07', 'M3', 'Hafenstadt', 'Lea', 33, 100, 30, 0.09, 'Off'],
  ['S08', 'M3', 'Hafenstadt', 'Nora', 61, 111, 42, 0.14, 'Saved'],
  ['S09', 'M3', 'Weststadt', 'Sina', 25, 104, 46, 0.24, 'Goal'],
  ['S10', 'M3', 'Weststadt', 'Ria', 52, 97, 52, 0.11, 'Saved'],
  ['S11', 'M3', 'Weststadt', 'Sina', 78, 106, 35, 0.07, 'Saved'],
  ['S12', 'M3', 'Weststadt', 'Ria', 90, 99, 44, 0.05, 'Off'],
  ['S13', 'M5', 'Nordstadt', 'Ada', 10, 104, 40, 0.15, 'Goal'],
  ['S14', 'M5', 'Hafenstadt', 'Nora', 50, 109, 36, 0.08, 'Saved'],
  ['S15', 'M5', 'Nordstadt', 'Mira', 72, 112, 44, 0.42, 'Goal'],
  ['S16', 'M7', 'Nordstadt', 'Mira', 5, 107, 36, 0.21, 'Goal'],
  ['S17', 'M7', 'Hafenstadt', 'Lea', 70, 105, 39, 0.05, 'Off'],
  ['S18', 'M7', 'Nordstadt', 'Mira', 49, 110, 43, 0.33, 'Goal'],
  ['S19', 'M7', 'Nordstadt', 'Ada', 81, 101, 48, 0.12, 'Goal'],
  ['S20', 'M8', 'Weststadt', 'Sina', 18, 105, 37, 0.26, 'Goal'],
  ['S21', 'M8', 'Nordstadt', 'Mira', 22, 107, 42, 0.3, 'Goal'],
  ['S22', 'M8', 'Weststadt', 'Ria', 59, 109, 47, 0.14, 'Off'],
  ['S23', 'M8', 'Nordstadt', 'Ada', 77, 100, 33, 0.1, 'Off'],
];

export const PASS_ROWS: SqlValue[][] = [
  ['M1', 'Nordstadt', 'Ada', 'Mira', 1],
  ['M1', 'Nordstadt', 'Mira', 'Ada', 1],
  ['M1', 'Nordstadt', 'Pia', null, 0],
  ['M1', 'Nordstadt', 'Ada', null, 0],
  ['M1', 'Hafenstadt', 'Nora', 'Lea', 1],
  ['M1', 'Hafenstadt', 'Lea', null, 0],
  ['M3', 'Hafenstadt', 'Nora', 'Lea', 1],
  ['M3', 'Hafenstadt', 'Lea', 'Nora', 1],
  ['M3', 'Weststadt', 'Ria', 'Sina', 1],
  ['M3', 'Weststadt', 'Sina', null, 0],
  ['M7', 'Nordstadt', 'Pia', 'Ada', 1],
  ['M7', 'Nordstadt', 'Ada', 'Mira', 1],
  ['M8', 'Weststadt', 'Ria', 'Sina', 1],
  ['M8', 'Weststadt', 'Sina', 'Ria', 1],
];

export const APPEARANCE_ROWS: SqlValue[][] = [
  [1, 'M1', 90],
  [1, 'M5', 90],
  [1, 'M7', 90],
  [1, 'M8', 90],
  [2, 'M1', 90],
  [2, 'M2', 90],
  [2, 'M4', 90],
  [2, 'M5', 90],
  [2, 'M7', 90],
  [2, 'M8', 90],
  [3, 'M1', 45],
  [3, 'M3', 90],
  [3, 'M6', 60],
  [3, 'M7', 20],
  [4, 'M1', 90],
  [4, 'M3', 90],
  [4, 'M5', 30],
  [4, 'M6', 90],
  [4, 'M7', 90],
  [5, 'M1', 90],
  [5, 'M2', 90],
  [5, 'M7', 90],
  [6, 'M1', 90],
  [6, 'M3', 90],
  [6, 'M5', 90],
  [6, 'M6', 90],
  [6, 'M7', 90],
  [7, 'M2', 90],
  [7, 'M3', 90],
  [7, 'M4', 90],
  [7, 'M6', 90],
  [7, 'M8', 90],
  [8, 'M2', 60],
  [8, 'M3', 90],
  [8, 'M4', 30],
  [8, 'M8', 90],
  [9, 'M2', 90],
  [9, 'M3', 90],
  [9, 'M4', 90],
  [9, 'M6', 90],
  [9, 'M8', 90],
  [10, 'M1', 90],
  [10, 'M2', 90],
  [10, 'M5', 90],
  [10, 'M7', 90],
  [12, 'M3', 90],
  [12, 'M4', 90],
  [12, 'M6', 90],
  [12, 'M8', 90],
];

export const SQL_BASE_SETUP = `import sqlite3

conn = sqlite3.connect(":memory:")
conn.executescript("""
-- Wichtig: shots enthält nur einen bewusst ausgewählten Ausschnitt der
-- Schussereignisse. matches enthält vollständige Mannschaftswerte (Tore, xG,
-- Schüsse) aus einer separaten Quelle. Summen aus shots müssen deshalb NICHT
-- zu matches passen. Eine fehlende Schusszeile bedeutet "nicht im Ausschnitt",
-- nicht "null Ereignisse".
-- players.minutes ist die Saison-Gesamtspielzeit zum Stichtag; appearances
-- enthält nur Einsätze aus der ausgewählten Spielmenge. Für deren Summe muss
-- appearances.minutes verwendet werden, nicht der Saisonwert aus players.
CREATE TABLE players (
  player_id INTEGER PRIMARY KEY, name TEXT, position TEXT, club TEXT,
  minutes INTEGER, goals INTEGER, assists INTEGER, key_passes INTEGER,
  prog_passes INTEGER, xg REAL, xa REAL
);
CREATE TABLE matches (
  match_id TEXT PRIMARY KEY, matchday INTEGER, home TEXT, away TEXT,
  home_goals INTEGER, away_goals INTEGER, home_xg REAL, away_xg REAL,
  home_shots INTEGER, away_shots INTEGER
);
CREATE TABLE shots (
  shot_id TEXT PRIMARY KEY, match_id TEXT, team TEXT, player TEXT,
  minute INTEGER, x REAL, y REAL, xg REAL, outcome TEXT
);
CREATE TABLE passes (
  match_id TEXT, team TEXT, passer TEXT, receiver TEXT, completed INTEGER
);
CREATE TABLE appearances (player_id INTEGER, match_id TEXT, minutes INTEGER);
""")

conn.executescript("""
INSERT INTO players VALUES
${sqlRows(PLAYER_ROWS)};
INSERT INTO matches VALUES
${sqlRows(MATCH_ROWS)};
INSERT INTO shots VALUES
${sqlRows(SHOT_ROWS)};
INSERT INTO passes VALUES
${sqlRows(PASS_ROWS)};
INSERT INTO appearances VALUES
${sqlRows(APPEARANCE_ROWS)};
""")
`;

const ALT_PLAYER_ROWS: SqlValue[][] = [
  [21, 'Ava', 'MF', 'Nord', 600, 2, 1, 8, 20, 1.5, 1.1],
  [22, 'Ben', 'DF', 'Süd', 900, 0, 1, 3, 18, 0.2, 0.8],
  [23, 'Cem', 'FW', 'Nord', 300, 4, 0, 5, 6, 3.2, 0.4],
  [24, 'Dora', 'MF', 'Süd', 200, 0, 1, 4, 9, 0.3, 0.5],
];
const ALT_MATCH_ROWS: SqlValue[][] = [
  ['X1', 1, 'Nord', 'Süd', 2, 0, 1.4, 0.6, 10, 5],
  ['X2', 2, 'Süd', 'Nord', 1, 4, 0.9, 2.3, 6, 14],
  ['X3', 3, 'West', 'Süd', 3, 3, 2.2, 2.0, 13, 12],
  ['X4', 4, 'Süd', 'Nord', 0, 0, 0.5, 0.6, 4, 5],
];
const ALT_SHOT_ROWS: SqlValue[][] = [
  ['T01', 'X1', 'Nord', 'Ava', 10, 108, 40, 0.4, 'Goal'],
  ['T02', 'X1', 'Nord', 'Cem', 30, 104, 46, 0.3, 'Goal'],
  ['T03', 'X1', 'Nord', 'Ava', 55, 110, 35, 0.2, 'Saved'],
  ['T04', 'X1', 'Nord', 'Cem', 70, 99, 52, 0.08, 'Off'],
  ['T05', 'X2', 'Nord', 'Ava', 15, 107, 38, 0.18, 'Goal'],
  ['T06', 'X2', 'Nord', 'Cem', 80, 101, 44, 0.1, 'Saved'],
  ['T07', 'X2', 'Süd', 'Ben', 25, 105, 40, 0.5, 'Goal'],
  ['T08', 'X2', 'Süd', 'Dora', 60, 100, 30, 0.1, 'Saved'],
  ['T09', 'X3', 'Süd', 'Ben', 40, 98, 36, 0.07, 'Off'],
  ['T10', 'X3', 'West', 'Eli', 22, 109, 41, 0.05, 'Saved'],
  ['T11', 'X3', 'West', 'Eli', 77, 102, 45, 0.04, 'Saved'],
];
const ALT_PASS_ROWS: SqlValue[][] = [
  ['X1', 'Nord', 'Ava', 'Cem', 1],
  ['X1', 'Nord', 'Cem', 'Ava', 1],
  ['X1', 'Nord', 'Ben', null, 0],
  ['X2', 'Nord', 'Ben', null, 0],
  ['X2', 'Süd', 'Ben', null, 0],
  ['X2', 'Süd', 'Dora', null, 0],
  ['X2', 'Süd', 'Eli', null, 0],
  ['X3', 'West', 'Eli', 'Ben', 1],
  ['X3', 'West', 'Ben', 'Eli', 1],
];
const ALT_APPEARANCE_ROWS: SqlValue[][] = [
  [21, 'X1', 90],
  [21, 'X2', 90],
  [22, 'X1', 90],
  [22, 'X2', 90],
  [22, 'X3', 90],
  [22, 'X4', 90],
  [23, 'X1', 60],
  [23, 'X2', 60],
  [24, 'X1', 30],
  [24, 'X3', 45],
];

export const SQL_ALT_SETUP = `import sqlite3

conn = sqlite3.connect(":memory:")
conn.executescript("""
-- Wichtig: shots enthält nur einen bewusst ausgewählten Ausschnitt der
-- Schussereignisse. matches enthält vollständige Mannschaftswerte (Tore, xG,
-- Schüsse) aus einer separaten Quelle. Summen aus shots müssen deshalb NICHT
-- zu matches passen. Eine fehlende Schusszeile bedeutet "nicht im Ausschnitt",
-- nicht "null Ereignisse".
-- players.minutes ist die Saison-Gesamtspielzeit zum Stichtag; appearances
-- enthält nur Einsätze aus der ausgewählten Spielmenge. Für deren Summe muss
-- appearances.minutes verwendet werden, nicht der Saisonwert aus players.
CREATE TABLE players (
  player_id INTEGER PRIMARY KEY, name TEXT, position TEXT, club TEXT,
  minutes INTEGER, goals INTEGER, assists INTEGER, key_passes INTEGER,
  prog_passes INTEGER, xg REAL, xa REAL
);
CREATE TABLE matches (
  match_id TEXT PRIMARY KEY, matchday INTEGER, home TEXT, away TEXT,
  home_goals INTEGER, away_goals INTEGER, home_xg REAL, away_xg REAL,
  home_shots INTEGER, away_shots INTEGER
);
CREATE TABLE shots (
  shot_id TEXT PRIMARY KEY, match_id TEXT, team TEXT, player TEXT,
  minute INTEGER, x REAL, y REAL, xg REAL, outcome TEXT
);
CREATE TABLE passes (
  match_id TEXT, team TEXT, passer TEXT, receiver TEXT, completed INTEGER
);
CREATE TABLE appearances (player_id INTEGER, match_id TEXT, minutes INTEGER);
""")

conn.executescript("""
INSERT INTO players VALUES
${sqlRows(ALT_PLAYER_ROWS)};
INSERT INTO matches VALUES
${sqlRows(ALT_MATCH_ROWS)};
INSERT INTO shots VALUES
${sqlRows(ALT_SHOT_ROWS)};
INSERT INTO passes VALUES
${sqlRows(ALT_PASS_ROWS)};
INSERT INTO appearances VALUES
${sqlRows(ALT_APPEARANCE_ROWS)};
""")
`;

export interface DemoEvent {
  match: string;
  team: string;
  type: 'Pass' | 'Shot';
  outcome: string;
  minute: number;
  x: number;
  y: number;
  attacks: 'right' | 'left';
  xg?: number;
}

export const MATCH_EVENTS: DemoEvent[] = [
  {
    match: 'M1',
    team: 'Nordstadt',
    type: 'Pass',
    outcome: 'Complete',
    minute: 3,
    x: 40,
    y: 30,
    attacks: 'right',
  },
  {
    match: 'M1',
    team: 'Nordstadt',
    type: 'Pass',
    outcome: 'Incomplete',
    minute: 7,
    x: 70,
    y: 20,
    attacks: 'right',
  },
  {
    match: 'M1',
    team: 'Hafenstadt',
    type: 'Pass',
    outcome: 'Complete',
    minute: 9,
    x: 80,
    y: 50,
    attacks: 'left',
  },
  {
    match: 'M1',
    team: 'Nordstadt',
    type: 'Shot',
    outcome: 'Goal',
    minute: 12,
    x: 108,
    y: 40,
    attacks: 'right',
    xg: 0.35,
  },
  {
    match: 'M1',
    team: 'Hafenstadt',
    type: 'Shot',
    outcome: 'Saved',
    minute: 22,
    x: 18,
    y: 50,
    attacks: 'left',
    xg: 0.22,
  },
  {
    match: 'M1',
    team: 'Nordstadt',
    type: 'Shot',
    outcome: 'Saved',
    minute: 30,
    x: 99,
    y: 52,
    attacks: 'right',
    xg: 0.12,
  },
  {
    match: 'M1',
    team: 'Hafenstadt',
    type: 'Pass',
    outcome: 'Incomplete',
    minute: 30,
    x: 30,
    y: 60,
    attacks: 'left',
  },
  {
    match: 'M1',
    team: 'Nordstadt',
    type: 'Shot',
    outcome: 'Off',
    minute: 67,
    x: 114,
    y: 34,
    attacks: 'right',
    xg: 0.08,
  },
  {
    match: 'M1',
    team: 'Hafenstadt',
    type: 'Shot',
    outcome: 'Saved',
    minute: 80,
    x: 10,
    y: 36,
    attacks: 'left',
    xg: 0.05,
  },
  {
    match: 'M3',
    team: 'Hafenstadt',
    type: 'Pass',
    outcome: 'Complete',
    minute: 5,
    x: 60,
    y: 40,
    attacks: 'left',
  },
  {
    match: 'M3',
    team: 'Weststadt',
    type: 'Pass',
    outcome: 'Complete',
    minute: 8,
    x: 50,
    y: 55,
    attacks: 'right',
  },
  {
    match: 'M3',
    team: 'Hafenstadt',
    type: 'Shot',
    outcome: 'Goal',
    minute: 15,
    x: 14,
    y: 42,
    attacks: 'left',
    xg: 0.18,
  },
  {
    match: 'M3',
    team: 'Weststadt',
    type: 'Shot',
    outcome: 'Goal',
    minute: 25,
    x: 104,
    y: 46,
    attacks: 'right',
    xg: 0.24,
  },
  {
    match: 'M3',
    team: 'Hafenstadt',
    type: 'Shot',
    outcome: 'Off',
    minute: 33,
    x: 20,
    y: 50,
    attacks: 'left',
    xg: 0.09,
  },
  {
    match: 'M3',
    team: 'Weststadt',
    type: 'Shot',
    outcome: 'Saved',
    minute: 52,
    x: 97,
    y: 52,
    attacks: 'right',
    xg: 0.11,
  },
  {
    match: 'M3',
    team: 'Hafenstadt',
    type: 'Shot',
    outcome: 'Saved',
    minute: 61,
    x: 9,
    y: 38,
    attacks: 'left',
    xg: 0.14,
  },
  {
    match: 'M3',
    team: 'Weststadt',
    type: 'Pass',
    outcome: 'Incomplete',
    minute: 70,
    x: 75,
    y: 20,
    attacks: 'right',
  },
  {
    match: 'M3',
    team: 'Weststadt',
    type: 'Shot',
    outcome: 'Saved',
    minute: 78,
    x: 106,
    y: 35,
    attacks: 'right',
    xg: 0.07,
  },
  {
    match: 'M3',
    team: 'Weststadt',
    type: 'Shot',
    outcome: 'Off',
    minute: 90,
    x: 99,
    y: 44,
    attacks: 'right',
    xg: 0.05,
  },
  {
    match: 'M5',
    team: 'Nordstadt',
    type: 'Shot',
    outcome: 'Goal',
    minute: 10,
    x: 104,
    y: 40,
    attacks: 'right',
    xg: 0.15,
  },
  {
    match: 'M5',
    team: 'Hafenstadt',
    type: 'Shot',
    outcome: 'Saved',
    minute: 50,
    x: 11,
    y: 44,
    attacks: 'left',
    xg: 0.08,
  },
  {
    match: 'M5',
    team: 'Nordstadt',
    type: 'Shot',
    outcome: 'Goal',
    minute: 72,
    x: 112,
    y: 44,
    attacks: 'right',
    xg: 0.42,
  },
  {
    match: 'M7',
    team: 'Nordstadt',
    type: 'Shot',
    outcome: 'Goal',
    minute: 5,
    x: 107,
    y: 36,
    attacks: 'right',
    xg: 0.21,
  },
  {
    match: 'M7',
    team: 'Hafenstadt',
    type: 'Pass',
    outcome: 'Incomplete',
    minute: 20,
    x: 35,
    y: 30,
    attacks: 'left',
  },
  {
    match: 'M7',
    team: 'Nordstadt',
    type: 'Shot',
    outcome: 'Goal',
    minute: 49,
    x: 110,
    y: 43,
    attacks: 'right',
    xg: 0.33,
  },
  {
    match: 'M7',
    team: 'Nordstadt',
    type: 'Pass',
    outcome: 'Complete',
    minute: 60,
    x: 60,
    y: 40,
    attacks: 'right',
  },
  {
    match: 'M7',
    team: 'Hafenstadt',
    type: 'Shot',
    outcome: 'Off',
    minute: 70,
    x: 15,
    y: 41,
    attacks: 'left',
    xg: 0.05,
  },
  {
    match: 'M7',
    team: 'Nordstadt',
    type: 'Shot',
    outcome: 'Goal',
    minute: 81,
    x: 101,
    y: 48,
    attacks: 'right',
    xg: 0.12,
  },
  {
    match: 'M8',
    team: 'Weststadt',
    type: 'Shot',
    outcome: 'Goal',
    minute: 18,
    x: 105,
    y: 37,
    attacks: 'right',
    xg: 0.26,
  },
  {
    match: 'M8',
    team: 'Nordstadt',
    type: 'Shot',
    outcome: 'Goal',
    minute: 22,
    x: 107,
    y: 42,
    attacks: 'right',
    xg: 0.3,
  },
  {
    match: 'M8',
    team: 'Weststadt',
    type: 'Shot',
    outcome: 'Off',
    minute: 59,
    x: 109,
    y: 47,
    attacks: 'right',
    xg: 0.14,
  },
  {
    match: 'M8',
    team: 'Nordstadt',
    type: 'Shot',
    outcome: 'Off',
    minute: 77,
    x: 100,
    y: 33,
    attacks: 'right',
    xg: 0.1,
  },
];

export const PASS_EVENTS = [
  { match: 'M1', team: 'Nordstadt', passer: 'Ada', receiver: 'Mira', completed: 1 },
  { match: 'M1', team: 'Nordstadt', passer: 'Mira', receiver: 'Ada', completed: 1 },
  { match: 'M1', team: 'Nordstadt', passer: 'Pia', receiver: null, completed: 0 },
  { match: 'M1', team: 'Hafenstadt', passer: 'Nora', receiver: 'Lea', completed: 1 },
  { match: 'M1', team: 'Hafenstadt', passer: 'Lea', receiver: null, completed: 0 },
  { match: 'M3', team: 'Hafenstadt', passer: 'Nora', receiver: 'Lea', completed: 1 },
  { match: 'M3', team: 'Hafenstadt', passer: 'Lea', receiver: 'Nora', completed: 1 },
  { match: 'M3', team: 'Weststadt', passer: 'Ria', receiver: 'Sina', completed: 1 },
  { match: 'M3', team: 'Weststadt', passer: 'Sina', receiver: null, completed: 0 },
  { match: 'M7', team: 'Nordstadt', passer: 'Pia', receiver: 'Ada', completed: 1 },
  { match: 'M7', team: 'Nordstadt', passer: 'Ada', receiver: 'Mira', completed: 1 },
  { match: 'M8', team: 'Weststadt', passer: 'Ria', receiver: 'Sina', completed: 1 },
  { match: 'M8', team: 'Weststadt', passer: 'Sina', receiver: 'Ria', completed: 1 },
];

export const EVENT_SETUP = `events = ${JSON.stringify(MATCH_EVENTS)}`;
export const PASS_SETUP = `passes = ${JSON.stringify(PASS_EVENTS).replace(/\bnull\b/g, 'None')}`;

export const GOAL_EVENTS = MATCH_EVENTS.filter(
  (event) => event.type === 'Shot' && event.outcome === 'Goal',
);
export const GOAL_SETUP = `goals = ${JSON.stringify(GOAL_EVENTS)}`;

export const PLAYERS_CSV = `player_id,name,position,club,minutes,goals,assists,key_passes,prog_passes,xg,xa
1,Ada,MF,Nordstadt,900,4,3,18,42,3.1,2.4
2,Mira,FW,Nordstadt,810,7,1,9,12,6.2,1.1
3,Lea,MF,Hafenstadt,180,1,0,3,8,0.4,0.3
4,Nora,MF,Hafenstadt,450,2,2,7,19,1.0,1.6
5,Pia,DF,Nordstadt,990,1,1,5,21,0.6,0.9
6,Uta,DF,Hafenstadt,800,0,2,4,26,0.2,1.2
7,Ria,MF,Weststadt,620,3,4,14,31,1.8,2.9
8,Sina,FW,Weststadt,360,3,0,4,5,2.7,0.2
9,Tine,DF,Weststadt,1080,0,1,3,12,0.1,0.7
10,Ina,GK,Nordstadt,1080,0,0,0,2,0.0,0.0
11,Jona,MF,Nordstadt,449,2,1,6,15,0.9,1.0
12,Lina,MF,Weststadt,700,5,2,11,24,2.2,1.5`;

export const SCOUTING_SETUP = `import io
import pandas as pd

csv_text = """${PLAYERS_CSV}"""
players = pd.read_csv(io.StringIO(csv_text))`;

export const XT_SETUP = `grid = [
  [0.01, 0.01, 0.02, 0.02, 0.03, 0.04, 0.05, 0.06, 0.08, 0.10, 0.12, 0.15],
  [0.01, 0.02, 0.02, 0.03, 0.04, 0.05, 0.06, 0.08, 0.10, 0.13, 0.16, 0.20],
  [0.01, 0.02, 0.03, 0.04, 0.05, 0.06, 0.08, 0.10, 0.13, 0.17, 0.21, 0.26],
  [0.02, 0.03, 0.04, 0.05, 0.06, 0.08, 0.10, 0.13, 0.17, 0.22, 0.27, 0.33],
  [0.02, 0.03, 0.04, 0.05, 0.06, 0.08, 0.10, 0.13, 0.17, 0.22, 0.27, 0.33],
  [0.01, 0.02, 0.03, 0.04, 0.05, 0.06, 0.08, 0.10, 0.13, 0.17, 0.21, 0.26],
  [0.01, 0.02, 0.02, 0.03, 0.04, 0.05, 0.06, 0.08, 0.10, 0.13, 0.16, 0.20],
  [0.01, 0.01, 0.02, 0.02, 0.03, 0.04, 0.05, 0.06, 0.08, 0.10, 0.12, 0.15],
]`;

export const check = (label: string, expression: string, expected: unknown): Check => ({
  label,
  expression,
  expected,
});
