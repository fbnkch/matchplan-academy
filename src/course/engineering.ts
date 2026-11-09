import type { Lesson, Check } from '../types';
import { PRACTICE_EVENTS_SETUP, PRACTICE_SQL_SETUP } from './practice-data';

const check = (label: string, expression: string, expected: unknown, raises?: string): Check => ({
  label,
  expression,
  expected,
  ...(raises ? { raises } : {}),
});
const provider = {
  title: 'StatsBomb: Datenstruktur und Nutzung',
  url: 'https://github.com/hudl/open-data',
};
const pandas = {
  title: 'pandas: Merge und Datenverknüpfungen',
  url: 'https://pandas.pydata.org/docs/user_guide/merging.html',
};
const common = {
  trackId: 'engineering',
  packages: ['pandas'],
  transfer: true,
  sources: [provider, pandas],
  reflection:
    'Halte den Datenvertrag fest und zeige an einem absichtlich ausgelösten Fehler, wie deine Lösung reagiert. Wo endet ihre Aussagekraft, und was fehlt noch für einen täglichen Einsatz im Verein?',
  rubric: [
    'Läuft mit neuen IDs und veränderter Reihenfolge.',
    'Eingabedaten bleiben unverändert.',
    'Der Bericht weist Datenfehler aus, damit sie nicht als sportliche Nullleistung in die Auswertung eingehen.',
    'Quelle, Abdeckung und Transformationsregeln sind dokumentiert.',
  ],
};

