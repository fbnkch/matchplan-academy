import type { Check, Lesson } from '../types';
import { PRACTICE_SHOTS_SETUP } from './practice-data';

const pitfalls = {
  title: 'scikit-learn: Common pitfalls',
  url: 'https://scikit-learn.org/stable/common_pitfalls.html',
};
const evaluation = {
  title: 'scikit-learn: Model evaluation',
  url: 'https://scikit-learn.org/stable/modules/model_evaluation.html',
};
const calibration = {
  title: 'scikit-learn: Probability calibration',
  url: 'https://scikit-learn.org/stable/modules/calibration.html',
};
const geometrySource = {
  title: 'Soccermatics: Geometry of shooting',
  url: 'https://soccermatics.readthedocs.io/en/latest/lesson2/GeometryOfShooting.html',
};
const check = (label: string, expression: string, expected: unknown = true): Check => ({
  label,
  expression: typeof expected === 'boolean' ? `bool(${expression})` : expression,
  expected,
});
const imports = `import numpy as np
import pandas as pd
`;

// Complete, deliberately synthetic fixtures. No network or production-data assumptions in checks.
const fixture = `${imports}
shots = pd.DataFrame([
 ['a', 31, '2022-11-01', 'A', 'Ada', 108., 40., 0, 'Right Foot', 'Open Play', .2],
 ['b', 31, '2022-11-01', 'B', 'Ben', 100., 36., 1, 'Head', 'Open Play', .1],
 ['c', 12, '2022-11-02', 'A', 'Ada', 110., 44., 0, 'Left Foot', 'Open Play', .3],
 ['d', 12, '2022-11-02', 'B', 'Ben', 90., 30., 0, 'Right Foot', 'Free Kick', .05],
 ['e', 45, '2022-11-03', 'C', 'Cem', 115., 40., 1, 'Right Foot', 'Open Play', .6],
 ['f', 45, '2022-11-03', 'A', 'Ada', 80., 20., 0, 'Head', 'Open Play', .02],
 ['g', 18, '2022-11-04', 'D', 'Dora', 105., 50., 0, 'Left Foot', 'Open Play', .12],
 ['h', 18, '2022-11-04', 'C', 'Cem', 112., 40., 1, 'Right Foot', 'Penalty', .78],
], columns=['event_id','match_id','match_date','team','player','x','y','goal','body_part','shot_type','provider_xg'])
`;
const changedFixture = `${fixture}
shots = shots.iloc[[7, 1, 6, 0, 5, 2, 4, 3]].copy()
shots['x'] = shots['x'] - 7
shots['goal'] = 1 - shots['goal']
shots['provider_xg'] = .99
shots.index = range(20, 28)
`;

const designSolution = `${imports}
def shot_design(frame):
    X = frame.loc[:, ['x', 'y', 'body_part', 'shot_type']].copy()
    y = frame['goal'].astype(int).copy()
    return X, y

X, y = shot_design(shots)
`;
const geometrySolution = `${imports}
def shot_geometry(frame):
    x = frame['x'].to_numpy(dtype=float)
    y = frame['y'].to_numpy(dtype=float)
    if not (np.isfinite(x).all() and np.isfinite(y).all()):
        raise ValueError('Koordinaten müssen endlich sein')
    if ((x < 0) | (x > 120) | (y < 0) | (y > 80)).any():
        raise ValueError('Außerhalb des StatsBomb-Feldes')
    dx, dy = 120 - x, y - 40
    angle = np.arctan2(8 * dx, dx ** 2 + dy ** 2 - 16)
    return pd.DataFrame({'distance': np.hypot(dx, dy), 'angle': angle}, index=frame.index)

features = shot_geometry(shots)
`;
const splitSolution = `${imports}
def split_matches(frame, n_test=2, embargo=0):
    if n_test < 1 or embargo < 0:
        raise ValueError('Ungültige Fenster')
    meta = frame[['match_id', 'match_date']].drop_duplicates()
    if meta['match_id'].duplicated().any():
        raise ValueError('Ein Match hat mehrere Daten')
    meta = meta.sort_values(['match_date', 'match_id'])
    if len(meta) <= n_test + embargo:
        raise ValueError('Kein Trainingsmatch')
    test_start = meta.iloc[-n_test]['match_date']
    earlier = meta[meta['match_date'] < test_start]
    if len(earlier) <= embargo:
        raise ValueError('Kein Trainingsmatch nach Datumserweiterung')
    train_end = earlier.iloc[-embargo]['match_date'] if embargo else test_start
    train = frame[frame['match_date'] < train_end].copy()
    test = frame[frame['match_date'] >= test_start].copy()
    if train.empty:
        raise ValueError('Kein Trainingsdatum nach Embargo')
    return train, test

train, test = split_matches(shots)
`;
const baselineSolution = `${imports}
from sklearn.dummy import DummyClassifier
from sklearn.metrics import brier_score_loss, log_loss

def baseline_scores(train_y, test_y):
    train_y = np.asarray(train_y, dtype=int)
    test_y = np.asarray(test_y, dtype=int)
    model = DummyClassifier(strategy='prior').fit(np.zeros((len(train_y), 1)), train_y)
    probabilities = model.predict_proba(np.zeros((len(test_y), 1)))
    p = probabilities[:, list(model.classes_).index(1)] if 1 in model.classes_ else np.zeros(len(test_y))
    return {'p': p, 'brier': float(brier_score_loss(test_y, p)),
            'logloss': float(log_loss(test_y, np.column_stack([1-p, p]), labels=[0, 1]))}

baseline = baseline_scores(shots['goal'].iloc[:4], shots['goal'].iloc[4:])
`;
const calibrationSolution = `${imports}
from sklearn.metrics import brier_score_loss, log_loss

def probability_audit(y, p, edges=(0., .1, .3, 1.), min_count=5):
    y, p, edges = np.asarray(y), np.asarray(p, dtype=float), np.asarray(edges, dtype=float)
    if len(y) == 0 or len(y) != len(p) or not np.isin(y, [0,1]).all():
        raise ValueError('Binäre Zielwerte gleicher Länge erforderlich')
    if not np.isfinite(p).all() or ((p < 0) | (p > 1)).any():
        raise ValueError('Ungültige Wahrscheinlichkeiten')
    if len(edges) < 2 or edges[0] != 0 or edges[-1] != 1 or not (np.diff(edges) > 0).all():
        raise ValueError('Bin-Grenzen müssen von 0 bis 1 steigen')
    rows = []
    for i, (left, right) in enumerate(zip(edges[:-1], edges[1:])):
        mask = (p >= left) & ((p <= right) if i == len(edges)-2 else (p < right))
        n = int(mask.sum())
        rows.append({'bin': i, 'n': n, 'mean_p': float(p[mask].mean()) if n else None,
                     'rate': float(y[mask].mean()) if n else None, 'sparse': n < min_count})
    return {'brier': float(brier_score_loss(y, p)),
            'logloss': float(log_loss(y, np.column_stack([1-p, p]), labels=[0,1])), 'bins': rows}

audit = probability_audit(shots['goal'], shots['provider_xg'])
`;
const bootstrapSolution = `${imports}
def cluster_interval(frame, n_boot=1000, seed=42):
    if n_boot < 2 or frame.empty:
        raise ValueError('Mindestens zwei Replikate und Daten erforderlich')
    groups = frame.groupby('match_id', sort=True).agg(goals=('goal','sum'), n=('goal','size'))
    rng = np.random.default_rng(seed)
    totals = groups[['goals','n']].to_numpy(dtype=float)
    draws = rng.integers(0, len(totals), size=(n_boot, len(totals)))
    sampled = totals[draws].sum(axis=1)
    reps = sampled[:,0] / sampled[:,1]
    low, high = np.quantile(reps, [.025, .975])
    return {'estimate': float(frame['goal'].mean()), 'low': float(low), 'high': float(high), 'replicates': reps}

interval = cluster_interval(shots)
`;
const peersSetup = `${imports}
# Explizit synthetische Vergleichsgruppe, keine WM-Spielerdaten oder erfundenen Einsatzminuten.
peers = pd.DataFrame({'player':['Ada','Ben','Cem','Dora'], 'minutes':[180,900,720,450],
                      'goals':[3,8,5,4], 'xg':[1.,7.,4.,2.]})
`;
const sensitivitySolution = `${imports}
def rank_sensitivity(peers, thresholds=(180, 450, 900)):
    if peers['player'].duplicated().any() or (peers['minutes'] <= 0).any():
        raise ValueError('Eindeutige Spieler mit positiven Minuten erforderlich')
    rows = []
    for threshold in thresholds:
        eligible = peers[peers['minutes'] >= threshold].copy()
        eligible['score'] = 90 * (eligible['goals'] - eligible['xg']) / eligible['minutes']
        eligible = eligible.sort_values(['score', 'player'], ascending=[False, True])
        for rank, (_, row) in enumerate(eligible.iterrows(), 1):
            rows.append({'threshold': threshold, 'player': row['player'], 'score': float(row['score']), 'rank': rank})
    return pd.DataFrame(rows, columns=['threshold','player','score','rank'])

ranks = rank_sensitivity(peers)
`;
const reviewSolution = `${geometrySolution}\n${splitSolution}\n${baselineSolution}\n${calibrationSolution}
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression

def evaluation_report(frame, n_test=2, embargo=0, C=1., seed=42):
    train, test = split_matches(frame, n_test, embargo)
    if train['goal'].nunique() != 2:
        raise ValueError('Training benötigt beide Zielklassen')
    X_train, X_test = shot_geometry(train), shot_geometry(test)
    model = make_pipeline(StandardScaler(), LogisticRegression(C=C, random_state=seed, max_iter=1000))
    model.fit(X_train, train['goal'])
    p = model.predict_proba(X_test)[:, list(model.classes_).index(1)]
    audit = probability_audit(test['goal'], p)
    base = baseline_scores(train['goal'], test['goal'])
    return {'train_ids': sorted(train['match_id'].unique().tolist()),
            'test_ids': sorted(test['match_id'].unique().tolist()),
            'event_ids': test['event_id'].tolist(), 'p': p,
            'scaler_mean': model.named_steps['standardscaler'].mean_,
            'brier': audit['brier'], 'logloss': audit['logloss'], 'bins': audit['bins'],
            'baseline_brier': base['brier'], 'baseline_logloss': base['logloss'],
            'delta_brier': audit['brier'] - base['brier']}

report = evaluation_report(shots)
`;

