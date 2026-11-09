import type { Lesson } from '../types';
import {
  PANDAS_DOCS,
  PANDAS_GROUPBY_DOCS,
  PANDAS_RANK_DOCS,
  SCOUTING_SETUP,
  STATSBOMB_DOCS,
  check,
} from './fixtures';

const common = { trackId: 'scouting', packages: ['pandas'] as string[] };

const scoutingExplanation =
  'Alle Spieler, Vereine und Werte sind frei erfunden. Die Beispiele zeigen Rechenwege und Prüfideen; sie sind keine empirische Evidenz für Transferentscheidungen.';

export const scoutingLessons: Lesson[] = [
  {
    ...common,
    id: 'scout-per90',
    title: 'Pro 90 Minuten innerhalb der Positionsgruppe',
    minutes: 40,
    concept: 'Per-90-Raten und Perzentile',
    objective:
      'Eine Rate pro 90 Minuten bilden, auf eine Positionsgruppe filtern und per Perzentil einordnen.',
    prerequisites: ['stat-review'],
    explanation: [
      'Eine Rate pro 90 Minuten rechnet unterschiedliche Einsatzzeiten auf dieselbe Dauer um: key_passes / minutes * 90. Key Passes sind die hier erfassten schussvorbereitenden Pässe. 18 in 900 Minuten ergeben 1,8 pro 90, 7 in 450 Minuten ergeben 1,4. So kannst du die bisherigen Einsätze eher vergleichen. Die nächste Leistung sagt die Rate nicht voraus.',
      'Wähle eine Vergleichsgruppe, deren Aufgaben zur Frage passen. Innenverteidiger und offensive Mittelfeldspieler haben unterschiedliche Aufgaben. Hier berücksichtigen wir position == "MF" und mindestens 450 Minuten. Damit fällt Jona mit 449 Minuten heraus. Begründe diese Grenze: Zwischen 449 und 450 Minuten besteht rechnerisch nur ein kleiner Unterschied.',
      'Ein Perzentil sagt, welcher Anteil der Vergleichsgruppe unter dem Wert liegt. rank(pct=True) * 100 liefert Werte von 0 bis 100. Bei vier Spielern sind die Perzentile grob (25, 50, 75, 100). Ein hohes Perzentil bedeutet nur "hoch in dieser kleinen Gruppe", nicht "gut für jede Rolle". Rolle, Spielstil und Gegnerdruck bleiben offen.',
      scoutingExplanation,
    ],
    example: `players["kp90"] = players["key_passes"] / players["minutes"] * 90
peers = players[(players["position"] == "MF") & (players["minutes"] >= 450)].copy()
peers["pct"] = peers["kp90"].rank(pct=True) * 100`,
    task: 'Filtere players auf position == "MF" und mindestens 450 Minuten in peers. Berechne kp90 = key_passes / minutes * 90 und pct = rank(pct=True) * 100 innerhalb von peers. Sortiere absteigend nach pct, bei Gleichstand aufsteigend nach name. Speichere ranked als Liste [name, gerundete kp90 auf 2 Stellen, gerundetes pct auf 1 Stelle].',
    starter: `peers = players.copy()
peers["kp90"] = 0
peers["pct"] = 0
ranked = []
print(peers)`,
    solution: `peers = players[(players["position"] == "MF") & (players["minutes"] >= 450)].copy()
peers["kp90"] = peers["key_passes"] / peers["minutes"] * 90
peers["pct"] = peers["kp90"].rank(pct=True) * 100
peers = peers.sort_values(["pct", "name"], ascending=[False, True])
ranked = [[row["name"], round(float(row["kp90"]), 2), round(float(row["pct"]), 1)] for _, row in peers.iterrows()]
print(ranked)`,
    hints: [
      'Der Filter gehört vor die Perzentilberechnung, damit die Vergleichsgruppe wirklich nur aus MF-Spielern mit mindestens 450 Minuten besteht.',
      'Lies die pandas-Dokumentation zu rank und pct=True. Überlege, warum vier Beobachtungen nur grobe Perzentile ergeben.',
      'Die Kernzeilen:\n\npeers["kp90"] = peers["key_passes"] / peers["minutes"] * 90\npeers["pct"] = peers["kp90"].rank(pct=True) * 100',
    ],
    checks: [
      check('Vier Mittelfeldspieler erfüllen die Minutenregel', 'len(peers)', 4),
      check('Per-90-Rate und Perzentil korrekt', 'ranked', [
        ['Ria', 2.03, 100.0],
        ['Ada', 1.8, 75.0],
        ['Lina', 1.41, 50.0],
        ['Nora', 1.4, 25.0],
      ]),
      check(
        'Perzentile bleiben im Bereich 0 bis 100',
        'bool(peers["pct"].between(0, 100).all())',
        true,
      ),
    ],
    reflection:
      'Warum ist es problematisch, einen Mittelfeldspieler mit 450 Minuten und einen mit 900 Minuten nur über ihr Perzentil zu vergleichen?',
    rubric: [
      'Nenne die Mindestspielzeit als willkürliche, begründungsbedürftige Regel.',
      'Erkläre, warum ein Perzentil in einer kleinen Gruppe wenig stabil ist.',
    ],
    setup: SCOUTING_SETUP,
    variants: [
      {
        label: 'Neue Spieler',
        setup: `import io
import pandas as pd

csv_text = """player_id,name,position,club,minutes,goals,assists,key_passes,prog_passes,xg,xa
1,Ida,MF,Nord,600,2,1,10,20,1.2,0.8
2,Jona,MF,Süd,500,1,2,5,15,0.5,1.0
3,Kai,DF,West,900,0,1,2,10,0.1,0.3
4,Lena,MF,Nord,400,3,0,8,18,2.0,0.6
5,Mia,FW,Süd,700,5,1,4,8,3.0,0.4"""
players = pd.read_csv(io.StringIO(csv_text))`,
        checks: [
          check('Neue Vergleichsgruppe', 'ranked', [
            ['Ida', 1.5, 100.0],
            ['Jona', 0.9, 50.0],
          ]),
        ],
      },
    ],
    sources: [PANDAS_RANK_DOCS, PANDAS_GROUPBY_DOCS],
  },
  {
    ...common,
    id: 'scout-robust',
    title: 'Abweichungen mit Median und MAD vergleichen',
    minutes: 45,
    concept: 'Median, MAD und robuste z-Werte',
    objective:
      'Abweichungen innerhalb einer Positionsgruppe mit Median und MAD statt mit Mittelwert und Standardabweichung beschreiben.',
    prerequisites: ['scout-per90'],
    explanation: [
      'Ein z-Wert beschreibt, wie viele Standardabweichungen ein Wert vom Mittelwert entfernt liegt. Mittelwert und Standardabweichung reagieren aber empfindlich auf Ausreißer. Der Median und die mediane absolute Abweichung (MAD) sind robuster: Ein einzelner Extremwert verschiebt sie weniger.',
      'Um die MAD zu berechnen, ermittelst du zuerst den Median und dann die absoluten Abstände aller Werte zu ihm. Der Median dieser Abstände ist die MAD. Oft multipliziert man sie mit 1,4826, um sie mit einer Standardabweichung zu vergleichen. Der Faktor setzt normalverteilte Daten voraus. Für unsere Daten ist das nicht gegeben; wir verwenden ihn als heuristische Skala, ohne damit Normalverteilung zu behaupten.',
      'Ein robuster z-Wert von 0,67 bedeutet: Der Spieler liegt 0,67 robuste Streuungen über dem Median seiner Gruppe. Das ist eine relative Einordnung. Bei fünf Mittelfeldspielern und einer MAD von 0,7 ist die Skala grob. Ist die MAD 0, darf nicht durch 0 geteilt werden; dann ist eine Definition nötig, etwa z = 0 für alle.',
      scoutingExplanation,
    ],
    example: `median = group["prog90"].median()
mad = (group["prog90"] - median).abs().median()
scale = 1.4826 * mad
group["z"] = (group["prog90"] - median) / scale`,
    task: 'Filtere players auf position == "MF" und mindestens 300 Minuten in mf. Berechne prog90 = prog_passes / minutes * 90. Speichere median und mad (mediane absolute Abweichung) der prog90-Werte. Berechne robust_z = (prog90 - median) / (1.4826 * mad). Speichere robust als Liste [name, gerundeter z-Wert auf 2 Stellen], sortiert absteigend nach z und bei Gleichstand aufsteigend nach name.',
    starter: `mf = players[players["position"] == "MF"].copy()
mf["prog90"] = 0
median = 0
mad = 0
robust = []
print(mf)`,
    solution: `mf = players[(players["position"] == "MF") & (players["minutes"] >= 300)].copy()
mf["prog90"] = mf["prog_passes"] / mf["minutes"] * 90
median = mf["prog90"].median()
mad = (mf["prog90"] - median).abs().median()
mf["robust_z"] = (mf["prog90"] - median) / (1.4826 * mad)
mf = mf.sort_values(["robust_z", "name"], ascending=[False, True])
robust = [[row["name"], round(float(row["robust_z"]), 2)] for _, row in mf.iterrows()]
print(median, mad, robust)`,
    hints: [
      'Berechne zuerst den Median, dann die absoluten Abstände dazu und davon wieder den Median.',
      'Lies die pandas-Dokumentation zu median und abs. Überlege, was passiert, wenn alle Werte gleich sind und mad = 0.',
      'Die Skala:\n\nmedian = mf["prog90"].median()\nmad = (mf["prog90"] - median).abs().median()\nmf["robust_z"] = (mf["prog90"] - median) / (1.4826 * mad)',
    ],
    checks: [
      check('Median der Gruppe', 'round(float(median), 1)', 3.8),
      check('Mediane absolute Abweichung', 'round(float(mad), 2)', 0.7),
      check('Robuste z-Werte', 'robust', [
        ['Ria', 0.67],
        ['Ada', 0.39],
        ['Nora', 0.0],
        ['Lina', -0.69],
        ['Jona', -0.76],
      ]),
    ],
    reflection:
      'Warum kann ein robuster z-Wert bei fünf Spielern trotzdem eine scheinbar präzise Rangfolge erzeugen?',
    rubric: [
      'Erkläre den Unterschied zwischen Standardabweichung und MAD.',
      'Nenne die kleine Gruppengröße und die fehlende Normalverteilung als Grenzen.',
    ],
    setup: SCOUTING_SETUP,
    sources: [
      {
        title: 'NIST: Median Absolute Deviation',
        url: 'https://www.itl.nist.gov/div898/software/dataplot/refman2/auxillar/mad.htm',
      },
      PANDAS_RANK_DOCS,
    ],
  },
  {
    ...common,
    id: 'scout-shrinkage',
    title: 'Kleine Stichproben zur Mitte ziehen',
    minutes: 45,
    concept: 'Shrinkage und Vorwissen',
    objective:
      'Eine per-90-Rate mit einem Vorwissen gewichtet kombinieren und den Effekt kleiner Spielzeiten erklären.',
    prerequisites: ['scout-robust'],
    explanation: [
      'Bei 180 Minuten schwankt eine Rate stärker als bei 900 Minuten. Shrinkage kombiniert sie deshalb mit einem Vorwissen, dem Prior. Hier lautet die Formel: (Aktionen + prior_rate * prior_minutes / 90) / (Minuten + prior_minutes) * 90. Du kannst den Prior wie zusätzliche Spielzeit lesen, in der der Spieler mit der durchschnittlichen Rate agiert hätte.',
      'Als Prior verwenden wir den ungewichteten Mittelwert der per-90-Raten aller Mittelfeldspieler. Du könntest stattdessen nach Minuten gewichten, einen anderen positionsspezifischen Prior wählen oder den Zeitraum begrenzen. Jede dieser Entscheidungen verändert das Ergebnis. Gib deshalb an, aus welcher Gruppe und welchem Zeitraum dein Vorwissen stammt.',
      'Die Anpassung wirkt bei wenig Spielzeit am stärksten: Lea mit 180 Minuten wird deutlich zum Mittelwert gezogen, Ada mit 900 Minuten kaum. Prüfe dennoch, ob der Prior ein besonderes Profil verdeckt. Gerade ein Spieler mit wenigen Minuten kann durch die Anpassung in der Rangliste zurückfallen. Zeige neben dem shrunk-Wert deshalb immer die Rohrate und die Minutenanzahl.',
      scoutingExplanation,
    ],
    example: `prior = mf["kp90"].mean()
prior_minutes = 450
mf["shrunk"] = (mf["key_passes"] + prior * prior_minutes / 90) / (mf["minutes"] + prior_minutes) * 90`,
    task: 'Filtere players auf position == "MF" in mf. Berechne kp90 = key_passes / minutes * 90 und prior = ungewichteter Mittelwert von kp90. Verwende prior_minutes = 450 und berechne shrunk mit der Formel (key_passes + prior * prior_minutes / 90) / (minutes + prior_minutes) * 90. Speichere shrunk_rows als Liste [name, gerundete kp90 auf 3 Stellen, gerundeter shrunk-Wert auf 3 Stellen], sortiert aufsteigend nach name.',
    starter: `mf = players[players["position"] == "MF"].copy()
mf["kp90"] = 0
prior = 0
prior_minutes = 450
mf["shrunk"] = 0
shrunk_rows = []
print(mf)`,
    solution: `mf = players[players["position"] == "MF"].copy()
mf["kp90"] = mf["key_passes"] / mf["minutes"] * 90
prior = float(mf["kp90"].mean())
prior_minutes = 450
mf["shrunk"] = (mf["key_passes"] + prior * prior_minutes / 90) / (mf["minutes"] + prior_minutes) * 90
mf = mf.sort_values("name")
shrunk_rows = [[row["name"], round(float(row["kp90"]), 3), round(float(row["shrunk"]), 3)] for _, row in mf.iterrows()]
print(prior, shrunk_rows)`,
    hints: [
      'Der Prior wird aus den per-90-Raten gebildet, nicht aus den absoluten Key Passes. Achte auf die Einheit Minuten/90 in der Formel.',
      'Lies das Beispiel und prüfe, warum der Nenner um prior_minutes wächst. Überlege, welcher Spieler am stärksten verändert wird.',
      'Die Formel:\n\nmf["shrunk"] = (mf["key_passes"] + prior * prior_minutes / 90) / (mf["minutes"] + prior_minutes) * 90',
    ],
    checks: [
      check('Ungewichteter Prior der Mittelfeldspieler', 'round(float(prior), 3)', 1.558),
      check('Rohrate und shrunk-Wert je Spieler', 'shrunk_rows', [
        ['Ada', 1.8, 1.719],
        ['Jona', 1.203, 1.381],
        ['Lea', 1.5, 1.542],
        ['Lina', 1.414, 1.471],
        ['Nora', 1.4, 1.479],
        ['Ria', 2.032, 1.833],
      ]),
    ],
    reflection:
      'Welche Spieler verliert eine Shortlist durch starkes Shrinkage, und ist das sportlich immer eine Verbesserung?',
    rubric: [
      'Erkläre, wie prior_minutes die Stärke des Vorwissens steuert.',
      'Nenne einen Nachteil für Spieler mit wenig, aber auffälliger Spielzeit.',
    ],
    setup: SCOUTING_SETUP,
    sources: [
      {
        title: 'Shrinkage (Statistik)',
        url: 'https://en.wikipedia.org/wiki/Shrinkage_(statistics)',
      },
      PANDAS_DOCS,
    ],
  },
  {
    ...common,
    id: 'scout-kontext',
    title: 'Mannschaftskontext herausrechnen',
    minutes: 45,
    concept: 'Kontextadjustierung mit Teamvergleich',
    objective:
      'Eine Spielerkennzahl am Teamniveau relativieren und die Grenzen dieser Adjustierung benennen.',
    prerequisites: ['scout-shrinkage'],
    explanation: [
      'Wie viele progressive Pässe ein Spieler spielen kann, hängt auch vom Ballbesitz seines Teams ab. Progressive Pässe bringen den Ball nach vorn. Hier setzen wir die Spielerrate ins Verhältnis zum Teamdurchschnitt und skalieren mit dem Ligadurchschnitt. Der Wert ordnet den Spieler damit relativ zu diesen Vergleichswerten ein; er liefert keine vom Kontext unabhängige Leistung.',
      'Die Teamrate wird hier als Summe der prog_passes geteilt durch die Summe der Minuten mal 90 berechnet. Das gewichtet Spieler nach Einsatzzeit, anders als ein ungewichteter Mittelwert der Spielerraten. Der Ligadurchschnitt nutzt alle gefilterten Spieler. Beide Entscheidungen verändern das Ergebnis.',
      'Prüfe, wer in die Teamrate eingeht. Ein Torwart mit vielen Minuten und wenigen progressiven Pässen senkt sie. Auch eine andere Definition progressiver Pässe verschiebt den Vergleich. Die Adjustierung kann somit einen Teil des Kontexts ausgleichen und zugleich neue Abhängigkeiten einführen. Betrachte Rohrate und Teamrate gemeinsam, bevor du den adjustierten Wert deutest. Einen kausalen Effekt weist die Rechnung nicht nach.',
      scoutingExplanation,
    ],
    example: `team = ctx.groupby("club")[["prog_passes", "minutes"]].sum()
team["per90"] = team["prog_passes"] / team["minutes"] * 90
ctx["club90"] = ctx["club"].map(team["per90"])`,
    task: 'Filtere players auf mindestens 300 Minuten in ctx. Berechne prog90 = prog_passes / minutes * 90. Berechne pro Club die gewichtete Teamrate als sum(prog_passes) / sum(minutes) * 90 und speichere sie als club90 je Spieler. Berechne league als sum(prog_passes) / sum(minutes) * 90 über ctx. Berechne adjusted = prog90 / club90 * league. Speichere context als Top 5 [name, club, gerundeter adjusted-Wert auf 2 Stellen], sortiert absteigend nach adjusted und bei Gleichstand aufsteigend nach name.',
    starter: `ctx = players[players["minutes"] >= 300].copy()
ctx["prog90"] = 0
ctx["club90"] = 0
league = 0
ctx["adjusted"] = 0
context = []
print(ctx)`,
    solution: `ctx = players[players["minutes"] >= 300].copy()
ctx["prog90"] = ctx["prog_passes"] / ctx["minutes"] * 90
team = ctx.groupby("club")[["prog_passes", "minutes"]].sum()
team["per90"] = team["prog_passes"] / team["minutes"] * 90
ctx["club90"] = ctx["club"].map(team["per90"])
league = ctx["prog_passes"].sum() / ctx["minutes"].sum() * 90
ctx["adjusted"] = ctx["prog90"] / ctx["club90"] * league
ctx = ctx.sort_values(["adjusted", "name"], ascending=[False, True]).head(5)
context = [[row["name"], row["club"], round(float(row["adjusted"]), 2)] for _, row in ctx.iterrows()]
print(context)`,
    hints: [
      'Die Teamrate ist gewichtet: Summe der Pässe durch Summe der Minuten, nicht der Mittelwert der Spielerraten.',
      'Lies die pandas-Dokumentation zu groupby und map. Achte darauf, dass Ina als Torwart in der Teamrate enthalten ist.',
      'Die Teamrate:\n\nteam = ctx.groupby("club")[["prog_passes", "minutes"]].sum()\nteam["per90"] = team["prog_passes"] / team["minutes"] * 90',
    ],
    checks: [
      check('Ligadurchschnitt der gefilterten Spieler', 'round(float(league), 3)', 2.283),
      check('Kontextadjustierte Top 5', 'context', [
        ['Ada', 'Nordstadt', 4.9],
        ['Ria', 'Weststadt', 4.38],
        ['Jona', 'Nordstadt', 3.51],
        ['Lina', 'Weststadt', 3.0],
        ['Nora', 'Hafenstadt', 2.68],
      ]),
    ],
    reflection:
      'Wie kann die Skalierung mit der Teamrate einen Spieler aus einem schwachen Team nach oben verschieben, und welche Annahme musst du dabei prüfen?',
    rubric: [
      'Erkläre, welche Annahme hinter der Skalierung mit dem Ligadurchschnitt steckt.',
      'Nenne mindestens einen Faktor, den die Teamrate nicht abbildet.',
    ],
    setup: SCOUTING_SETUP,
    sources: [PANDAS_GROUPBY_DOCS, STATSBOMB_DOCS],
  },
  {
    ...common,
    id: 'scout-composite',
    title: 'Ein zusammengesetztes Profil bauen',
    minutes: 45,
    concept: 'Perzentilbasierte Composite Scores',
    objective:
      'Mehrere per-90-Kennzahlen innerhalb einer Rolle in Perzentile übersetzen und zu einem gewichteten Profilscore verbinden.',
    prerequisites: ['scout-kontext'],
    explanation: [
      'Ein Composite Score fasst mehrere Kennzahlen zusammen. Hier werden Key Passes, progressive Pässe und xG pro 90 zunächst innerhalb einer einzigen Rolle in Perzentile übersetzt, nämlich bei Mittelfeldspielern. Perzentile über verschiedene Rollen hinweg wären nicht vergleichbar: Ein Verteidiger mit vielen progressiven Pässen und ein Stürmer mit vielen Abschlüssen haben unterschiedliche Aufgaben und Referenzgruppen.',
      'Mit den Gewichten 0,4 / 0,4 / 0,2 gibst du Kreativität und Progressionsspiel mehr Gewicht als dem eigenen Abschluss. Das ist eine fachliche Entscheidung. Für einen anderen Trainer oder eine andere Rolle können andere Gewichte passen. Dokumentiere diese Wahl, damit sich erklären lässt, weshalb ein Spieler im Score vorn liegt.',
      'Bei fünf Mittelfeldspielern entstehen die groben Perzentilstufen 20, 40, 60, 80 und 100. Schon Änderungen in dieser kleinen Gruppe können ihre Einordnung verschieben. Verwende den Score deshalb zum Sortieren und Diskutieren innerhalb der Rolle. Er beschreibt weder einen Rang in der gesamten Liga noch eine Wahrscheinlichkeit und reicht allein nicht für eine Empfehlung.',
      scoutingExplanation,
    ],
    example: `comp = players[players["position"] == "MF"].copy()
comp["kp_pct"] = comp["kp90"].rank(pct=True) * 100
comp["score"] = 0.4 * comp["kp_pct"] + 0.6 * comp["prog_pct"]`,
    task: 'Filtere players auf position == "MF" und mindestens 300 Minuten in comp. Berechne kp90, prog90 und xg90. Bilde für jede Kennzahl ein Perzentil innerhalb dieser Mittelfeldgruppe mit rank(pct=True) * 100. Berechne score = 0.4 * kp90_pct + 0.4 * prog90_pct + 0.2 * xg90_pct. Speichere scores als Top 5 [name, position, gerundeter score auf 1 Stelle], sortiert absteigend nach score und bei Gleichstand aufsteigend nach name.',
    starter: `comp = players[players["minutes"] >= 300].copy()
comp["kp90"] = 0
comp["prog90"] = 0
comp["xg90"] = 0
comp["score"] = 0
scores = []
print(comp)`,
    solution: `comp = players[(players["position"] == "MF") & (players["minutes"] >= 300)].copy()
comp["kp90"] = comp["key_passes"] / comp["minutes"] * 90
comp["prog90"] = comp["prog_passes"] / comp["minutes"] * 90
comp["xg90"] = comp["xg"] / comp["minutes"] * 90
for col in ["kp90", "prog90", "xg90"]:
    comp[col + "_pct"] = comp[col].rank(pct=True) * 100
comp["score"] = 0.4 * comp["kp90_pct"] + 0.4 * comp["prog90_pct"] + 0.2 * comp["xg90_pct"]
comp = comp.sort_values(["score", "name"], ascending=[False, True])
top = comp.head(5)
scores = [[row["name"], row["position"], round(float(row["score"]), 1)] for _, row in top.iterrows()]
print(scores)`,
    hints: [
      'Filtere zuerst auf die Rolle und die Mindestspielzeit. Die Perzentile entstehen danach nur innerhalb dieser Gruppe, nicht über alle Spieler.',
      'Lies die pandas-Dokumentation zu rank. Überlege, warum ein rollenübergreifendes Perzentil für einen Verteidiger und einen Stürmer nicht dieselbe Bedeutung hätte.',
      'Der Score nach dem Rollenfilter:\n\ncomp["kp90_pct"] = comp["kp90"].rank(pct=True) * 100\ncomp["score"] = 0.4 * comp["kp90_pct"] + 0.4 * comp["prog90_pct"] + 0.2 * comp["xg90_pct"]',
    ],
    checks: [
      check('Fünf Mittelfeldspieler mit mindestens 300 Minuten', 'len(comp)', 5),
      check(
        'Vergleichsgruppe enthält nur Mittelfeldspieler',
        'bool((comp["position"] == "MF").all())',
        true,
      ),
      check('Top 5 des Composite Scores', 'scores', [
        ['Ria', 'MF', 92.0],
        ['Ada', 'MF', 84.0],
        ['Lina', 'MF', 56.0],
        ['Nora', 'MF', 48.0],
        ['Jona', 'MF', 20.0],
      ]),
      check('Score bleibt im Perzentilbereich', 'bool(comp["score"].between(0, 100).all())', true),
    ],
    reflection:
      'Welche Rolle würde dein Composite übersehen, wenn du nur Key Passes, progressive Pässe und xG verwendest?',
    rubric: [
      'Nenne mindestens eine fehlende Fähigkeit, etwa Defensivarbeit oder Pressing.',
      'Erkläre, warum die Gewichte eine fachliche Entscheidung sind.',
    ],
    setup: SCOUTING_SETUP,
    sources: [PANDAS_RANK_DOCS, PANDAS_GROUPBY_DOCS],
  },
  {
    ...common,
    id: 'scout-sensitivitaet',
    title: 'Bleibt die Rangliste unter anderen Annahmen stabil?',
    minutes: 40,
    concept: 'Sensitivitätsanalyse von Rankings',
    objective: 'Ränge unter mehreren Szenarien berechnen und die Spannweite pro Spieler ausweisen.',
    prerequisites: ['scout-composite'],
    explanation: [
      'Gewichte gehören zu den Annahmen eines Rankings. änderst du sie, können sich die Ränge verschieben. Mit einer Sensitivitätsanalyse prüfst du, wie stark die Einordnung von diesen Annahmen abhängt. Sie entscheidet nicht, welches Szenario das richtige ist.',
      'Hier berechnest du pro Szenario eine Rangfolge (1 = bester Score) und danach pro Spieler den kleinsten und größten Rang über alle Szenarien. Ein Spieler mit Rang 2 in allen Szenarien ist stabil; ein Spieler mit Rang 1 und Rang 4 ist stark annahmeabhängig. Die Spannweite ist anschaulicher als ein einzelner Mittelwert.',
      'Ein gleichbleibender Rang kann auch eine gleichbleibend schwache Einordnung bedeuten. Umgekehrt können wechselnde Ränge zeigen, dass zwei Kennzahlen unterschiedliche Aspekte der Leistung erfassen. Prüfe deshalb, welche Änderung einen Spieler nach oben oder unten verschiebt. Steigt er etwa bei stärkerem Abschlussgewicht, obwohl du für seine Rolle vor allem andere Aufgaben bewerten willst?',
      scoutingExplanation,
    ],
    example: `ranked = scores.set_index("player").rank(ascending=False, method="min")
ranked["span"] = ranked.max(axis=1) - ranked.min(axis=1)`,
    task: 'Für scores mit den Spalten player, s1, s2 und s3: Berechne pro Szenario den Rang mit method="min" und ascending=False. Speichere spread_rows als Liste [player, min_rank, max_rank], sortiert aufsteigend nach player, wobei die Ränge ganze Zahlen sind. Speichere stable als alphabetisch sortierte Liste der Spieler, deren max_rank in allen Szenarien höchstens 3 ist.',
    starter: `ranked = scores.set_index("player").rank(ascending=False, method="min")
spread_rows = []
stable = []
print(ranked)`,
    solution: `ranked = scores.set_index("player").rank(ascending=False, method="min")
min_rank = ranked.min(axis=1)
max_rank = ranked.max(axis=1)
spread_rows = [[player, int(min_rank[player]), int(max_rank[player])] for player in sorted(ranked.index)]
stable = sorted(max_rank[max_rank <= 3].index.tolist())
print(spread_rows, stable)`,
    hints: [
      'Der Rang pro Szenario entsteht spaltenweise. Für die Spannweite brauchst du das Minimum und Maximum über die drei Rangspalten.',
      'Lies die pandas-Dokumentation zu rank und method="min". Überlege, warum ein Spieler mit Rang 1 und 4 nicht stabil ist.',
      'Die Spannweite:\n\nranked["min_rank"] = ranked.min(axis=1)\nranked["max_rank"] = ranked.max(axis=1)',
    ],
    checks: [
      check('Rangspannen je Spieler', 'spread_rows', [
        ['A', 1, 4],
        ['B', 2, 2],
        ['C', 1, 4],
        ['D', 1, 4],
        ['E', 5, 5],
        ['F', 6, 6],
      ]),
      check('Nur B bleibt in allen Szenarien in den Top 3', 'stable', ['B']),
    ],
    reflection:
      'Was würdest du einem Trainer sagen, wenn ein Kandidat in einem Szenario Erster und in einem anderen Vierter ist?',
    rubric: [
      'Beschreibe die Annahmeabhängigkeit statt nur eine Rangzahl zu nennen.',
      'Nenne eine Möglichkeit, die Instabilität fachlich zu erklären.',
    ],
    setup: `import pandas as pd

scores = pd.DataFrame({
    "player": ["A", "B", "C", "D", "E", "F"],
    "s1": [88, 85, 60, 70, 50, 40],
    "s2": [70, 84, 88, 60, 55, 45],
    "s3": [60, 83, 70, 88, 52, 48],
})`,
    variants: [
      {
        label: 'Andere Szenarien',
        setup: `import pandas as pd

scores = pd.DataFrame({
    "player": ["A", "B", "C", "D", "E", "F"],
    "s1": [70, 90, 60, 80, 50, 40],
    "s2": [80, 60, 90, 70, 55, 45],
    "s3": [75, 85, 65, 95, 52, 48],
})`,
        checks: [
          check('Neue Rangspannen', 'spread_rows', [
            ['A', 2, 3],
            ['B', 1, 4],
            ['C', 1, 4],
            ['D', 1, 3],
            ['E', 5, 5],
            ['F', 6, 6],
          ]),
          check('Neue stabilen Spieler', 'stable', ['A', 'D']),
        ],
      },
    ],
    sources: [PANDAS_RANK_DOCS],
  },
  {
    ...common,
    id: 'scout-shortlist',
    title: 'Shortlist mit Unsicherheitsgrenze',
    minutes: 45,
    concept: 'Unsicherheit und konservative Auswahl',
    objective:
      'Eine per-90-Rate mit einer einfachen Unsicherheitsgrenze versehen und eine Shortlist konservativ filtern.',
    prerequisites: ['scout-sensitivitaet'],
    explanation: [
      'Eine Punktzahl wie 2,03 Key Passes pro 90 sieht präzise aus, ist aber eine Schätzung aus endlich vielen Aktionen. Bei 14 Aktionen ist sie unsicherer als bei 30. Eine einfache Näherung behandelt die Anzahl der Aktionen als Poisson-Prozess: Der relative Standardfehler ist etwa 1 / sqrt(Aktionen), der absolute Standardfehler also Rate / sqrt(Aktionen).',
      'Die untere Grenze rate - 1,96 * se ist konservativ: Sie fragt, wie gut der Spieler sein könnte, wenn die beobachtete Rate am unteren Ende der Unsicherheit liegt. Wir kappen sie bei 0, weil negative Raten sportlich keinen Sinn ergeben. Das Kappen ist eine Annahme und verändert die Interpretation der Grenze.',
      'Hier kommen nur Spieler auf die Shortlist, deren untere Grenze mindestens 0,9 beträgt. Prüfe auch andere Schwellen, denn die Wahl von 0,9 ist nicht aus den Daten vorgegeben. Nach dem Runden können zwei Grenzen gleich aussehen, obwohl sich die Rohraten unterscheiden. Behalte deshalb Rohrate, Aktionszahl und Minuten im Blick. Nutze die Liste, um Video und Gespräch vorzubereiten; eine Transferentscheidung erfordert weitere Prüfung.',
      scoutingExplanation,
    ],
    example: `rate = 14 / 620 * 90
se = rate / (14 ** 0.5)
lower = max(0, rate - 1.96 * se)
print(round(rate, 3), round(lower, 3))`,
    task: 'Filtere players auf position == "MF" und mindestens 450 Minuten in sh. Berechne kp90 = key_passes / minutes * 90 und se = kp90 / sqrt(key_passes). Berechne lower = max(0, kp90 - 1.96 * se). Behalte nur Zeilen mit lower >= 0.9. Sortiere absteigend nach lower, dann absteigend nach kp90, dann aufsteigend nach name. Speichere shortlist als Liste [name, gerundete kp90 auf 3 Stellen, gerundete lower auf 3 Stellen].',
    starter: `import math

sh = players[(players["position"] == "MF") & (players["minutes"] >= 450)].copy()
sh["kp90"] = 0
sh["se"] = 0
sh["lower"] = 0
shortlist = []
print(sh)`,
    solution: `import math

sh = players[(players["position"] == "MF") & (players["minutes"] >= 450)].copy()
sh["kp90"] = sh["key_passes"] / sh["minutes"] * 90
sh["se"] = sh["kp90"] / sh["key_passes"].pow(0.5)
sh["lower"] = (sh["kp90"] - 1.96 * sh["se"]).clip(lower=0)
sh = sh[sh["lower"] >= 0.9].sort_values(["lower", "kp90", "name"], ascending=[False, False, True])
shortlist = [[row["name"], round(float(row["kp90"]), 3), round(float(row["lower"]), 3)] for _, row in sh.iterrows()]
print(shortlist)`,
    hints: [
      'Der Standardfehler skaliert mit 1/sqrt(Aktionen). Achte darauf, die Anzahl der Key Passes als Aktionen zu verwenden, nicht die Minuten.',
      'Lies die pandas-Dokumentation zu pow und clip. Überlege, warum die untere Grenze bei 0 gekappt wird.',
      'Die Grenze:\n\nsh["se"] = sh["kp90"] / sh["key_passes"].pow(0.5)\nsh["lower"] = (sh["kp90"] - 1.96 * sh["se"]).clip(lower=0)',
    ],
    checks: [
      check('Zwei Spieler über der konservativen Schwelle', 'len(shortlist)', 2),
      check('Shortlist mit Rohrate und unterer Grenze', 'shortlist', [
        ['Ada', 1.8, 0.968],
        ['Ria', 2.032, 0.968],
      ]),
      check('Grenze wird nicht negativ', 'bool((sh["lower"] >= 0).all())', true),
    ],
    reflection:
      'Was würde sich an der Shortlist ändern, wenn du statt der unteren Grenze die Rohrate sortierst, und welche Entscheidung wäre defensiver?',
    rubric: [
      'Erkläre den Unterschied zwischen Punktschätzung und unterer Grenze.',
      'Nenne die Schwelle und das Kappen bei 0 als setzbare Annahmen.',
    ],
    setup: SCOUTING_SETUP,
    sources: [
      {
        title: 'Poisson-Verteilung: Unsicherheit von Zählraten',
        url: 'https://en.wikipedia.org/wiki/Poisson_distribution',
      },
      PANDAS_DOCS,
    ],
  },
  {
    ...common,
    id: 'scout-review',
    title: 'Wiederholung: Stürmerprofile vergleichen',
    minutes: 40,
    concept: 'Wiederholung: Per-90 und Perzentile',
    objective:
      'Dieselbe Perzentil-Logik auf eine andere Positionsgruppe und eine andere Kennzahl anwenden.',
    prerequisites: ['scout-shortlist'],
    reviewOf: 'scout-per90',
    explanation: [
      'Vergleiche jetzt Stürmer anhand von xG pro 90 und berücksichtige mindestens 400 Minuten. Du verwendest denselben Rechenweg für eine andere fachliche Frage. Ein hoher xG-Wert pro 90 beschreibt die erfassten Abschlusspositionen. Daraus folgt noch nicht, dass der Spieler diese Positionen dauerhaft aus eigener Fähigkeit erreicht.',
      'Filtere zuerst, dann berechne die Rate, dann das Perzentil. Die Reihenfolge ist wichtig, weil sich die Vergleichsgruppe durch den Filter ändert. Kai mit 300 Minuten gehört nicht dazu, obwohl er in der Tabelle steht.',
      'Mit nur drei Stürmern bleiben die Perzentile grob. 100 kennzeichnet den höchsten Wert dieser Dreiergruppe; einen Vergleich mit allen Stürmern der Liga erlaubt das nicht. Prüfe für eine Empfehlung zusätzlich Spielstil, Rolle, Gegner und erzielte Tore.',
      scoutingExplanation,
    ],
    example: `fw = players[(players["position"] == "FW") & (players["minutes"] >= 400)].copy()
fw["xg90"] = fw["xg"] / fw["minutes"] * 90
fw["pct"] = fw["xg90"].rank(pct=True) * 100`,
    task: 'Filtere players auf position == "FW" und mindestens 400 Minuten in fw. Berechne xg90 = xg / minutes * 90 und pct = rank(pct=True) * 100. Sortiere absteigend nach pct und bei Gleichstand aufsteigend nach name. Speichere ranked als Liste [name, gerundete xg90 auf 3 Stellen, gerundetes pct auf 1 Stelle].',
    starter: `fw = players[players["position"] == "FW"].copy()
fw["xg90"] = 0
fw["pct"] = 0
ranked = []
print(fw)`,
    solution: `fw = players[(players["position"] == "FW") & (players["minutes"] >= 400)].copy()
fw["xg90"] = fw["xg"] / fw["minutes"] * 90
fw["pct"] = fw["xg90"].rank(pct=True) * 100
fw = fw.sort_values(["pct", "name"], ascending=[False, True])
ranked = [[row["name"], round(float(row["xg90"]), 3), round(float(row["pct"]), 1)] for _, row in fw.iterrows()]
print(ranked)`,
    hints: [
      'Der Filter ist diesmal FW und 400 Minuten. Berechne das Perzentil erst nach dem Filter.',
      'Lies bei Bedarf noch einmal die Per-90-Lektion. Prüfe, ob Kai mit 300 Minuten wirklich ausgeschlossen ist.',
      'Die Rate:\n\nfw["xg90"] = fw["xg"] / fw["minutes"] * 90\nfw["pct"] = fw["xg90"].rank(pct=True) * 100',
    ],
    checks: [
      check('Drei Stürmer in der Vergleichsgruppe', 'len(fw)', 3),
      check('xG pro 90 und Perzentil', 'ranked', [
        ['Ida', 0.75, 100.0],
        ['Jona', 0.45, 66.7],
        ['Lena', 0.113, 33.3],
      ]),
    ],
    reflection:
      'Warum kann ein Stürmer mit hohem xG pro 90 trotzdem ein schwaches Saisonprofil haben, wenn er viele Minuten gegen starke Gegner spielte?',
    rubric: [
      'Trenne Abschlussposition von Abschlussergebnis.',
      'Nenne mindestens einen Kontextfaktor, der die Rate beeinflusst.',
    ],
    setup: `import io
import pandas as pd

csv_text = """name,position,minutes,xg,key_passes
Ida,FW,600,5.0,4
Jona,FW,400,2.0,3
Kai,FW,300,3.0,2
Lena,FW,800,1.0,6
Mia,MF,700,4.0,5"""
players = pd.read_csv(io.StringIO(csv_text))`,
    sources: [PANDAS_RANK_DOCS, PANDAS_GROUPBY_DOCS],
  },
];