export const engineeringLessons: Lesson[] = [
  {
    ...common,
    id: 'de-flatten',
    title: 'Verschachtelte Eventdaten normalisieren',
    minutes: 90,
    concept: 'Granularität, optionale Felder und ein stabiles Tabellenschema',
    objective: 'Eine allgemeine Normalisierungsfunktion für heterogene Provider-Events entwickeln.',
    prerequisites: ['data-review'],
    setup: PRACTICE_EVENTS_SETUP,
    explanation: [
      'Starting XI, Pass und Shot haben in einem Eventfeed unterschiedliche Felder. Lege deshalb für die gemeinsame Tabelle fest, welche Spalten jede Eventzeile enthält und wie fehlende Werte dargestellt werden. Fehlt location, ist der Ort unbekannt. Mit (0, 0) würdest du dem Event stattdessen eine konkrete Position zuweisen.',
      'Die bereitgestellten Daten sind unabhängig generierte Lehrdaten aus zwei fiktiven Spielen; sie enthalten keine echten Spielbeobachtungen. Du arbeitest mit 6.948 Events, nicht mit einer vollständig vorgegebenen Beispieltabelle. Prüfe die Funktion auch mit kleinen fremden Listen. So erkennst du, ob sie den Vertrag erfüllt oder nur zu dieser Lieferung passt. Die Quelle muss unverändert bleiben.',
      'Der providerinspirierte Lehrvertrag verwendet Eventkoordinaten im 120×80-System; beide Halbzeiten greifen auf (120, 40) an. Das ist weder automatisch eine Messung in Metern noch eine Aufforderung, jede zweite Halbzeit zu spiegeln. Providerkonventionen gehören in die Dokumentation.',
    ],
    example:
      'record = {"team": {"id": 4}}\nteam_id = record.get("team", {}).get("id")\n# Nicht vorhandene Werte bleiben None.',
    task: 'Implementiere normalize_events(records). Gib eine Liste neuer Dictionaries zurück, in Eingabereihenfolge und mit genau den Feldern event_id, match_id, index, period, kind, team_id, player_id, x, y. kind stammt aus type.name; verschachtelte IDs aus team/player. Fehlen player oder location, setze die jeweiligen Werte auf None. Übernimm match_id, id, index und period. Für diese Normalisierung kannst du strukturell gültige Events voraussetzen; Validierung folgt separat. Verändere records nicht.',
    starter:
      'def normalize_events(records):\n    # Entwickle zuerst den Ausgabevertrag, dann die Abbildung.\n    raise NotImplementedError\n',
    solution: `def normalize_events(records):
    rows = []
    for event in records:
        location = event.get('location')
        rows.append(dict(event_id=event['id'], match_id=event['match_id'], index=event['index'], period=event['period'], kind=event['type']['name'], team_id=event.get('team', {}).get('id'), player_id=event.get('player', {}).get('id'), x=location[0] if location else None, y=location[1] if location else None))
    return rows`,
    hints: [
      'Schreibe zuerst auf, welche Felder Pflicht sind und welche None zulassen.',
      'dict.get mit leerem Dictionary hilft bei optionalen verschachtelten Objekten; location musst du gesondert behandeln.',
      'Erzeuge je Event ein neues Dictionary. Prüfe zusätzlich ein Event ohne player und location sowie eine leere Liste.',
    ],
    checks: [
      check(
        'Alle Quellereignisse bleiben erhalten',
        'len(normalize_events(events)) == len(events)',
        true,
      ),
      check('Vereinbarte Spalten', 'sorted(normalize_events(events)[0])', [
        'event_id',
        'index',
        'kind',
        'match_id',
        'period',
        'player_id',
        'team_id',
        'x',
        'y',
      ]),
      check('Original bleibt unverändert', 'events == raw_events', true),
      check(
        'Optionale Felder korrekt',
        `normalize_events([{'id':'neu','match_id':99,'index':1,'period':1,'type':{'name':'Starting XI'},'team':{'id':7}}])`,
        [
          {
            event_id: 'neu',
            match_id: 99,
            index: 1,
            period: 1,
            kind: 'Starting XI',
            team_id: 7,
            player_id: null,
            x: null,
            y: null,
          },
        ],
      ),
      check('Keine Daten', 'normalize_events([])', []),
      check(
        'Koordinaten sind keine Konstanten',
        `normalize_events([{'id':'q','match_id':8,'index':6,'period':2,'type':{'name':'Pass'},'player':{'id':23},'location':[118.5,0]}])[0]['x']`,
        118.5,
      ),
    ],
  },
  {
    ...common,
    id: 'de-contract',
    title: 'Datenfehler erkennen und getrennt ausweisen',
    minutes: 105,
    concept: 'Schlüssel, Pflichtfelder und räumliche Validierung',
    objective: 'Fehlerklassen prüfen, statt falsche Datensätze still zu bereinigen.',
    prerequisites: ['de-flatten'],
    setup: PRACTICE_EVENTS_SETUP,
    explanation: [
      'Ein Import ohne Fehlermeldung kann trotzdem unbrauchbar sein. Doppelte Eventschlüssel verzerren Zähler, ungültige Koordinaten räumliche Analysen und fehlende Spiel-IDs verhindern eine eindeutige Zuordnung.',
      'Der Prüfbericht soll Fehler auffindbar machen; eine Reparatur wäre ein eigener Arbeitsschritt. Verändere deshalb keine Daten und führe ein Event bei Bedarf in mehreren Fehlerklassen auf. Das optionale Feld location darf fehlen. Ist es vorhanden, muss es ein gültiges Koordinatenpaar enthalten.',
    ],
    example:
      'keys = [(row["match_id"], row["id"]) for row in records]\n# Der zusammengesetzte Schlüssel gilt innerhalb eines Spiels.',
    task: 'Schreibe audit_events(records) mit Rückgabe {"duplicates": [...], "invalid_location": [...], "missing_required": [...]}. duplicates enthält jede mehrfach vorkommende Kombination als "match_id:id" einmal. missing_required enthält die Event-ID (oder "<missing>"), wenn id fehlt/leer ist, match_id keine positive Ganzzahl oder index keine positive Ganzzahl ist; bool gilt nicht als Ganzzahl. invalid_location enthält Event-IDs mit vorhandenem location, das kein Paar endlicher Zahlen in 0 bis 120 und 0 bis 80 ist. None bei vorhandener location ist ungültig. Sortiere jede Liste eindeutig. Prüfe keine Spielerpflicht.',
    starter: 'def audit_events(records):\n    raise NotImplementedError\n',
    solution: `import math
def audit_events(records):
    seen, duplicates, invalid, missing = set(), set(), set(), set()
    for row in records:
        label = row.get('id') or '<missing>'
        if not row.get('id') or type(row.get('match_id')) is not int or row['match_id'] <= 0 or type(row.get('index')) is not int or row['index'] <= 0:
            missing.add(label)
        if row.get('id') and type(row.get('match_id')) is int:
            key = str(row['match_id']) + ':' + str(row['id'])
            if key in seen: duplicates.add(key)
            seen.add(key)
        if 'location' in row:
            loc = row['location']
            valid = isinstance(loc, (list, tuple)) and len(loc) == 2
            if valid:
                valid = all(type(v) in (int,float) and math.isfinite(v) for v in loc) and 0 <= loc[0] <= 120 and 0 <= loc[1] <= 80
            if not valid: invalid.add(label)
    return dict(duplicates=sorted(duplicates), invalid_location=sorted(invalid), missing_required=sorted(missing))`,
    hints: [
      'Verwende Sets für eindeutige Fehlerlisten und einen zusammengesetzten Eventschlüssel.',
      'Prüfe Typ und Länge, bevor du Koordinaten indizierst. math.isfinite verhindert, dass NaN als Zahl durchrutscht.',
      'Teste dieselbe ID in zwei Spielen, bool statt match_id und einen gültigen Randpunkt (120, 80).',
    ],
    checks: [
      check(
        'Mehrfachimport erkannt',
        `audit_events([{'id':'a','match_id':2,'index':1}]*3)['duplicates']`,
        ['2:a'],
      ),
      check(
        'Spiele sind getrennte Namensräume',
        `audit_events([{'id':'a','match_id':1,'index':1},{'id':'a','match_id':2,'index':1}])`,
        { duplicates: [], invalid_location: [], missing_required: [] },
      ),
      check(
        'Koordinaten und Pflichtfelder',
        `audit_events([{'id':'b','match_id':True,'index':0,'location':[121,40]},{'id':'a','match_id':2,'index':1,'location':[120,80]},{'id':'c','match_id':2,'index':1,'location':[float('nan'),0]}])`,
        { duplicates: [], invalid_location: ['b', 'c'], missing_required: ['b'] },
      ),
      check('Fehlendes Paar und Schlüssel', `audit_events([{'location':None}])`, {
        duplicates: [],
        invalid_location: ['<missing>'],
        missing_required: ['<missing>'],
      }),
      check('Quelle wird nicht repariert', 'events == raw_events', true),
    ],
  },
  {
    ...common,
    id: 'de-upsert',
    title: 'Wiederholbare Imports ohne Duplikate',
    minutes: 105,
    concept: 'Idempotenz, Korrekturen und atomare Validierung',
    objective: 'Einen deterministischen Upsert für wiederholte Lieferungen schreiben.',
    prerequisites: ['de-contract'],
    setup: PRACTICE_EVENTS_SETUP,
    sources: [
      provider,
      {
        title: 'Airflow: Task Best Practices und Wiederholbarkeit',
        url: 'https://airflow.apache.org/docs/apache-airflow/stable/best-practices.html',
      },
    ],
    explanation: [
      'Ein täglicher Import muss nach einem Abbruch wiederholt werden können. Einfaches Anhängen zählt erneut gelieferte Events doppelt. Ein Upsert hält pro (match_id, id) genau einen aktuellen Datensatz und kann eine spätere Korrektur übernehmen.',
      'Für diese Übung gilt: Bei mehrfach geliefertem Schlüssel gewinnt das letzte Vorkommen. Halte diese Regel fest, denn andere Provider können Korrekturen anders kennzeichnen. Für einen produktiven Feed müsstest du außerdem klären, wie Lieferrevisionen, Löschungen und gleichzeitig eintreffende Korrekturen behandelt werden.',
    ],
    example:
      'current = {(1, "e"): {"value": 4}}\ncurrent[(1, "e")] = {"value": 5}\n# Wiederholungen erzeugen keinen zweiten Schlüssel.',
    task: 'Implementiere upsert_events(existing, incoming). Prüfe beide Listen auf eine nichtleere id sowie positive match_id und index vom Typ int; bool ist ausgeschlossen. Wirf bei einem Verstoß ValueError. Gib neue, tief kopierte Eventobjekte zurück, eindeutig nach (match_id,id). Incoming überschreibt existing; innerhalb einer Liste gewinnt der letzte Datensatz. Sortiere nach match_id,index,id. Beide Eingabelisten müssen auch dann unverändert bleiben, wenn der Import fehlschlägt. Derselbe Import zweimal muss dieselbe Ausgabe erzeugen. Leere Listen sind erlaubt.',
    starter: 'def upsert_events(existing, incoming):\n    raise NotImplementedError\n',
    solution: `import copy
def upsert_events(existing, incoming):
    merged = {}
    for row in list(existing) + list(incoming):
        if not row.get('id') or type(row.get('match_id')) is not int or row['match_id'] <= 0 or type(row.get('index')) is not int or row['index'] <= 0:
            raise ValueError('Ungültiger Eventschlüssel')
        merged[(row['match_id'],row['id'])] = copy.deepcopy(row)
    return sorted(merged.values(), key=lambda row:(row['match_id'],row['index'],row['id']))`,
    hints: [
      'Lege den Vertrag für den eindeutigen Schlüssel vor dem Merge fest.',
      'Ein Dictionary nach zusammengesetztem Schlüssel bildet ein Upsert ab. Validiere, bevor du die Quelle verändern könntest.',
      'copy.deepcopy schützt verschachtelte Objekte. Prüfe Wiederholung, Korrektur und einen Abbruch mit ungültigem Schlüssel.',
    ],
    checks: [
      check(
        'Idempotenter echter Import',
        'upsert_events(events, events) == upsert_events([], events)',
        true,
      ),
      check(
        'Korrektur gewinnt',
        `upsert_events([{'id':'a','match_id':2,'index':1,'v':4}],[{'id':'a','match_id':2,'index':5,'v':9}])`,
        [{ id: 'a', match_id: 2, index: 5, v: 9 }],
      ),
      check(
        'Deterministische Reihenfolge',
        `[(r['match_id'],r['id']) for r in upsert_events([], [{'id':'b','match_id':2,'index':2},{'id':'a','match_id':1,'index':4}])]`,
        [
          [1, 'a'],
          [2, 'b'],
        ],
      ),
      check(
        'Ungültige Lieferung bricht ab',
        `upsert_events(events, [{'id':'bad','match_id':False,'index':1}])`,
        null,
        'ValueError',
      ),
      check('Original weiterhin unverändert', 'events == raw_events', true),
      check(
        'Tiefe Kopie',
        `(lambda r: r[0]['type'] is not events[0]['type'])(upsert_events([],events))`,
        true,
      ),
    ],
  },
  {
    ...common,
    id: 'de-joins',
    title: 'Joins gegen explodierende Zeilenzahlen absichern',
    minutes: 90,
    concept: 'Faktentabelle, Dimension und Many-to-one-Vertrag',
    objective:
      'Events mit einer geprüften Spielerdimension verknüpfen und unbekannte Spieler-IDs kenntlich machen.',
    prerequisites: ['de-upsert'],
    setup: `${PRACTICE_EVENTS_SETUP}
import pandas as pd
event_table = pd.DataFrame([dict(event_id=e['id'], player_id=e.get('player',{}).get('id')) for e in events])
players = pd.DataFrame(list({e['player']['id']:dict(player_id=e['player']['id'], name=e['player']['name']) for e in events if 'player' in e}.values()))`,
    explanation: [
      'Enthält die Spielerdimension doppelte IDs, kann ein Join aus 7.000 Events unbemerkt 14.000 Zeilen erzeugen. Bei der anschließenden Aggregation zählen dieselben Aktionen mehrfach. Die Ergebnisse können plausibel wirken, obwohl schon die Zahl der zugrunde liegenden Events falsch ist.',
      'Ein Left Join soll die Eventgranularität erhalten. Spielerlose Ereignisse sind legitim; eine unbekannte vorhandene Spieler-ID muss dagegen als fehlende Zuordnung erkennbar bleiben. Die Funktion darf unbekannte Events nicht einfach verwerfen.',
    ],
    example:
      'joined = facts.merge(dimension, on="key", how="left", validate="many_to_one")\n# validate prüft die Kardinalität, nicht die Bedeutung der Zuordnung.',
    task: 'Implementiere attach_players(facts, dimension). Beide haben player_id, facts zusätzlich event_id, dimension zusätzlich name. Doppelte player_id oder fehlende player_id in dimension führen zu ValueError. Erzeuge einen Left Join mit many_to_one-Validierung. Gib die Zeilen in ursprünglicher Reihenfolge zurück und ergänze known_player als bool: nur True, wenn eine vorhandene player_id in der Dimension existiert. Ein fehlender Spieler im Event bleibt erhalten und gilt nicht als bekannt. Keine Mutation. Rückgabe ist ein DataFrame.',
    starter: 'def attach_players(facts, dimension):\n    raise NotImplementedError\n',
    solution: `import pandas as pd
def attach_players(facts, dimension):
    if dimension['player_id'].isna().any() or dimension['player_id'].duplicated().any():
        raise ValueError('Spielerdimension ist nicht eindeutig')
    joined = facts.merge(dimension, on='player_id', how='left', sort=False, validate='many_to_one', indicator=True)
    joined['known_player'] = (joined['_merge'] == 'both') & joined['player_id'].notna()
    return joined.drop(columns='_merge')`,
    hints: [
      'Prüfe zuerst die Dimension. drop_duplicates würde den Fehler nur verstecken.',
      'how="left" erhält unbekannte Events. validate="many_to_one" sichert die Kardinalität ab.',
      'Mit indicator=True erkennst du Treffer und left_only-Zeilen. Prüfe die Zuordnung anhand der ID: Auch bei einem vorhandenen Spieler kann der Name fehlen.',
    ],
    checks: [
      check(
        'Eventgranularität bleibt erhalten',
        'len(attach_players(event_table, players)) == len(event_table)',
        true,
      ),
      check(
        'Reihenfolge bleibt erhalten',
        'attach_players(event_table, players).event_id.tolist() == event_table.event_id.tolist()',
        true,
      ),
      check(
        'Bekannt, unbekannt und spielerlos',
        `attach_players(pd.DataFrame({'event_id':['b','a','c'],'player_id':[1,9,None]}), pd.DataFrame({'player_id':[1],'name':['Test']})).known_player.tolist()`,
        [true, false, false],
      ),
      check(
        'Doppelte Dimension abgelehnt',
        `attach_players(event_table, pd.concat([players,players.iloc[:1]]))`,
        null,
        'ValueError',
      ),
      check(
        'Null-ID in Dimension abgelehnt',
        `attach_players(event_table, pd.DataFrame({'player_id':[None],'name':['Test']}))`,
        null,
        'ValueError',
      ),
    ],
  },
  {
    ...common,
    id: 'de-sql-window',
    title: 'Rollierende Kennzahlen auf echter Eventreihenfolge',
    minutes: 90,
    language: 'sql',
    concept: 'Window-Frames, Partitionen und deterministische Sortierung',
    objective: 'Kontextkennzahlen je Spiel und Team ohne Zeilenverlust bilden.',
    prerequisites: ['de-joins', 'sql-window'],
    setup: PRACTICE_SQL_SETUP,
    sources: [
      provider,
      {
        title: 'SQLite: Window Functions und Frames',
        url: 'https://www.sqlite.org/windowfunctions.html',
      },
    ],
    explanation: [
      'Berechne das Fenster für jedes Team und jedes Spiel getrennt. Andernfalls gehen Schüsse aus einem anderen Spiel oder von der gegnerischen Mannschaft in die Kennzahl ein. Ein ROWS-Frame begrenzt dabei die Zahl der Schussereignisse, nicht die verstrichene Zeit.',
      'shots enthält 255 fiktive Schüsse mit match_id, event_id, team, shot_order und xg. shot_order erhält die Reihenfolge der generierten Datensätze. xg ist eine generierte Wahrscheinlichkeit, keine echte Provider-Schätzung; die Kennzahl beschreibt die letzten drei Abschlüsse, nicht Momentum oder zukünftige Tore.',
    ],
    example:
      'SELECT key, SUM(value) OVER (PARTITION BY group_id ORDER BY sequence ROWS BETWEEN 1 PRECEDING AND CURRENT ROW)\nFROM measurements;',
    task: 'Liefere je Schuss match_id, event_id und rolling_xg: Summe der aktuellen und maximal zwei vorherigen Schuss-xG desselben Teams im selben Spiel, auf sechs Dezimalen gerundet. Verwende ein ROWS-Fenster. Sortiere das Ergebnis nach match_id, team, shot_order. Die ersten beiden Schüsse einer Partition verwenden nur die verfügbaren Zeilen. Keine GROUP BY-Verdichtung und keine Übertragung über Spiele.',
    starter:
      '-- Entwickle Partition, Sortierung und Fensterrahmen selbst.\nSELECT match_id, event_id, 0 AS rolling_xg FROM shots;',
    solution:
      'SELECT match_id, event_id, ROUND(SUM(xg) OVER (PARTITION BY match_id, team ORDER BY shot_order ROWS BETWEEN 2 PRECEDING AND CURRENT ROW), 6) AS rolling_xg FROM shots ORDER BY match_id, team, shot_order',
    hints: [
      'PARTITION BY braucht zwei Spalten: Spiel und Team.',
      'ROWS BETWEEN 2 PRECEDING AND CURRENT ROW meint höchstens drei Events. Ein ungegrenztes Fenster wäre eine andere Kennzahl.',
      'Prüfe zwei Spiele mit gleichem Teamnamen und unregelmäßige shot_order-Abstände. Die Abstände dürfen das ROWS-Fenster nicht verändern.',
    ],
    checks: [
      check('Alle Fenster unabhängig nachgerechnet', 'result == expected', true),
      check('Kein Event verloren', 'len(result)', 255),
      check('Drei Ausgabespalten', 'all(len(row)==3 for row in result)', true),
    ],
    variants: [
      {
        label: 'Neue Spiele und unterbrochene Reihenfolge',
        setup: `import sqlite3
conn=sqlite3.connect(':memory:')
conn.execute('CREATE TABLE shots(match_id INTEGER,event_id TEXT,team TEXT,shot_order INTEGER,xg REAL)')
conn.executemany('INSERT INTO shots VALUES(?,?,?,?,?)',[(1,'a','X',1,.1),(1,'b','Y',2,.8),(1,'c','X',3,.2),(1,'d','X',8,.3),(1,'e','X',12,.4),(2,'f','X',1,.9)])`,
        checks: [
          check('Spiel- und Teamgrenzen respektiert', 'result', [
            [1, 'a', 0.1],
            [1, 'c', 0.3],
            [1, 'd', 0.6],
            [1, 'e', 0.9],
            [1, 'b', 0.8],
            [2, 'f', 0.9],
          ]),
        ],
      },
    ],
  },
  {
    ...common,
    id: 'de-manifest',
    title: 'Datenherkunft mit Hash und Manifest belegen',
    minutes: 75,
    concept: 'Lineage, kanonische Serialisierung und Inhaltsadressierung',
    objective: 'Den Datenstand eines Analyseergebnisses nachvollziehbar machen.',
    prerequisites: ['de-sql-window'],
    setup: PRACTICE_EVENTS_SETUP,
    sources: [
      provider,
      {
        title: 'Python: hashlib und SHA-256',
        url: 'https://docs.python.org/3/library/hashlib.html',
      },
    ],
    explanation: [
      'Um ein Notebook-Ergebnis nachzurechnen, brauchst du den verwendeten Datenstand. Das Manifest hält Quelle, Revision, Transformationsschema und Inhalt zusammen. Mit dem Hash kannst du prüfen, ob zwei Bytefolgen übereinstimmen. Ob die Daten fachlich richtig sind, lässt sich daraus nicht ableiten.',
      'Hier hashen wir eine kanonisch serialisierte Projektion: sort_keys=True, ensure_ascii=False, separators=(",", ":"). Die Reihenfolge der Eventliste bleibt absichtlich relevant. Dieser Hash ist nicht der Hash der ursprünglichen Providerdatei; deren unveränderte Rohbytes müsste ein produktiver Import separat speichern.',
    ],
    example:
      'import hashlib\nprint(hashlib.sha256(b"example").hexdigest())\n# Nicht hash(...): dessen Ergebnis ist kein stabiler Dateifingerabdruck.',
    task: 'Implementiere make_manifest(records, source_url, revision). Rückgabe mit genau schema_version=1, source, revision, row_count, match_ids (eindeutig sortiert), sha256. source/revision müssen nichtleer sein, sonst ValueError. Berechne sha256 über json.dumps(records, sort_keys=True, ensure_ascii=False, separators=(",", ":")).encode("utf-8"). Quellenfelder sind Metadaten und werden nicht in den Inhalts-Hash aufgenommen. Ändere records nicht.',
    starter: 'def make_manifest(records, source_url, revision):\n    raise NotImplementedError\n',
    solution: `import hashlib, json
def make_manifest(records, source_url, revision):
    if not source_url or not revision: raise ValueError('Quelle und Revision fehlen')
    payload=json.dumps(records,sort_keys=True,ensure_ascii=False,separators=(',',':')).encode('utf-8')
    return dict(schema_version=1,source=source_url,revision=revision,row_count=len(records),match_ids=sorted({r['match_id'] for r in records}),sha256=hashlib.sha256(payload).hexdigest())`,
    hints: [
      'Trenne Identität der serialisierten Daten von Metadaten zur Herkunft.',
      'JSON mit sort_keys stabilisiert Dictionary-Schlüssel; die Liste selbst bleibt geordnet.',
      'Vergleiche zwei Dictionaries mit anderer Schlüsselreihenfolge und zwei Listen mit vertauschten Events. Nur der erste Vergleich muss denselben Hash liefern.',
    ],
    checks: [
      check(
        'Leerer Datenstand korrekt gehasht',
        `make_manifest([], 'url', 'rev')['sha256']`,
        '4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945',
      ),
      check(
        'Kompaktes UTF-8 statt Standard-Whitespace',
        `make_manifest([{'match_id':7,'name':'Müller','id':'x'}], 'url', 'rev')['sha256']`,
        'c82de468d793b6b1fe9372b02f03bcce1481a4693f4ddeb3e36800c46a7b4b6c',
      ),
      check(
        'Herkunft gehört nicht zum Inhalts-Hash',
        `make_manifest(events,'quelle-a','rev-a')['sha256'] == make_manifest(events,'quelle-b','rev-b')['sha256']`,
        true,
      ),
      check(
        'Metadaten der synthetischen Lieferung',
        `(lambda m:[m['schema_version'],m['row_count'],len(m['match_ids']),m['revision']])(make_manifest(events,'url',source_revision))`,
        [1, 6948, 2, 'matchplan-synthetic-v1'],
      ),
      check(
        'Schlüsselreihenfolge kanonisch',
        `make_manifest([{'match_id':1,'id':'x'}],'u','r')['sha256'] == make_manifest([{'id':'x','match_id':1}],'u','r')['sha256']`,
        true,
      ),
      check(
        'Eventreihenfolge bleibt Teil des Inhalts',
        `make_manifest(events,'u','r')['sha256'] != make_manifest(list(reversed(events)),'u','r')['sha256']`,
        true,
      ),
      check('Herkunft ist erforderlich', `make_manifest([], '', 'r')`, null, 'ValueError'),
    ],
  },
  {
    ...common,
    id: 'de-coverage',
    title: 'Fehlende Spiele von Nullleistung unterscheiden',
    minutes: 90,
    concept: 'Abdeckung, erwartete Lieferungen und Missingness',
    objective: 'Lieferumfang gegen einen unabhängig definierten Spielplan prüfen.',
    prerequisites: ['de-manifest'],
    setup: PRACTICE_EVENTS_SETUP,
    explanation: [
      'Laut Spielauswahl werden zwölf Spiele erwartet; vollständige Eventlisten liegen aber nur für zwei vor. Für die übrigen zehn weißt du aus dieser Lieferung nicht, wie viele Pässe gespielt wurden. Eine Zusammenfassung mit null Pässen würde die fehlende Lieferung fälschlich als beobachtete Leistung ausgeben.',
      'Vergleiche die Lieferung vor jeder Kennzahlenberechnung mit einem unabhängig festgelegten Spielplan und suche nach Duplikaten. Damit prüfst du, ob die erwarteten Spiele überhaupt vorkommen. Ob die Eventliste ein Spiel über seine gesamte Dauer abdeckt, musst du mit zusätzlichen Vollständigkeitsregeln prüfen.',
    ],
    example: 'expected = {10, 11, 12}\nreceived = {10, 12}\nprint(sorted(expected - received))',
    task: 'Schreibe coverage_report(expected_ids, records). Gib genau missing_matches, unexpected_matches, duplicate_keys und counts zurück. Die ersten beiden sind sortierte eindeutige Match-IDs aus Soll/Ist-Differenz; duplicate_keys sind sortierte Strings "match_id:id" mehrfach vorkommender Schlüssel. counts ist eine nach match_id sortierte Liste [match_id, Anzahl_eindeutiger_Event_IDs]. Mehrfachlieferungen erhöhen counts nicht. Für dieses Coverage-Audit darfst du gültige Pflichtfelder voraussetzen. Leere Soll- und Istmengen sind erlaubt.',
    starter: 'def coverage_report(expected_ids, records):\n    raise NotImplementedError\n',
    solution: `from collections import Counter
def coverage_report(expected_ids,records):
    keys=Counter((r['match_id'],r['id']) for r in records)
    observed={match for match,event in keys}
    counts=[[match,sum(1 for key in keys if key[0]==match)] for match in sorted(observed)]
    return dict(missing_matches=sorted(set(expected_ids)-observed),unexpected_matches=sorted(observed-set(expected_ids)),duplicate_keys=sorted(str(m)+':'+str(e) for (m,e),count in keys.items() if count>1),counts=counts)`,
    hints: [
      'Definiere zuerst Soll- und Istmenge; ergänze nicht einfach fehlende Events durch null.',
      'Counter über (match_id,id) liefert Duplikate und eine eindeutige Zählbasis.',
      'Teste ein unerwartetes Spiel und eine doppelte Lieferung. Die Coverage bleibt gleich, der Duplikatbericht ändert sich.',
    ],
    checks: [
      check(
        'Zehn fehlende Spiele sichtbar',
        "len(coverage_report(expected_matches,events)['missing_matches'])",
        10,
      ),
      check(
        'Keine zusätzlichen Spiele',
        "coverage_report(expected_matches,events)['unexpected_matches']",
        [],
      ),
      check(
        'Doppelte Lieferung verändert nicht die Zählbasis',
        "coverage_report(expected_matches,events+events)['counts'] == coverage_report(expected_matches,events)['counts']",
        true,
      ),
      check(
        'Unerwartete Spiele und Duplikate',
        `coverage_report([1,2],[{'match_id':1,'id':'a'},{'match_id':3,'id':'b'},{'match_id':3,'id':'b'}])`,
        {
          missing_matches: [2],
          unexpected_matches: [3],
          duplicate_keys: ['3:b'],
          counts: [
            [1, 1],
            [3, 1],
          ],
        },
      ),
      check('Leere Quelle', 'coverage_report([2,1],[])', {
        missing_matches: [1, 2],
        unexpected_matches: [],
        duplicate_keys: [],
        counts: [],
      }),
    ],
  },
  {
    ...common,
    id: 'de-review',
    title: 'Praxisprüfung: ein belastbares Pass-Datenprodukt',
    minutes: 180,
    concept: 'Eigenständige Integration von Import, Quarantäne und Aggregation',
    objective: 'Eine wiederholbare Auswertung mit expliziten Fehler- und Erfolgsregeln entwickeln.',
    prerequisites: ['de-coverage'],
    reviewOf: 'de-upsert',
    setup: PRACTICE_EVENTS_SETUP,
    explanation: [
      'Erstelle aus einer Eventlieferung eine überprüfbare Tabelle mit einer Zeile je Team und Spiel. Dafür verbindest du die bisher einzeln geübten Schritte. Die fachliche Kennzahl ist im Briefing festgelegt; wie du Code, Hilfsfunktionen und Tests aufteilst, entscheidest du selbst.',
      'Ein gültiges Passobjekt ohne outcome gilt in diesem providerinspirierten Lehrvertrag ausdrücklich als erfolgreich. Das ist eine vereinbarte synthetische Datenregel. Du darfst sie nicht auf beliebige fehlende oder unbekannte Felder übertragen, sonst würden fehlerhafte Datensätze die Erfolgsquote erhöhen. Die bereitgestellte Auswahl enthält keine vollständige Liga; die Tabelle ist kein Scouting-Ranking.',
    ],
    example:
      '# Vor dem Code: Eingabe -> Schlüsselprüfung -> letzte Revision\n# -> fachliche Validierung -> Mart + Quarantänebericht.\n# Schreibe zuerst zwei kleine Gegenbeispiele.',
    task: 'Schreibe build_pass_mart(batch). Validiere zunächst jeden Datensatz: id nichtleer, match_id und index positive echte int, sonst ValueError für den gesamten Batch. Dedupliziere alle Events nach (match_id,id), letzte Version gewinnt. Berücksichtige anschließend nur type.name="Pass". Ein Pass ist ungültig, wenn team.id keine positive echte int ist oder pass kein Dictionary ist oder pass.outcome.name nicht zu Incomplete, Out, Pass Offside, Injury Clearance, Unknown gehört. Ein fehlendes outcome ist gültig und erfolgreich; ein vorhandenes outcome ohne name ist ungültig. Gib {"rows": [[match_id,team_id,attempted,completed,rate],...], "quarantined": ["match_id:id",...]} zurück. rate=completed/attempted auf vier Dezimalen; rows nach Spiel/Team und Quarantäne eindeutig sortiert. Valide Pässe zählen auch ohne Ortsinformation. Verändere batch nicht.',
    starter:
      'def build_pass_mart(batch):\n    # Baue und teste die Pipeline selbst.\n    raise NotImplementedError\n',
    solution: `def build_pass_mart(batch):
    current={}
    for event in batch:
        if not event.get('id') or type(event.get('match_id')) is not int or event['match_id']<=0 or type(event.get('index')) is not int or event['index']<=0:
            raise ValueError('Ungültige Lieferung')
        current[(event['match_id'],event['id'])]=event
    groups={}; quarantine=[]
    allowed={'Incomplete','Out','Pass Offside','Injury Clearance','Unknown'}
    for key,event in current.items():
        if event.get('type',{}).get('name')!='Pass': continue
        team=event.get('team',{}).get('id'); detail=event.get('pass')
        valid=type(team) is int and team>0 and isinstance(detail,dict)
        if valid and 'outcome' in detail:
            valid=isinstance(detail['outcome'],dict) and detail['outcome'].get('name') in allowed
        if not valid:
            quarantine.append(str(key[0])+':'+key[1]); continue
        count=groups.setdefault((key[0],team),[0,0])
        count[0]+=1; count[1]+=int('outcome' not in detail)
    rows=[[m,t,a,c,round(c/a,4)] for (m,t),(a,c) in sorted(groups.items())]
    return dict(rows=rows,quarantined=sorted(quarantine))`,
    hints: [
      'Trenne technische Schlüsselvalidierung, letzte Revision und fachliche Passprüfung. Ein früher Fehler darf kein halbes Ergebnis erzeugen.',
      'Eine leere pass-Struktur ist ein erfolgreiches Passobjekt; ein ganz fehlendes pass-Feld ist dagegen ungültig.',
      'Baue Mini-Tests mit Korrektur eines Passes, fehlendem outcome, unbekanntem Ergebnis und einem Nicht-Pass. Erst danach den echten Batch auswerten.',
    ],
    checks: [
      check('Vier Team-Spiel-Gruppen', "len(build_pass_mart(events)['rows'])", 4),
      check(
        'Raten und Größen konsistent',
        "all(0<=row[3]<=row[2] and abs(row[4]-round(row[3]/row[2],4))<1e-9 for row in build_pass_mart(events)['rows'])",
        true,
      ),
      check(
        'Wiederholbare Lieferung',
        'build_pass_mart(events+events)==build_pass_mart(events)',
        true,
      ),
      check(
        'Technischer Fehler beendet Import',
        "build_pass_mart([{'id':'x','match_id':True,'index':1}])",
        null,
        'ValueError',
      ),
      check('Leere Lieferung', 'build_pass_mart([])', { rows: [], quarantined: [] }),
      check('Original unverändert', 'events==raw_events', true),
    ],
    variants: [
      {
        label: 'Korrekturen, Quarantäne und neue Schlüssel',
        setup: `batch=[
{'id':'a','match_id':9,'index':1,'type':{'name':'Pass'},'team':{'id':4},'pass':{'outcome':{'name':'Incomplete'}}},
{'id':'a','match_id':9,'index':1,'type':{'name':'Pass'},'team':{'id':4},'pass':{}},
{'id':'b','match_id':9,'index':2,'type':{'name':'Pass'},'team':{'id':4},'pass':{'outcome':{'name':'Out'}}},
{'id':'c','match_id':9,'index':3,'type':{'name':'Pass'},'team':{'id':4},'pass':{'outcome':{}}},
{'id':'d','match_id':9,'index':4,'type':{'name':'Shot'},'team':{'id':4}},
{'id':'e','match_id':10,'index':1,'type':{'name':'Pass'},'team':{'id':8},'pass':{}}]`,
        checks: [
          check('Erfolgsdefinition und Quarantäne', 'build_pass_mart(batch)', {
            rows: [
              [9, 4, 2, 1, 0.5],
              [10, 8, 1, 1, 1],
            ],
            quarantined: ['9:c'],
          }),
        ],
      },
      {
        label: 'Jede Fehlerklasse und spätere Korrekturen',
        setup: `def sample(event_id, team=4, detail=None):
    return dict(id=event_id,match_id=7,index=1,type={'name':'Pass'},team={'id':team},**({'pass':detail} if detail is not None else {}))
batch=[sample('ok',detail={}),sample('no-team',team=None,detail={}),sample('bool-team',team=True,detail={}),sample('no-pass'),sample('list-pass',detail=[]),sample('bad-outcome',detail={'outcome':{'name':'Invented'}}),sample('null-outcome',detail={'outcome':None}),sample('to-bad',detail={}),sample('to-bad',detail={'outcome':{}}),sample('to-good',detail={'outcome':{}}),sample('to-good',detail={}),sample('unknown',detail={'outcome':{'name':'Unknown'}})]`,
        checks: [
          check('Vertrag wird nach letzter Revision geprüft', 'build_pass_mart(batch)', {
            rows: [[7, 4, 3, 2, 0.6667]],
            quarantined: [
              '7:bad-outcome',
              '7:bool-team',
              '7:list-pass',
              '7:no-pass',
              '7:no-team',
              '7:null-outcome',
              '7:to-bad',
            ],
          }),
        ],
      },
    ],
  },
];
