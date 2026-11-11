# Saison-Dashboard

Dieses Gerüst führt dich zu einer eigenen Auswertung für die laufende
Kickbase-Saison. Du schreibst API-Client, Bereinigung, Speicherung und Oberfläche
selbst. Die vollständigen Beispiele unter `examples/` behandeln andere Probleme;
die Funktionen unter `src/season_dashboard/` sind deine Arbeitsdateien.

Die Website erklärt die Grundlagen. Hier arbeitest du in deiner IDE. Im
Website-Download enthält `LERNWEG.md` alle Aufgaben, Quellen und Hilfestufen auch
zum Nachschlagen ohne Website. Beim direkten Klonen stehen die Arbeitsaufträge
auf der Website unter Projektweg; `coach.py` zeigt dir die zugehörigen Dateien.

## Anfangen

Öffne diesen Ordner in deiner IDE. Python 3.11 oder neuer genügt; zunächst brauchst
du keine Pakete zu installieren. Alle Befehle laufen aus diesem Ordner:

```sh
python coach.py --list
python coach.py --stage api
python examples/http_results.py --help
```

`python examples/http_results.py` ruft echte öffentliche OpenLigaDB-Spiele des
aktuellen Bundesliga-Spieltags ab. Mit `--season JAHR` wählst du die Saison über
ihr Startjahr. Prüfe die Antwort auf Abdeckung und Datum. Sie enthält keine
Kickbase-Punkte. Netzwerkfehler sind ein möglicher Ausgang, keine Übung mit
absichtlich erfundenen Live-Daten.

## Arbeitsweise

1. Baue auf der Website die Grundlage auf, die dir für den Abschnitt fehlt.
2. Formuliere deine Erwartung, bevor du das Vergleichsbeispiel ausführst.
3. Untersuche nur die genannte Funktion oder Codestelle. Schließe die Vorlage
   und übertrage das Prinzip auf deine eigene Datei.
4. Prüfe einen normalen Fall und ein Gegenbeispiel. Notiere Erwartung,
   beobachtete Abweichung und vermutete Ursache. Schreibe deine Prüffälle selbst.
5. Nutze bei Bedarf einen Denkanstoß. Nach der Korrektur wiederholst du den Fall
   und am nächsten Tag eine Abwandlung ohne Vorlage.

Bitte bei einer Rückfrage zunächst um eine Diagnosefrage oder einen Hinweis.
Eine fertige Antwort lässt sich schwerer von deinem eigenen Verständnis trennen.
`coach.py` liest nur die Struktur der Dateien. Es meldet offene Platzhalter und
führt weder deine Module noch eine Anmeldung aus. Kein Platzhalter bedeutet
nicht, dass die Funktion fachlich geprüft ist.

## Abschnitte und Lesestellen

