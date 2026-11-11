import { strToU8, zipSync } from 'fflate';
import { seasonSteps } from './season-project';

export interface TransferReference {
  title: string;
  url: string;
  section: string;
  observe: string;
  adapt: string;
}

export interface JourneyStep {
  id: string;
  title: string;
  result: string;
  question: string;
  concepts: { title: string; text: string }[];
  assignment: string[];
  checks: string[];
  folder: string;
  command: string;
  hint: string;
  variant: string;
  recall: string;
  practiceIds: string[];
  studyChapterId: string;
  transfer?: {
    support: string;
    references: TransferReference[];
    localExample?: string;
    prediction: string;
    hints: string[];
    feedback: string;
  };
}

export const previewPlayers = [
  { name: 'Mira Nord', role: 'MID', points: 80, marketValue: 4000000 },
  { name: 'Leon West', role: 'MID', points: 100, marketValue: 8000000 },
  { name: 'Nora Feld', role: 'DEF', points: 60, marketValue: 3000000 },
  { name: 'Emil Tor', role: 'FWD', points: 90, marketValue: 6000000 },
];

export const foundationSteps: JourneyStep[] = [
  {
    id: 'study-kickbase-01',
    title: 'Ein vollständiges Beispiel verstehen',
    result:
      'Das Dashboard läuft auf deinem Rechner. Es zeigt sechs fiktive Spieler und die Kennzahlen aus den CSV-Dateien.',
    question: 'Wie wird aus einer CSV-Zeile eine Zeile im Dashboard?',
    concepts: [
      {
        title: 'Datenfluss',
        text: 'load_players liest Text, wandelt Zahlen um und liefert Dictionaries. dashboard_data ergänzt Kennzahlen; render erzeugt daraus die Tabelle.',
      },
      {
        title: 'Was die Zahlen bedeuten',
        text: 'points enthält die durchschnittlichen Punkte je Einsatz, market_value den Marktwert in Euro. Bei 80 Punkten und 4 Millionen Euro beträgt das Verhältnis 20 Punkte je Million. Daraus lässt sich noch nicht ablesen, ob sich ein Kauf lohnt.',
      },
    ],
    assignment: [
      'ZIP entpacken und den Projektordner in deiner IDE öffnen.',
      'python app.py starten und http://127.0.0.1:8000 öffnen.',
      'Verfolge Mira Nord von data/players.csv über app.py bis zur Tabellenzeile. Erkläre jeden Übergang mit eigenen Worten.',
    ],
    checks: [
      'Die Tabelle zeigt sechs Spieler. Bei Mira stehen 20 Punkte je Million Euro.',
      'Du kannst CSV-Text, Python-Zahl und HTML-Ausgabe auseinanderhalten.',
    ],
    folder: 'steps/01-verstehen',
    command: 'python app.py',
    hint: 'Beginne bei dashboard_data und folge nur einem Spieler; die fertige Referenz liegt in solutions/metrics.py.',
    variant:
      'Exportiere mit python app.py --export bericht.json und finde denselben Spieler im JSON.',
    recall: 'Schließe den Code und zeichne die drei Stationen des Datenflusses aus dem Gedächtnis.',
    practiceIds: ['anpfiff', 'profil'],
    studyChapterId: 'study-foundations',
  },
  {
    id: 'study-kickbase-02',
    title: 'Ein Beispiel gezielt verändern',
    result: 'Deine Shortlist enthält nur Mittelfeldspieler, deren Marktwert in dein Budget passt.',
    question: 'Welche Bedingung muss jeder Kandidat erfüllen?',
    concepts: [
      {
        title: 'Filtern',
        text: 'Ein Filter behält Datensätze, deren Bedingung wahr ist. Position und Budget werden mit and verknüpft.',
      },
      {
        title: 'Vergleichsgruppe',
        text: 'Ein Gesamtmarkt-Ranking und eine Mittelfeld-Shortlist beantworten unterschiedliche Fragen. Schreibe den Filter neben das Ergebnis.',
      },
    ],
    assignment: [
      'Öffne steps/02-filtern/main.py und führe das vollständige Beispiel aus.',
      'Wähle ein anderes Budget oder eine andere Position. Sage voraus, welche Spieler übrig bleiben, bevor du das Skript erneut startest.',
      'Ergänze eine Mindestspielzeit von 600 Minuten und begründe ausgeschlossene Spieler.',
    ],
    checks: [
      'Bei MID und 5 Millionen erscheinen Mira Nord und Sam Ufer.',
      'Mit zusätzlich 600 Minuten bleibt Mira Nord; die ursprüngliche CSV bleibt unverändert.',
    ],
    folder: 'steps/02-filtern',
    command: 'python steps/02-filtern/main.py',
    hint: 'Vergleiche player["role"] mit "MID" und player["market_value"] mit dem Budget in Euro.',
    variant:
      'Erstelle eine DEF-Shortlist mit maximal 3,5 Millionen Euro. Sage die Namen vor dem Start voraus.',
    recall: 'Schreibe den Filter morgen ohne Vorlage neu und erkläre and gegenüber or.',
    practiceIds: ['rollenfilter', 'vergleich', 'schleife'],
    studyChapterId: 'study-data',
  },
  {
    id: 'study-kickbase-03',
    title: 'Eine Kennzahl selbst implementieren',
    result:
      'Deine Funktion berechnet Punkte je Million. Wenn Angaben fehlen oder der Marktwert null ist, gibt sie kein Verhältnis aus.',
    question:
      'Wie verhinderst du, dass ein Marktwert von null zum vermeintlichen Top-Kandidaten wird?',
    concepts: [
      {
        title: 'Funktionsvertrag',
        text: 'Die Funktion bekommt Punkte und Marktwert. Sie teilt die Punkte durch den Marktwert in Millionen Euro. Fehlt eine Eingabe, ist sie nicht endlich oder beträgt der Marktwert null, liefert die Funktion None.',
      },
      {
        title: 'Randfälle',
        text: 'Für diese Übung haben wir negative Werte ausgeschlossen. Deine Funktion soll dafür ValueError auslösen. Wir haben diese Regel für die Übungsdaten festgelegt; sie beschreibt nicht das vollständige Kickbase-Punktesystem.',
      },
    ],
    assignment: [
      'Implementiere nur points_per_million in exercises/metrics.py.',
      'Starte zunächst den einzelnen Übungstest und beobachte den Fehler.',
      'Prüfe 80 / 4 Mio., Null-Marktwert, fehlende Eingabe und negative Werte. Vergleiche erst danach mit solutions/metrics.py.',
    ],
    checks: [
      '80 Punkte bei 4 Millionen liefern 20; 100 bei 8 Millionen liefern 12,5.',
      'None wird nicht stillschweigend zu null. Der einzelne Übungstest ist grün.',
    ],
    folder: 'steps/03-kennzahl',
    command: 'python -m unittest tests.learner_suite.LearnerMetricTests.test_value -v',
    hint: 'Rechne zuerst market_value / 1_000_000; prüfe fehlende Werte vor der Division.',
    variant:
      'Verdopple den Marktwert bei gleichen Punkten und erkläre die Halbierung des Ergebnisses.',
    recall:
      'Erkläre ohne Vorlage, welche Einheit die Funktion erwartet, wann sie None liefert und wann sie einen Fehler auslöst.',
    practiceIds: ['funktion', 'spielzeit'],
    studyChapterId: 'study-analysis',
  },
  {
    id: 'study-kickbase-04',
    title: 'Die letzten Spieltage auswerten',
    result:
      'Deine Funktion berechnet den Punkteschnitt der letzten Spieltage. Wenn ein Spieler nicht eingesetzt wurde, zählt das nicht als Einsatz mit null Punkten.',
    question: 'Meinst du die letzten drei Spieltage oder die letzten drei Einsätze?',
    concepts: [
      {
        title: 'Zeitfenster',
        text: 'rolling_form nimmt zuerst die letzten N Spieltage und mittelt danach die vorhandenen Werte. [10, None, 30, 50] mit N=3 ergibt 40.',
      },
      {
        title: 'Test vor Implementierung',
        text: 'Wähle Beispiele, die zwei plausible Implementierungen unterscheiden: Ein fehlender Spieltag innerhalb des Fensters darf keinen älteren Spieltag nachrücken lassen.',
      },
    ],
    assignment: [
      'Schreibe in tests/test_my_form.py eigene Tests für normale Werte, fehlende Einsätze und ein ungültiges Fenster.',
      'Schreibe rolling_form selbst und behalte die Reihenfolge der Spieltage bei. Schau dir die Referenz erst nach deinem Versuch an.',
      'Begründe die Fensterentscheidung in einer kurzen Notiz und prüfe anschließend den vorhandenen Übungstest.',
    ],
    checks: [
      '[10, None, 30, 50] mit Fenster 3 ergibt 40; ausschließlich fehlende Werte ergeben None.',
      'Fenster 0 löst ValueError aus. Deine Tests erklären die Bedeutung des Fensters.',
    ],
    folder: 'steps/04-form',
    command: 'python -m unittest tests.learner_suite.LearnerMetricTests.test_form -v',
    hint: 'Trenne Fensterauswahl und Umgang mit fehlenden Werten. Eine Liste muss nicht vollständig beobachtet sein.',
    variant:
      'Vergleiche Fenster 2 und 3. Berichte, welche Aussage bei nur einem beobachteten Einsatz noch belastbar ist.',
    recall:
      'Erkläre den Unterschied zwischen fehlendem Einsatz und einem beobachteten Einsatz mit null Punkten.',
    practiceIds: ['ds-temporal', 'ds-features'],
    studyChapterId: 'study-science',
  },
  {
    id: 'study-kickbase-05',
    title: 'Daten importieren, verbinden und historisieren',
    result:
      'Dein Import ordnet jedem Spieler seine Spieltage zu und speichert einen datierten Snapshot. Ältere Datenstände bleiben erhalten.',
    question: 'Woran erkennst du, ob ein Join Datensätze verloren oder vervielfacht hat?',
    concepts: [
      {
        title: 'Schlüssel und Vertrag',
        text: 'players.id ist eindeutig. matchdays verwendet (id, matchday); jede ID muss auf einen Spieler zeigen. Geld, Minuten und Spieltagspunkte werden vor dem Schreiben geprüft.',
      },
      {
        title: 'Historie statt Überschreiben',
        text: 'Der Dateiname enthält das Datum im Format YYYY-MM-DD. Öffne die neue Datei mit dem Modus x: Python meldet dann einen Fehler, falls sie schon existiert. Speichere auch Quelle und Datenstand im JSON.',
      },
    ],
    assignment: [
      'Definiere die erwarteten Schlüssel und Spalten auf Papier. Implementiere eine eigene Pipeline in exercises/import_data.py.',
      'Dein Skript soll die in README beschriebenen Argumente --players, --matches, --output und --as-of annehmen. Arbeite mit den mitgelieferten Übungsdateien.',
      'Teste doppelte IDs, verwaiste Spieltage und erneuten Import desselben Datums. Vergleiche danach die Referenz pipeline.py.',
    ],
    checks: [
      'Sechs Spieler und je drei zugeordnete Spieltage sind erhalten.',
      'Ungültige Daten erzeugen keinen Snapshot; ein zweiter Lauf überschreibt keine Historie.',
    ],
    folder: 'steps/05-import',
    command:
      'python -m exercises.import_data --players data/players.csv --matches data/matchdays.csv --output history --as-of 2026-01-01',
    hint: 'Prüfe erst den gesamten Import im Speicher. Öffne die Zieldatei erst nach erfolgreicher Validierung.',
    variant:
      'Erzeuge einen neuen Stand mit anderem Datum und beschreibe den Unterschied zwischen Beobachtungs- und Importzeit.',
    recall: 'Nenne drei Prüfungen, die ein erfolgreicher CSV-Parser allein nicht garantiert.',
    practiceIds: ['de-contract', 'de-joins', 'de-upsert'],
    studyChapterId: 'study-engineering',
  },
  {
    id: 'study-kickbase-06',
    title: 'Spielerprofile vergleichen und Grenzen prüfen',
    result:
      'Dein Bericht zeigt, welche Spieler sich nach den gewählten Merkmalen ähneln. Er nennt die Vergleichsgruppe und erklärt, was der Abstand aussagt.',
    question: 'Ist ein kleiner Profilabstand ein guter Grund für eine Kaufentscheidung?',
    concepts: [
      {
        title: 'Positionsinterne Standardisierung',
        text: 'Wähle erst dieselbe Position und mindestens 450 Minuten. Standardisiere Punkte und Marktwert in dieser Gruppe mit Mittelwert und Populationsstandardabweichung; berechne dann den euklidischen Abstand.',
      },
      {
        title: 'Wann ein Vergleich keine Aussage erlaubt',
        text: 'None und NaN stehen für fehlende Werte. Schließe solche Profile aus, statt null einzusetzen. Ein Merkmal, das bei allen Spielern gleich ist, trägt nichts zum Abstand bei. Nenne im Bericht die Gruppengröße, die Minutengrenze und den Beitrag jedes Merkmals. Der Abstand beschreibt Ähnlichkeit in diesen Daten; er sagt keine künftige Leistung voraus.',
      },
    ],
    assignment: [
      'Entwirf Tests, Implementierung und Ergebnisdarstellung eigenständig in exercises/metrics.py.',
      'Halte dich an die Regeln in README: Wähle die Position vor der Skalierung aus. Ersetze NaN nicht durch geschätzte Werte und gib unterhalb der Minutengrenze keinen Vergleich aus.',
      'Schreibe einen Bericht für einen Spieler mit zwei Featurebeiträgen und einer Sensitivitätsprüfung. Nutze die Referenz erst zur abschließenden Kontrolle.',
    ],
    checks: [
      'Kein Vergleich über Positionen hinweg; Zielspieler erscheint nicht als eigener Nachbar.',
      'Unter 450 Minuten oder bei NaN gibt es keine Aussage. Ein konstantes Merkmal erzeugt keine Division durch null.',
      'Der Bericht enthält cohort_size, minimum_minutes und delta_z. Er erklärt, dass die kleine Gruppe aus fiktiven Spielern für eine echte Kaufentscheidung nicht ausreicht.',
    ],
    folder: 'steps/06-profile',
    command: 'python -m unittest tests.learner_suite.LearnerMetricTests.test_profile -v',
    hint: 'Prüfe mit zwei Spielern derselben Position und zwei verschiedenen Merkmalen. Ihre z-Werte sind je -1 und +1.',
    variant:
      'Ändere die Minutengrenze und entferne ein Feature. Prüfe, ob sich Nachbarn ändern, und begründe die Grenzen.',
    recall:
      'Erkläre aus dem Gedächtnis, warum Eurobeträge ohne Standardisierung den Abstand dominieren würden.',
    practiceIds: ['ds-features', 'ds-sensitivity', 'ds-review'],
    studyChapterId: 'study-scouting',
  },
];