const common = {
  trackId: 'science-practice',
  packages: ['pandas', 'numpy', 'scikit-learn'],
  setup: PRACTICE_SHOTS_SETUP,
};
const designChecks = [
  check(
    'Whitelist statt nachträglichem Drop',
    "shot_design(shots.assign(result_text='Goal', future=999))[0].columns.tolist()",
    ['x', 'y', 'body_part', 'shot_type'],
  ),
  check(
    'Zielwerte und Index bleiben verbunden',
    "shot_design(shots)[1].equals(shots['goal'].astype(int))",
  ),
  check(
    'Keine Eingabemutation',
    '(lambda f: (shot_design(f), f.equals(shots))[-1])(shots.copy(deep=True))',
  ),
  check(
    'Neue Zeilen und Werte werden übernommen',
    "(lambda f: shot_design(f)[0]['x'].tolist() == [71., 82.] and shot_design(f)[1].tolist() == [1,0])(shots.iloc[:2].assign(x=[71.,82.],goal=[1,0]))",
  ),
];
const geometryChecks = [
  check(
    'Unabhängige geometrische Referenzpunkte',
    "np.allclose(shot_geometry(pd.DataFrame({'x':[117.,120.,110.], 'y':[44.,40.,40.]},index=[9,2,7])).to_numpy(), [[5.,np.arctan2(24.,9.)],[0.,np.pi],[10.,2*np.arctan(.4)]])",
  ),
  check(
    'Spiegelung und Index',
    "(lambda f: np.allclose(shot_geometry(f),shot_geometry(f.assign(y=80-f['y']))) and shot_geometry(f).index.equals(f.index))(shots)",
  ),
  {
    ...check(
      'Ungültige Koordinaten ablehnen',
      "shot_geometry(pd.DataFrame({'x':[121.],'y':[40.]}))",
    ),
    raises: 'ValueError',
  },
  {
    ...check(
      'NaN ist keine Schussposition',
      "shot_geometry(pd.DataFrame({'x':[float('nan')],'y':[40.]}))",
    ),
    raises: 'ValueError',
  },
];
const splitChecks = [
  check(
    'Späte ganze Matches unabhängig von Zeilenfolge',
    '(lambda parts: set(parts[0].match_id)=={31,12} and set(parts[1].match_id)=={45,18} and len(parts[0])+len(parts[1])==len(shots))(split_matches(shots,2))',
  ),
  check(
    'Embargo entfernt genau ein Match',
    "(lambda parts: set(parts[0].event_id)=={'a','b'} and set(parts[1].event_id)=={'g','h'})(split_matches(shots,1,2))",
  ),
  check(
    'Testgrenze erweitert auf das ganze Datum',
    "(lambda parts: set(parts[0].match_id)=={31,12} and set(parts[1].match_id)=={45,18} and parts[0].match_date.max()<parts[1].match_date.min())(split_matches(shots.assign(match_date=shots.match_id.map({31:'2022-11-01',12:'2022-11-02',45:'2022-11-03',18:'2022-11-03'})),1))",
  ),
  check(
    'Embargogrenze entfernt ebenfalls das ganze Datum',
    "(lambda parts: set(parts[0].match_id)=={31} and set(parts[1].match_id)=={18})(split_matches(shots.assign(match_date=shots.match_id.map({31:'2022-11-01',12:'2022-11-02',45:'2022-11-02',18:'2022-11-03'})),1,1))",
  ),
  {
    ...check(
      'Nur ein Datum kann nicht aufgeteilt werden',
      "split_matches(shots.assign(match_date='2022-11-01'),1)",
    ),
    raises: 'ValueError',
  },
  { ...check('Leeres Trainingsfenster ablehnen', 'split_matches(shots,4)'), raises: 'ValueError' },
  {
    ...check(
      'Widersprüchliche Matchdaten ablehnen',
      "split_matches(pd.concat([shots,shots.iloc[:1].assign(match_date='2022-12-01')]))",
    ),
    raises: 'ValueError',
  },
];
const baselineChecks = [
  check(
    'Prior nur aus Training, exakter Brier',
    "(lambda r: np.allclose(r['p'],[.25,.25,.25]) and np.isclose(r['brier'],19/48) and np.isclose(r['logloss'],-(2*np.log(.25)+np.log(.75))/3))(baseline_scores([0,0,0,1],[1,0,1]))",
  ),
  check(
    'Vertauschte Zielverteilung, kein fester Prior',
    "(lambda r: np.allclose(r['p'],[.75,.75]) and np.isclose(r['brier'],.3125))(baseline_scores([1,0,1,1],[0,1]))",
  ),
  check(
    'Ein-Klassen-Training bleibt definierter Dummy',
    "np.allclose(baseline_scores([0,0],[1,0])['p'],[0,0]) and np.allclose(baseline_scores([1,1],[0,1])['p'],[1,1])",
  ),
];
const auditChecks = [
  check(
    'Proper Scores mit unabhängiger Referenz',
    "(lambda a: np.isclose(a['brier'],.1) and np.isclose(a['logloss'],-np.log(.8*.6)/2))(probability_audit([0,1],[.2,.6]))",
  ),
  check(
    'Bin-Grenzen, leere und dünne Bins explizit',
    "(lambda a: [r['n'] for r in a['bins']]==[1,2,1] and np.allclose([r['rate'] for r in a['bins']],[0,.5,1]) and [r['sparse'] for r in a['bins']]==[True,False,True])(probability_audit([0,1,0,1],[0,.25,.25,1],(0,.25,.75,1),2))",
  ),
  check(
    'Leere Bins tragen keine erfundene Rate',
    "probability_audit([1],[1.])['bins'][0]['rate'] is None",
  ),
  check(
    'Binmittel verwendet Prognosen statt Intervallmitte',
    "np.isclose(probability_audit([0,1],[.12,.22])['bins'][1]['mean_p'],.17)",
  ),
  {
    ...check('Werte außerhalb [0,1] ablehnen', 'probability_audit([1],[1.1])'),
    raises: 'ValueError',
  },
];
const bootstrapChecks = [
  check(
    'Schussgewichteter Punktschätzer statt Mittel der Matchquoten',
    "np.isclose(cluster_interval(pd.DataFrame({'match_id':[1,2,2,2], 'goal':[1,0,0,0]}))['estimate'],.25)",
  ),
  check(
    'Cluster-Replikate enthalten nur mögliche ganze Matchziehungen',
    "(lambda r: np.isin(np.round(r['replicates'],8),[0.,.25,1.]).all() and len(np.unique(r['replicates']))==3)(cluster_interval(pd.DataFrame({'match_id':[1,2,2,2], 'goal':[1,0,0,0]}),200,7))",
  ),
  check(
    'Reihenfolge egal, Seed reproduzierbar und Quantile korrekt',
    "(lambda a,b: np.array_equal(a['replicates'],b['replicates']) and np.allclose([a['low'],a['high']],np.quantile(a['replicates'],[.025,.975])))(cluster_interval(shots,80,3),cluster_interval(shots.iloc[::-1],80,3))",
  ),
  check(
    'Ein Match liefert degeneriertes Intervall',
    "(lambda r: np.allclose(r['replicates'],[.5]*20) and r['low']==r['high']==.5)(cluster_interval(pd.DataFrame({'match_id':[9,9],'goal':[0,1]}),20,5))",
  ),
  check(
    'Drei ungleiche Cluster: vollständige Seed-Replikate zählen jede Ziehung',
    "(lambda r, draws: (lambda counts: np.allclose(r['replicates'],(counts @ np.array([1.,1.,0.]))/(counts @ np.array([1.,2.,4.]))) and np.allclose([r['low'],r['high']],np.quantile((counts @ np.array([1.,1.,0.]))/(counts @ np.array([1.,2.,4.])),[.025,.975])))(np.eye(3,dtype=int)[draws].sum(axis=1)))(cluster_interval(pd.DataFrame({'match_id':[30,10,20,30,20,30,30],'goal':[0,1,1,0,0,0,0]}),97,17),np.random.default_rng(17).integers(0,3,size=(97,3)))",
  ),
];
const rankChecks = [
  check(
    'Minutengrenzen und per-90 statt Rohdifferenz',
    "(lambda r: r.player.tolist()==['Ada','Dora','Cem','Ben','Dora','Cem','Ben','Ben'] and np.allclose(r.score,[1.,.4,.125,.1,.4,.125,.1,.1]) and r['rank'].tolist()==[1,2,3,4,1,2,3,1])(rank_sensitivity(peers))",
  ),
  check(
    'Gleichstand alphabetisch, neue Gruppe und leeres Fenster',
    "(lambda r: r.player.tolist()==['A','Z'] and r['rank'].tolist()==[1,2] and np.allclose(r.score,[.5,.5]))(rank_sensitivity(pd.DataFrame({'player':['Z','A'],'minutes':[180,360],'goals':[2,4],'xg':[1,2]}),(180,500)))",
  ),
  {
    ...check(
      'Null Minuten nicht stillschweigend dividieren',
      'rank_sensitivity(peers.assign(minutes=0))',
    ),
    raises: 'ValueError',
  },
];

