import { createProjectDefinition } from '../../definition';
import analysisCsv from './data/players.csv?raw';
import starter from './starter.py?raw';
import solution from './solution.py?raw';
import scoutingAppSource from './app.py?raw';
import requirementsText from './requirements.txt?raw';

export const scoutingAppProject = createProjectDefinition({
  id: 'scouting-app',
  title: 'Scouting-App',
  subtitle: 'Ein Rollenprofil in eine Liste für die nächste Sichtung übersetzen',
  question:
    'Welche Mittelfeldspielerinnen kommen für eine verbindende Rolle im Ballbesitz infrage, und wie stark hängt die Auswahl von deinen Annahmen ab?',
  prerequisites: ['scout-shortlist', 'scout-sensitivitaet', 'ds-sensitivity', 'de-joins'],
  brief: [
    'Beschreibe vor dem Blick auf die Rangliste, was die gesuchte Spielerin im Aufbau, im Raumverhalten und gegen den Ball leisten soll. Wähle dafür vier bis sechs Kennzahlen. Halte fest, welche Anforderung jede Kennzahl abbildet und welche Information ihr fehlt.',
    'Die Demo enthält 24 synthetische Profile. Für den Vergleich wählst du MF mit mindestens 900 Minuten aus. Dieses Positionslabel grenzt die Gruppe nur grob ein. Prüfe bei der Interpretation weiterhin Rolle und Teamkontext, auch wenn du alle Werte auf 90 Minuten umgerechnet hast.',
    'Berechne einen gewichteten Score aus den innerhalb der Vergleichsgruppe standardisierten Raten. Ändere mindestens einmal die Gewichtung und prüfe zwei Minutenfilter. Wenige Ballverluste können auch bedeuten, dass eine Spielerin selten riskante Aktionen versucht. Beurteile den Wert deshalb zusammen mit der Ballprogression.',
    'Im Browser prüfst du den Analysekern. Das ZIP enthält zusätzlich eine lokal startbare Streamlit-App. Dort kannst du Daten laden, Position, Minuten und Gewichte ändern, Profile ansehen und die Auswahl als CSV exportieren. Installiere die Pakete mit pip install -r requirements.txt und starte streamlit run app.py.',
  ],
  milestones: [
    {
      id: 'role',
      title: 'Rollenprofil vor der Rangliste',
      description:
        'Beschreibe die Aufgaben der gesuchten Rolle und übersetze sie in begründete Kennzahlen. Notiere bewusst fehlende Daten.',
      deliverable: 'Rollenprofil mit vier bis sechs Kriterien, Bedeutung und Grenzen.',
      criteria: [
        'Sind Kriterien vor dem Blick auf Namen festgelegt?',
        'Stehen riskante und sichere Spielweisen im Kontext?',
      ],
    },
    {
      id: 'peers',
      title: 'Faire Vergleichsgruppe',
      description:
        'Wähle vergleichbare Rollen und eine Mindestspielzeit. Prüfe Datenabdeckung und berechne Raten pro 90.',
      deliverable: 'Peer-Tabelle mit Minuten, Raten und Ausschlussgründen.',
      criteria: [
        'Wird nicht zwischen fremden Positionen gerankt?',
        'Ist der Minutenfilter begründet?',
      ],
    },
    {
      id: 'ranking',
      title: 'Score und Gegenprüfung',
      description:
        'Standardisiere innerhalb der Peer-Gruppe, nicht über alle Positionen. Dokumentiere Richtung und Gewicht jeder Kennzahl.',
      deliverable: 'Shortlist mit drei Kandidatinnen und offenem Rechenweg.',
      criteria: [
        'Führt eine konstante Kennzahl nicht zu Division durch null?',
        'Werden fehlende Werte nicht still als Nullqualität behandelt?',
      ],
    },
    {
      id: 'sensitivity',
      title: 'Stabilität untersuchen',
      description:
        'Variiere Gewichte und Mindestminuten. Untersuche, welche Namen stabil bleiben und warum sich andere verändern.',
      deliverable: 'Mindestens drei Szenarien und eine Gegenargument-Spalte pro Kandidatin.',
      criteria: [
        'Werden instabile Rangunterschiede sichtbar?',
        'Wird ein Score nicht als objektive Wahrheit dargestellt?',
      ],
    },
    {
      id: 'app',
      title: 'App und Kandidatenberichte',
      description:
        'Exportiere das Projekt und starte die enthaltene Streamlit-App. Prüfe Filter, leere Auswahl und CSV-Export. Schreibe einen One-Pager pro Kandidatin für die Videosichtung.',
      deliverable: 'Startbare App, README und drei begründete Kandidatenprofile.',
      criteria: [
        'Kann eine zweite Person die App starten?',
        'Sind Video-/Livefragen und Gründe gegen die Auswahl benannt?',
      ],
    },
  ],
  rubric: [
    'Du begründest die Kennzahlen mit den Aufgaben der gesuchten Rolle, bevor du die Namen vergleichst.',
    'Der Bericht erklärt den Einfluss von Spielzeit, Position, Teamkontext und Datenlücken auf die Auswahl.',
    'Du zeigst die Rangfolgen unter anderen Annahmen und erklärst, warum Kandidatinnen auf- oder abrücken.',
    'In der App lassen sich Rechenweg und Grenzen nachvollziehen; Filter und CSV-Export funktionieren.',
  ],
  lesson: {
    id: 'projekt-scouting',
    title: 'Shortlist berechnen',
    minutes: 150,
    concept: 'Peer-Vergleich und Sensitivität',
    trackId: 'scouting',
    packages: ['pandas', 'matplotlib'],
    task: 'Filtere peers auf MF und mindestens 900 Minuten. Standardisiere progressive_passes, pressures und turnovers als pro-90-Raten innerhalb peers. Verwende Gewichte +0,5, +0,3, −0,2. Erstelle shortlist_names (Top 3) und alternative_names mit +0,1, +0,1, −0,8. Zeichne die Raten der Shortlist.',
    starter: starter,
    solution: solution,
    checks: [
      {
        label: 'Nur passende Peer-Rollen',
        expression: 'bool(peers["position"].eq("MF").all())',
        expected: true,
      },
      {
        label: 'Mindestspielzeit angewendet',
        expression: 'bool(peers["minutes"].ge(900).all())',
        expected: true,
      },
      {
        label: 'Sechs Vergleichsprofile',
        expression: 'len(peers)',
        expected: 6,
      },
      {
        label: 'Drei eindeutige Kandidatinnen',
        expression: 'len(set(shortlist_names))',
        expected: 3,
      },
      {
        label: 'Alternative Auswertung vorhanden',
        expression: 'len(alternative_names)',
        expected: 3,
      },
      {
        label: 'Alle Kandidatinnen aus der Peer-Gruppe',
        expression: 'bool(set(shortlist_names).issubset(set(peers["name"])))',
        expected: true,
      },
      {
        label: 'Score nach vereinbarten Gewichten',
        expression:
          'bool((peers["score"] - (.5 * peers["progressive_passes_z"] + .3 * peers["pressures_z"] - .2 * peers["turnovers_z"])).abs().max() < 1e-9)',
        expected: true,
      },
      {
        label: 'Sortierte Shortlist aus dem Score',
        expression: 'shortlist_names',
        expected: ['Pia', 'Nora', 'Fina'],
      },
      {
        label: 'Alternative Gewichtung ausgewertet',
        expression:
          'bool((peers["alternative"] - (.1 * peers["progressive_passes_z"] + .1 * peers["pressures_z"] - .8 * peers["turnovers_z"])).abs().max() < 1e-9)',
        expected: true,
      },
      {
        label: 'Alternative Namen aus der richtigen Rangfolge',
        expression: 'alternative_names',
        expected: ['Pia', 'Nora', 'Kira'],
      },
    ],
    explanation: [
      'Beschreibe vor dem Blick auf die Rangliste, was die gesuchte Spielerin im Aufbau, im Raumverhalten und gegen den Ball leisten soll. Wähle dafür vier bis sechs Kennzahlen. Halte fest, welche Anforderung jede Kennzahl abbildet und welche Information ihr fehlt.',
      'Die Demo enthält 24 synthetische Profile. Für den Vergleich wählst du MF mit mindestens 900 Minuten aus. Dieses Positionslabel grenzt die Gruppe nur grob ein. Prüfe bei der Interpretation weiterhin Rolle und Teamkontext, auch wenn du alle Werte auf 90 Minuten umgerechnet hast.',
    ],
    example:
      'import matplotlib.pyplot as plt\npeers = players.loc[players["position"].eq("MF") & players["minutes"].ge(900)].copy()\nfor metric in ["progressive_passes", "pressures", "turnovers"]:\n    peers[metric + "_p90"] = peers[metric] / peers["minutes"] * 90\n    values = peers[metric + "_p90"]',
    hints: [
      'Kontrolliere nach dem Filter die Positionen und die kleinste Spielzeit in peers. Rechne für eine Spielerin eine Rate pro 90 Minuten nach, bevor du die Gruppe standardisierst.',
      'Standardisiere nur innerhalb peers. Prüfe die Streuung jeder Kennzahl: Ist sie null, darf deine Rechnung nicht durch null teilen. Vergleiche mit den Kursbeispielen und lass dir die Zwischenwerte ausgeben.',
      'Prüfe am Teilbeispiel zuerst die Standardisierung und dann den Score. Arbeite die restlichen Meilensteine einzeln ab. Sortiere für jede Gewichtung neu und übernimm alternative_names aus dieser Rangfolge; eine berechnete Spalte allein zeigt noch keine alternative Auswahl.',
    ],
    reflection:
      'Welche Mittelfeldspielerinnen kommen für eine verbindende Rolle im Ballbesitz infrage, und wie stark hängt die Auswahl von deinen Annahmen ab?',
    rubric: [
      'Du begründest die Kennzahlen mit den Aufgaben der gesuchten Rolle, bevor du die Namen vergleichst.',
      'Der Bericht erklärt den Einfluss von Spielzeit, Position, Teamkontext und Datenlücken auf die Auswahl.',
      'Du zeigst die Rangfolgen unter anderen Annahmen und erklärst, warum Kandidatinnen auf- oder abrücken.',
      'In der App lassen sich Rechenweg und Grenzen nachvollziehen; Filter und CSV-Export funktionieren.',
    ],
    objective: 'Ein Rollenprofil in eine Liste für die nächste Sichtung übersetzen',
    sources: [
      {
        title: 'StatsBomb/Hudl Open Data – Daten und Nutzungsbedingungen',
        url: 'https://github.com/hudl/open-data',
      },
      {
        title: 'pandas User Guide',
        url: 'https://pandas.pydata.org/docs/user_guide/index.html',
      },
    ],
  },
  reportTemplate:
    '# Scouting-Auftrag: verbindendes Mittelfeld\n\n## Rolle und Kriterien\n[Aufgaben, Kennzahlen, Gewichtung vor der Analyse]\n\n## Vergleichsgruppe und Datenqualität\n[Positionen, Minuten, Ballbesitzkontext, Quelle]\n\n## Shortlist und Gegenargumente\n### Kandidatin 1\n[Eignung, Gegenargument, Videoauftrag]\n### Kandidatin 2\n[Eignung, Gegenargument, Videoauftrag]\n### Kandidatin 3\n[Eignung, Gegenargument, Videoauftrag]\n\n## Sensitivität\n[Welche Namen ändern sich bei anderen Gewichten oder Minutenfiltern?]\n\n## Empfehlung für die nächste Prüfung\n[Konkreter Arbeitsauftrag, kein automatischer Transferentscheid]\n',
  limitations: [
    'Positionslabels und drei Übungskennzahlen bilden keine vollständige Rolle ab.',
    'Die Demo kennt weder Transferbudget, Verletzungskontext noch Vertragsdaten. Empfehlungen bleiben Arbeitsaufträge zur weiteren Prüfung.',
  ],
  analysisData: {
    fileName: 'data/players.csv',
    variableName: 'players',
    csv: analysisCsv,
  },
  transfer: {
    question:
      'Stelle für eine festgelegte Rolle zusammen, welche Spieler die Videoscouts als Nächstes prüfen sollen.',
    tasks: [
      'Formuliere das Rollenprofil und eine sinnvolle Vergleichsgruppe. Ein Turnier mit wenigen Spielen ist keine ausreichende Saisonbasis.',
      'Sichere Schlüssel und Einsatzzeitdefinitionen; vergleiche Raten, Rollen- und Teamkontext. Variiere Gewichte und Minutenschwellen.',
      'Schreibe je Kandidat eine begründete Hypothese, ein Gegenargument und eine konkrete Video-Prüffrage. Zeige Datenabdeckung und leere Filterzustände in der App.',
    ],
    evidence: [
      'Beschreibung der Quellen, Kennzahlen und Anforderungen an die Rolle',
      'Tabelle mit den Rangfolgen unter verschiedenen Gewichten und Minutenfiltern',
      'Lokal startbare App mit dokumentiertem CSV-Export und Fehlerbehandlung',
    ],
  },
  extraFiles: [
    {
      name: 'app.py',
      content: scoutingAppSource,
    },
    {
      name: 'requirements.txt',
      content: requirementsText,
    },
  ],
  applicationInstructions:
    '## Streamlit-App\n\nStarte die App nach der Installation mit `streamlit run app.py`. Ändere Position, Mindestminuten und Gewichte und vergleiche die Ergebnisse. Du kannst einzelne Profile ansehen und die Shortlist als CSV herunterladen.\n\n',
});
