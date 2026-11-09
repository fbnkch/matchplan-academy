# Quellenprüfung: Sportanalyse, Video und AI Engineering

Prüfdatum: 9. November 2026. Verantwortungsbereich: sieben angefragte Repositories sowie die neuen Inhalte in `src/course/reference-sport-ai.ts`. Die Kapitel sind eigenständig geschriebene deutsche Lehrtexte. Es wurden keine fremden Programmteile oder Repositorytexte übernommen. Alle Rechenbeispiele verwenden erfundene Daten.

## Vorgehen und Grenzen

Die öffentliche GitHub REST API lieferte Metadaten und rekursive Dateibäume aller sieben Repositories. Anschließend wurden README, verfügbare Lizenzdateien und ausgewählte Quell-, Konfigurations- und Themendateien per `raw.githubusercontent.com` am unten genannten festen Stand gelesen. Der Web-Reader konnte die API-URLs nicht öffnen; der read-only HTTPS-Abruf über Python funktionierte. Fremder Code wurde weder importiert noch ausgeführt. Es erfolgten keine Paketinstallationen, Modellaufrufe, Video-Downloads oder Git-Aktionen.

Die Prüfung ist eine dokumentierte Stichprobe, keine vollständige Codeprüfung aller Repositories. Die angegebenen Textdateien wurden hinsichtlich der hier beschriebenen Aussagen geprüft; lange übersichten und Betriebsartikel selektiv. Verlinkte Drittanbieterangebote wurden nicht allein durch ihre Aufnahme in eine Liste als geprüft gewertet. Gegen Ende begrenzte die öffentliche GitHub API weitere Anfragen mit HTTP 403; es erfolgte kein blinder Wiederholungsversuch. Die bereits abgerufenen Dateien aller sieben Repositories waren davon nicht betroffen.

Lizenzangaben beschreiben die gefundenen Repositorydateien. Sie sagen nichts über Rechte an externen Veröffentlichungen, Videos, personenbezogenen Daten, Modellen oder Diensten aus. Bei fehlender Lizenz wird keine Weiterverwendungsfreigabe unterstellt. Quellen dienen zum Nachprüfen und optionalen Nachbauen, nicht als ausgelagerte Pflichtlektionen.

## Befunde je Repository

### AdilShamim8/100-AI-Machine-Learning-Deep-Learnin-Projects

