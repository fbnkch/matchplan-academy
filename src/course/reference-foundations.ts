/** Eigene deutsche Erläuterungen und Beispiele; geprüfte Quellen stehen bei den Kapiteln. */
export const foundationEnrichment: Record<
  string,
  {
    title: string;
    paragraphs: string[];
    example?: { code: string; expected: string; explanation: string };
  }[]
> = {
  'study-foundations': [
    {
      title: 'Variablen, Einheiten und Algebra vor der ersten Tabelle',
      paragraphs: [
        'Eine Variable benennt einen Wert; ein Ausdruck berechnet daraus einen neuen Wert. Für eine Rate pro 90 Minuten brauchst du die Anzahl a und die Einsatzminuten m: r = 90 × a / m. Die Umstellung a = r × m / 90 zeigt, weshalb eine Rate ohne Minutenangabe unvollständig ist. Zwei Spieler mit derselben Rate können auf sehr unterschiedlichen Beobachtungsmengen beruhen. Schreibe die Einheiten dazu: Aktionen pro 90 Minuten sind etwas anderes als Aktionen pro Spiel.',
        'Eine Funktion macht diese Rechnung wiederverwendbar. Parameter sind ihre Eingaben, return liefert das Ergebnis, und eine Bedingung behandelt Eingaben außerhalb des erlaubten Bereichs. Bei null Minuten ist die Rate undefiniert. Dieses Referenzbeispiel weist sie bewusst mit ValueError ab. Die Browserlektion verwendet dafür den Rückgabewert None; das ist ein anderer gültiger Vertrag, den aufrufender Code ausdrücklich prüfen muss. Die Zahl null wäre irreführend, weil sie wie beobachtete Leistung aussieht. OSSU setzt Schulmathematik voraus; diese Rechnung prüft Brüche, Umstellen und Einheiten vor der größeren Tabelle.',
      ],
      example: {
        code: `def per90(actions, minutes):
    if minutes <= 0:
        raise ValueError("minutes must be positive")
    return 90 * actions / minutes

print(per90(12, 360))
print(per90(3, 90))
assert per90(0, 90) == 0
try:
    per90(2, 0)
except ValueError:
    print("ungueltige Minuten")`,
        expected: '3.0\n3.0\nungueltige Minuten',
        explanation:
          '12 Aktionen in vier vollen Spielen und 3 Aktionen in einem vollen Spiel ergeben dieselbe Rate 3. Der dritte Kontrollfall hat beobachtete Minuten und keine Aktionen. Der letzte Fall hat keine gültige Exposition und wird ausdrücklich abgewiesen.',
      },
    },
    {
      title: 'Listen, Wörterbücher und Tests als Denkwerkzeuge',
      paragraphs: [
        'Eine Liste erhält eine Reihenfolge und kann Wiederholungen enthalten. Ein Wörterbuch ordnet einem Schlüssel einen Wert zu; ein Set speichert eindeutige Werte. Wähle anhand der Fachfrage: Eine Ereignisfolge braucht eine Reihenfolge, ein Spielerlookup eine Zuordnung, eine Menge gelieferter Match-IDs Eindeutigkeit. Ein Set entfernt Wiederholungen, erklärt aber nicht, ob zwei gleich benannte Ereignisse tatsächlich dieselbe Aktion sind. Du brauchst zuerst einen fachlich gültigen Schlüssel.',
        'Die Programmierseite von OSSU nennt Funktionen, Schleifen, Ausnahmen, Dateien und Unit Tests. Verbinde diese Grundlagen in einem kleinen Vertrag: Ein Filter liefert IDs mit mindestens 180 Minuten, erhält die Eingabereihenfolge und verändert seine Eingabe nicht. Schreibe den erwarteten Wert vor der Implementierung auf. Der Grenzfall mit genau 180 Minuten prüft das Wort mindestens; eine leere Liste prüft, ob der Ablauf auch ohne Datensätze ein gültiges Ergebnis erzeugt.',
      ],
      example: {
        code: `def eligible(rows, minimum=180):
    return [row["id"] for row in rows if row["minutes"] >= minimum]

rows = [{"id": "A", "minutes": 179},
        {"id": "B", "minutes": 180},
        {"id": "C", "minutes": 270}]
assert eligible(rows) == ["B", "C"]
assert eligible([]) == []
assert len(rows) == 3
print(eligible(rows))`,
        expected: "['B', 'C']",
        explanation:
          'Die List Comprehension besucht jeden Datensatz, prüft die Minuten und übernimmt bei erfüllter Bedingung seine ID. B bleibt wegen >= enthalten. Ein falsches > würde den ersten Test scheitern lassen. Fehlende minutes-Felder sind laut diesem einfachen Vertrag ungültige Eingaben und werden nicht stillschweigend als null Minuten behandelt.',
      },
    },
    {
      title: 'Ein eigenes Kommando und eine kleine API verstehen',
      paragraphs: [
        'Build Your Own X enthält Rubriken für Kommandozeilenprogramme, Datenbanken und Webserver. Die übertragbare Lernidee ist, einen überschaubaren Mechanismus selbst zu bauen. Eine API ist zunächst eine vereinbarte Schnittstelle: Die Funktion per90 erhält zwei Zahlen und liefert eine Zahl. Eine HTTP-API ergänzt Transportregeln wie URL, Statuscode und JSON. Netzwerkzugriff, Datenprüfung und Fachrechnung sind verschiedene Aufgaben; eine fehlerhafte Antwort darf nicht ungeprüft in die Berechnung gelangen.',
        'Ein Kommandozeilenprogramm nimmt Argumente entgegen, ruft eine getestete Funktion auf und schreibt ein Ergebnis. Das Beispiel simuliert die Argumente direkt, damit es ohne Datei und Netzwerk funktioniert. Lokal speicherst du es später als rate.py und ersetzt die Liste in parse_args durch parse_args() ohne Argument. Dann lautet der Aufruf python rate.py --actions 12 --minutes 360. Dokumentiere Python-Version, Eingaben, Ausgabe und Fehlerverhalten. Damit wird aus einer Notebookzelle ein nachvollziehbarer Einstiegspunkt.',
      ],
      example: {
        code: `import argparse

def per90(actions, minutes):
    if actions < 0 or minutes <= 0:
        raise ValueError("invalid exposure or count")
    return 90 * actions / minutes

parser = argparse.ArgumentParser()
parser.add_argument("--actions", type=int, required=True)
parser.add_argument("--minutes", type=float, required=True)
args = parser.parse_args(["--actions", "12", "--minutes", "360"])
print(f"{per90(args.actions, args.minutes):.2f}")`,
        expected: '3.00',
        explanation:
          'argparse wandelt Zeichenketten in int und float um und meldet fehlende Pflichtargumente. Die Fachfunktion prüft zusätzlich die Wertebereiche. Das Ausgabeformat legt zwei Nachkommastellen fest. Diese Trennung erlaubt Funktionstests ohne Terminal und einen späteren Austausch der Oberfläche.',
      },
    },
  ],
  'study-data': [
    {
      title: 'Ein Schema ist ein Vertrag über Zeilen und Schlüssel',
      paragraphs: [
        'Bevor du SQL schreibst, formulierst du die Granularität in einem Satz: Eine Zeile in shots beschreibt einen Schuss eines bestimmten Spiels. Die Kombination match_id und event_id identifiziert ihn, wenn event_id nur innerhalb eines Spiels eindeutig ist. Eine Spielertabelle hat dagegen eine Zeile pro player_id. Ein Schema legt Namen, Typen, Schlüssel und erlaubte fehlende Werte fest. Ein Ganzzahltyp allein beweist weder eine sinnvolle Minute noch die Existenz des referenzierten Spielers.',
        'OSSU führt Datenbanken und Data Warehousing als eigene Grundlagen. Für Fußballanalysen reicht zunächst SQLite, das Python bereits mitbringt. Im Beispiel verhindert ein zusammengesetzter Primärschlüssel das doppelte Einfügen derselben Aktion. NOT NULL erzwingt die Angabe der Spiel- und Ereigniskennung. Das ist ein technischer Schutz für deine fachliche Festlegung; wenn der Provider Kennungen anders definiert, musst du den Vertrag anpassen. Eine frei erfundene fortlaufende Zeilennummer erkennt erneute Lieferungen derselben Aktion nicht.',
      ],
      example: {
        code: `import sqlite3
db = sqlite3.connect(":memory:")
db.execute("""CREATE TABLE shots (
    match_id INTEGER NOT NULL,
    event_id INTEGER NOT NULL,
    player_id INTEGER,
    goal INTEGER NOT NULL CHECK (goal IN (0, 1)),
    PRIMARY KEY (match_id, event_id)
)""")
db.executemany("INSERT INTO shots VALUES (?, ?, ?, ?)",
               [(1, 7, 10, 0), (2, 7, 10, 1)])
print(db.execute("SELECT COUNT(*), SUM(goal) FROM shots").fetchone())`,
        expected: '(2, 1)',
        explanation:
          'event_id 7 kommt zweimal vor, gehört aber zu verschiedenen Spielen. Der vollständige Schlüssel unterscheidet beide Schüsse. COUNT zählt zwei Beobachtungen und SUM(goal) ein Tor; die Kodierung 0 oder 1 macht die Summe zur Toranzahl.',
      },
    },
    {
      title: 'Ein Join kann die Aussage einer Kennzahl verändern',
      paragraphs: [
        'Ein Left Join sucht für jede linke Zeile alle passenden rechten Zeilen. Hat ein Spieler zwei Zeilen in der rechten Tabelle, wird jeder seiner Schüsse zweimal ausgegeben. GROUP BY repariert diese Vervielfachung nicht: Die Summen enthalten die künstlichen Kopien bereits. Prüfe deshalb zuerst, ob die rechte Tabelle auf dem Join-Schlüssel eindeutig ist. Vergleiche anschließend Zeilenzahl, Schlüsselanzahl und die Zahl fehlender Zuordnungen.',
        'Fehlende Zuordnung und fehlende Beobachtung sind verschieden. Ein gelieferter Schuss ohne Spielerzuordnung bleibt ein Schuss; seine Spielerattribute sind unbekannt. Im Beispiel bleibt dieser Datensatz durch LEFT JOIN erhalten. COUNT(*) zählt alle Zeilen, COUNT(name) nur vorhandene Namen. Bei einer vollständig fehlenden Matchdatei kannst du dagegen keine sichere Schusszahl null behaupten. Dafür brauchst du eine separate Liste der erwarteten und tatsächlich gelieferten Spiele.',
      ],
      example: {
        code: `import sqlite3
db = sqlite3.connect(":memory:")
db.executescript("""
CREATE TABLE players (id INTEGER PRIMARY KEY, name TEXT NOT NULL);
CREATE TABLE shots (event_id INTEGER PRIMARY KEY, player_id INTEGER);
INSERT INTO players VALUES (10, 'Ada');
INSERT INTO shots VALUES (1, 10), (2, 10), (3, 99);
""")
print(db.execute("""SELECT COUNT(*), COUNT(p.name)
FROM shots s LEFT JOIN players p ON p.id = s.player_id""").fetchone())
print(db.execute("""SELECT s.event_id FROM shots s
LEFT JOIN players p ON p.id = s.player_id
WHERE p.id IS NULL ORDER BY s.event_id""").fetchall())`,
        expected: '(3, 2)\n[(3,)]',
        explanation:
          'Drei Schüsse bleiben erhalten, zwei bekommen einen Namen. Die separate Abfrage weist Ereignis 3 als ungeklärte Zuordnung aus. Der Primärschlüssel in players garantiert hier höchstens einen Treffer pro Spieler-ID.',
      },
    },
    {
      title: 'Aggregieren, Fenster bilden und NULL bewusst behandeln',
      paragraphs: [
        'GROUP BY erzeugt eine Zeile je Gruppe, etwa eine Summe pro Spieler und Spiel. Eine Window Function behält dagegen jede Aktion und berechnet ihren Kontext. Für eine laufende Summe brauchst du eine Partition pro Spiel sowie eine eindeutige Reihenfolge. Bei gleichen Zeitstempeln ergänzt eine Ereigniskennung die Sortierung. ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW beschreibt ein Fenster aus Zeilen; es ist kein Zeitraum in Sekunden.',
        'SQL behandelt NULL als unbekannt. Ein Vergleich wie value = NULL prüft nicht sinnvoll auf fehlende Werte; verwende IS NULL. SUM ignoriert NULL, und SUM über keine Zeilen liefert NULL. COALESCE kann daraus null machen, aber nur bei fachlich belegter Vollständigkeit. Der Data-Folks-Lernpfad verbindet SQL mit Statistik und Metriken. Diese Verbindung ist entscheidend: Eine korrekt berechnete Quote bleibt falsch interpretiert, wenn ihr Nenner unvollständig ist.',
      ],
      example: {
        code: `import sqlite3
db = sqlite3.connect(":memory:")
db.executescript("""
CREATE TABLE shots (match_id INT, minute INT, event_id INT, goal INT);
INSERT INTO shots VALUES (1, 5, 1, 0), (1, 5, 2, 1), (1, 9, 3, 0);
""")
rows = db.execute("""SELECT event_id,
SUM(goal) OVER (PARTITION BY match_id ORDER BY minute, event_id
ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS running_goals
FROM shots ORDER BY minute, event_id""").fetchall()
print(rows)`,
        expected: '[(1, 0), (2, 1), (3, 1)]',
        explanation:
          'Die erste Aktion ergibt null Tore, die zweite erhöht die Summe auf eins und die dritte lässt sie unverändert. minute allein hätte die beiden Aktionen in Minute 5 nicht eindeutig geordnet. Die drei Eingabezeilen bleiben drei Ergebniszeilen.',
      },
    },
  ],
  'study-statistics': [
    {
      title: 'Vektoren und Ableitungen erklären, wie ein Modell lernt',
      paragraphs: [
        'Ein Merkmalsvektor ist eine geordnete Sammlung von Zahlen. Bei x = (1, Distanz) und Gewichten w = (Achsenabschnitt, Distanzgewicht) ergibt das Skalarprodukt z = w₀ × 1 + w₁ × Distanz. Die Reihenfolge gehört zum Vertrag: Vertauschst du Merkmale ohne Gewichte mitzutauschen, entsteht eine andere Vorhersage. Die logistische Funktion bildet z auf eine Wahrscheinlichkeit ab. Lineare Algebra aus OSSU und Data Folks wird damit zur konkreten Frage, welche Information an welcher Stelle in die Rechnung eingeht.',
        'Eine Ableitung beschreibt die lokale Änderung einer Funktion. Für die einfache Verlustfunktion L(w) = (w - 3)² ist L′(w) = 2 × (w - 3). Ein Gradientenschritt w_neu = w - Lernrate × L′(w) bewegt sich gegen diese Steigung. Bei w = 0 und Lernrate 0,1 entsteht w_neu = 0,6; der Verlust fällt von 9 auf 5,76. Das ist eine Rechenübung zum Optimieren, noch kein xG-Modell. Große Lernraten können über das Minimum hinausschießen; ein sinkender Trainingsverlust beweist zudem keine gute Vorhersage auf neuen Spielen.',
      ],
      example: {
        code: `import math
x = [1, 10]
weights = [1, -0.1]
z = sum(a * b for a, b in zip(x, weights))
print(round(1 / (1 + math.exp(-z)), 3))
w = 0.0
updated = w - 0.1 * 2 * (w - 3)
print(f"{updated:.2f} {(updated - 3) ** 2:.2f}")`,
        expected: '0.5\n0.60 5.76',
        explanation:
          'Der Modellscore ist 1 - 0,1 × 10 = 0; die logistische Funktion liefert deshalb 0,5. Die zweite Ausgabe berechnet genau einen Gradientenschritt und den danach verbleibenden quadratischen Verlust. Die Parameter der beiden Rechnungen sind illustrative Lernwerte, keine geschätzten Fußballkoeffizienten.',
      },
    },
    {
      title: 'Bedingte Wahrscheinlichkeit und Stichprobenunsicherheit',
      paragraphs: [
        'P(Tor | Strafraum) meint den Toranteil unter den Schüssen aus dem Strafraum. P(Strafraum | Tor) fragt dagegen, welcher Anteil aller Tore aus dem Strafraum stammt. Die Nenner unterscheiden sich. Bei 4 Toren aus 20 Strafraumschüssen und 1 Tor aus 10 Distanzschüssen gilt P(Tor | Strafraum) = 4/20 = 0,2, während P(Strafraum | Tor) = 4/5 = 0,8. Diese Umkehrung ist eine häufige Ursache irreführender Aussagen.',
        'Eine Quote aus einer Stichprobe schätzt eine unbekannte Wahrscheinlichkeit. Unter der vereinfachenden Annahme unabhängiger Bernoulli-Versuche mit gleicher Erfolgswahrscheinlichkeit p beträgt der Standardfehler der Quote ungefähr sqrt(p × (1 - p) / n). Bei p = 0,2 ergibt das für 20 Schüsse rund 0,089 und für 500 rund 0,018. Im Fußball sind Schüsse oft abhängig und unterschiedlich schwierig. Die Formel ist daher ein Verständnisbeispiel für die Rolle des Stichprobenumfangs, kein automatisch gültiges Spielerintervall. Mehr Daten beseitigen außerdem keine Auswahlverzerrung durch nur verfügbare Spiele.',
      ],
      example: {
        code: `from math import sqrt
inside_goals, inside_shots = 4, 20
outside_goals = 1
print(inside_goals / inside_shots)
print(inside_goals / (inside_goals + outside_goals))
for n in [20, 500]:
    print(f"{sqrt(0.2 * 0.8 / n):.3f}")`,
        expected: '0.2\n0.8\n0.089\n0.018',
        explanation:
          'Die ersten Ausgaben wechseln bewusst die Bezugsmenge. Die letzten zeigen die Unsicherheit einer Quote unter einem idealisierten Zufallsmodell. Eine 25-mal größere Stichprobe reduziert diesen Standardfehler um den Faktor fünf, weil n unter der Quadratwurzel steht.',
      },
    },
    {
      title: 'Mittelwerte kontrollieren und Korrelation begrenzen',
      paragraphs: [
        'Das SADS-Repository zeigt mit dem Anscombe-Quartett, dass sehr unterschiedliche Punktwolken ähnliche Regressionskennzahlen haben können. Prüfe daher vor einem linearen Modell die einzelnen Werte, Streuung, ungewöhnliche Beobachtungen und mögliche Krümmung. Bereits ein einfacheres Beispiel zeigt das Problem: Die Reihen [0, 0, 6] und [2, 2, 2] haben beide Mittelwert 2. Für die erste Reihe ist die Leistung ungleich verteilt, für die zweite konstant. Ein Balken mit nur dem Mittelwert versteckt diesen Unterschied.',
        'Korrelation beschreibt gemeinsamen linearen Verlauf, keine Ursache. Zuschauerzahlen und eine Promotion können zusammenhängen, weil attraktive Spieltage gezielt Promotions erhalten. Das SADS-Zuschauerbeispiel berücksichtigt Monat und Wochentag als Modellvariablen, aber beobachtete Kontrollvariablen garantieren keine kausale Identifikation. Im Fußball gilt dasselbe für Ballbesitz und Siege: Spielstand, Gegner und taktische Auswahl beeinflussen beide. Formuliere das Ergebnis als bedingten Zusammenhang und nenne eine plausible alternative Erklärung.',
      ],
      example: {
        code: `from statistics import mean, pvariance
for values in [[0, 0, 6], [2, 2, 2]]:
    print(f"Mittel={mean(values):.1f}, Varianz={pvariance(values):.1f}")`,
        expected: 'Mittel=2.0, Varianz=8.0\nMittel=2.0, Varianz=0.0',
        explanation:
          'pvariance mittelt hier die quadrierten Abweichungen über die drei gezeigten Werte: (4 + 4 + 16) / 3 = 8. Es beschreibt diese vollständige kleine Werteliste. Für die Schätzung einer Populationsvarianz aus einer Stichprobe gibt es mit variance einen anderen Nenner.',
      },
    },
  ],
  'study-engineering': [
    {
      title: 'ETL als drei überprüfbare Zustände verstehen',
      paragraphs: [
        'Extract übernimmt eine Lieferung, Transform prüft und vereinheitlicht sie, Load veröffentlicht das Ergebnis. Das Data Engineering Lab veranschaulicht diese Aufgaben mit Bronze, Silver und Gold: Rohdaten, bereinigte Zeilen und fachliche Aggregate. Diese Bezeichnungen brauchen keine Cloud. Lokal können eine unveränderte JSON-Datei, eine SQLite-Tabelle und eine Ergebnisdatei dieselben Rollen erfüllen. Entscheidend ist, dass du von einer Zahl im Bericht zu den verwendeten Eingaben zurückfindest.',
        'Das untersuchte Silver-Notebook wandelt Text in Typen um und legt unbrauchbare Zeilen separat ab. Übernimm dieses Prinzip mit eigenen Fachregeln: Ein Schuss braucht eine Kennung und ein binäres Torlabel. Erfasse für jeden Ausschluss einen Grund, statt fehlerhafte Zeilen unsichtbar zu verwerfen. Das Beispiel akzeptiert ausdrücklich nur ganze Zahlen 0 oder 1; die Zeichenkette "0" ist ohne definierte Konvertierungsregel ungültig. Ob fehlende Koordinaten die gesamte Zeile ausschließen, hängt davon ab, ob die nächste Auswertung Geometrie benötigt.',
      ],
      example: {
        code: `raw = [{"id": "s1", "goal": 0},
       {"id": "s2", "goal": 2},
       {"id": "", "goal": 1}]
good, rejected = [], []
for row in raw:
    reason = None
    if not row.get("id"):
        reason = "missing_id"
    elif type(row.get("goal")) is not int or row["goal"] not in (0, 1):
        reason = "invalid_goal"
    if reason:
        rejected.append((row["id"], reason))
    else:
        good.append(dict(row))
print(len(good), len(rejected))
print(rejected)`,
        expected: "1 2\n[('s2', 'invalid_goal'), ('', 'missing_id')]",
        explanation:
          'Drei Eingabezeilen werden vollständig bilanziert: eine akzeptierte und zwei ausgeschlossene. Die Fehlerpriorität ist festgelegt: zuerst die Kennung, dann das Torlabel. dict(row) erzeugt eine eigene Kopie der akzeptierten Zeile, sodass die Rohdaten unverändert bleiben.',
      },
    },
    {
      title: 'Idempotenz braucht Schlüssel und eine Korrekturregel',
      paragraphs: [
        'Idempotent bedeutet: Derselbe Import auf demselben Ausgangsstand verändert das fachliche Ergebnis bei Wiederholung nicht erneut. Ein einfaches Anhängen aller Zeilen erfüllt das nicht. Im untersuchten Lab-Notebook werden doppelte Zeilen und anschließend doppelte order_id entfernt. Das verdeutlicht Eindeutigkeit, legt bei widersprüchlichen Zeilen aber noch keine fachliche Reihenfolge fest. Für einen Eventfeed brauchst du deshalb zusätzlich eine Regel, welche Providerrevision neuer ist.',
        'Im Beispiel identifiziert id eine Aktion und rev eine ganzzahlige Revision. Eine höhere Revision ersetzt den alten Stand, eine niedrigere wird ignoriert. Die identische Revision mit anderen Werten löst einen Konflikt aus, weil keine eindeutige Wahrheit erkennbar ist. So überschreibt ein verspäteter alter Download keine Korrektur. Dieses kleine Modell setzt voraus, dass Revisionen je Aktion vergleichbar sind. Löschungen, mehrere Provider und Schemaänderungen brauchen weitere explizite Regeln, bevor du es auf echte Lieferungen überträgst.',
      ],
      example: {
        code: `def load(state, batch):
    result = {key: dict(value) for key, value in state.items()}
    for row in batch:
        old = result.get(row["id"])
        if old is not None and row["rev"] == old["rev"] and row != old:
            raise ValueError("revision conflict")
        if old is None or row["rev"] > old["rev"]:
            result[row["id"]] = dict(row)
    return result

batch = [{"id": "s1", "rev": 1, "goal": 0}]
state = load({}, batch)
assert load(state, batch) == state
state = load(state, [{"id": "s1", "rev": 2, "goal": 1}])
state = load(state, batch)
print(len(state), state["s1"]["goal"], state["s1"]["rev"])`,
        expected: '1 1 2',
        explanation:
          'Der zweite Import der ersten Lieferung erzeugt keinen zusätzlichen Datensatz. Revision 2 korrigiert das Label auf ein Tor. Die anschließende erneute Revision 1 ist veraltet und ändert nichts. Erst nach erfolgreicher Verarbeitung wird das zurückgegebene Ergebnis als neuer Zustand übernommen.',
      },
    },
    {
      title: 'Abhängigkeiten, Fehler und veröffentlichte Ergebnisse',
      paragraphs: [
        'Der untersuchte Airflow-DAG ordnet drei Notebooks ausdrücklich als Bronze vor Silver vor Gold an. Diese Abhängigkeit ist auch ohne Airflow sinnvoll: Ein Bericht darf erst aus dem neu geprüften Stand entstehen. Schreibe Ergebnisse zunächst in einen Arbeitsbereich und veröffentliche den gesamten geprüften Stand zusammen. In SQLite hilft eine Transaktion: Entweder alle zusammengehörigen Änderungen werden bestätigt oder keine. Ein Prozessabbruch zwischen zwei Updates darf keinen halb korrigierten Spielbericht hinterlassen.',
        'Eine reproduzierbare Umgebung benötigt konkrete Versionen und passende Systemvoraussetzungen. Die geprüfte Lab-Datei pinnt unter anderem den Spark-Client und weist auf die Übereinstimmung mit dem Server hin. Der vollständige Stack benötigt Docker und weitere Werkzeuge; er ist keine Voraussetzung dieser Beispiele. Für ein eigenes kleines Datenprodukt dokumentierst du Python- und SQLite-Version, Quelle, Revision, Schema und Startkommando. Prüfe einen gültigen Import, eine Wiederholung, eine Korrektur und einen absichtlichen Fehler. Damit testest du Verhalten statt nur die erfolgreiche Ausführung einer Notebookzelle.',
      ],
      example: {
        code: `import sqlite3
db = sqlite3.connect(":memory:")
db.execute("CREATE TABLE score (id INTEGER PRIMARY KEY, goals INTEGER)")
db.execute("INSERT INTO score VALUES (1, 0)")
db.commit()
try:
    with db:
        db.execute("UPDATE score SET goals = 1 WHERE id = 1")
        db.execute("INSERT INTO score VALUES (1, 9)")
except sqlite3.IntegrityError:
    print("rollback")
print(db.execute("SELECT goals FROM score WHERE id = 1").fetchone()[0])`,
        expected: 'rollback\n0',
        explanation:
          'Die doppelte Primärschlüsselkennung löst einen Fehler aus. Der Connection-Kontext rollt die innerhalb der Transaktion ausgeführte Änderung zurück. Weil der anfängliche Stand bereits separat bestätigt wurde, bleibt sein Wert null erhalten.',
      },
    },
  ],
  'study-science': [
    {
      title: 'Problem, Zielgröße und Auswertung vor dem Modell festlegen',
      paragraphs: [
        'Der Zero-to-Mastery-Kurs strukturiert Projekte über Problem, Daten, Bewertung, Merkmale, Modellierung und Experimente. Übertrage das auf eine eng begrenzte Fußballfrage: Vor einem Schuss soll die Torwahrscheinlichkeit aus bereits bekannten Merkmalen geschätzt werden. Die Untersuchungseinheit ist der Schuss, das Label 0 oder 1, und die gewünschte Ausgabe eine Wahrscheinlichkeit. Ein Ranking von Spielern oder die Erklärung eines taktischen Mechanismus wäre eine andere Aufgabe und bräuchte andere Belege.',
        'Wähle die Metrik passend zur Entscheidung. Für Wahrscheinlichkeiten mittelt der Brier Score die quadrierten Abweichungen von Label und Vorhersage. Kleine Werte sind besser. Ein Klassifikationsschwellwert wirft Wahrscheinlichkeitsinformation weg: 0,01 und 0,49 werden bei Schwelle 0,5 beide kein Tor. Accuracy allein übersieht diesen Unterschied. Lege eine einfache Referenz fest, etwa die konstante Torquote aus den Trainingsspielen. Ein komplexes Modell muss an denselben zurückgehaltenen Spielen zeigen, ob es diese Referenz verbessert.',
      ],
      example: {
        code: `def brier(probabilities, labels):
    if len(probabilities) != len(labels) or not labels:
        raise ValueError("need equally sized, nonempty inputs")
    return sum((p - y) ** 2 for p, y in zip(probabilities, labels)) / len(labels)

labels = [0, 1, 0, 1]
print(f"{brier([0.5] * 4, labels):.3f}")
print(f"{brier([0.1, 0.8, 0.2, 0.9], labels):.3f}")`,
        expected: '0.250\n0.025',
        explanation:
          'Die Referenz macht viermal einen quadrierten Fehler von 0,25. Die zweite Vorhersageliste hat Fehler 0,01, 0,04, 0,04 und 0,01, zusammen 0,10 geteilt durch vier. Diese vier konstruierten Beobachtungen zeigen die Rechnung, beweisen aber keine Modellqualität auf einem Wettbewerb.',
      },
    },
    {
      title: 'Training, Validierung und Test haben verschiedene Aufgaben',
      paragraphs: [
        'Training schätzt Modellparameter und lernt die Aufbereitung, beispielsweise einen Mittelwert zum Ersetzen fehlender Werte. Validierung vergleicht Modelle, Merkmale und Hyperparameter. Der finale Test beantwortet erst nach diesen Entscheidungen, wie gut das gewählte Verfahren auf bisher ungenutzten Daten funktioniert. Wenn du nach jedem Testergebnis das Modell änderst, wird der Test faktisch zur Validierung. Dann benötigst du einen neuen unangetasteten Testbestand, um eine ehrliche Abschlussbewertung zu erhalten.',
        'Das untersuchte Heart-Disease-Notebook demonstriert einen zufälligen Train/Test-Split. Für zukünftige Fußballspiele ist diese Wahl nicht automatisch passend. Halte ganze Spiele zusammen und ordne die Bestände nach Datum; sonst können Aktionen desselben Spiels oder später bekannte Informationen die Bewertung erleichtern. Im Beispiel werden zwei frühe Spiele trainiert, eines validiert und eines getestet. Die Aufbereitung berechnet ihren Mittelwert ausschließlich aus den frühen Trainingswerten. Der auffällige Testwert 100 darf ihn nicht verändern, auch wenn das die abschließende Modellleistung verbessern würde.',
      ],
      example: {
        code: `from statistics import mean
matches = [
    {"id": "m1", "date": "2026-01-01", "x": 2},
    {"id": "m2", "date": "2026-02-01", "x": 4},
    {"id": "m3", "date": "2026-03-01", "x": None},
    {"id": "m4", "date": "2026-04-01", "x": 100},
]
train = [m for m in matches if m["date"] < "2026-03-01"]
valid = [m for m in matches if "2026-03-01" <= m["date"] < "2026-04-01"]
test = [m for m in matches if m["date"] >= "2026-04-01"]
replacement = mean(m["x"] for m in train if m["x"] is not None)
print([m["id"] for m in train], [m["id"] for m in valid], [m["id"] for m in test])
print(replacement, valid[0]["x"] if valid[0]["x"] is not None else replacement)`,
        expected: "['m1', 'm2'] ['m3'] ['m4']\n3 3",
        explanation:
          'ISO-Datumszeichenketten mit gleichem Format lassen sich hier chronologisch vergleichen. Der Trainingsmittelwert ist (2 + 4) / 2 = 3 und ersetzt den fehlenden Validierungswert. Die Beispielgröße reicht zur Erklärung des Datenflusses; sie reicht nicht für eine belastbare empirische Modellauswahl.',
      },
    },
    {
      title: 'Experimente und Berichte so führen, dass sie prüfbar bleiben',
      paragraphs: [
        'Ein Experiment braucht eine feste Datenrevision, dieselben Split-IDs, eine klar benannte Änderung und eine passende Metrik. Verändere zunächst genau eine begründete Sache, etwa die Aufnahme des Schusswinkels neben der Distanz. Halte auch nicht verbesserte Versuche fest. Wenn du nur das beste Ergebnis aus vielen Varianten berichtest, verschwinden die Versuche, die seine Zufallsabhängigkeit sichtbar machen. Ein Startwert für Zufallsgeneratoren hilft beim Wiederholen; er ersetzt weder Versionsangaben noch die Untersuchung mehrerer plausibler Datenaufteilungen.',
        'Eine Ergebnistabelle gehört mit Fallzahlen, Referenzwert und begrenzter Schlussfolgerung in den Bericht. Die Data-Folks-Sammlung trennt Lernverfahren von Bewertungsmetriken, während SADS unterschiedliche Darstellungen derselben Daten vorführt. Daraus folgt eine nützliche Kontrollroutine: Vergleiche Kennzahl und Einzelbeispiele. Prüfe hohe und niedrige Vorhersagen sowie Fehler bei speziellen Schusstypen. Ein Modell kann im Mittel besser sein und bei einer seltenen Untergruppe scheitern. Benenne deshalb, welche Population dein Test enthält und welche nächste Datensammlung deine Aussage erweitern könnte.',
      ],
      example: {
        code: `runs = [
    {"name": "prior", "valid_brier": 0.18},
    {"name": "distance", "valid_brier": 0.16},
    {"name": "distance_angle", "valid_brier": 0.15},
]
chosen = min(runs, key=lambda run: run["valid_brier"])
print(chosen["name"])
baseline_test, chosen_test = 0.19, 0.17
print(f"{baseline_test - chosen_test:.2f}")`,
        expected: 'distance_angle\n0.02',
        explanation:
          'Die Auswahl nutzt ausschließlich die drei vorgegebenen Validierungswerte. Erst anschließend wird der bereits gewählten Variante ein konstruiertes Testergebnis zugeordnet. Die absolute Brier-Verbesserung beträgt 0,02. Diese Zahlen sind didaktisch gesetzt und keine gemessenen Resultate der verlinkten Repositories.',
      },
    },
  ],
};

