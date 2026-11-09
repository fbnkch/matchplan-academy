import type { Lesson } from '../types';
import {
  DATA_NOTE,
  PANDAS_DOCS,
  PANDAS_MERGE_DOCS,
  PANDAS_MISSING_DOCS,
  SQL_AGG_DOCS,
  SQL_ALT_SETUP,
  SQL_BASE_SETUP,
  SQL_DOCS,
  SQL_NULL_DOCS,
  SQL_WINDOW_DOCS,
  check,
} from './fixtures';

const common = {
  trackId: 'data',
  packages: [] as string[],
};

export const dataLessons: Lesson[] = [
  {
    ...common,
    id: 'sql-select',
    title: 'Spiele mit vielen Toren finden',
    minutes: 25,
    concept: 'SQL: SELECT, WHERE und ORDER BY',
    objective: 'Eine Tabelle mit SELECT auswählen, mit WHERE filtern und das Ergebnis sortieren.',
    prerequisites: ['transfer'],
    explanation: [
      'Eine SQL-Tabelle enthält Zeilen und benannte Spalten. Mit SELECT wählst du die Spalten aus, FROM gibt die Tabelle an. Die Abfrage liefert wiederum eine Tabelle. Eine Grafik oder Rangliste entsteht daraus erst durch weitere Schritte.',
      'WHERE behält nur Zeilen, für die die Bedingung wahr ist. Vergleiche wie >=, < oder = funktionieren zeilenweise: Bei jedem Spiel wird home_goals mit der Zahl verglichen. ORDER BY sortiert zum Schluss; mehrere Sortierschlüssel werden mit Komma getrennt, und DESC bedeutet absteigend.',
      'Prüfe bei jeder Abfrage, wofür eine Ergebniszeile steht. Hier ist es genau ein Spiel. Ein späterer JOIN kann diese Zuordnung verändern, etwa wenn zu einem Spiel mehrere Ereignisse passen. Dann musst du die Bedeutung der Zeile erneut prüfen, bevor du zählst oder summierst.',
      DATA_NOTE,
    ],
    example: `SELECT match_id, home, away
FROM matches
WHERE away_goals >= 2
ORDER BY match_id;`,
    exampleNote:
      'Dieses Beispiel liefert alle Spiele, in denen die Auswärtsmannschaft mindestens zwei Tore erzielt hat.',
    task: 'Schreibe eine Abfrage mit den Spalten match_id, home, away und home_goals für alle Spiele, in denen die Heimmannschaft mindestens 3 Tore erzielt hat. Sortiere absteigend nach home_goals und bei Gleichstand aufsteigend nach match_id.',
    starter: `SELECT match_id, home, away, home_goals
FROM matches
WHERE home_goals > 10
ORDER BY home_goals DESC;`,
    solution: `SELECT match_id, home, away, home_goals
FROM matches
WHERE home_goals >= 3
ORDER BY home_goals DESC, match_id ASC;`,
    hints: [
      'Die Schwelle steht in WHERE. "mindestens 3" schließt die 3 ein, also brauchst du >= statt >.',
      'Lies in der SQLite-Dokumentation die Abschnitte zu WHERE und ORDER BY. Prüfe danach, ob deine Sortierung bei zwei Spielen mit gleich vielen Toren eindeutig bleibt.',
      'Der zweite Sortierschlüssel entscheidet den Gleichstand:\n\nWHERE home_goals >= 3\nORDER BY home_goals DESC, match_id ASC',
    ],
    checks: [
      check('Nur Spiele mit mindestens drei Heimtoren, korrekt sortiert', 'result', [
        ['M3', 'Hafenstadt', 'Weststadt', 3],
        ['M7', 'Nordstadt', 'Hafenstadt', 3],
      ]),
      check('Genau zwei Ergebniszeilen', 'len(result)', 2),
    ],
    reflection:
      'Was bedeutet eine Zeile in deinem Ergebnis, und warum sagt "mindestens drei Heimtore" noch nichts über die Spielqualität der Heimmannschaft aus?',
    rubric: [
      'Erkläre, dass eine Zeile ein Spiel repräsentiert.',
      'Nenne mindestens einen Grund, warum ein einzelnes Spiel mit drei Toren kein Beleg für eine stabile Offensivstärke ist.',
    ],
    setup: SQL_BASE_SETUP,
    language: 'sql',
    packages: ['sqlite3'],
    variants: [
      {
        label: 'Andere Spiele',
        setup: SQL_ALT_SETUP,
        checks: [
          check('Auch in den neuen Daten nur passende Spiele', 'result', [
            ['X3', 'West', 'Süd', 3],
          ]),
        ],
      },
    ],
    sources: [SQL_DOCS],
  },
  {
    ...common,
    id: 'sql-group',
    title: 'Schüsse und Tore pro Team zählen',
    minutes: 35,
    concept: 'SQL: GROUP BY, COUNT und SUM(CASE)',
    objective:
      'Zeilen mit GROUP BY zusammenfassen und bedingte Zählungen mit SUM(CASE WHEN ...) bilden.',
    prerequisites: ['sql-select'],
    explanation: [
      'GROUP BY fasst Zeilen mit demselben Wert zu einer Gruppe zusammen. So werden aus vielen Schusszeilen einzelne Teamzeilen. Eine Aggregatfunktion berechnet einen Wert über mehrere Zeilen: COUNT(*) zählt sie. Ohne GROUP BY erhältst du dabei genau eine Ergebniszeile für die gesamte Tabelle.',
      "SUM(CASE WHEN outcome = 'Goal' THEN 1 ELSE 0 END) zählt die Tore. CASE setzt für jede Schusszeile mit outcome = 'Goal' eine 1, für alle anderen eine 0; SUM addiert sie. Diese bedingte Summe ist eine übliche Alternative zu COUNT mit Filter. Damit lassen sich Tore und sämtliche Schüsse in derselben Abfrage zählen.",
      'HAVING filtert Gruppen, WHERE filtert einzelne Zeilen. Die Reihenfolge ist wichtig: Erst werden Zeilen mit WHERE ausgewählt, dann gruppiert, dann mit HAVING gefiltert, zuletzt sortiert. Eine Ausgabe wie "10 Schüsse, 7 Tore" ist eine Beschreibung dieser fiktiven Stichprobe, keine Schätzung der wahren Abschlussstärke. Die Tabelle shots ist außerdem nur ein Ausschnitt der Schussereignisse; matches enthält vollständige Mannschaftswerte aus einer separaten Quelle. Summen aus shots müssen deshalb nicht zu den Werten in matches passen. Eine fehlende Zeile bedeutet "nicht im Ausschnitt", nicht "null Ereignisse".',
    ],
    example: `SELECT team, COUNT(*) AS shots
FROM shots
WHERE minute <= 45
GROUP BY team
ORDER BY shots DESC;`,
    exampleNote:
      'So zählst du nur Schüsse aus der ersten Halbzeit. WHERE arbeitet vor der Gruppierung.',
    task: 'Ermittle pro Team die Anzahl aller Schüsse als shots und die Anzahl der Tore als goals. Behalte nur Teams mit mindestens 6 Schüssen. Sortiere absteigend nach goals, dann absteigend nach shots, bei Gleichstand aufsteigend nach team.',
    starter: `SELECT team, COUNT(*) AS shots
FROM shots
GROUP BY team
ORDER BY shots DESC;`,
    solution: `SELECT team,
       COUNT(*) AS shots,
       SUM(CASE WHEN outcome = 'Goal' THEN 1 ELSE 0 END) AS goals
FROM shots
GROUP BY team
HAVING COUNT(*) >= 6
ORDER BY goals DESC, shots DESC, team ASC;`,
    hints: [
      'Du brauchst zwei Kennzahlen in derselben gruppierten Zeile: COUNT(*) für alle Schüsse und eine bedingte Summe für Tore.',
      'Lies die SQLite-Dokumentation zu COUNT, SUM und HAVING. Überlege, welcher Filter vor und welcher nach der Gruppierung greift.',
      "Die Torzählung entsteht zeilenweise:\n\nSUM(CASE WHEN outcome = 'Goal' THEN 1 ELSE 0 END) AS goals\n\nDer Mindestwert für Schüsse gehört in HAVING.",
    ],
    checks: [
      check('Teams mit mindestens sechs Schüssen, Tore und Schüsse korrekt', 'result', [
        ['Nordstadt', 10, 7],
        ['Weststadt', 6, 2],
        ['Hafenstadt', 7, 1],
      ]),
      check('Drei Gruppen', 'len(result)', 3),
    ],
    reflection:
      'Warum ist die Umrechnung "7 Tore bei 10 Schüssen" kein guter Schätzer für die zukünftige Torquote, und welche Rolle spielt die Auswahl der Gegner?',
    rubric: [
      'Unterscheide beschreibende Quote und Prognose.',
      'Nenne Stichprobengröße, Gegnerstärke oder Schussqualität als offene Punkte.',
    ],
    setup: SQL_BASE_SETUP,
    language: 'sql',
    packages: ['sqlite3'],
    variants: [
      {
        label: 'Andere Teams',
        setup: SQL_ALT_SETUP,
        checks: [check('Neue Gruppierung mit HAVING', 'result', [['Nord', 6, 3]])],
      },
    ],
    sources: [SQL_AGG_DOCS, SQL_DOCS],
  },
  {
    ...common,
    id: 'sql-join',
    title: 'Spieler und Einsatzminuten verknüpfen',
    minutes: 40,
    concept: 'SQL: JOIN und Aggregation über zwei Tabellen',
    objective:
      'Zwei Tabellen über einen Schlüssel verbinden und pro Spieler Anzahl und Summe der Einsätze berechnen.',
    prerequisites: ['sql-group'],
    explanation: [
      'Ein JOIN verbindet Zeilen aus zwei Tabellen über einen gemeinsamen Schlüssel. Hier ist das player_id in players und appearances. Zu jeder Einsatzzeile ergänzt der JOIN die passende Spielerzeile. Mit GROUP BY kannst du die verbundenen Einsätze anschließend pro Spieler zusammenfassen.',
      'Vor dem JOIN steht eine Zeile für einen Einsatz, danach für denselben Einsatz mit Spielernamen. Erst nach der Gruppierung steht eine Ergebniszeile für einen Spieler. Vorsicht bei einer weiteren Tabelle mit mehreren Zeilen pro Spieler: Dieselbe Einsatzzeile kann dann mehrfach auftauchen und die Minutensumme erhöhen. Diese Vervielfachung heißt Fan-out.',
      'GROUP BY p.player_id ist hier robuster als GROUP BY p.name, weil der Schlüssel eindeutig ist. Namen können sich wiederholen. HAVING filtert die summierten Minuten, nicht die einzelnen Einsätze. Die Aussage "mindestens 360 Minuten" ist eine Auswahlregel, keine Qualitätsaussage. Für die Datenbasis gilt außerdem: shots ist nur ein Ausschnitt der Schussereignisse, während matches vollständige Mannschaftswerte aus einer separaten Quelle enthält. Die Tabellen sind nicht ereignisgenau abgestimmt; fehlende Schusszeilen bedeuten "nicht im Ausschnitt", nicht "null".',
    ],
    example: `SELECT p.position, COUNT(*) AS appearances
FROM players p
JOIN appearances a ON a.player_id = p.player_id
GROUP BY p.position
ORDER BY appearances DESC;`,
    exampleNote:
      'Hier ist die Gruppe die Position. Die Zeile bedeutet: So viele Einsätze gab es bei Spielern dieser Position.',
    task: 'Gib für jeden Spieler mit insgesamt mindestens 360 Einsatzminuten in der ausgewählten Spielmenge den Namen, die Position, die Anzahl der Einsätze als apps und die Summe von appearances.minutes als total_minutes aus. players.minutes enthält dagegen einen Saisonwert mit größerem Umfang. Sortiere absteigend nach total_minutes, bei Gleichstand aufsteigend nach name.',
    starter: `SELECT p.name, COUNT(a.match_id) AS apps
FROM players p
JOIN appearances a ON a.player_id = p.player_id
GROUP BY p.name;`,
    solution: `SELECT p.name,
       p.position,
       COUNT(a.match_id) AS apps,
       SUM(a.minutes) AS total_minutes
FROM players p
JOIN appearances a ON a.player_id = p.player_id
GROUP BY p.player_id
HAVING SUM(a.minutes) >= 360
ORDER BY total_minutes DESC, p.name ASC;`,
    hints: [
      'Du brauchst pro Spieler zwei Aggregate: COUNT für Einsätze und SUM für Minuten. Der Filter auf die Summe gehört zu HAVING.',
      'Lies die JOIN- und GROUP-BY-Abschnitte der SQLite-Dokumentation. Prüfe, ob deine Gruppierung pro Spieler eindeutig ist.',
      'Die fehlenden Teile:\n\nSUM(a.minutes) AS total_minutes\nGROUP BY p.player_id\nHAVING SUM(a.minutes) >= 360',
    ],
    checks: [
      check('Spieler mit mindestens 360 Minuten, Einsätze und Summe korrekt', 'result', [
        ['Mira', 'FW', 6, 540],
        ['Ria', 'MF', 5, 450],
        ['Tine', 'DF', 5, 450],
        ['Uta', 'DF', 5, 450],
        ['Nora', 'MF', 5, 390],
        ['Ada', 'MF', 4, 360],
        ['Ina', 'GK', 4, 360],
        ['Lina', 'MF', 4, 360],
      ]),
      check('Acht Spieler erfüllen die Minutenregel', 'len(result)', 8),
    ],
    reflection:
      'Warum kann dieselbe Einsatzzeile durch einen zusätzlichen JOIN doppelt in eine Summe eingehen, und wie würdest du das vor dem Auswerten prüfen?',
    rubric: [
      'Erkläre die Bedeutung einer Zeile vor und nach dem JOIN.',
      'Nenne eine Prüfung gegen doppelte Zeilen, etwa COUNT(DISTINCT ...) oder einen Test auf Duplikate.',
    ],
    setup: SQL_BASE_SETUP,
    language: 'sql',
    packages: ['sqlite3'],
    variants: [
      {
        label: 'Andere Einsatzliste',
        setup: SQL_ALT_SETUP,
        checks: [check('Neue Einsätze korrekt summiert', 'result', [['Ben', 'DF', 4, 360]])],
      },
    ],
    sources: [SQL_DOCS, SQL_AGG_DOCS],
  },
  {
    ...common,
    id: 'sql-null',
    title: 'Fehlende Empfänger sind keine leeren Strings',
    minutes: 35,
    concept: 'SQL: NULL, COUNT(Spalte) und sichere Anteile',
    objective:
      'Den Unterschied zwischen COUNT(*) und COUNT(spalte) bei NULL verstehen und einen Anteil berechnen.',
    prerequisites: ['sql-join'],
    explanation: [
      'NULL kennzeichnet einen unbekannten oder nicht vorhandenen Wert. Es ist weder 0 noch leerer Text. Bei einem unvollständigen Pass enthält receiver keinen Namen, die Passzeile bleibt aber erhalten. COUNT(*) zählt deshalb alle Passzeilen, COUNT(receiver) nur die mit bekanntem Empfänger.',
      'Vergleiche mit NULL brauchen IS NULL oder IS NOT NULL. Ausdrücke wie receiver = NULL werden nicht wahr, sondern unbekannt. Für Anteile ist das entscheidend: Der Nenner COUNT(*) beschreibt alle Versuche, der Zähler COUNT(receiver) die abgeschlossenen. 100.0 * COUNT(receiver) / COUNT(*) macht daraus eine Prozentzahl; die Multiplikation mit 100.0 verhindert in SQLite die ganzzahlige Division.',
      'Viele kurze Sicherheitspässe können den Anteil erhöhen, ohne Raumgewinn zu bringen. Die Quote misst hier, wie oft ein Empfänger eingetragen ist. Schwierigkeit und Gegnerdruck erfasst sie nicht. Gib deshalb bei jeder Quote an, welche Ereignisse du im Zähler und welche du im Nenner berücksichtigst.',
    ],
    example: `SELECT team,
       COUNT(*) AS attempts,
       COUNT(receiver) AS with_receiver
FROM passes
GROUP BY team;`,
    exampleNote: 'with_receiver zählt nur Passzeilen, in denen ein Empfänger eingetragen ist.',
    task: 'Berechne pro Team total_passes als COUNT(*), completed_passes als COUNT(receiver) und completion_pct als 100.0 * completed_passes / total_passes, gerundet auf eine Nachkommastelle. Sortiere absteigend nach completion_pct und bei Gleichstand aufsteigend nach team.',
    starter: `SELECT team,
       COUNT(*) AS total_passes,
       COUNT(*) AS completed_passes
FROM passes
GROUP BY team;`,
    solution: `SELECT team,
       COUNT(*) AS total_passes,
       COUNT(receiver) AS completed_passes,
       ROUND(100.0 * COUNT(receiver) / COUNT(*), 1) AS completion_pct
FROM passes
GROUP BY team
ORDER BY completion_pct DESC, team ASC;`,
    hints: [
      'Zähle im Zähler nur Zeilen, in denen receiver bekannt ist. COUNT(*) zählt dagegen jede Zeile.',
      'Lies die SQLite-Hinweise zu NULL und zu COUNT. Achte darauf, dass COUNT(receiver) NULL-Werte ignoriert.',
      'Der Zähler ist COUNT(receiver), der Nenner COUNT(*):\n\nROUND(100.0 * COUNT(receiver) / COUNT(*), 1) AS completion_pct\n\nDer zweite Sortierschlüssel team ASC macht die Reihenfolge bei gleicher Quote eindeutig.',
    ],
    checks: [
      check('Quote aus bekanntem Empfänger, nicht aus allen Zeilen', 'result', [
        ['Hafenstadt', 4, 3, 75.0],
        ['Weststadt', 4, 3, 75.0],
        ['Nordstadt', 6, 4, 66.7],
      ]),
      check('Drei Teams', 'len(result)', 3),
    ],
    reflection:
      'Warum wäre es irreführend, die Passquote als "spielerische Qualität" zu lesen, wenn ein Team vor allem kurze Pässe ohne Raumgewinn spielt?',
    rubric: [
      'Erkläre Zähler und Nenner der Quote.',
      'Nenne Passlänge, Raumgewinn oder Gegnerdruck als fehlenden Kontext.',
    ],
    setup: SQL_BASE_SETUP,
    language: 'sql',
    packages: ['sqlite3'],
    variants: [
      {
        label: 'Andere Pässe',
        setup: SQL_ALT_SETUP,
        checks: [
          check('NULL-Empfänger werden nicht mitgezählt', 'result', [
            ['West', 2, 2, 100.0],
            ['Nord', 4, 2, 50.0],
            ['Süd', 3, 0, 0.0],
          ]),
        ],
      },
    ],
    sources: [SQL_NULL_DOCS, SQL_AGG_DOCS],
  },
  {
    ...common,
    id: 'sql-window',
    title: 'Die zwei besten Schüsse pro Team',
    minutes: 45,
    concept: 'SQL: Window Functions, PARTITION BY und CTE',
    objective:
      'Mit ROW_NUMBER() innerhalb von Gruppen rangieren und das Ergebnis in einer CTE weiterfiltern.',
    prerequisites: ['sql-null'],
    explanation: [
      'Eine Window Function berechnet einen Wert pro Zeile, ohne die Zeilen wie GROUP BY zusammenzufassen. ROW_NUMBER() OVER (PARTITION BY team ORDER BY xg DESC, minute) nummeriert die Schüsse innerhalb jedes Teams neu, beginnend bei 1. Jede Schusszeile bleibt erhalten und bekommt zusätzlich eine Rangnummer.',
      'PARTITION BY team startet die Nummerierung für jedes Team neu. ORDER BY im Fenster legt die Reihenfolge fest. Bei gleichem xG entscheidet hier minute als zweiter Sortierschlüssel, auch Tie-Breaker genannt. Ohne ihn kann die Abfrage bei einem Gleichstand unterschiedliche Zeilen auswählen.',
      'Auf das Ergebnis einer Window Function kannst du nicht direkt in WHERE derselben Abfrage zugreifen. Verwende deshalb eine CTE, eine mit WITH benannte Zwischentabelle: WITH ranked AS (...) SELECT ... FROM ranked WHERE rn <= 2. ROW_NUMBER vergibt bei Gleichstand verschiedene Nummern. RANK behandelt gleiche Werte gleich und könnte deshalb mehr als zwei Zeilen liefern.',
      'Für die Einordnung der Datenbasis gilt: shots enthält nur einen bewusst ausgewählten Ausschnitt der Schussereignisse. Die Tabelle matches enthält vollständige Mannschaftswerte aus einer separaten Quelle. Summen über shots müssen deshalb nicht zu den Werten in matches passen, und eine fehlende Schusszeile bedeutet "nicht im Ausschnitt", nicht "null Schüsse".',
    ],
    example: `SELECT team, player, xg,
       ROW_NUMBER() OVER (PARTITION BY team ORDER BY xg DESC) AS rn
FROM shots
WHERE match_id = 'M3';`,
    exampleNote:
      'Die Rangnummer startet für jedes Team bei 1, obwohl alle Zeilen aus demselben Spiel stammen.',
    task: 'Ermittle für jedes Team die zwei Schüsse mit dem höchsten xG. Nutze eine CTE mit ROW_NUMBER(), partitioniert nach team und sortiert nach xg absteigend, bei Gleichstand nach minute aufsteigend. Gib team, player, match_id und das auf zwei Nachkommastellen gerundete xG aus. Sortiere nach team und Rangnummer.',
    starter: `SELECT team, player, xg,
       ROW_NUMBER() OVER (ORDER BY xg DESC) AS rn
FROM shots
ORDER BY rn;`,
    solution: `WITH ranked AS (
  SELECT team, player, match_id, minute, xg,
         ROW_NUMBER() OVER (PARTITION BY team ORDER BY xg DESC, minute ASC) AS rn
  FROM shots
)
SELECT team, player, match_id, ROUND(xg, 2) AS xg
FROM ranked
WHERE rn <= 2
ORDER BY team ASC, rn ASC;`,
    hints: [
      'Die Nummerierung muss pro Team neu beginnen. Danach filterst du die Zwischentabelle auf rn <= 2.',
      'Lies die SQLite-Dokumentation zu Window Functions und zu WITH. Achte auf PARTITION BY und den Tie-Breaker im ORDER BY.',
      'Der Kern der CTE:\n\nROW_NUMBER() OVER (PARTITION BY team ORDER BY xg DESC, minute ASC) AS rn\n\nDas äußere SELECT filtert WHERE rn <= 2.',
    ],
    checks: [
      check('Zwei beste Schüsse je Team, inklusive Tie-Breaker', 'result', [
        ['Hafenstadt', 'Nora', 'M1', 0.22],
        ['Hafenstadt', 'Nora', 'M3', 0.18],
        ['Nordstadt', 'Mira', 'M5', 0.42],
        ['Nordstadt', 'Ada', 'M1', 0.35],
        ['Weststadt', 'Sina', 'M8', 0.26],
        ['Weststadt', 'Sina', 'M3', 0.24],
      ]),
      check('Sechs Zeilen, zwei pro Team', 'len(result)', 6),
    ],
    reflection:
      'Warum ist "die zwei besten Schüsse" keine Aussage über die zwei besten Spieler, und was würde sich ändern, wenn du statt xG den Torerfolg sortierst?',
    rubric: [
      'Trenne Schussqualität von Spielerqualität.',
      'Erkläre, warum die Auswahlregel das Ergebnis bestimmt.',
    ],
    setup: SQL_BASE_SETUP,
    language: 'sql',
    packages: ['sqlite3'],
    variants: [
      {
        label: 'Andere Schüsse',
        setup: SQL_ALT_SETUP,
        checks: [
          check('Rangliste in neuen Gruppen', 'result', [
            ['Nord', 'Ava', 'X1', 0.4],
            ['Nord', 'Cem', 'X1', 0.3],
            ['Süd', 'Ben', 'X2', 0.5],
            ['Süd', 'Dora', 'X2', 0.1],
            ['West', 'Eli', 'X3', 0.05],
            ['West', 'Eli', 'X3', 0.04],
          ]),
        ],
      },
    ],
    sources: [SQL_WINDOW_DOCS, SQL_DOCS],
  },
  {
    ...common,
    id: 'pandas-load',
    title: 'Eine CSV laden und pro 90 Minuten rechnen',
    minutes: 40,
    concept: 'pandas: read_csv, neue Spalte, Filtern und Sortieren',
    objective:
      'Eine CSV in einen DataFrame laden, eine Rate berechnen, nach Spielzeit filtern und ein geprüftes Ergebnis ausgeben.',
    prerequisites: ['sql-window'],
    explanation: [
      'pd.read_csv liest Text mit Kopfzeile in einen DataFrame, die Tabellenstruktur von pandas. io.StringIO stellt einen String als Datei bereit; das Beispiel braucht dadurch weder einen Dateipfad noch eine Netzverbindung. Jede Zeile bildet einen Datensatz. Jede Spalte ist eine Series mit einem Datentyp.',
      'Eine neue Spalte entsteht durch Zuweisung: df["per90"] = df["goals"] / df["minutes"] * 90. pandas rechnet spaltenweise, nicht mit einer Python-Schleife. Anschließend filterst du mit df[df["minutes"] >= 300] und sortierst mit sort_values. Bei Gleichstand entscheidet eine zweite Spalte, hier der Name.',
      'Runde erst für die Ausgabe. Hier verwenden wir zwei Nachkommastellen, damit kleine Gleitkomma-Unterschiede die Prüfung nicht beeinflussen. Die Mindestspielzeit von 300 Minuten bestimmt dagegen, wer überhaupt in den Vergleich kommt: Spieler mit weniger Minuten fallen heraus, auch wenn sich ihre Rate berechnen ließe. Die verbleibenden Raten beschreiben bisherige Einsätze und erlauben noch keine Prognose.',
    ],
    example: `import io
import pandas as pd

text = """name,minutes,goals
Ada,900,4
Mira,810,7"""
df = pd.read_csv(io.StringIO(text))
df["per90"] = df["goals"] / df["minutes"] * 90
print(df[["name", "per90"]])`,
    exampleNote: 'Der DataFrame enthält die neue Spalte; print zeigt sie als Tabelle.',
    task: 'Lade csv_text mit pd.read_csv(io.StringIO(...)). Berechne goals_per90 = goals / minutes * 90. Behalte nur Zeilen mit mindestens 300 Minuten, sortiere absteigend nach goals_per90 und bei Gleichstand aufsteigend nach name. Speichere die Liste [name, gerundete goals_per90] in top; runde auf zwei Nachkommastellen.',
    starter: `import io
import pandas as pd

df = pd.read_csv(io.StringIO(csv_text))
top = []
print(df)`,
    solution: `import io
import pandas as pd

df = pd.read_csv(io.StringIO(csv_text))
df["goals_per90"] = df["goals"] / df["minutes"] * 90
filtered = df[df["minutes"] >= 300].copy()
filtered = filtered.sort_values(["goals_per90", "name"], ascending=[False, True])
filtered["goals_per90"] = filtered["goals_per90"].round(2)
top = filtered[["name", "goals_per90"]].values.tolist()
print(top)`,
    hints: [
      'Nach dem Laden fehlt die neue Spalte. Berechne sie zuerst, bevor du filterst und sortierst.',
      'Lies die pandas-Einführung zu Auswahl, neuer Spalte und sort_values. Prüfe, ob dein Filter wirklich nur die Zeilen mit mindestens 300 Minuten behält.',
      'Die Rechenschritte:\n\ndf["goals_per90"] = df["goals"] / df["minutes"] * 90\ndf = df[df["minutes"] >= 300]\n\nDanach sortieren und runden.',
    ],
    checks: [
      check('Fünf Spieler mit mindestens 300 Minuten, korrekt sortiert', 'top', [
        ['Mira', 0.78],
        ['Lina', 0.64],
        ['Ria', 0.44],
        ['Ada', 0.4],
        ['Nora', 0.4],
      ]),
      check('Alle sechs CSV-Zeilen geladen', 'len(df)', 6),
      check('Keine fehlende Rate', 'bool(df["goals_per90"].notna().all())', true),
    ],
    reflection:
      'Warum kann ein Spieler mit 310 Minuten und hoher Torrate über der Liste stehen, obwohl die Stichprobe für eine Empfehlung zu klein ist?',
    rubric: [
      'Nenne die Mindestspielzeit als bewusste, nicht neutrale Regel.',
      'Erkläre, warum eine hohe Rate bei wenig Spielzeit unsicher ist.',
    ],
    setup: `import io
import pandas as pd

csv_text = """name,position,minutes,goals,key_passes
Ada,MF,900,4,18
Mira,FW,810,7,9
Lea,MF,180,1,3
Nora,MF,450,2,7
Ria,MF,620,3,14
Lina,MF,700,5,11"""`,
    packages: ['pandas'],
    variants: [
      {
        label: 'Andere CSV',
        setup: `import io
import pandas as pd

csv_text = """name,position,minutes,goals,key_passes
Ida,MF,600,6,10
Jona,FW,300,3,4
Kai,DF,120,1,1
Lena,MF,450,3,7"""`,
        checks: [
          check('Neue Daten, gleiche Rechenregel', 'top', [
            ['Ida', 0.9],
            ['Jona', 0.9],
            ['Lena', 0.6],
          ]),
        ],
      },
    ],
    sources: [PANDAS_DOCS],
  },
  {
    ...common,
    id: 'pandas-clean-join',
    title: 'Zwei Tabellen bereinigen und zusammenführen',
    minutes: 50,
    concept: 'pandas: Duplikate, merge, fillna und sichere Division',
    objective:
      'Zwei fehlerhafte Tabellen über einen Schlüssel verbinden, Duplikate entfernen und fehlende Werte kontrolliert behandeln.',
    prerequisites: ['pandas-load'],
    explanation: [
      'In beiden Tabellen kommt dieselbe player_id mehrfach vor. drop_duplicates("player_id") behält standardmäßig die erste Zeile. Bevor du das auf andere Daten überträgst, kläre, weshalb gerade dieser Eintrag gelten soll. Die Funktion kann nicht entscheiden, ob die erste oder die letzte Zeile fachlich richtig ist.',
      'merge verbindet beide Tabellen über player_id. how="left" behält alle Spieler, auch wenn in der Statistik kein Eintrag existiert. Danach sind goals und key_passes bei fehlenden Zeilen NaN. fillna(0) ist hier vertretbar, weil "kein Eintrag" in dieser Übung "keine erfasste Aktion" bedeutet; bei unbekannten Werten wäre 0 eine falsche Behauptung.',
      'Bei 0 Minuten ist die Rate pro 90 nicht definiert. minutes.replace(0, np.nan) ersetzt die Null vor der Division durch einen fehlenden Wert; die Rechnung liefert dann NaN. Mit fillna(0) setzen wir diese Rate für die Übung auf 0. Halte diese Regel ausdrücklich fest, denn sie bewertet keine sportliche Leistung. Prüfe vor dem Sortieren die Zeilenzahl, die Spalten und die verbleibenden fehlenden Werte.',
    ],
    example: `import pandas as pd

left = pd.DataFrame({"id": [1, 2], "name": ["Ada", "Mira"]})
right = pd.DataFrame({"id": [1], "goals": [4]})
merged = left.merge(right, on="id", how="left")
print(merged)`,
    exampleNote: 'Mira bleibt erhalten, obwohl rechts kein Eintrag existiert; goals ist dort NaN.',
    task: 'Lies players_text und stats_text. Entferne in beiden Tabellen doppelte player_id (erste Zeile behalten). Verbinde mit einem Left-Join auf player_id. Fehlende goals und key_passes werden 0, fehlende minutes ebenfalls 0. Berechne goals_per90 und kp_per90 mit der Regel: bei 0 Minuten ist die Rate 0, sonst Wert / Minuten * 90. Sortiere absteigend nach goals_per90 und bei Gleichstand aufsteigend nach name. Speichere [name, goals_per90, kp_per90] gerundet auf zwei Nachkommastellen in rows.',
    starter: `import io
import pandas as pd
import numpy as np

players = pd.read_csv(io.StringIO(players_text))
stats = pd.read_csv(io.StringIO(stats_text))
merged = players.merge(stats, on="player_id", how="left")
rows = []
print(merged)`,
    solution: `import io
import pandas as pd
import numpy as np

players = pd.read_csv(io.StringIO(players_text)).drop_duplicates("player_id")
stats = pd.read_csv(io.StringIO(stats_text)).drop_duplicates("player_id")
merged = players.merge(stats, on="player_id", how="left")
merged[["goals", "key_passes", "minutes"]] = merged[["goals", "key_passes", "minutes"]].fillna(0)
merged["minutes"] = merged["minutes"].astype(int)
safe_minutes = merged["minutes"].replace(0, np.nan)
merged["goals_per90"] = (merged["goals"] / safe_minutes * 90).fillna(0)
merged["kp_per90"] = (merged["key_passes"] / safe_minutes * 90).fillna(0)
merged = merged.sort_values(["goals_per90", "name"], ascending=[False, True])
merged["goals_per90"] = merged["goals_per90"].round(2)
merged["kp_per90"] = merged["kp_per90"].round(2)
rows = merged[["name", "goals_per90", "kp_per90"]].values.tolist()
print(rows)`,
    hints: [
      'Bereinige zuerst beide Tabellen, bevor du sie verbindest. Ein Duplikat würde sonst Zeilen vervielfachen.',
      'Lies die pandas-Abschnitte zu merge und missing data. Überlege, warum 0 Minuten eine Sonderbehandlung braucht.',
      'Die sichere Division:\n\nsafe_minutes = merged["minutes"].replace(0, np.nan)\nmerged["goals_per90"] = (merged["goals"] / safe_minutes * 90).fillna(0)',
    ],
    checks: [
      check('Bereinigte, verbundene und sortierte Raten', 'rows', [
        ['Mira', 0.78, 1.0],
        ['Ria', 0.44, 2.03],
        ['Ada', 0.4, 1.8],
        ['Nora', 0.4, 1.4],
        ['Lina', 0.0, 0.0],
      ]),
      check('Fünf eindeutige Spieler nach dem Join', 'len(merged)', 5),
      check(
        'Keine fehlenden Raten',
        'bool(merged[["goals_per90", "kp_per90"]].notna().all().all())',
        true,
      ),
      check('Erste Zeile nach der Sortierung', 'list(rows[0]) if rows else []', [
        'Mira',
        0.78,
        1.0,
      ]),
    ],
    reflection:
      'Warum ist die Entscheidung, fehlende Werte mit 0 zu füllen, eine fachliche Annahme und keine neutrale Datenbereinigung?',
    rubric: [
      'Erkläre, warum die Wahl der ersten Duplikatzeile begründet werden muss.',
      'Nenne einen Fall, in dem 0 statt "unbekannt" die Aussage verfälscht.',
    ],
    setup: `import io
import pandas as pd
import numpy as np

players_text = """player_id,name,minutes
1,Ada,900
2,Mira,810
3,Nora,450
1,Ada,900
4,Ria,620
5,Lina,700"""

stats_text = """player_id,goals,key_passes
1,4,18
2,7,9
3,2,7
4,3,14
4,3,14"""`,
    packages: ['pandas', 'numpy'],
    variants: [
      {
        label: 'Andere bereinigte Tabellen',
        setup: `import io
import pandas as pd
import numpy as np

players_text = """player_id,name,minutes
1,Ada,900
2,Mira,0
3,Nora,450
1,Ada,900"""

stats_text = """player_id,goals,key_passes
1,4,18
2,2,4
3,1,7"""`,
        checks: [
          check('Nullminuten und Duplikate in neuen Daten', 'rows', [
            ['Ada', 0.4, 1.8],
            ['Nora', 0.2, 1.4],
            ['Mira', 0.0, 0.0],
          ]),
        ],
      },
    ],
    sources: [PANDAS_MERGE_DOCS, PANDAS_MISSING_DOCS, PANDAS_DOCS],
  },
  {
    ...common,
    id: 'data-review',
    title: 'Wiederholung: Einsatzminuten aus zwei Tabellen',
    minutes: 35,
    concept: 'Wiederholung: JOIN, GROUP BY und HAVING',
    objective:
      'Eine Verknüpfung mit neuen Tabellen und einer anderen Schwelle selbstständig aufbauen.',
    prerequisites: ['pandas-clean-join'],
    reviewOf: 'sql-join',
    explanation: [
      'Leite die Abfrage aus den neuen Tabellen ab: In squad steht eine Zeile für einen Spieler, in minutes_log für einen einzelnen Einsatz. Im Ergebnis soll wieder eine Zeile pro Spieler stehen. Damit kannst du die nötige Verknüpfung und Gruppierung bestimmen, ohne die frühere Abfrage auswendig zu übernehmen.',
      'Der Join läuft über player_id. Danach gruppierst du pro Spieler, zählst Einsätze und summierst Minuten. Die Schwelle steht wieder in HAVING, weil sie die Summe pro Gruppe betrifft. Ein Spieler ohne Einsatz soll nicht auftauchen; dafür sorgt der inner Join.',
      'Zwei Einsätze und 180 Minuten in diesen kleinen, fiktiven Tabellen reichen nicht für eine Spielerempfehlung. Hier prüfst du den Aufbau der Abfrage. Ob sich die Zahlen für eine sportliche Entscheidung eignen, lässt sich mit dieser Datenbasis nicht beurteilen.',
    ],
    example: `SELECT s.name, COUNT(m.match_id) AS apps
FROM squad s
JOIN minutes_log m ON m.player_id = s.player_id
GROUP BY s.player_id;`,
    exampleNote:
      'Das Beispiel zeigt die Struktur; die Aufgabe verlangt zusätzlich die Minutensumme und eine Schwelle.',
    task: 'Ermittle aus squad und minutes_log für jeden Spieler mit mindestens 2 Einsätzen den Namen, die Anzahl der Einsätze als apps und die Summe der Minuten als total_minutes. Sortiere absteigend nach total_minutes, bei Gleichstand aufsteigend nach name.',
    starter: `SELECT s.name, COUNT(m.match_id) AS apps
FROM squad s
JOIN minutes_log m ON m.player_id = s.player_id
GROUP BY s.player_id
ORDER BY apps DESC;`,
    solution: `SELECT s.name,
       COUNT(m.match_id) AS apps,
       SUM(m.minutes) AS total_minutes
FROM squad s
JOIN minutes_log m ON m.player_id = s.player_id
GROUP BY s.player_id
HAVING COUNT(m.match_id) >= 2
ORDER BY total_minutes DESC, s.name ASC;`,
    hints: [
      'Die Schwelle betrifft die Anzahl der Einsätze, also eine Aggregatfunktion. Sie gehört in HAVING.',
      'Lies bei Bedarf noch einmal die Abschnitte zu JOIN und HAVING. Prüfe, ob deine Gruppierung pro Spieler eindeutig ist.',
      'Der Filter:\n\nHAVING COUNT(m.match_id) >= 2\n\nZusätzlich brauchst du SUM(m.minutes) AS total_minutes.',
    ],
    checks: [
      check('Neue Spieler, Einsätze und Minuten', 'result', [
        ['Nora', 3, 210],
        ['Mira', 2, 180],
        ['Ada', 2, 150],
      ]),
      check('Drei Spieler mit mindestens zwei Einsätzen', 'len(result)', 3),
    ],
    reflection:
      'Welche Entscheidung in deiner Abfrage würde sich ändern, wenn ein Spieler ohne Einsatz trotzdem in der Auswertung erscheinen soll?',
    rubric: [
      'Nenne den Unterschied zwischen inner und left join.',
      'Erkläre, warum die Schwelle auf Einsätze und nicht auf Minuten die Auswahl verändert.',
    ],
    setup: `import sqlite3

conn = sqlite3.connect(":memory:")
conn.executescript("""
CREATE TABLE squad (player_id INTEGER PRIMARY KEY, name TEXT, position TEXT);
CREATE TABLE minutes_log (player_id INTEGER, match_id TEXT, minutes INTEGER);
INSERT INTO squad VALUES (1, 'Ada', 'MF'), (2, 'Mira', 'FW'), (3, 'Nora', 'MF'), (4, 'Pia', 'DF');
INSERT INTO minutes_log VALUES
  (1, 'A1', 90), (1, 'A2', 60),
  (2, 'A1', 90), (2, 'A3', 90),
  (3, 'A2', 60), (3, 'A3', 90), (3, 'A4', 60);
""")`,
    language: 'sql',
    packages: ['sqlite3'],
    sources: [SQL_DOCS, SQL_AGG_DOCS],
  },
];
