# Unveränderte Upstream-Beispiele

## Vollständige Sport-Projekte für deine IDE

In [Archive/](Archive/) liegen fünf unveränderte GitHub-Quellcode-ZIPs. Es sind
eigenständige Projekte mit ihren ursprünglichen Verzeichnissen, Beispielen,
Paketdateien und Lizenztexten. Sie wurden nicht für Matchplan umgeschrieben.
Die Archive enthalten den festgehaltenen Quellcode-Stand, keinen Git-Verlauf und
keine separat eingebundenen Git-Submodule oder nachgeladenen Daten.

| Originalprojekt | ZIP im Repository | Woran du die Struktur untersuchen kannst |
| --- | --- | --- |
| [FastF1](https://github.com/theOehrly/Fast-F1) · Formel 1 | [fastf1-383e950b02a9.zip](Archive/fastf1-383e950b02a9.zip) | Analysebibliothek mit Session-Objekten, API-Zugriff, Cache und Beispielen |
| [nba_api](https://github.com/swar/nba_api) · Basketball | [nba-api-e077ba5fd381.zip](Archive/nba-api-e077ba5fd381.zip) | Einzelne Endpunkte bauen auf gemeinsamem HTTP-Transport auf |
| [nflreadpy](https://github.com/nflverse/nflreadpy) · American Football | [nflreadpy-e7e87b2ef626.zip](Archive/nflreadpy-e7e87b2ef626.zip) | Kleine Ladefunktionen, zentraler Downloader, Konfiguration und Cache |
| [mplsoccer](https://github.com/andrewRowlinson/mplsoccer) · Fußball | [mplsoccer-150be3f5d891.zip](Archive/mplsoccer-150be3f5d891.zip) | Wiederverwendbare Zeichenwerkzeuge und davon getrennte Analysebeispiele |
| [Soccer Analytics Handbook](https://github.com/devinpleuler/analytics-handbook) · Fußball | [analytics-handbook-1a76865bb79e.zip](Archive/analytics-handbook-1a76865bb79e.zip) | Ein echtes Analyse-Notebook als Gegenstück zur Paketstruktur |

Das [Archivmanifest](Archive/manifest.json) hält die vollständigen Revisionen,
Downloadquellen, Größen sowie SHA-256 für ZIP, Dateiinhalte und Lizenz fest.
Alle fünf Projekte stehen unter MIT; ihre Original-Lizenztexte bleiben im ZIP.
Zusätzliche Daten, Dienste und Marken haben eigene Bedingungen.

### Öffnen und bearbeiten

Aus dem Hauptverzeichnis von Matchplan:

```sh
python scripts/upstream_archives.py --extract
```

Danach kannst du `Beispielprojekte/Originalprojekte.code-workspace` in VS Code
öffnen oder `Beispielprojekte/Arbeitskopien/<projekt-id>` mit einer anderen IDE.
Die bereits vorbereiteten Arbeitskopien liegen außerhalb der versionierten
Originale. Ein erneuter Aufruf überschreibt sie nicht. Es werden keine Pakete
installiert, Erweiterungen geladen, Projektprogramme oder Notebookzellen gestartet.
Beachte beim Lesen die Versionsanforderungen des jeweiligen Projekts.

### Eine Lesereihenfolge statt eines ganzen Repositories auf einmal

Beginne mit **nflreadpy**, weil sich dort ein Datenabruf durch wenige Module
verfolgen lässt. Öffne `src/nflreadpy/load_pbp.py`, folge dem Aufruf nach
`downloader.py` und untersuche danach `cache.py` und `config.py`. Zeichne die
Zuständigkeiten. Überlege, wo dein Saisonprojekt einen ähnlichen Übergang braucht.

In **nba_api** gehst du von
`src/nba_api/stats/endpoints/playergamelog.py` über
`src/nba_api/stats/library/http.py` nach `src/nba_api/library/http.py`.
Vergleiche danach `tests/unit/http/test_http.py`. Viele Endpunktdateien werden
generiert. Lerne zuerst die gemeinsame Fehler- und Antwortbehandlung kennen,
bevor du dich durch den Endpunktkatalog arbeitest.

Bei **FastF1** startest du mit
`examples/lap_times/plot_driver_laptimes.py`. Folge `get_session` nach
`fastf1/events.py` und suche die verwendeten Methoden von `Session` in
`fastf1/core.py`. Erst danach ist `fastf1/req.py` mit dem Cache interessant.
Die getrennten Repositories für Testdaten und Dokumentationsdaten stehen in
`.gitmodules`; GitHub-ZIPs enthalten deren Inhalt nicht. Für das Lesen der
Paketstruktur brauchst du diese Daten nicht.

In **mplsoccer** vergleichst du `examples/pitch_plots/plot_scatter.py` mit
`examples/pitch_plots/plot_pass_network.py`. Suche die jeweils verwendeten
Methoden in `mplsoccer/soccer/pitch.py`. Welche Arbeit übernimmt das gemeinsame
Werkzeug, welche bleibt bei der konkreten Analyse?

Im **Soccer Analytics Handbook** öffnest du
`soccer_analytics_handbook.ipynb` zunächst ohne Ausführung. Lies die Abschnitte
zur Datenvorbereitung und danach Passing Chart oder Shot Chart. Markiere,
welche Zellen du für eine wiederholbare Anwendung später in Funktionen
auslagern würdest. Ein exploratives Notebook erfüllt eine andere Aufgabe als
eine installierbare Bibliothek; beide Formen sind hier absichtlich vertreten.

Für jeden Lesedurchgang reicht eine konkrete Frage. Notiere Einstiegspunkt,
Eingabe, Verarbeitung und Ausgabe. Verändere anschließend in deiner Arbeitskopie
eine kleine Sache und sage die Folge voraus. Übertrage erst danach das erkannte
Prinzip auf deinen eigenen Code.

## Frühere RAG-Quellenausschnitte

Stand der Übernahme: 9. November 2026. Diese drei **Quellenausschnitte** stammen aus den bereits recherchierten Repositories. Jede übernommene Datei enthält exakt die heruntergeladenen Originalbytes; keine Fehler wurden darin repariert. Die vollständigen Repositorystrukturen werden nicht behauptet. Herkunft, feste Revision, Dateigröße und SHA-256 stehen in [manifest.json](manifest.json). `files[].path` ist relativ zu `localPath` und zugleich der ursprüngliche Repositorypfad. Die jeweilige originale Root-`LICENSE` liegt direkt im Projektordner.

| ID und lokaler Einstieg | Umfang einschließlich LICENSE | Zweck und Zustand |
| --- | ---: | --- |
| [patchy-agentic-rag](patchy-agentic-rag/agentic_rag/README.md) | 18 Dateien, 95.100 Bytes | CrewAI: Dokumentensuche, Websuche, Antwortsynthese; mehrere Demo-Varianten mit erkennbaren Integrationslücken |
| [patchy-colivara-rag](patchy-colivara-rag/Colivara-deepseek-website-RAG/README.md) | 4 Dateien, 14.762 Bytes | Website-Screenshot → ColiVara-Retrieval → Janus-Antwort; zusätzliche externe Komponenten erforderlich |
| [adil-hybrid-rag](adil-hybrid-rag/projects/02-hybrid-rag-over-notion/README.md) | 13 Dateien, 8.670 Bytes | Ausdrücklich **Skeleton**: Projektstruktur und Evaluationsgerüst, kein fertiges Notion-RAG |

Zusammen: 35 Originaldateien, 118.532 Bytes. Hinzu kommen diese eigene Anleitung und das Manifest. Deutlich unter der Grenze von 15 MB; keine Modelle, Videos, großen Datensätze, Binärdateien, virtuellen Umgebungen oder Git-Verzeichnisse wurden übernommen. `golden.jsonl` enthält ausschließlich zwei 244 Bytes große Platzhalterfälle (`REPLACE_WITH_REAL_INPUT`), keine realen Notiondaten.

## Herkunft und Lizenzprüfung

Die vollständigen rekursiven GitHub-Dateibäume waren beim Abruf nicht abgeschnitten. Die Root-Lizenz wurde jeweils direkt von der festen Raw-URL gelesen: [patchy631 MIT](https://raw.githubusercontent.com/patchy631/ai-engineering-hub/042aeb5067384981eeba6a07fa882f436bb1660d/LICENSE), Copyright 2024 patchy631; [Adil Shamim MIT](https://raw.githubusercontent.com/AdilShamim8/GenAI-Roadmap-with-Notes-and-Projects/ecd9484ce791ab5f63d397b488deba9517b9ad3b/LICENSE), Copyright 2026 Adil Shamim. In den ausgewählten Ordnern und ihren übergeordneten Verzeichnissen wurden keine abweichenden Lizenzdateien gefunden. Eine andere Lizenz im nicht übernommenen `kitops-mcp`-Teilbaum gilt nicht für diese Auswahl.

MIT erlaubt die Übernahme mit erhaltenem Copyright- und Lizenztext. Externe Dienste, Modellgewichte, Webseiteninhalte und in alten Notebookausgaben zitierte Fremdtexte erhalten dadurch keine zusätzliche Freigabe. Upstream-Werbung, Newsletterlinks und gespeicherte Notebookausgaben sind Teil der unveränderten Quellen und keine Empfehlung des Kurses. Unlizenzierte oder nicht eindeutig freigegebene Alternativen wie Matre5/Football_Video_Analysis, maarthala- oder ZTM-Quellen wurden nicht kopiert. Für praktische Fußballarbeit zuerst den eigenständigen Starter und die Kursprojekte im übergeordneten Beispielverzeichnis nutzen.

## Lesen und späteres Starten

Es wurden **keine fremden Programme importiert oder ausgeführt**, keine Pakete installiert und keine Modelle oder Dienste gestartet. Die folgenden Befunde stammen aus statischem Lesen; eine funktionierende Laufzeit wird nicht zugesichert. Für einen eigenen Versuch zuerst eine separate Arbeitskopie anlegen, damit Original und Manifest prüfbar bleiben. Die Upstream-Startbefehle stehen in der jeweiligen README; Installation und Netzwerknutzung gehören erst zu einem bewussten späteren Versuch.

- **Agentic RAG:** `pyproject.toml` fordert Python `>=3.10,<=3.13` und CrewAI `>=0.86,<1.0`; die README empfiehlt Python 3.11+. Weitere importierte Pakete umfassen Streamlit, MarkItDown, Chonkie, Qdrant und Embedding-Komponenten; sie sind nicht vollständig im pyproject deklariert. Die Ollama-Varianten erwarten einen Server auf `localhost:11434` mit `deepseek-r1:7b` beziehungsweise `llama3.2`. Je nach Variante werden Firecrawl, Serper, OpenAI oder in Notebooks Groq/Tavily samt Schlüsseln benötigt. Diese Dienste, Schlüssel, Modelle und die Eingabe-PDF sind hier nicht bereitgestellt. Statische Blocker: `FireCrawlWebSearchTool` wird importiert, fehlt aber in `custom_tool.py`; `crew.py` übergibt `pdf=`, obwohl `DocumentSearchTool` `file_path` erwartet, und enthält einen absoluten Autorenpfad. `app.py` und `app_llama3.2.py` referenzieren `assets/crewai.png`, das selbst im ausgewählten Upstream-Ordner nicht existiert. Das ist kein sofort startfertiger Stand.
- **ColiVara/Janus:** laut README Python 3.11+, Streamlit, ColiVara, Firecrawl, Transformers und weitere Pakete; der Code importiert zusätzlich unter anderem Torch, Pillow, requests, FPDF und pdf2image. Janus ist ein separat zu beschaffendes externes Projekt, nicht Bestandteil dieses Ausschnitts. ColiVara und Firecrawl benötigen eigene Konten/Schlüssel; Janus-Pro-1B benötigt separat zu prüfende Gewichte und passende Hardware. Ein vollständiger Lockfile fehlt. Das ausgeschlossene `assets/deep-seek.png` wird beim UI-Aufbau geöffnet und muss vor einem Versuch wiederhergestellt werden. `trust_remote_code=True` lädt fremden Modellcode; feste Dateinamen wie `tempfile.jpeg`, `image.png` und `screenshot_slices.pdf` sind für parallele Sitzungen ungeeignet. Die Suche greift ohne Leerprüfung auf den ersten Treffer zu.
- **Hybrid RAG:** Python >=3.11 und die im pyproject genannten API-/Validierungspakete; für Makefile-Befehle ist zusätzlich `make` nötig. `src/main.py` druckt nur eine Implementierungsaufforderung. Notion, Chunking, Vektorsuche, BM25, Reranking und FastAPI sind als Ziel beschrieben, hier aber nicht implementiert. Der Evaluationsrunner liefert konstant `REPLACE_WITH_AGENT_OUTPUT`; die beiden Golden-Fälle verlangen nur `REPLACE` und können deshalb ohne echtes RAG bestehen. Die Smoke-Tests prüfen `assert True`. Die genannten Qualitätsmetriken werden nicht berechnet. Docker-/Deploymenttexte sind illustrative Gerüste, kein geprüfter Betrieb.

Die `.env.example`-Dateien enthalten nur Platzhalter; eine Musterprüfung auf verbreitete Schlüssel-/Private-Key-Formate fand keine entsprechenden Zugangsdaten. Das ersetzt keine vollständige Geheimnisprüfung. Die Notebooks enthalten alte Autorenpfade, Logs und Web-/Dokumentauszüge; gespeicherte Antworten sind keine neue Ausführung und kein Qualitätsnachweis. Netzwerk- und Modellaufrufe können Texte an Dritte übertragen und Kosten verursachen. Vor einem eigenen Versuch ausschließlich freigegebene Testinhalte verwenden.

## Auslassungen und Wiederherstellung

Das Manifest führt jede ausgelassene Datei aus den drei gewählten Teilbäumen mit ursprünglichem Pfad, fester `sourceUrl`, Größe und Grund auf: Agentic-RAG-Eingabe-PDF, Thumbnailbilder, kleine UI-Bilder und ColiVara-Demovideo. Nicht enthalten sind außerdem alle übrigen Repositoryordner sowie externes Janus, Modelle, Dienste und Zugangsdaten. Bestehende fehlende Upstream-Dateien sind keine hier vorgenommenen Auslassungen.

Zum Wiederherstellen einer ausgelassenen Datei deren `sourceUrl` aus `excluded` als rohe Bytes herunterladen und in einer **Arbeitskopie** unter `<localPath>/<path>` ablegen. Vorher Rechte und Bedarf prüfen; Video und PDF gehören nicht zum Quellcodeumfang. Nicht `main` verwenden: die URL muss die im Manifest fixierte Revision enthalten. Für die 35 aufgenommenen Dateien kann derselbe Vorgang mit `files[].sourceUrl` erfolgen; anschließend müssen Größe und SHA-256 übereinstimmen. Das Manifest selbst ist eine eigene Erfassungsdatei und kein Upstream-Original.

## Lernweg und Prüfung

Zuerst im Hybrid-Gerüst verfolgen, welche Behauptungen README, Platzhalterantwort und Test tatsächlich tragen. Danach im Agentic-Beispiel Datenfluss und Toolvertrag vergleichen; zuletzt im ColiVara-Beispiel Retrieval, Bilddatei und Generierung nachzeichnen. Für Fußballnotizen anschließend in einer eigenen Implementierung Quellenzugriff, Enthaltung und manuell geprüfte Referenzfälle ergänzen. Eine Modellantwort allein ist kein Nachweis sportlicher Richtigkeit.

Validiert wurden Dateigrößen und SHA-256 aller 35 lokalen Originaldateien gegen den Erfassungsstand sowie erneut heruntergeladene Bytes von allen 35 festen Raw-URLs. JSON und Notebook-JSON wurden ausschließlich geparst. Keine Upstream-Tests, Installationsbefehle, Docker-Builds, Modell- oder API-Aufrufe wurden ausgeführt.
