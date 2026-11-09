# Recherche: Grundlagen für die Fußball-Lernwebsite

Prüfdatum: 9. November 2026. Ergebnis ist die eigenständig verfasste deutsche Erweiterung in `src/course/reference-foundations.ts`: fünf Kapitel, jeweils drei Abschnitte mit zwei vollständigen Erläuterungsabsätzen und einem eigenen nachvollziehbaren Beispiel. Die Quellen liefern Themenauswahl und methodische Anregungen. Weder ihre Texte noch ihre umfangreichen Implementierungen wurden in den Kurs übernommen. Die Beispiele sind Referenzcode mit erklärten Ausgaben, keine automatisch bewerteten Aufgaben.

## Vorgehen und Reichweite

Die öffentliche GitHub REST API wurde lesend für Repository-Metadaten, Default-Branch, dessen Commit und rekursive Dateibäume genutzt. Dateien wurden lesend über `raw.githubusercontent.com` abgerufen. Es wurde kein heruntergeladener Fremdcode ausgeführt, installiert oder in die lokale Anwendung eingebunden. Zunächst wurden die tatsächlichen Commit-IDs bestimmt. Einige nachfolgende Textabrufe verwendeten `HEAD`; die nachstehenden Belege verweisen auf die beim Recherchebeginn festgehaltenen Revisionen. Es wurde keine lückenlose Prüfung aller Dateien, externen Kursangebote oder Datensätze vorgenommen.

Bei OSSU, Data Folks, SADS, Zero to Mastery und Build Your Own X meldete die Tree-API ausdrücklich `truncated: false`. Die Dateinamen wurden auf Lizenzdateien und übliche Python-Manifeste wie requirements, environment.yml, pyproject oder setup.py geprüft. Beim wesentlich größeren Data Engineering Lab wurden der rekursive Dateibaum und konkrete Setup-, Anforderungs- und Beispieldateien gezielt untersucht. Das Fehlen einer gefundenen Lizenz wird als unbekannte Lizenz behandelt, nicht als Erlaubnis zur Übernahme. Die Lizenz eines Verzeichnisses oder einer Linksammlung überträgt sich nicht automatisch auf verlinkte Kurse oder Daten.

## OSSU Data Science