export const foundationSources: {
  title: string;
  url: string;
  chapters: string[];
  focus: string;
  license: string;
  inspected: string[];
}[] = [
  {
    title: 'OSSU Data Science: mathematische und informatische Grundlagen',
    url: 'https://github.com/ossu/data-science/tree/ccb52fe046fe3b61696083596278b36516fdb80b',
    chapters: ['study-foundations', 'study-data', 'study-statistics'],
    focus:
      'Curriculum mit Schulmathematik als Voraussetzung, Programmierung, Datenbanken, Analysis, linearer Algebra und Wahrscheinlichkeit. Eigenständige Grundlagenbeispiele im Kurs; externe Kurse sind optional.',
    license: 'CC BY-SA 4.0 laut LICENSE.md; verlinkte Kurse haben eigene Bedingungen.',
    inspected: [
      'README.md',
      'coursepages/intro-programming/README.md',
      'LICENSE.md',
      'vollständiger Dateibaum; kein eigenes Laufzeitmanifest',
    ],
  },
  {
    title: 'Data Folks: Programmierung, Mathematik und Bewertungsmetriken',
    url: 'https://github.com/data-folks/data-science-learning-path/tree/1970e5b070ff99f74c3d5e715223e59345ba5b23',
    chapters: ['study-foundations', 'study-data', 'study-statistics', 'study-science'],
    focus:
      'Linksammlung von Python und SQL über Mathematik zu Lernverfahren und gesonderten Metriken; hier als Strukturhilfe genutzt, nicht als geprüfte Implementierung.',
    license: 'MIT laut LICENSE; externe Ressourcen separat prüfen.',
    inspected: [
      'README.md',
      'LICENSE',
      'vollständiger Dateibaum; keine Notebooks oder Anforderungen vorhanden',
    ],
  },
  {
    title: 'Data Engineering Lab: Bronze, Silver, Gold und Orchestrierung',
    url: 'https://github.com/maarthala/data-engineering-lab/tree/457da5f0a3d7a63f7e25d510f263f004beb0b5e7',
    chapters: ['study-data', 'study-engineering'],
    focus:
      'Gezielt geprüft: lokales Setup, Versionsbindungen, Silver-Typkonvertierung und Rejects sowie Notebook-Reihenfolge im DAG. Der Kurs erläutert eigene lokale Alternativen und deterministische Korrekturregeln.',
    license: 'Unbekannt: keine repositoryweite LICENSE im untersuchten Dateibaum gefunden.',
    inspected: [
      'Readme.md',
      'local/README.md',
      'common/dockerfiles/add/requirements.txt',
      'azure/demo/dags/demo_sales_pipeline.py',
      'azure/demo/notebooks/demo_02_silver.ipynb',
    ],
  },
  {
    title: 'Sports Analytics and Data Science: Datenbilder und Modellgrenzen',
    url: 'https://github.com/mtpa/sads/tree/635c6657d81a72d714b9383c7e1c3b6465a987cc',
    chapters: ['study-statistics', 'study-science'],
    focus:
      'Anscombe-Quartett, Zuschaueranalyse und MDS exemplarisch gelesen. Schwerpunkt sind Streuung, Darstellung, kontrollierte Zusammenhänge und die Grenzen alter APIs.',
    license: 'Unbekannt: keine LICENSE und kein Lizenzhinweis im knappen README gefunden.',
    inspected: [
      'README.md',
      'SADS_Appendix_A/sads_exhibit_A_1.py',
      'SADS_Chapter_7/sads_exhibit_7_2.py',
      'SADS_Chapter_6/sads_exhibit_6_2.py',
      'vollständiger Dateibaum; kein Abhängigkeitsmanifest',
    ],
  },
  {
    title: 'Zero to Mastery ML: Projektablauf und getrennte Bewertung',
    url: 'https://github.com/mrdbourke/zero-to-mastery-ml/tree/81492352d12d7a52caef57bba7744cbdc34af33f',
    chapters: ['study-science', 'study-statistics'],
    focus:
      'Sechs-Schritte-Rahmen und ausgewählte Zellen des Heart-Disease-Notebooks zu Imports, Split und Modellvergleich. Für Fußball zeitliche Validierung und unangetasteten Abschlusstest ergänzt.',
    license:
      'Unbekannt: keine repositoryweite LICENSE im untersuchten Dateibaum gefunden; öffentliche Lesbarkeit ist keine Übernahmelizenz.',
    inspected: [
      'README.md',
      'docs/a-6-step-framework-for-approaching-machine-learning-projects.md',
      'docs/end-to-end-heart-disease-classification.ipynb (ausgewählte Zellen)',
      'vollständiger Dateibaum; kein Abhängigkeitsmanifest',
    ],
  },
  {
    title: 'Build Your Own X: kleine Mechanismen selbst nachvollziehen',
    url: 'https://github.com/codecrafters-io/build-your-own-x/tree/b2daa235c4fb774402d219c48adfea2a81d94ce7',
    chapters: ['study-foundations', 'study-engineering'],
    focus:
      'README-Rubriken für CLI, Datenbank und Webserver als didaktische Anregung. Keine verlinkten Fremdimplementierungen geprüft; das CLI-Beispiel ist eine eigene kleine Übung.',
    license:
      'Unbekannt: keine LICENSE im untersuchten Dateibaum gefunden; verlinkte Projekte haben eigene Bedingungen.',
    inspected: [
      'README.md (Einführung und ausgewählte Rubriken)',
      'vollständiger Dateibaum; kein eigener Implementierungscode oder Laufzeitmanifest',
    ],
  },
];