// References use explicit fixture match membership and independently fitted pipelines,
// never the learner's split, geometry, scoring or scaling helpers.
const pipelineReference = (
  frame: string,
  trainIds: number[],
  testIds: number[],
  nTest = 2,
  embargo = 0,
  C = 1,
  seed = 42,
) =>
  `(lambda f: (lambda r, tr, te: (lambda a,b: (lambda m: np.allclose(r['p'],m.predict_proba(b)[:,1],rtol=1e-7,atol=1e-9) and np.allclose(r['scaler_mean'],a.mean(axis=0),rtol=1e-10,atol=1e-10) and np.isclose(r['brier'],np.mean((te.goal.to_numpy()-r['p'])**2)) and np.isclose(r['baseline_brier'],np.mean((te.goal-tr.goal.mean())**2)))(__import__('sklearn.pipeline',fromlist=['make_pipeline']).make_pipeline(__import__('sklearn.preprocessing',fromlist=['StandardScaler']).StandardScaler(),__import__('sklearn.linear_model',fromlist=['LogisticRegression']).LogisticRegression(C=${C},random_state=${seed},max_iter=1000)).fit(a,tr.goal)))(np.column_stack([np.sqrt((120-tr.x)**2+(tr.y-40)**2),np.arctan2(8*(120-tr.x),(120-tr.x)**2+(tr.y-40)**2-16)]),np.column_stack([np.sqrt((120-te.x)**2+(te.y-40)**2),np.arctan2(8*(120-te.x),(120-te.x)**2+(te.y-40)**2-16)])))(evaluation_report(f,${nTest},${embargo},${C},${seed}),f[f.match_id.isin(${JSON.stringify(trainIds)})],f[f.match_id.isin(${JSON.stringify(testIds)})]))(${frame})`;
const reviewChecks = [
  check(
    'Train-only Pipeline mit Embargo stimmt mit unabhängiger Referenz überein',
    pipelineReference('shots', [31, 12], [18], 1, 1, 0.7, 9),
  ),
  check(
    'Standardfenster: Vorhersagen und Trainingsmittel unabhängig geprüft',
    pipelineReference('shots', [31, 12], [45, 18]),
  ),
  check(
    'Verschobene Testfeatures ohne Embargo dürfen Skalierung nicht mitlernen',
    pipelineReference(
      'shots.assign(x=np.where(shots.match_id==18,20.,shots.x),y=np.where(shots.match_id==18,75.,shots.y))',
      [31, 12, 45],
      [18],
      1,
      0,
      2.3,
      7,
    ),
  ),
  check(
    'Report erweitert auch bei n_test=1 den gesamten letzten Tag',
    pipelineReference(
      "shots.assign(match_date=shots.match_id.map({31:'2022-11-01',12:'2022-11-02',45:'2022-11-03',18:'2022-11-03'}))",
      [31, 12],
      [45, 18],
      1,
    ),
  ),
  check(
    'Report enthält ganze Matchfenster und ausgerichtete Ereignisse',
    "(lambda r: r['train_ids']==[12,31] and r['test_ids']==[18] and r['event_ids']==shots.loc[shots.match_id==18,'event_id'].tolist() and np.isclose(r['delta_brier'],r['brier']-r['baseline_brier']))(evaluation_report(shots,1,1))",
  ),
  check(
    'Testlabels beeinflussen weder Fit noch Vorhersagen',
    "np.allclose(evaluation_report(shots,1)['p'],evaluation_report(shots.assign(goal=np.where(shots.match_id==18,1-shots.goal,shots.goal)),1)['p'])",
  ),
  check(
    'Provider-Modell ist kein Eingabefeature',
    "np.allclose(evaluation_report(shots,1)['p'],evaluation_report(shots.assign(provider_xg=1-shots.provider_xg),1)['p'])",
  ),
  check(
    'Logloss und Reliability aus tatsächlichen Testprognosen',
    "(lambda r,t: np.isclose(r['logloss'],__import__('sklearn.metrics',fromlist=['log_loss']).log_loss(t.goal,np.column_stack([1-r['p'],r['p']]),labels=[0,1])) and np.isclose(r['baseline_logloss'],__import__('sklearn.metrics',fromlist=['log_loss']).log_loss(t.goal,np.tile([1-shots.loc[~shots.match_id.isin([45,18]),'goal'].mean(),shots.loc[~shots.match_id.isin([45,18]),'goal'].mean()],(len(t),1)),labels=[0,1])) and sum(b['n'] for b in r['bins'])==len(t) and np.isclose(sum(b['n']*b['mean_p'] for b in r['bins'] if b['n']),sum(r['p'])))(evaluation_report(shots,2),shots[shots.match_id.isin([45,18])])",
  ),
  {
    ...check(
      'Ein-Klassen-Training wird ehrlich abgelehnt',
      'evaluation_report(shots.assign(goal=0))',
    ),
    raises: 'ValueError',
  },
];