export const kickbaseSteps: JourneyStep[] = seasonSteps;
export const allProjectSteps = [...kickbaseSteps, ...foundationSteps];

const starterFiles = import.meta.glob<string>(
  [
    '../../Beispielprojekte/Kickbase-Lernprojekt/**/*.py',
    '../../Beispielprojekte/Kickbase-Lernprojekt/**/*.csv',
    '../../Beispielprojekte/Kickbase-Lernprojekt/**/*.md',
    '../../Beispielprojekte/Kickbase-Lernprojekt/*.code-workspace',
    '../../Beispielprojekte/Kickbase-Lernprojekt/LICENSE',
    '!../../Beispielprojekte/Kickbase-Lernprojekt/**/__pycache__/**',
    '!../../Beispielprojekte/Kickbase-Lernprojekt/history/**',
  ],
  { query: '?raw', import: 'default', eager: true },
);

export function exportKickbaseStarter(): { data: Uint8Array; name: string } {
  const files: Record<string, Uint8Array> = {};
  for (const [path, content] of Object.entries(starterFiles)) {
    const relative = path.split('/Kickbase-Lernprojekt/')[1];
    if (!relative || /(^|\/)(?:__pycache__|history|\.git)(\/|$)/.test(relative)) continue;
    if (!/\.(?:py|csv|md|code-workspace)$/.test(relative) && relative !== 'LICENSE') continue;
    files[`Kickbase-Lernprojekt/${relative}`] = strToU8(content);
  }
  for (const required of [
    'app.py',
    'metrics.py',
    'data/players.csv',
    'data/matchdays.csv',
    'README.md',
    'LICENSE',
    'solutions/metrics.py',
    'exercises/metrics.py',
    'tests/test_reference.py',
  ]) {
    if (!files[`Kickbase-Lernprojekt/${required}`]) {
      throw new Error(`Starter-Download unvollständig: ${required} fehlt im Build.`);
    }
  }
  return { data: zipSync(files), name: 'Kickbase-Lernprojekt.zip' };
}
