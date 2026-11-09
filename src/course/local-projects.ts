export interface LocalProject {
  title: string;
  path: string;
  kind: 'Matchplan' | 'Upstream-Original';
}
const starter: LocalProject = {
  title: 'Python-Paket mit CSV-Prüfung, CLI und Tests',
  path: 'Beispielprojekte/Matchplan-Fussball',
  kind: 'Matchplan',
};
const workshop = (id: string, title: string): LocalProject => ({
  title,
  path: `Beispielprojekte/Werkstaetten/${id}`,
  kind: 'Matchplan',
});
export const localProjectsByChapter: Record<string, LocalProject[]> = {
  'study-foundations': [starter],
  'study-data': [starter],
  'study-analysis': [workshop('spielbericht', 'Spielbericht mit Daten und Musterlösung')],
  'study-statistics': [workshop('xg-modell', 'xG-Probelauf mit Trainings- und Testspielen')],
  'study-scouting': [workshop('scouting-app', 'Scouting-Auswahl mit Streamlit-App')],
  'study-engineering': [starter],
  'study-science': [workshop('xg-modell', 'xG-Modellierung und Bewertung')],
  'study-advanced': [workshop('aktionswerte', 'Rasterbasierte Aktionsbewertung')],
  'study-ai': [
    {
      title: 'Agentic RAG: ursprüngliches Notebook-Projekt',
      path: 'Beispielprojekte/Originale/patchy-agentic-rag',
      kind: 'Upstream-Original',
    },
    {
      title: 'Retrieval mit Colivara: ursprünglicher Beispielordner',
      path: 'Beispielprojekte/Originale/patchy-colivara-rag',
      kind: 'Upstream-Original',
    },
    {
      title: 'Hybrid RAG: ursprüngliches Projektgerüst',
      path: 'Beispielprojekte/Originale/adil-hybrid-rag',
      kind: 'Upstream-Original',
    },
  ],
};