export const sciencePracticeLessons: Lesson[] = [
  {
    ...common,
    id: 'ds-question',
    title: 'Eine prüfbare Frage an ein xG-Modell formulieren',
    minutes: 45,
    concept: 'Estimand, Beobachtungseinheit und zulässiger Informationsstand',
    objective:
      'Festlegen, welche Schusswahrscheinlichkeit untersucht wird und welche Informationen der wiederverwendbare Datenvertrag zulässt.',
    prerequisites: ['stat-leakage', 'de-review'],
    explanation: [
      'Die Arbeitsfrage lautet: Wie gut lassen sich Tore bereits beobachteter Schüsse aus ihrer Situation zum Zeitpunkt des Abschlusses vorhersagen? Die Einheit ist ein Schuss, das Ziel goal. Geschätzt wird eine bedingte Wahrscheinlichkeit innerhalb dieser Schussauswahl, weder die Wahrscheinlichkeit eines künftigen Schusses noch der kausale Einfluss eines Spielers. Die zwölf chronologisch geordneten Spiele und ihre Schüsse sind synthetisch erzeugt. Sie prüfen die Methode, nicht ihre Übertragbarkeit auf eine echte Liga.',
      'x, y, body_part und shot_type beschreiben hier den Abschluss im Moment der Ausführung. Sie sind für diese retrospektive Pre-shot-Frage zulässig; für eine Live-Prognose Sekunden davor wären manche Angaben noch unbekannt. goal ist das Ziel. provider_xg ist ein bereits modelliertes Vergleichssignal, keine Eingabe unseres eigenen Basismodells. event_id, match_id und match_date dienen Identität und Evaluation; team und player lassen wir bewusst aus dem Modellvertrag.',
      'Lege die zulässigen Eingabespalten ausdrücklich fest. Entfernst du nur eine bekannte Leakage-Spalte, kann eine später ergänzte Ergebnisvariable unbemerkt ins Modell gelangen. Die Funktion prüft die Spaltenauswahl technisch. Du musst zusätzlich begründen, wann diese Angaben verfügbar sind und für welche Schüsse die Untersuchung gelten soll. Schreibe dazu einen knappen Datenvertrag, prüfe ihn an Gegenbeispielen und überarbeite ihn schriftlich.',
    ],
    example: `# Andere Fragestellung: Vorhersage einer Verspätung vor Fahrtbeginn.
available_at_departure = ['planned_distance', 'weekday']
print('arrival_delay gehört zum Ziel, nicht in die Eingabe')`,
    task: 'Schreibe shot_design(frame) -> (X, y): X enthält exakt x,y,body_part,shot_type in dieser Reihenfolge, y die ganzzahlige goal-Serie. Erhalte Zeilenindex und Reihenfolge, verändere frame nicht. Wende die Funktion auf shots an. Schreibe danach ein Untersuchungsprotokoll mit Zielpopulation, Zeitpunkt, Ausschlüssen, Rolle von provider_xg und zwei Gegenfragen, die diese Daten nicht beantworten. Prüfe deine Whitelist mit zusätzlichen Ergebnis- und Identitätsspalten.',
    starter: `${imports}\ndef shot_design(frame):\n    # Leite den Datenvertrag aus der Fragestellung ab.\n    raise NotImplementedError\n\nX, y = shot_design(shots)`,
    solution: designSolution,
    hints: [
      'Trenne Ziel, Features, Vergleichsmodell und Evaluationsschlüssel zunächst auf Papier.',
      'Eine explizite Spaltenliste verhindert, dass neue Ergebnisspalten unbemerkt eintreten.',
      'Nutze .loc mit einer Whitelist und .copy(); y erhält denselben Index. Prüfe auch eine umsortierte Teilmenge.',
    ],
    checks: designChecks,
    variants: [
      {
        label: 'Umsortiert, anderes Ziel und neue Indizes',
        setup: changedFixture,
        checks: designChecks,
      },
    ],
    reflection:
      'Wie würde sich dein Datenvertrag ändern, wenn die Prognose fünf Sekunden vor dem Schuss verfügbar sein müsste?',
    rubric: [
      'Estimand, Einheit und Zeitbezug sind explizit; keine Talent- oder Kausalaussage.',
      'Whitelist und Ziel bleiben bei fremden Spalten und neuen Zeilen korrekt.',
      'Die schriftliche Begründung trennt technische Check-Erfüllung von fachlicher Zulässigkeit.',
    ],
    sources: [pitfalls, geometrySource],
  },
  {
    ...common,
    id: 'ds-features',
    title: 'Torgeometrie als überprüfbare Transformation',
    minutes: 60,
    concept: 'Geometrische Features, Randfälle und Symmetrien',
    objective:
      'Distanz und Toröffnungswinkel vektorisieren und mit geometrischen Invarianten absichern.',
    prerequisites: ['ds-question'],
    explanation: [
      'Die Übungsdaten verwenden die von StatsBomb bekannte 120 × 80-Konvention, mit dem angegriffenen Tor bei x=120 und den Pfosten y=36 und y=44. Diese Einheiten sind keine Meter. Der Abstand zur Tormitte ist hypot(120-x,y-40). Der Winkel zwischen den Pfosten enthält andere Information als die Distanz; dieselbe Entfernung kann frontal oder seitlich entstehen.',
      'Für dx=120-x und dy=y-40 liefert atan2(8·dx, dx²+dy²−16) den nichtnegativen Winkel in Radiant. atan eines Quotienten verliert die Quadranteninformation nahe der Torlinie. Als explizite Grenzkonvention gilt im Zentrum auf der Torlinie der Winkel π, außerhalb der Pfosten auf der Torlinie 0. Koordinaten müssen endlich und im Feld sein.',
      'Die Transformation braucht keine Zielwerte und lernt keine Statistik. Später folgt jedoch ein gelernter Scaler, der ausschließlich Trainingsdaten sehen darf. Leite die Formeln her und stelle eigene Grenzfälle in einer Tabelle zusammen; kontrolliere den Zusammenhang auch grafisch. Die automatischen Checks prüfen Zahlen und Symmetrie. Die Qualität einer optionalen Abbildung musst du selbst beurteilen.',
    ],
    example: `# Winkel zwischen zwei anderen Vektoren, keine Schusslösung.
u, v = np.array([2.,0.]), np.array([0.,3.])
print(np.arctan2(abs(np.linalg.det(np.stack([u,v]))), np.dot(u,v)))`,
    task: 'Implementiere shot_geometry(frame) -> DataFrame mit Spalten distance,angle, unverändertem Index und ohne Mutation. Nutze die oben definierte Geometrie; wirf ValueError bei NaN, Unendlich oder Koordinaten außerhalb [0,120]×[0,80]. Berechne features für shots. Leite mindestens sechs eigene Referenzpunkte her. Erstelle optional eine matplotlib-Abbildung Winkel gegen Distanz und erkläre zwei geometrisch verschiedene Bereiche; die Grafik ist kein Bestehenscheck.',
    starter: `${imports}\ndef shot_geometry(frame):\n    raise NotImplementedError\n\nfeatures = shot_geometry(shots)`,
    solution: geometrySolution,
    hints: [
      'Zeichne Pfosten und Schuss; arbeite erst mit dx und dy.',
      'Nutze atan2 für den Winkel. Spiegelung an y=40 darf beide Features nicht ändern.',
      'Baue den Rückgabe-DataFrame mit index=frame.index; prüfe Wertebereiche vor der Berechnung.',
    ],
    checks: geometryChecks,
    variants: [
      {
        label: 'Andere Positionen und nichtfortlaufender Index',
        setup: changedFixture,
        checks: geometryChecks,
      },
    ],
    reflection:
      'Welche Informationen über Verteidiger oder Torwart fehlen auch bei exakt berechneter Geometrie?',
    rubric: [
      'Winkelkonvention und Koordinateneinheiten sind dokumentiert.',
      'Randfälle, Spiegelung und Zeilenzuordnung sind geprüft.',
      'Die Interpretation verwechselt geometrischen Zusammenhang nicht mit Modellgüte.',
    ],
    sources: [geometrySource, pitfalls],
  },
  {
    ...common,
    id: 'ds-temporal',
    title: 'Training und Test nach ganzen Spielen aufteilen',
    minutes: 90,
    concept: 'Chronologische Gruppenaufteilung mit optionalem Match-Embargo',
    objective:
      'Eine parametrisierte zeitliche Evaluation ohne Überschneidung von Spielen implementieren.',
    prerequisites: ['ds-features'],
    explanation: [
      'Schüsse desselben Spiels teilen Gegner, Spielstand und Bedingungen. Ein zufälliger Zeilensplit lässt Informationen aus einem Spiel auf beiden Seiten erscheinen und beantwortet eine andere Frage als eine Prognose auf spätere Spiele. Die Daten enthalten nur ISO-match_date, keine Anstoßzeiten. Deshalb bleiben auch alle Matches desselben Datums auf derselben Seite einer Grenze; Match-IDs dürfen keine zeitliche Reihenfolge innerhalb eines Tages vortäuschen.',
      'n_test ist die Mindestzahl letzter Matches: Suche das Datum des n_test-letzten Matches und nimm dieses gesamte Datum sowie alle späteren in den Test. Von den davor liegenden Matches verwirfst du optional mindestens embargo Matches; erweitere auch diese Ausschlussgrenze auf das gesamte betroffene Datum. Training enthält nur die noch früheren Daten. Beispiel: Bei einem Match am Montag, zwei am Dienstag und einem am Mittwoch liefern n_test=1 und embargo=1 Montag als Training, Mittwoch als Test und beide Dienstagmatches als Embargo. Training und Test erfüllen strikt max(Trainingsdatum)<min(Testdatum). Ein Datum mit mehreren Matches kann die verlangten Mindestzahlen überschreiten.',
      'Zeilenreihenfolge und Index in beiden Teilframes bleiben wie in der Eingabe. Ein Match mit widersprüchlichen Datumsangaben wird abgelehnt. Reserviere die Testdaten, bevor du Modellentscheidungen triffst. Passt du das Modell nach Einsicht in diese Daten an, brauchst du für die Bewertung später neue Testdaten. Übe zusätzlich mehrere Fenstergrößen und protokolliere, welche Fragen bei nur zwölf Matches überhaupt stabil prüfbar bleiben.',
    ],
    example: `# Zeitfenster für unabhängige Lieferchargen.
batches = ['Montag','Dienstag','Mittwoch','Donnerstag','Freitag']
print('Training:', batches[:2], 'Abstand:', batches[2:3], 'Test:', batches[3:])`,
    task: 'Schreibe split_matches(frame,n_test=2,embargo=0) -> (train,test). n_test zählt mindestens die letzten Matches, erweitert um sämtliche Matches am angeschnittenen Testdatum. embargo=0 entfernt nichts; sonst entferne mindestens die letzten embargo Matches vor dem Test, ebenfalls erweitert um alle Matches am angeschnittenen Embargodatum. So bleiben ganze Datumsgruppen zusammen. Beide Ergebnisse sind Kopien mit ursprünglicher Zeilenreihenfolge. Wirf ValueError bei n_test<1, embargo<0, widersprüchlichen Matchdaten oder keinem verbleibenden Trainingsmatch nach den Datumserweiterungen. Parameter sind ganze Zahlen, ISO-Daten und vollständige Schlüssel darfst du voraussetzen. Erzeuge train,test für shots. Dokumentiere Matchlisten, Datumsgrenzen, tatsächliche Matchzahlen und drei alternative Fenster, ohne anhand ihrer Scores ein bestes Fenster auszuwählen.',
    starter: `${imports}\ndef split_matches(frame, n_test=2, embargo=0):\n    raise NotImplementedError\n\ntrain, test = split_matches(shots)`,
    solution: splitSolution,
    hints: [
      'Erstelle zuerst eine Matchtabelle; splitte niemals die rohe Schusszeilenliste.',
      'Das Datum des n_test-letzten Matches ist die inklusive Testuntergrenze. Ein zweiter solcher Grenzwert in den früheren Matches bestimmt bei embargo>0 die exklusive Trainingsobergrenze.',
      'Filtere das Original nach Datumsgrenzen und erhalte damit Indizes und Zeilenreihenfolge. Prüfe nach jeder Erweiterung, ob noch Training übrig bleibt.',
    ],
    checks: [
      check(
        'Test enthält alle Matches ab dem Grenzdatum',
        "(lambda parts, boundary: parts[0].equals(shots[shots.match_date<boundary]) and parts[1].equals(shots[shots.match_date>=boundary]) and parts[0].match_date.max()<parts[1].match_date.min())(split_matches(shots),shots[['match_id','match_date']].drop_duplicates().sort_values('match_date').iloc[-2].match_date)",
      ),
      check(
        'Originale Zeilenzuordnung bleibt erhalten',
        '(lambda parts: parts[0].equals(shots.loc[parts[0].index]) and parts[1].equals(shots.loc[parts[1].index]))(split_matches(shots))',
      ),
    ],
    variants: [
      {
        label: 'Absichtlich durcheinander gespeicherte Matches',
        setup: changedFixture,
        checks: splitChecks,
      },
    ],
    reflection:
      'Wann ist ein Embargo fachlich begründet und wann verbraucht es hier nur ohnehin knappe Trainingsdaten?',
    rubric: [
      'Matchgruppen und Daten überlappen nicht; das letzte Trainingsdatum liegt strikt vor dem ersten Testdatum.',
      'Mindestzahlen, Datumserweiterungen und ungültige Fenster sind explizit behandelt.',
      'Die Dokumentation benennt Abhängigkeiten, die der Split nicht beseitigt.',
    ],
    sources: [pitfalls, evaluation],
  },
  {
    ...common,
    id: 'ds-baselines',
    title: 'Den Trainingsprior als einfachen Modellvergleich nutzen',
    minutes: 75,
    concept: 'DummyClassifier, Trainingsprior und proper scoring rules',
    objective: 'Einen trainierten Prior-Benchmark reproduzierbar auf neuen Zielwerten bewerten.',
    prerequisites: ['ds-temporal'],
    explanation: [
      'Ein komplexes Modell braucht einen einfachen Vergleich. DummyClassifier mit strategy="prior" sagt bei jedem Testschuss dieselbe Torquote voraus, geschätzt ausschließlich im Training. Das ist kein Spielervergleich und keine konstante Nullprognose. Auch wenn wenige Tore die Accuracy einer Nullklassifikation hoch erscheinen lassen, kann deren Wahrscheinlichkeitsprognose schlecht sein.',
      'Brier ist der Mittelwert von (y−p)². Binärer Logloss bestraft insbesondere selbstsichere falsche Vorhersagen; sklearn begrenzt numerisch die Logarithmusargumente. Beide sind proper scoring rules: Ihr Erwartungswert ist am günstigsten, wenn die vorhergesagte Wahrscheinlichkeit der tatsächlichen entspricht. Ein einzelnes Testergebnis beweist dennoch weder Kalibration noch Überlegenheit in einer anderen Population.',
      'Die Dummy-Klassen hängen von den Trainingslabels ab. Bei nur Nullen oder nur Einsen muss die Funktion weiterhin die Wahrscheinlichkeit der Klasse 1 korrekt liefern. Die zwei möglichen Testklassen sollen für log_loss explizit festgelegt werden. Rechne kleine Fälle zunächst von Hand nach. Vergleiche anschließend mehrere zeitlich zulässige Trainingsfenster und erläutere, welche Aussagen die kleine Testmenge trägt.',
    ],
    example: `# Handrechnung einer einzelnen probabilistischen Vorhersage.
y_observed, p_forecast = 1, .4
print((y_observed-p_forecast)**2, -np.log(p_forecast))`,
    task: 'Implementiere baseline_scores(train_y,test_y) mit DummyClassifier(strategy="prior"). Liefere ein Dict p (Array in Testreihenfolge), brier und logloss als ungerundete Zahlen. Trainiere nur auf train_y; X darf eine Nullmatrix sein. Unterstütze auch Ein-Klassen-Training und explizite Testklassen [0,1]. Erzeuge baseline aus den ersten vier und restlichen shots-Zielwerten als Funktionsdemonstration; für deine Analyse verwende den vorher begründeten Matchsplit. Vergleiche schriftlich Prior, Nullklassifikation und Anbieter-xG ohne ein Ergebnis vorwegzunehmen.',
    starter: `${imports}\nfrom sklearn.dummy import DummyClassifier\nfrom sklearn.metrics import brier_score_loss, log_loss\n\ndef baseline_scores(train_y, test_y):\n    raise NotImplementedError\n\nbaseline = baseline_scores(shots['goal'].iloc[:4],shots['goal'].iloc[4:])`,
    solution: baselineSolution,
    hints: [
      'Fit und Score brauchen unterschiedliche Zielvektoren. Eine neue Testquote darf den Prior nicht verändern.',
      'Lies classes_: eine einzelne predict_proba-Spalte muss nicht Klasse 1 bedeuten.',
      'Baue für log_loss zwei Spalten [1-p,p] und setze labels=[0,1]; runde erst bei der Präsentation.',
    ],
    checks: baselineChecks,
    variants: [
      { label: 'Umgekehrte Labels im Datenbestand', setup: changedFixture, checks: baselineChecks },
    ],
    reflection:
      'Warum ist ein niedriger Brier allein kein Nachweis, dass ein Modell hilfreicher als der Trainingsprior ist?',
    rubric: [
      'Prior und Bewertung stammen aus getrennten Zielvektoren.',
      'Handrechnung und Funktionsaufrufe stimmen ohne fest codierte Quote überein.',
      'Ein-Klassen-Fälle und die Grenzen eines kleinen Testfensters werden erläutert.',
    ],
    sources: [evaluation, pitfalls],
  },
  {
    ...common,
    id: 'ds-calibration',
    title: 'Wahrscheinlichkeiten und schwach besetzte Bins prüfen',
    minutes: 90,
    concept: 'Reliability-Tabelle, Brier und Logloss ohne Accuracy-Gate',
    objective:
      'Eine wiederverwendbare Kalibrationsdiagnose erstellen, die schwach besetzte Wahrscheinlichkeitsbereiche ausweist.',
    prerequisites: ['ds-baselines'],
    explanation: [
      'Ein Reliability-Bin vergleicht den mittleren vorhergesagten Wert mit der beobachteten Torquote. Ein Modell kann gute Rangordnung und dennoch verzerrte Wahrscheinlichkeiten liefern. Brier und Logloss fassen verschiedene Aspekte zusammen; ihre Verbesserung allein beweist keine bessere Kalibration, weil auch Auflösung und Unsicherheit hineinspielen.',
      'Wir verwenden fest vorab gewählte Bin-Grenzen: Intervalle sind links geschlossen und rechts offen, nur das letzte enthält 1. Leere Bins bekommen n=0 und None für Mittelwert und Torquote. Bins unter min_count erhalten sparse=True, bleiben aber sichtbar. Die Schwelle ist eine Warnmarkierung, kein statistisch garantiert ausreichender Stichprobenumfang.',
      'Die Anbieterwerte eignen sich hier für eine deskriptive Übung, sind aber kein unabhängig von deren Trainingsdaten garantiertes Testmodell. Zeichne optional die beobachtete Quote gegen mean_p und beschrifte die Besetzungen. Bei wenigen Toren kann die Darstellung zufällig nahe an der Diagonalen liegen. Auch eine bestandene Rechenprüfung belegt nur die korrekte Berechnung; beides reicht nicht als Nachweis allgemeiner Kalibration. Re-Kalibration darf später nur auf zusätzlichem Trainings-/Validierungsmaterial gelernt werden.',
    ],
    example: `# Ein einzelner Zuverlässigkeitsbereich einer Wetterprognose.
forecasts = np.array([.35,.45,.40])
rain = np.array([0,1,0])
print('Prognose',forecasts.mean(),'Beobachtung',rain.mean(),'n',len(rain))`,
    task: 'Schreibe probability_audit(y,p,edges=(0.,.1,.3,1.),min_count=5). Rückgabe: brier,logloss,bins. bins ist eine Liste von Dicts mit bin (0-basiert),n,mean_p,rate,sparse; leere Mittelwerte sind None. Validiere binäre Ziele, gleiche positive Länge, endliche p in [0,1] und streng steigende edges von 0 bis 1 mit ValueError. min_count ist eine positive ganze Zahl. Erzeuge audit für goal und provider_xg. Begründe die Binwahl, vergleiche zwei vorab festgelegte Binnings und schreibe eine vorsichtige Interpretation. Eine Reliability-Abbildung ist optional.',
    starter: `${imports}\nfrom sklearn.metrics import brier_score_loss, log_loss\n\ndef probability_audit(y, p, edges=(0.,.1,.3,1.), min_count=5):\n    raise NotImplementedError\n\naudit = probability_audit(shots['goal'],shots['provider_xg'])`,
    solution: calibrationSolution,
    hints: [
      'Lege die Randzuordnung zuerst anhand p=0, einer inneren Grenze und p=1 fest.',
      'Eine leere Bin-Torquote ist unbekannt, nicht null; sparse ist nur eine Kennzeichnung.',
      'Berechne Masken pro Intervall und die Scores über alle Beobachtungen; eine Binmittelung wäre ein anderes Gewichtungsschema.',
    ],
    checks: auditChecks,
    variants: [
      {
        label: 'Andere Zielrate und konzentrierte Anbieterwerte',
        setup: changedFixture,
        checks: auditChecks,
      },
    ],
    reflection:
      'Was kannst du über einen Bin mit einem Schuss und einer Trefferquote von 100 Prozent tatsächlich sagen?',
    rubric: [
      'Grenzen, leere Bereiche und kleine Besetzungen sind korrekt abgebildet.',
      'Scores werden auf Einzelprognosen gerechnet und nicht mit Kalibration gleichgesetzt.',
      'Die Interpretation benennt Datenumfang und fehlende unabhängige Anbieter-Validierung.',
    ],
    sources: [calibration, evaluation],
  },
  {
    ...common,
    id: 'ds-bootstrap',
    title: 'Unsicherheit mit ganzen Spielen resampeln',
    minutes: 90,
    concept: 'Match-Cluster-Bootstrap und eingeschränkte Inferenz',
    objective:
      'Ein reproduzierbares Perzentilintervall für die schussgewichtete Torquote mit Matchclustern berechnen.',
    prerequisites: ['ds-calibration'],
    explanation: [
      'Ein Zeilenbootstrap behandelt Schüsse wie unabhängige Ziehungen. Wir ziehen stattdessen aus M beobachteten Matches M Match-IDs mit Zurücklegen und übernehmen jeden gezogenen Cluster vollständig. Ein doppelt gezogenes Match muss zweimal zählen; isin auf der gezogenen ID-Liste würde die Wiederholungen verlieren.',
      'Jede Replikation berechnet Summe der Tore geteilt durch Summe der Schüsse ihrer gezogenen Matches. Das ist eine schussgewichtete Quote, nicht der ungewichtete Mittelwert von Matchquoten. Das Perzentilintervall verwendet die 2,5- und 97,5-Prozent-Quantile dieser Replikationen. Wir speichern sie, um Gewichtung, Reproduzierbarkeit und Quantile prüfen zu können.',
      'Mit zwölf ausgewählten Turnierspielen stehen nur wenige Cluster zur Verfügung. Das Intervall setzt voraus, dass diese Cluster austauschbar sind; zeitliche Zusammenhänge und wiederkehrende Teams können dieser Annahme widersprechen. Nutze es deshalb als Sensitivitätsdiagnose für diesen Ausschnitt. Eine Aussage über alle Ligen lässt sich daraus nicht ableiten. Bei einem einzigen Cluster fallen die Intervallgrenzen zusammen. Die Funktion soll dieses Ergebnis ausgeben; erkläre im Bericht, warum die fehlende Streuung hier keine Sicherheit bedeutet. Untersuche mehrere Seeds und Replikatzahlen und trenne Monte-Carlo-Schwankung von fehlender Datenvielfalt.',
    ],
    example: `# Zwei Lieferchargen: aggregierte Zähler bleiben zusammen.
totals = np.array([[2,10],[9,30]])
draw = [0,0]  # erste Charge zweimal, nicht einmal
print(totals[draw,0].sum()/totals[draw,1].sum())`,
    task: 'Implementiere cluster_interval(frame,n_boot=1000,seed=42) -> Dict estimate,low,high,replicates. Gruppiere nach match_id in sortierter ID-Reihenfolge; verwende np.random.default_rng(seed), ziehe n_boot×M ganze Matchindizes mit Zurücklegen. estimate ist die originale Schussquote, replicates ein Array ungerundeter Quotienten; low/high sind np.quantile bei .025/.975. Wirf ValueError bei leerem Frame oder n_boot<2. Erzeuge interval für shots. Begründe zusätzlich, warum das Intervall keine ligaweite Inferenz erlaubt, und vergleiche die Mechanik mit einem bewusst naiven Zeilenbootstrap.',
    starter: `${imports}\ndef cluster_interval(frame, n_boot=1000, seed=42):\n    raise NotImplementedError\n\ninterval = cluster_interval(shots)`,
    solution: bootstrapSolution,
    hints: [
      'Speichere pro Match Tore und Schusszahl; so bleiben Clustergrößen sichtbar.',
      'Ziehe Indizes mit Wiederholung und summiere Zähler und Nenner erst danach.',
      'Bei einem Match mit einem Tor und einem Match mit drei Fehlschüssen sind nur 0, 1/4 oder 1 als Replikat möglich.',
    ],
    checks: bootstrapChecks,
    variants: [
      {
        label: 'Umgekehrte Speicherung und Treffer',
        setup: changedFixture,
        checks: bootstrapChecks,
      },
    ],
    reflection:
      'Warum wird ein Intervall durch 100000 Replikate nicht repräsentativer für andere Wettbewerbe?',
    rubric: [
      'Wiederholte Cluster und unterschiedliche Clustergrößen werden korrekt gewichtet.',
      'Seed und Reihenfolge sind kontrolliert; Quantile stammen aus gespeicherten Replikaten.',
      'Wenige Cluster, Auswahl und zeitliche Abhängigkeit begrenzen die Interpretation.',
    ],
    sources: [evaluation, geometrySource],
  },
  {
    ...common,
    setup: `${PRACTICE_SHOTS_SETUP}\n${peersSetup}`,
    id: 'ds-sensitivity',
    title: 'Wie stabil ist eine Rangliste gegen Minutenfilter?',
    minutes: 75,
    concept: 'Vergleichsgruppe, Einsatzschwelle und Rangrobustheit',
    objective:
      'Eine explizit synthetische Peer-Gruppe unter mehreren Minutenschwellen vergleichen, ohne Rangstabilität als Talentbeweis auszugeben.',
    prerequisites: ['ds-bootstrap'],
    explanation: [
      'Die Schussdatei enthält keine vollständigen Spielerminuten. Deshalb verwendet diese Lektion eine separate synthetische Peer-Tabelle peers mit player,minutes,goals,xg. Die Profile und ihre Minutenwerte sind frei erfunden. Der Übungsscore ist 90·(goals−xg)/minutes und beschreibt realisierte Über-/Untererfüllung, keine isolierte Abschlussfähigkeit.',
      'Für jede vorab gewählte Schwelle gehören nur Spieler mit minutes≥threshold zur Vergleichsgruppe. Sortiert wird nach Score absteigend, bei Gleichstand alphabetisch nach player. rank ist anschließend die fortlaufende Position ab 1; es handelt sich also bewusst nicht um geteilte statistische Ränge. Ein leerer Filter liefert keine Zeilen, aber dieselben Spalten.',
      'Eine höhere Minutenhürde verändert die Zielgruppe. Ein Spieler kann dadurch aufrücken, obwohl sich seine Daten überhaupt nicht ändern. Kleine Einsatzzeiten machen per-90-Werte volatil; der Clusterbootstrap der vorherigen Lektion löst hier weder fehlende Minutenkontexte noch Auswahlverzerrung. Konstruiere eigene synthetische Gegenbeispiele und untersuche die Rangwechsel. Halte in einer Entscheidungsvorlage fest, welche Unsicherheiten bleiben und weshalb die Rangliste allein keine Auswahlentscheidung trägt.',
    ],
    example: `# Andere Kennzahl: Ballgewinne je 90 Minuten zweier fiktiver Profile.
for name, wins, minutes in [('Profil X',8,180),('Profil Y',20,900)]:
    print(name,90*wins/minutes)`,
    task: 'Schreibe rank_sensitivity(peers,thresholds=(180,450,900)) -> DataFrame mit threshold,player,score,rank in dieser Reihenfolge. Behalte die übergebene Reihenfolge der Schwellen bei; je Schwelle gilt die definierte Sortierung und Rangfolge. Wirf ValueError bei doppelten Spielern oder nichtpositiven Minuten. Eingaben sind ansonsten vollständig und numerisch. Erzeuge ranks. Vergleiche Top-2-Mitgliedschaft und Rangwechsel in einem schriftlichen Memo; konstruiere eine zweite Peer-Tabelle, in der Rohdifferenz und per-90-Reihenfolge widersprechen. Keine Talentempfehlung aus diesen vier Profilen.',
    starter: `${imports}\ndef rank_sensitivity(peers, thresholds=(180,450,900)):\n    raise NotImplementedError\n\nranks = rank_sensitivity(peers)`,
    solution: sensitivitySolution,
    hints: [
      'Berechne erst die zulässige Peer-Gruppe, dann ihren Score und ihre Rangfolge.',
      'Tie-Break und Schwellenreihenfolge gehören zum öffentlichen Funktionsvertrag.',
      'Sortiere mit zwei Schlüsseln; eine Liste von Zeilen erlaubt auch einen leeren DataFrame mit expliziten Spalten.',
    ],
    checks: rankChecks,
    variants: [
      {
        label: 'Vollständige synthetische Fixture ohne Schuss-Setup',
        setup: `${changedFixture}\n${peersSetup}`,
        checks: rankChecks,
      },
    ],
    reflection:
      'Wie erklärst du einem Scout eine Rangverbesserung, die allein durch den Ausschluss anderer Spieler entsteht?',
    rubric: [
      'Filter, Score und Tie-Break folgen dem Vertrag auch bei fremden Tabellen.',
      'Rangwechsel werden von Leistungsänderungen unterschieden.',
      'Synthetische Minuten und fehlende Talentinferenz sind im Memo kenntlich.',
    ],
    sources: [evaluation, geometrySource],
  },
  {
    ...common,
    id: 'ds-review',
    title: 'Transfer: einen nachvollziehbaren Evaluationsbericht erstellen',
    minutes: 180,
    concept:
      'Parametrisierte Gesamtevaluation und ausschließlich im Training gelernte Vorverarbeitung',
    objective:
      'Die bisherigen Funktionen zu einem prüfbaren zeitlichen Modellvergleich mit begrenzten Schlussfolgerungen verbinden.',
    prerequisites: ['ds-sensitivity'],
    reviewOf: 'ds-temporal',
    transfer: true,
    explanation: [
      'Szenario: Ein Analyst soll abschätzen, ob ein einfaches geometrisches Schussmodell auf späteren Matches brauchbare Wahrscheinlichkeiten liefert. Das Report-Fenster, ein optionales Embargo und die Regularisierung sind Parameter, keine in der Funktion versteckten Konstanten. n_test und embargo behalten die Mindestzahl-Semantik mit ganzen Datumsgruppen aus ds-temporal; ein Tag wird nie zwischen Training und Test aufgeteilt. Der Bericht soll nachvollziehbar zeigen, was der Modellvergleich ergibt. Auch ein schlechteres Ergebnis als die Baseline gehört hinein.',
      'Verwende genau distance und angle aus der vereinbarten Geometrie. Eine Pipeline aus StandardScaler und LogisticRegression lernt Skalierung und Koeffizienten ausschließlich im Training. C ist vorgegeben, random_state=seed, max_iter=1000; andere Modellentscheidungen gehören auf zusätzliche innere zeitliche Validierung, nicht auf den hier reservierten Test. Das Training muss beide Zielklassen enthalten.',
      'Der Bericht vergleicht Modell und Trainingsprior mit Brier, Logloss und einer Reliability-Tabelle. Delta-Brier ist Modell minus Baseline; kleinere Werte sind günstiger, doch es gibt keinen Bestehensschwellenwert. Die Prüfungen vergleichen deine Berechnung mit einer unabhängig aufgebauten Pipeline. Außerdem verändern sie Testlabels: Ändern sich dadurch die Vorhersagen, sind Testinformationen in das Training gelangt. Die Checks verlangen weder ein bestimmtes Koeffizientenvorzeichen noch ein besseres Ergebnis auf einer künstlich einfachen Stichprobe.',
      'Plane etwa drei Stunden für Zusammenführung, eigene adversariale Prüfungen und einen schriftlichen Bericht. Benenne Datenherkunft, kleine Matchzahl, Matchabhängigkeiten und Auswahlgrenzen. Der Bericht dokumentiert deine Arbeit an dieser Übung. Für einen Nachweis beruflicher Eignung oder allgemein belastbarer Modellgüte reicht dieser begrenzte Datenausschnitt nicht aus.',
    ],
    example: `# Struktur eines Berichts für eine andere Prognoseaufgabe.
shipping_report = {'train_batches':['A','B'], 'test_batches':['D'],
                   'baseline_mae':4.2, 'model_mae':4.5}
print('Auch ein schwächeres Modell ist ein berichtenswertes Ergebnis:',shipping_report)`,
    task: 'Implementiere evaluation_report(frame,n_test=2,embargo=0,C=1.,seed=42). Übernimm deine bisherigen Funktionen in dieses eigenständig laufende Skript. Verwende den Matchsplit, Geometrie und exakt StandardScaler→LogisticRegression(C=C,random_state=seed,max_iter=1000). Rückgabe: train_ids,test_ids (je sortierte Listen),event_ids (Testreihenfolge),p (Klasse-1-Array),scaler_mean (Trainingsmittel der beiden unskalierten Features),brier,logloss,bins (Audit-Defaults),baseline_brier,baseline_logloss,delta_brier. Bei Ein-Klassen-Training ValueError. Erzeuge report für shots. Schreibe dazu einen Bericht mit Frage, Zeitraum/Embargo, Schusszahlen, Datenprüfung, Ergebnissen samt Baseline, Kalibrationsgrenzen und nächstem unabhängigen Validierungsschritt. Ändere nicht nachträglich C, um den reservierten Test zu gewinnen.',
    starter: `${imports}\nfrom sklearn.pipeline import make_pipeline\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.linear_model import LogisticRegression\n\n# Übernimm deine geprüften Hilfsfunktionen aus den vorigen Lektionen.\n# Hier sind absichtlich weder Split noch Fit vorgeschrieben ausgeführt.\ndef evaluation_report(frame, n_test=2, embargo=0, C=1., seed=42):\n    raise NotImplementedError\n\nreport = evaluation_report(shots)`,
    solution: reviewSolution,
    hints: [
      'Integriere zuerst die Funktionen mit ihren unveränderten Verträgen; prüfe danach den Bericht an fremden Frames.',
      'Passe die gesamte Pipeline ausschließlich an die Trainingsdaten an. Testlabels sind ausschließlich für nachträgliche Scores zulässig.',
      'Eine Labeländerung ausschließlich im Test darf p und scaler_mean nicht ändern; prüfe zusätzlich ein Embargo und veränderte provider_xg-Werte.',
    ],
    checks: [
      check(
        'Bericht auf den bereitgestellten Schüssen ist intern konsistent',
        "report['event_ids']==split_matches(shots)[1]['event_id'].tolist() and np.isclose(report['delta_brier'],report['brier']-report['baseline_brier'])",
      ),
    ],
    variants: [
      {
        label: 'Kleine vollständige Referenz mit expliziten Matchfenstern',
        setup: fixture,
        checks: reviewChecks,
      },
      {
        label: 'Neue Indizes, Positionen, Labels und Zeilenfolge',
        setup: changedFixture,
        checks: reviewChecks,
      },
    ],
    reflection:
      'Welche echten Daten und welche unabhängige Evaluation brauchst du, bevor du mit dieser Methode eine sportliche Entscheidung begründest?',
    rubric: [
      'Die Parameter erlauben eine Reproduktion; alle gelernten Statistiken stammen ausschließlich aus dem Training.',
      'Baseline, Proper Scores und Kalibrationsbesetzung werden gemeinsam interpretiert, ohne Erfolgsschwelle.',
      'Schriftliche Grenzen und unabhängiger nächster Prüfplan passen zur kleinen ausgewählten Stichprobe.',
    ],
    sources: [pitfalls, evaluation, calibration, geometrySource],
  },
];