- Default-Branch: `master`; Revision: `ccb52fe046fe3b61696083596278b36516fdb80b`.
- Geprüft: [README.md](https://github.com/ossu/data-science/blob/ccb52fe046fe3b61696083596278b36516fdb80b/README.md), [coursepages/intro-programming/README.md](https://github.com/ossu/data-science/blob/ccb52fe046fe3b61696083596278b36516fdb80b/coursepages/intro-programming/README.md), [LICENSE.md](https://github.com/ossu/data-science/blob/ccb52fe046fe3b61696083596278b36516fdb80b/LICENSE.md) und der vollständige Dateibaum.
- Lizenz: CC BY-SA 4.0 laut konkreter Lizenzdatei. Die Metadaten nennen lediglich `NOASSERTION`; die Datei ist der aussagekräftigere Nachweis.

Das README setzt Schulmathematik und Statistik voraus und trennt Programmierung, Algorithmen, Datenbanken, Analysis, lineare Algebra, Wahrscheinlichkeit und Machine Learning. Die Programmier-Unterseite konkretisiert Funktionen, Bedingungen, Schleifen, Fehler, Tests und Dateien. Das Repository ist ein Curriculum mit Verweisen, kein vollständig enthaltenes ausführbares Studienprogramm. Im Dateibaum wurde kein eigenes Python-Abhängigkeitsmanifest gefunden. Die verlinkten Kursinhalte und deren aktuelle Zugangsbedingungen wurden nicht separat geprüft.

Transfer: `study-foundations` erklärt Variablen, Funktionen, Datenstrukturen und CLI-Verträge; `study-data` konkretisiert relationales Schema und Schlüssel; `study-statistics` füllt vorausgesetzte Algebra, Ableitungen, Vektoren und Wahrscheinlichkeit mit selbst enthaltenen Rechnungen. Die neuen Texte übernehmen keine Abschluss-, Zeitplan- oder Berufserfolgsversprechen aus dem README. Voraussetzungen für die eigenen Übungen sind die vier Grundrechenarten und die Bereitschaft, kleine Python-Ausdrücke Schritt für Schritt nachzuvollziehen.

## Data Folks Data Science Learning Path

- Default-Branch: `main`; Revision: `1970e5b070ff99f74c3d5e715223e59345ba5b23`.
- Geprüft: [README.md](https://github.com/data-folks/data-science-learning-path/blob/1970e5b070ff99f74c3d5e715223e59345ba5b23/README.md), [LICENSE](https://github.com/data-folks/data-science-learning-path/blob/1970e5b070ff99f74c3d5e715223e59345ba5b23/LICENSE) und vollständiger Dateibaum.
- Lizenz: MIT, Copyright 2021 Data Folks Indonesia. Der Lizenz-Badge-Link im README verweist auf einen anderen Pfad; maßgeblich für diesen Befund ist die tatsächlich vorhandene Datei `LICENSE`.

Die Sammlung gliedert Programmierung einschließlich Python, SQL und Shell, Mathematik und Statistik, Lernverfahren, ausdrücklich getrennte Bewertungsmetriken und weitere Anwendungen. Sie enthält keine eigenen Notebooks oder ausführbaren Beispielprogramme und kein Laufzeitmanifest. Die extern verlinkten Implementierungen wurden nicht geprüft. Daher wird hier keine Lauffähigkeit oder Qualität dieser Fremdangebote behauptet.

Transfer: Die Trennung von Verfahren und Bewertung wird in `study-science` zu Zieldefinition, Baseline und Brier-Rechnung. `study-data` stellt SQL-Operationen ihrer fachlichen Bedeutung gegenüber. Mathematik wird in `study-statistics` an einem Skalarprodukt und einem einzelnen Gradientenschritt erläutert. Der gesamte Deep-Learning- und Deployment-Katalog wird bewusst nicht als Voraussetzung für eine erste Fußballanalyse behandelt.

## Data Engineering Lab

- Default-Branch: `main`; Revision: `457da5f0a3d7a63f7e25d510f263f004beb0b5e7`.
- Geprüft: [Readme.md](https://github.com/maarthala/data-engineering-lab/blob/457da5f0a3d7a63f7e25d510f263f004beb0b5e7/Readme.md), [local/README.md](https://github.com/maarthala/data-engineering-lab/blob/457da5f0a3d7a63f7e25d510f263f004beb0b5e7/local/README.md), [common/dockerfiles/add/requirements.txt](https://github.com/maarthala/data-engineering-lab/blob/457da5f0a3d7a63f7e25d510f263f004beb0b5e7/common/dockerfiles/add/requirements.txt), [azure/demo/dags/demo_sales_pipeline.py](https://github.com/maarthala/data-engineering-lab/blob/457da5f0a3d7a63f7e25d510f263f004beb0b5e7/azure/demo/dags/demo_sales_pipeline.py) und [azure/demo/notebooks/demo_02_silver.ipynb](https://github.com/maarthala/data-engineering-lab/blob/457da5f0a3d7a63f7e25d510f263f004beb0b5e7/azure/demo/notebooks/demo_02_silver.ipynb).
- Lizenz: unbekannt; die GitHub-Metadaten enthalten keine erkannte Lizenz und im untersuchten Dateibaum wurde keine repositoryweite LICENSE gefunden.

Das lokale Setup nennt Docker mit Compose v2, mindestens 8 GB Docker-RAM, ungefähr 25 GB freien Speicher und Werkzeuge wie git, make, curl, unzip, ruby und python3. Windows wird über den genannten WSL-Weg eingeordnet. Der Stack kombiniert unter anderem Spark, Trino, Airflow, Jupyter, PostgreSQL und einen Iceberg-Katalog. Die konkret geprüfte Anforderungsdatei pinnt `apache-airflow-providers-apache-spark==6.3.2`, `pyspark-client==4.1.3`, `papermill==2.7.0`, `ipykernel==7.3.0` und `jupyter==1.1.1`; ein Kommentar fordert die Übereinstimmung von Spark-Client und Server. Das ist eine Teilanforderungsdatei, keine vollständige Reproduzierbarkeitsprüfung aller Images.

Der Demo-DAG führt Bronze, Silver und Gold nacheinander aus. Das Silver-Notebook entfernt Duplikate, konvertiert Typen und Datumsformate, normalisiert Text und separiert ungültige Zeilen. Gute Zeilen werden nochmals anhand `order_id` dedupliziert und in Iceberg geschrieben. Diese Betrachtung belegt konkrete Transformationsschritte, aber keine vollständige Korrektheit des Gesamtsystems. Bei widersprüchlichen Zeilen mit gleicher `order_id` macht `dropDuplicates` allein keine fachlich erklärte neueste Revision aus. Auch die tatsächliche Vollständigkeit der Rejects und sämtliche NULL-Fälle wurden nicht ausgeführt oder abschließend geprüft.

Transfer: `study-engineering` erläutert ETL-Zustände, Fehlerbilanzen, Revisionen, Konflikte und Transaktionen mit eigenem Standardbibliothekscode. Das eigene Importbeispiel verwendet eine explizite höhere Revision und bricht bei widersprüchlichen identischen Revisionen ab. Es kopiert keine unbestimmte Gewinnerregel. Die Kursübungen erfordern keinen Betrieb des Stacks. Die Setup-Anleitung erwähnt automatisches Committen und Pushen von Notebooks bei entsprechender Konfiguration; diese Funktion wurde weder eingerichtet noch ausgelöst. Cloud- und Terraform-Unterprojekte wurden nicht provisioniert oder auf Kosten untersucht.

## Sports Analytics and Data Science (SADS)

- Default-Branch: `master`; Revision: `635c6657d81a72d714b9383c7e1c3b6465a987cc`.
- Geprüft: [README.md](https://github.com/mtpa/sads/blob/635c6657d81a72d714b9383c7e1c3b6465a987cc/README.md), [SADS_Appendix_A/sads_exhibit_A_1.py](https://github.com/mtpa/sads/blob/635c6657d81a72d714b9383c7e1c3b6465a987cc/SADS_Appendix_A/sads_exhibit_A_1.py), [SADS_Chapter_7/sads_exhibit_7_2.py](https://github.com/mtpa/sads/blob/635c6657d81a72d714b9383c7e1c3b6465a987cc/SADS_Chapter_7/sads_exhibit_7_2.py), [SADS_Chapter_6/sads_exhibit_6_2.py](https://github.com/mtpa/sads/blob/635c6657d81a72d714b9383c7e1c3b6465a987cc/SADS_Chapter_6/sads_exhibit_6_2.py) und vollständiger Dateibaum.
- Lizenz: unbekannt; keine LICENSE und kein Lizenzhinweis im sehr knappen README gefunden.

Das Anscombe-Beispiel erstellt vier Regressionen und Streudiagramme. Die Zuschaueranalyse für die Dodgers verwendet Gruppierungen nach Wochentag und Monat, einen Zufallssplit und eine lineare Formel mit Promotion. Ihr ausgegebener Testwert ist quadrierte Korrelation zwischen Beobachtung und Vorhersage, nicht ohne weitere Bedingungen der übliche Out-of-Sample-R²-Wert relativ zur Referenzvorhersage. Eine kausale Wirkung wird durch diese Formel allein nicht identifiziert. Das MDS-Beispiel verarbeitet eine vorgegebene Dissimilaritätsmatrix; eine zweidimensionale Karte ist damit eine Modellrepräsentation, keine direkt beobachtete räumliche Wahrheit.

Aus Imports ergeben sich exemplarisch pandas, NumPy, SciPy, statsmodels, Matplotlib und scikit-learn. Es wurde kein versioniertes Abhängigkeitsmanifest gefunden. Das Zuschauerprogramm enthält `future_builtins` und `pandas.tools.rplot`; diese alten Imports sind ein konkreter Grund, aktuelle Lauffähigkeit nicht zu versprechen. Das MDS-Programm importiert `linear_kernel` unter dem Namen `cosine_distances`, verwendet diesen Import im gezeigten MDS-Ablauf aber nicht. Diese Namenswahl wird nicht als fachliche Definition einer Kosinusdistanz übernommen.

Transfer: `study-statistics` nutzt eigene kurze Wertelisten mit gleichem Mittelwert und unterschiedlicher Varianz, erklärt Bedingung und Ursache getrennt und fordert Einzelwerte neben Summenkennzahlen. `study-science` übernimmt die Notwendigkeit von Einzelbeispielkontrollen. Keine Buchkapitel, CSV-Daten oder Originalprogramme wurden eingebettet. Die Datensatzlizenzen wurden nicht unabhängig geklärt.

## Zero to Mastery Machine Learning

- Default-Branch: `master`; Revision: `81492352d12d7a52caef57bba7744cbdc34af33f`.
- Geprüft: [README.md](https://github.com/mrdbourke/zero-to-mastery-ml/blob/81492352d12d7a52caef57bba7744cbdc34af33f/README.md), [docs/a-6-step-framework-for-approaching-machine-learning-projects.md](https://github.com/mrdbourke/zero-to-mastery-ml/blob/81492352d12d7a52caef57bba7744cbdc34af33f/docs/a-6-step-framework-for-approaching-machine-learning-projects.md), ausgewählte Zellen aus [docs/end-to-end-heart-disease-classification.ipynb](https://github.com/mrdbourke/zero-to-mastery-ml/blob/81492352d12d7a52caef57bba7744cbdc34af33f/docs/end-to-end-heart-disease-classification.ipynb) sowie vollständiger Dateibaum.
- Lizenz: unbekannt; keine repositoryweite LICENSE im untersuchten Baum gefunden.

Das Rahmenpapier trennt Problem, Daten, Bewertung, Merkmale, Modellierung und Experimente. Das exemplarisch gelesene Notebook importiert NumPy, pandas, Matplotlib, seaborn und scikit-learn; es zeigt einen zufälligen 80/20-Split, mehrere Klassifikatoren und deren Vergleich anhand des als Test bezeichneten Bestands. Der Text bespricht Validierung und Cross-Validation. Diese Beobachtung ist kein Audit jeder späteren Notebookzelle und keine Ausführung der Modelle. Das Versionsausgeben im Notebook ist keine feste, vollständig getestete Umgebungsdefinition; im Dateibaum wurde kein übliches Python-Abhängigkeitsmanifest gefunden.

Transfer: `study-science` übernimmt die Projektstruktur mit eigenen Fußballbeispielen, trennt aber ausdrücklich Auswahl auf Validierungsdaten von einer einmaligen Abschlussbewertung. Ganze Spiele werden zeitlich zugeordnet. Das verhindert die unkritische Übertragung eines medizinischen Zufallssplits auf die Vorhersage zukünftiger Matches. Trainingsabhängige Aufbereitung wird an einer Mittelwertersetzung erklärt. Die medizinischen Labels und Daten werden weder übertragen noch als Beratung verwendet; die Kursseiten und bezahlten Videoinhalte wurden nicht vollständig geprüft.

## Build Your Own X

- Default-Branch: `master`; Revision: `b2daa235c4fb774402d219c48adfea2a81d94ce7`.
- Geprüft: [README.md](https://github.com/codecrafters-io/build-your-own-x/blob/b2daa235c4fb774402d219c48adfea2a81d94ce7/README.md), insbesondere Einführung und Rubriken Command-Line Tool, Database und Web Server; vollständiger Dateibaum.
- Lizenz: unbekannt; keine LICENSE im untersuchten Baum gefunden.

Es handelt sich um eine Sammlung externer Anleitungen, nicht um eine einheitliche Implementierung. Ein eigener ausführbarer Kern, Anforderungen oder Notebooks sind im Dateibaum nicht vorhanden. Die gelisteten Projekte erfordern unterschiedliche Sprachen und Systeme; es gibt keine aus dieser Sammlung ableitbare gemeinsame Laufzeitumgebung. Weder die externen Anleitungen noch deren Code, Lizenz oder aktuelle Erreichbarkeit wurden einzeln geprüft.

Transfer: `study-foundations` verwendet die Idee des kleinen Eigenbaus für ein eigenes `argparse`-Kommando mit klarer Fachfunktion. `study-engineering` verbindet den Mechanismus einer atomaren Änderung mit einem minimalen SQLite-Beispiel. Es wird nicht verlangt, eine Datenbank oder einen Webserver vollständig neu zu implementieren, um die Fußballanalyse zu beginnen.

## Integration, eigene Beispiele und Prüfung

Die Exportnamen entsprechen dem Integrationsvertrag: `foundationEnrichment` und `foundationSources`. Kapitel-IDs sind ausschließlich `study-foundations`, `study-data`, `study-statistics`, `study-engineering` und `study-science`. Es gibt keine Imports und damit keine Abhängigkeit auf die Laufzeitwerte von `course-study.ts`. Alle Quellen erhalten nachvollziehbare Prüfpfade, Lizenzstatus und relevante Kapitelzuordnungen. Bestehende Kursinhalte wurden als Kontext gelesen; fremde oder bestehende Dateien wurden in diesem Teilauftrag nicht verändert.

Alle 15 selbst geschriebenen Codebeispiele wurden einzeln als Python-Code ausgeführt und ihre gesamte Standardausgabe gegen `expected` verglichen: 15 von 15 stimmen überein. Verwendet wurden ausschließlich Python-Standardbibliotheken, einschließlich `sqlite3`, und eigene konstante Eingaben. Wichtige Kontrollwerte sind 3,0 Aktionen pro 90 Minuten; SQL-Zählung `(2, 1)`; Left-Join-Bilanz `(3, 2)`; laufende Summen `[(1, 0), (2, 1), (3, 1)]`; logistischer Wert 0,5; ein Optimierungsschritt zu 0,60 mit Verlust 5,76; Standardfehler 0,089 und 0,018; Varianzen 8 und 0; eine akzeptierte und zwei verworfene ETL-Zeilen; ein korrigierter Datensatz auf Revision 2; Rollback zum Wert 0; Brier-Werte 0,250 und 0,025; Trainingsmittelwert 3; absolute illustrative Testverbesserung 0,02.

Die isolierte Typprüfung bestand mit `npx tsc --ignoreConfig --noEmit --skipLibCheck --target ES2022 --module ESNext --moduleResolution bundler src/course/reference-foundations.ts`. Die hier installierte TypeScript-Version verlangt `--ignoreConfig`, wenn eine Datei ausdrücklich angegeben wird. Die Beispielprüfung importierte das eigene TypeScript-Datenmodul über Node.js und startete für jedes eigene Beispiel einen Python-Prozess. Es wurde kein Fremdcode aus den Quellen ausgeführt.

Grenzen: Der vollständige Website-Build, die visuelle Darstellung und die übrigen Agentenänderungen sind Verantwortung der Integration. Die eigenen Beispiele sind bewusst klein und deterministisch. Sie beweisen die angegebenen Rechnungen und illustrieren Verträge; sie sind weder eine empirische Evaluation auf realen Fußballdaten noch ein Nachweis der Lauffähigkeit der sechs Fremdrepositories.