| Abschnitt   | Deine Datei                         | Vorbild und konkrete Lesestelle                                                                                                                                                      |
| ----------- | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `api`       | `client.py`                         | `examples/http_results.py`; [HTTPX QuickStart](https://github.com/encode/httpx/blob/master/docs/quickstart.md): JSON, Status, Header und Timeout                                     |
| `auth`      | `auth.py`                           | [Kickbase Analytics](https://github.com/noltinho/kickbase-analytics/blob/main/fetch.py): `load_credentials`, `KickbaseClient.login`, `get`                                           |
| `cleaning`  | `cleaning.py`                       | `examples/clean_inventory.py`; [derselbe Import](https://github.com/noltinho/kickbase-analytics/blob/main/fetch.py): `extract_season`, `parse_minutes_num`                           |
| `identity`  | `identity.py`                       | [pandas Merge Guide](https://pandas.pydata.org/docs/user_guide/merging.html): `validate`, `indicator` und vervielfachte Schlüssel                                                    |
| `storage`   | `storage.py`                        | `examples/sqlite_weather.py`; [Data Engineering Lab](https://github.com/maarthala/data-engineering-lab/blob/main/azure/demo/dags/demo_sales_pipeline.py): `bronze`, `silver`, `gold` |
| `metrics`   | `metrics.py`                        | [pandas-Zeitreihenbeispiel](https://github.com/pandas-dev/pandas/blob/main/doc/source/getting_started/intro_tutorials/09_timeseries.rst): Zeitraum vor Aggregation festlegen         |
| `dashboard` | `dashboard.py` und deine Oberfläche | [Streamlit-Demoprojekt](https://github.com/streamlit/demo-self-driving/blob/master/streamlit_app.py): `main`, `run_the_app`, Datenladen und Auswahl                                  |
| `transfer`  | Dein gewählter Bereich              | Eine eigene Managerfrage, dein Fehlerprotokoll und ein neuer Gegenbeweis                                                                                                             |

Die Beispiele im Ordner sind eigenständig geschrieben. Externer Quellcode wird
als Lesestelle verlinkt, nicht als geprüfte Lösung deines Projekts übernommen.
Beim Streamlit-Beispiel interessiert die Aufteilung; Bildmodelle, alte Paketstände
und die fremden Daten brauchst du nicht zu installieren. Das Data Engineering Lab
zeigt die Reihenfolge von Aufgaben; Azure und Airflow sind hier nicht nötig.

## Aktuelle Daten und eigener Account

Im Gerüst liegen keine erfundenen Spieler, die als aktueller Datenstand ausgegeben
werden. Die Lager- und Wetterwerte der Vergleichsbeispiele sind ausdrücklich
erfunden. Für die späteren Auswertungen benötigst du erlaubte eigene aktuelle
Kickbase-Daten und gegebenenfalls einen Statistik-Feed für dieselben Partien.

Die [Kickbase-Community-Dokumentation](https://github.com/kevinskyba/kickbase-api-doc)
ist keine offizielle Freigabe. Prüfe die aktuellen
[Nutzungsbedingungen](https://www.kickbase.com/de/terms-conditions/general) für den
geplanten Zugriff. Bis der Zugriff geklärt ist, bleibt der echte Verbindungsnachweis
offen. Transport-Doppel prüfen Softwareverhalten, keine tatsächliche Anbindung.

Du implementierst die Anmeldung selbst. Spätere Zugangsdaten gibst du nur lokal
ein, etwa mit `getpass`; sie gehören weder in Chat noch Git, URL, Protokoll oder
Ausgabedaten. Lege eigene Rohdaten und Datenbanken unter `private_data/` ab. Die
Datei `.env.example` enthält nur leere Konfigurationsplätze. Ein `.env`-Import ist
noch nicht implementiert. Bevor du etwas teilst, prüfe auch Export und Logs.

Die Funktionsverträge beschreiben dein eigenes Zielschema. Eine echte API-Antwort
kann andere Felder und Einheiten haben. Verbinde Spieler und Partien über geprüfte
Zuordnungen und bewahre Quelle, Saison sowie Abrufzeit auf. Die Oberfläche soll bei
einem Abruffehler den letzten brauchbaren Datenstand mit dessen Alter zeigen.

## Git parallel zum Projekt lernen

Die Website enthält die Kapitel zu Git-Grundlagen, Branches, Konflikten,
Teamarbeit, Releases und Datenversionierung. Das lokale Labor ergänzt acht
Arbeitsrunden mit einem echten lokalen Remote und zwei Arbeitskopien.

```powershell
python git_lab.py
python git_lab.py --round 1
python git_lab.py --help
```

Diese Aufrufe zeigen nur Aufgaben. Wenn du das Labor anlegen möchtest, wähle
einen **neuen Ordner außerhalb bestehender Repositories**, zum Beispiel:

```powershell
python git_lab.py --init C:/03_Dev/Projects/Matchplan-Git-Labor
```

Nur dieser ausdrückliche Aufruf erzeugt ein lokales Bare-Repository `remote.git`,
die Arbeitskopien `analyst` und `reviewer` sowie einen Startcommit. Ein bestehender
Zielordner wird abgelehnt. Es gibt keinen Netzwerkzugriff, keine Anmeldung und
keine Änderung deiner globalen Git-Konfiguration. Bei einem Abbruch bleibt ein
begonnener Ordner zur Prüfung stehen.

Starte mit der Index-/Commit-Runde, bevor du den API-Client umsetzt. Nach der
Datenbereinigung übst du Branches und Konflikte. Beim Speichern und Auswerten
ergänzt du den Datenstand zum Code-Commit. Vor der Dashboard-Abgabe folgen
Review, Integration und Release-Nachweis. Die detaillierten Aufträge zeigt
`--round 1` bis `--round 8`; eine Runde schaltet nichts automatisch als bestanden frei.

Für KI-Hilfe: Beschreibe zuerst deinen Branch, den Status und dein erwartetes
Ergebnis. Bitte um eine Diagnosefrage. Lass dir vor einer History-Änderung erklären,
welche Verweise und Dateien der Befehl verändern würde. Die KI soll deine echten
Zugangsdaten oder privaten Ligadaten nicht erhalten.

## Eigene Tests

Lege deine Prüffälle unter `tests/` an. Für Imports aus `src/` kannst du in deinem
Testmodul den Projektpfad ausdrücklich ergänzen oder das Paket selbst installierbar
machen. Wähle pro Schritt einen handgerechneten Fall und einen Fehlerfall. Führe
deine Tests dann mit `python -m unittest discover -s tests -v` aus. Eine absichtlich
offene Funktion wirft `NotImplementedError`; das ist dein Startpunkt.

Eigener Beispielcode unter MIT; siehe die Lizenz des Hauptprojekts. Im ZIP liegt
der Lizenztext bei. Externe Daten und verlinkte Projekte haben eigene Bedingungen.