[Repository](https://github.com/AdilShamim8/100-AI-Machine-Learning-Deep-Learnin-Projects) | geprüfter Stand `5ae25aed973fefb46d9c2cdd245a29b9fc6e677f` | Keine Lizenzdatei gefunden

Der rekursive geprüfte Baum enthält exakt README.md und index.html. Die README verlinkt eigenständige Projekte in anderen Repositories; der HTML-Atlas enthält Darstellung und Projektbeschreibungen. Es liegen hier keine hundert getrennten ausführbaren Implementierungen samt Umgebungen vor. Deshalb sind die Marketingbegriffe Produktionsreife und langjährige Erfahrung keine eigenen Qualitätsbefunde dieser Recherche. Nutzen: Ideensuche. Grenze: jedes Zielprojekt benötigt eine separate Quellen-, Daten-, Lizenz- und Ausführungsprüfung. Keine Lizenzdatei im geprüften Baum.

Geprüfte Pfade:

- [README.md](https://github.com/AdilShamim8/100-AI-Machine-Learning-Deep-Learnin-Projects/blob/5ae25aed973fefb46d9c2cdd245a29b9fc6e677f/README.md)
- [index.html](https://github.com/AdilShamim8/100-AI-Machine-Learning-Deep-Learnin-Projects/blob/5ae25aed973fefb46d9c2cdd245a29b9fc6e677f/index.html)

### patchy631/ai-engineering-hub

[Repository](https://github.com/patchy631/ai-engineering-hub) | geprüfter Stand `042aeb5067384981eeba6a07fa882f436bb1660d` | MIT

Ein tatsächlich umfangreiches Demo-Repository mit Pythondateien, Notebooks und projektweisen Umgebungen. Die README ordnet Beispiele nach Schwierigkeitsgrad; Werbeaussagen zur Produktionsreife wurden nicht als Prüfresultat übernommen. Die geprüfte `rag_code.py` sucht drei Treffer, verwendet dann den ersten Bildtreffer, speichert ihn unter einem festen temporären Namen und lädt Janus-Pro-1B über Transformers mit `trust_remote_code=True`. Das ist ein konkretes Retrieval-/Generierungsbeispiel, aber kein Nachweis korrekter Belege, sicherer Mehrbenutzerdateien oder Sportvalidität. Die separate agentic_rag-Konfiguration nennt Python >=3.10,<=3.13 und CrewAI >=0.86,<1.0. Nutzen: Komponentenverträge für eine begrenzte optionale KI-Integration. Grenze: externe Gewichte, Rechenleistung, Projektversionen und Dienste separat prüfen; keine Ausführung in dieser Recherche.

Geprüfte Pfade:

- [README.md](https://github.com/patchy631/ai-engineering-hub/blob/042aeb5067384981eeba6a07fa882f436bb1660d/README.md)
- [LICENSE](https://github.com/patchy631/ai-engineering-hub/blob/042aeb5067384981eeba6a07fa882f436bb1660d/LICENSE)
- [Colivara-deepseek-website-RAG/rag_code.py](https://github.com/patchy631/ai-engineering-hub/blob/042aeb5067384981eeba6a07fa882f436bb1660d/Colivara-deepseek-website-RAG/rag_code.py)
- [agentic_rag/pyproject.toml](https://github.com/patchy631/ai-engineering-hub/blob/042aeb5067384981eeba6a07fa882f436bb1660d/agentic_rag/pyproject.toml)

### AdilShamim8/AI-Engineering

[Repository](https://github.com/AdilShamim8/AI-Engineering) | geprüfter Stand `c95358aa70673346acf73d033acebd979b037230` | MIT

Das Repository enthält ein gegliedertes Textcurriculum, Roadmaps, Evaluations- und Betriebsartikel. Es ist mehr als eine Linkliste; bei der geprüften Stichprobe handelt es sich um Wissens- und Protokolltexte, nicht um einen ausgeführten Sportassistenten. Besonders brauchbar ist das RAG-Evaluationsprotokoll: Datenfreigabe, Retrieval, Antwortbelege, Arbeitsablauf und Betrieb werden getrennt; Groundedness und Wahrheit ebenfalls. Der lange Monitoringartikel wurde hinsichtlich Token-, Kosten- und Latenzthemen selektiv geprüft. Die hiesigen Lehrtexte übertragen diese Trennung auf erfundene Spielnotizen. Konkrete Frameworks, Anbieterpreise und behauptete Karriereergebnisse werden nicht als Kursvoraussetzung übernommen.

Geprüfte Pfade:

- [README.md](https://github.com/AdilShamim8/AI-Engineering/blob/c95358aa70673346acf73d033acebd979b037230/README.md)
- [LICENSE](https://github.com/AdilShamim8/AI-Engineering/blob/c95358aa70673346acf73d033acebd979b037230/LICENSE)
- [102_AI-Application-Development/03-RAG/6. RAG Evaluation & Benchmarking (RAGAS, TruLens, DeepEval).md](https://github.com/AdilShamim8/AI-Engineering/blob/c95358aa70673346acf73d033acebd979b037230/102_AI-Application-Development/03-RAG/6.%20RAG%20Evaluation%20%26%20Benchmarking%20%28RAGAS%2C%20TruLens%2C%20DeepEval%29.md)
- [104_LLMOps/3. Observability/2. Token, Cost & Latency Monitoring.md](https://github.com/AdilShamim8/AI-Engineering/blob/c95358aa70673346acf73d033acebd979b037230/104_LLMOps/3.%20Observability/2.%20Token%2C%20Cost%20%26%20Latency%20Monitoring.md)

### eugeneyan/applied-ml

[Repository](https://github.com/eugeneyan/applied-ml) | geprüfter Stand `d58606b6ec039e9cc242f43fd64d16af71cd1297` | MIT

Eine thematisch gegliederte Sammlung externer Produktionsberichte, Papers und Vorträge. README, CONTRIBUTING und LICENSE bilden den vollständigen geprüften Dateibaum. Kategorien wie Datenqualität, Data Engineering, Validierung, Effizienz und Fehlversuche eignen sich als Fragenkatalog. Es gibt keine eigene lauffähige ML- oder Sportpipeline in diesem Repository. Verlinkte Artikel sind jeweils eigenständige Quellen und wurden hier nicht pauschal mitgeprüft. Der Kurs verwendet die Perspektive auf Daten- und Betriebsfehler, ohne fremde Unternehmensresultate auf Sport zu übertragen.

Geprüfte Pfade:

- [README.md](https://github.com/eugeneyan/applied-ml/blob/d58606b6ec039e9cc242f43fd64d16af71cd1297/README.md)
- [LICENSE](https://github.com/eugeneyan/applied-ml/blob/d58606b6ec039e9cc242f43fd64d16af71cd1297/LICENSE)

### matiasmascioto/awesome-soccer-analytics

[Repository](https://github.com/matiasmascioto/awesome-soccer-analytics) | geprüfter Stand `1433426b80e4244f53ab77980de0773116a68443` | CC0-1.0

Eine kuratierte englisch/spanische Sammlung mit Kategorien wie Daten, Ausbildung, Bibliotheken, Unternehmen und Video. Der geprüfte Baum enthält README und CC0-Lizenztext, keine Notebooks oder eigene Analyseimplementierung. Nutzen: Orientierung über unterschiedliche Daten- und Beobachtungsquellen. Grenze: Aufnahme in die Sammlung belegt weder heutige Erreichbarkeit noch Zugangsrechte oder fachliche Eignung eines Zielangebots. Der Kurs erklärt Sichtungsprotokoll und Bericht direkt und verlangt kein Durchlesen der Liste.

Geprüfte Pfade:

- [README.md](https://github.com/matiasmascioto/awesome-soccer-analytics/blob/1433426b80e4244f53ab77980de0773116a68443/README.md)
- [LICENSE.txt](https://github.com/matiasmascioto/awesome-soccer-analytics/blob/1433426b80e4244f53ab77980de0773116a68443/LICENSE.txt)

### Matre5/Football_Video_Analysis

[Repository](https://github.com/Matre5/Football_Video_Analysis) | geprüfter Stand `71183d88a7bcc52687c434f868eac661e7445d94` | Keine Lizenzdatei gefunden

Die README beschreibt einen Offlineablauf aus YOLO, ByteTrack, Filterung, Stitching und Streamlit. Der Code bestätigt die Notwendigkeit einer getrennten lokalen Laufzeit: `teterr.py` lädt yolov8n.pt und setzt `device=0`; requirements enthält unter anderem ultralytics, opencv-python, lapx, streamlit, pandas, matplotlib, SoccerNet und numpy ohne feste Versionen. Eingabepfade sind projektspezifisch; generierte JSON-Daten sind laut README ausgeschlossen.

Ein wesentlicher Widerspruch: Ein früher README-Abschnitt behauptet eine homographiebasierte Transformation. `tracks_scaled.py` bildet jedoch einen angenäherten Fußpunkt und eine geglättete Boxhöhe; `speed_tracks.py` verwendet 1.75 Meter geteilt durch mittlere Boxhöhe und multipliziert damit Bildpunktabstände. Eine echte Bodenhomographie ist in diesen geprüften Berechnungsschritten nicht implementiert. Die späteren README-Antworten bestätigen diese Näherung und nennen Homographie als zukünftige Verbesserung. Kameraschwenk, Zoom und Körperhaltung können Bewegung vortäuschen.

`stitch.py` verbindet Fragmente anhand Zeitlücke, Bildabstand und Boxhöhe; maximal 75 Frames bei angenommener Bildrate 25. Es gibt darin keinen Beleg für bestätigte reale Spieleridentität. `fatigue.py` teilt sortierte Beobachtungen nach Anzahl in frühe/späte Hälften und setzt bei 20 Prozent mittlerem Geschwindigkeitsrückgang ein Flag. Die Begriffe confidence und fatigue sind heuristisch, keine kalibrierten physiologischen Nachweise. Die README nennt selbst nur kurze Beobachtungsfenster und Fragmentierung. Auch längere Spuren allein würden die alternative Erklärung durch taktische Aufgaben oder Messfehler nicht ausschließen. Der Kurs übernimmt weder Verletzungsrisiko- noch Ermüdungsdiagnosen und unterscheidet Spuren ausdrücklich von Spielern. Es wurde keine Lizenzdatei im vollständigen geprüften Baum gefunden.

Geprüfte Pfade:

- [README.md](https://github.com/Matre5/Football_Video_Analysis/blob/71183d88a7bcc52687c434f868eac661e7445d94/README.md)
- [requirements.txt](https://github.com/Matre5/Football_Video_Analysis/blob/71183d88a7bcc52687c434f868eac661e7445d94/requirements.txt)
- [1st_Half/teterr.py](https://github.com/Matre5/Football_Video_Analysis/blob/71183d88a7bcc52687c434f868eac661e7445d94/1st_Half/teterr.py)
- [1st_Half/tracks_scaled.py](https://github.com/Matre5/Football_Video_Analysis/blob/71183d88a7bcc52687c434f868eac661e7445d94/1st_Half/tracks_scaled.py)
- [1st_Half/speed_tracks.py](https://github.com/Matre5/Football_Video_Analysis/blob/71183d88a7bcc52687c434f868eac661e7445d94/1st_Half/speed_tracks.py)
- [1st_Half/stitch.py](https://github.com/Matre5/Football_Video_Analysis/blob/71183d88a7bcc52687c434f868eac661e7445d94/1st_Half/stitch.py)
- [1st_Half/fatigue.py](https://github.com/Matre5/Football_Video_Analysis/blob/71183d88a7bcc52687c434f868eac661e7445d94/1st_Half/fatigue.py)

### AdilShamim8/GenAI-Roadmap-with-Notes-and-Projects

[Repository](https://github.com/AdilShamim8/GenAI-Roadmap-with-Notes-and-Projects) | geprüfter Stand `ecd9484ce791ab5f63d397b488deba9517b9ad3b` | MIT

Eine strukturierte Roadmap mit Themenartikeln und Projektgerüsten. Die README spricht von Code, Tests und Evaluationsharnesses; die konkrete Implementierung muss trotzdem geprüft werden. Im untersuchten Hybrid-RAG-Projekt druckt `src/main.py` nur eine Aufforderung zur Implementierung. Der Evaluationsrunner liefert in `run_agent` eine konstante Platzhalterantwort und prüft anschließend Pflicht- und Verbotswörter. Der feste Grenzwert 0.85 ist eine Projektvorgabe, kein allgemeiner Qualitätsstandard. Die pyproject-Datei enthält Python >=3.11 und API-/Validierungsabhängigkeiten.

Die Texte zu Golden Datasets und Kosten sind nützliche Planungsanregungen, aber genannte Testfallzahlen oder Bewertungen durch ein Sprachmodell sind keine ausreichende Garantie. Der Kurs verwendet manuell geprüfte Referenzen, Enthaltung, Widerspruch, Quellenzugriff und eine eigene Baseline. Er bezeichnet das geprüfte Projekt ausdrücklich als Gerüst und übernimmt keine Behauptung eines fertigen RAG-Systems.

Geprüfte Pfade:

- [README.md](https://github.com/AdilShamim8/GenAI-Roadmap-with-Notes-and-Projects/blob/ecd9484ce791ab5f63d397b488deba9517b9ad3b/README.md)
- [LICENSE](https://github.com/AdilShamim8/GenAI-Roadmap-with-Notes-and-Projects/blob/ecd9484ce791ab5f63d397b488deba9517b9ad3b/LICENSE)
- [07-evals/01-golden-datasets.md](https://github.com/AdilShamim8/GenAI-Roadmap-with-Notes-and-Projects/blob/ecd9484ce791ab5f63d397b488deba9517b9ad3b/07-evals/01-golden-datasets.md)
- [08-production/01-cost-engineering.md](https://github.com/AdilShamim8/GenAI-Roadmap-with-Notes-and-Projects/blob/ecd9484ce791ab5f63d397b488deba9517b9ad3b/08-production/01-cost-engineering.md)
- [projects/02-hybrid-rag-over-notion/src/main.py](https://github.com/AdilShamim8/GenAI-Roadmap-with-Notes-and-Projects/blob/ecd9484ce791ab5f63d397b488deba9517b9ad3b/projects/02-hybrid-rag-over-notion/src/main.py)
- [projects/02-hybrid-rag-over-notion/pyproject.toml](https://github.com/AdilShamim8/GenAI-Roadmap-with-Notes-and-Projects/blob/ecd9484ce791ab5f63d397b488deba9517b9ad3b/projects/02-hybrid-rag-over-notion/pyproject.toml)
- [projects/02-hybrid-rag-over-notion/evals/eval_runner.py](https://github.com/AdilShamim8/GenAI-Roadmap-with-Notes-and-Projects/blob/ecd9484ce791ab5f63d397b488deba9517b9ad3b/projects/02-hybrid-rag-over-notion/evals/eval_runner.py)

## Umsetzung und didaktische Abdeckung

- `study-analysis`: Sequenzauswahl mit Nenner und unbekannten Fällen; Synchronisation von Video- und Eventuhr; Befund, Erklärung und nächster Prüfauftrag.
- `study-scouting`: rollenbezogenes Sichtungsprotokoll; Track-ID gegenüber bestätigter Spieler-ID; Unsicherheit und Beobachterübereinstimmung.
- `study-advanced`: Kamerageometrie und Boxhöhen-Näherung; zeitlich korrekte Geschwindigkeit und Lücken; Messqualität vor sportlicher Deutung.
- `study-video`: sechs vollständige optionale Abschnitte zu Beobachtungsvertrag, Detektion/Tracking, Kalibrierung, Kennzahlen, Qualitätsauswertung und lokaler Reproduktion. Voraussetzungen und Laufzeitgrenzen stehen im Einstieg.
- `study-ai`: sieben vollständige optionale Abschnitte zu begrenzter Aufgabe, freigegebenem Wissensbestand, Retrieval/Generierung, Evaluation, Ausgabevertrag, Kosten/Datenschutz und reproduzierbarer Abgabe. Kein Modell zur Vorhersage von Spielerqualität.

Die neun Ergänzungsabschnitte haben jeweils zwei eigenständige Absätze. Die beiden vollständigen Kapitel enthalten jeweils zwei Absätze pro Abschnitt sowie Fragen und Abgabekriterien. Externe Links sind Quellen beziehungsweise optionale Vertiefung. Aufgaben und Begriffe werden auf der Seite erklärt. Die drei Ergänzungsbeispiele und zwei Kapitelbeispiele sind eigenständig und benötigen nur Python-Standardbibliothek. Sie führen weder Netzwerkzugriffe noch Modell-Downloads aus.

## Validierung

Die fünf tatsächlich eingebetteten Pythonbeispiele wurden aus der eigenen TypeScriptdatei gelesen, isoliert ausgeführt und bytegenau mit dem jeweils gespeicherten erwarteten Ergebnis verglichen. Prüfwerte: Zeitversatz 205; Sichtung 3 bekannte/2 unbekannte und 0.67; Geschwindigkeit [5.0, None]; Distanz 5.0 und 18.0 km/h; Recall 2 von 3 und 0.667. Diese Ausführung prüft nur die eigenen didaktischen Beispiele, keinen abgerufenen Fremdcode.

Die Integration und der abschließende TypeScript-/UI-Test liegen beim Hauptagenten. Neue Beispieldaten sind ausdrücklich erfunden. Verfügbare Studien-/Praxis-IDs wurden wiederverwendet, damit keine neuen ungeprüften Laufzeitübungen behauptet werden. Das KI-Kapitel hat kein unpassendes xG-Projekt zugeordnet. Verbleibende Grenzen: keine tatsächliche Detektionsgüte, GPU-Leistung, Videolizenz, API-Qualität oder medizinische Aussage wurde empirisch geprüft.
