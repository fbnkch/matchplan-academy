import type { JourneyStep, TransferReference } from './course';

const httpReference: TransferReference = {
  title: 'HTTPX: ein API-Client im Aufbau',
  url: 'https://github.com/encode/httpx/blob/master/docs/quickstart.md',
  section: 'JSON Response Content, Custom Headers, Response Status Codes und Timeouts',
  observe:
    'Verfolge Anfrage, Statusprüfung und JSON-Dekodierung getrennt. Ein gültiges JSON allein macht eine Antwort noch nicht erfolgreich.',
  adapt:
    'Übertrage die Trennung auf deinen Client. HTTPX ist optional; das Gerüst startet mit der Standardbibliothek. Endpunkte und Antwortfelder gehören zum jeweiligen Anbieter.',
};

const apiReference: TransferReference = {
  title: 'OpenLigaDB: Beispiele für echte Spielplandaten',
  url: 'https://github.com/OpenLigaDB/OpenLigaDB-Samples',
  section: 'README: verfügbare REST-Aufrufe und Matchdaten',
  observe:
    'Suche den Abruf für eine Liga und Saison. Notiere, woran du Wettbewerb, Spiel und Abschlussstatus erkennst.',
  adapt:
    'Nutze die öffentliche API, um deinen Transport mit echten Daten zu prüfen. Sie liefert keine Kickbase-Punkte oder vollständigen Spielerstatistiken.',
};

export const seasonSteps: JourneyStep[] = [
  {
    id: 'study-season-api',
    title: 'Eine echte API lesen und nachbauen',
    result:
      'Dein eigener Client liest öffentliche Spielplandaten und unterscheidet Datenfehler von Verbindungsfehlern.',
    question: 'Wo endet der HTTP-Abruf, und wo beginnt die Bedeutung der Fußballdaten?',
    concepts: [
      {
        title: 'Vom Beispiel zum Vertrag',
        text: 'Du untersuchst einen funktionierenden Abruf und formulierst daraus den Vertrag für get_json. Erst danach schreibst du deinen Client ohne die Vorlage daneben.',
      },
      {
        title: 'Aktuelle Saison',
        text: 'Wettbewerb und Saison sind Eingaben. Prüfe die tatsächliche Abdeckung der Antwort. Ein leerer Datensatz bedeutet nicht, dass keine Spiele stattgefunden haben.',
      },
    ],
    assignment: [
      'Lade das Saisonprojekt herunter. Starte python coach.py --list und zeichne den Weg vom Anbieter bis zur Anzeige.',
      'Lies das Git-Grundlagenkapitel und öffne python git_lab.py --round 1. Übe Index und Commit im separaten Labor, bevor du die erste API-Funktion änderst.',
      'Lies examples/http_results.py und die markierten Quellenabschnitte. Sage vor dem Start voraus, was bei Timeout, HTTP 401 und ungültigem JSON passieren soll.',
      'Implementiere get_json in src/season_dashboard/client.py. Führe denselben öffentlichen Abruf anschließend mit deinem eigenen Client aus.',
    ],
    checks: [
      'Du kannst einen echten Matchdatensatz mit Quelle und Abrufzeit zeigen.',
      'Timeout, Fehlerstatus und ungültiges JSON erscheinen als unterschiedliche Fehler; Zugangsdaten stehen in keiner Fehlermeldung.',
    ],
    folder: 'src/season_dashboard/client.py',
    command: 'python coach.py --stage api',
    hint: 'Schreibe zuerst auf, welche Eingaben dein Client braucht und welche Fehler der Aufrufer erkennen muss.',
    variant:
      'Nutze einen anderen öffentlichen JSON-Endpunkt. Der Client bleibt gleich; nur die fachliche Auswertung ändert sich.',
    recall:
      'Erkläre morgen ohne Vorlage, weshalb Statusprüfung vor der fachlichen Verarbeitung kommt.',
    practiceIds: ['de-contract'],
    studyChapterId: 'study-engineering',
    transfer: {
      support: 'Vorlage untersuchen, dann eine Funktion übertragen',
      references: [httpReference, apiReference],
      localExample: 'examples/http_results.py',
      prediction:
        'Welche Ausgabe erwartest du bei einer gültigen leeren Liste, und welche bei einem HTTP-Fehler?',
      hints: [
        'Lies nur den Abschnitt zur HTTP-Antwort, nicht das ganze Repository.',
        'Trenne Verbindungsaufbau, Statusprüfung und JSON-Dekodierung.',
        'Prüfe mit einer absichtlich unerreichbaren lokalen Adresse; mache dafür keine wiederholten Anfragen beim Anbieter.',
      ],
      feedback:
        'Notiere Eingabe, erwartetes Verhalten und den tatsächlichen Fehler ohne Zugangsdaten. Korrigiere einen Teil und wiederhole genau diesen Fall.',
    },
  },
  {
    id: 'study-season-auth',
    title: 'Den eigenen Account lesend anbinden',
    result:
      'Du kannst nach geklärtem Zugang eine erlaubte Anfrage für deinen eigenen Kickbase-Account ausführen und ein abgelaufenes Token erkennen.',
    question:
      'Welche Teile einer Anmeldung sind allgemein, und welche musst du an Kickbase prüfen?',
    concepts: [
      {
        title: 'Sitzung statt Passwortweitergabe',
        text: 'Du implementierst die Anmeldung lokal. Das Passwort gehört weder in Arbeitsnotizen noch in Chat, URL, Git oder Log. Die Website verlangt keine Zugangsdaten von dir.',
      },
      {
        title: 'Beobachten statt Antwortfelder erfinden',
        text: 'Die verlinkte Kickbase-Dokumentation stammt aus der Community. Prüfe den erlaubten Zugriff und die tatsächlich erhaltene Antwort, bevor du Feldnamen übernimmst. Bis dahin arbeitest du mit einem selbst geschriebenen Transport-Doppel.',
      },
    ],
    assignment: [
      'Untersuche an HTTPX, wie ein Client gemeinsame Header und eine Sitzung verwaltet. Beschreibe die Lebensdauer eines Tokens.',
      'Lies in der Community-Spezifikation nur Anmeldung und lesenden Ligazugriff. Kläre die Nutzungsbedingungen für deinen geplanten Abruf. Implementiere danach sign_in und extract_access_token in auth.py.',
      'Prüfe zunächst ohne echten Account: erlaubter Zugriff, abgelaufenes Token, verweigerte Antwort und verändertes Antwortschema. Nach geklärtem Zugang reicht ein einzelner eigener lesender Abruf als Nachweis.',
    ],
    checks: [
      'Eine Fehlermeldung enthält weder Passwort noch Token oder vollständige Anmeldeantwort.',
      'HTTP 401 startet keine endlose Wiederholung. Es gibt keine Gebote, Verkäufe oder Aufstellungsänderungen.',
      'Ohne geklärten Zugang bleibt der Live-Nachweis offen; ein simuliertes Ergebnis zählt nicht als Verbindung.',
    ],
    folder: 'src/season_dashboard/auth.py',
    command: 'python coach.py --stage auth',
    hint: 'Trenne Anmeldetransport und Auslesen des Tokens. Beide Teile lassen sich ohne echte Zugangsdaten untersuchen.',
    variant:
      'Ändere im Transport-Doppel das Tokenfeld. Deine Anwendung soll einen Schemafehler zeigen, statt sich als angemeldet auszugeben.',
    recall:
      'Erkläre den Unterschied zwischen einer gültigen Anmeldung, einem abgelaufenen Token und fehlender Berechtigung.',
    practiceIds: ['de-contract'],
    studyChapterId: 'study-engineering',
    transfer: {
      support: 'Zwei Quellen vergleichen, eigene Schnittstelle ableiten',
      references: [
        {
          title: 'Kickbase Analytics: Anmeldung eines ähnlichen Projekts',
          url: 'https://github.com/noltinho/kickbase-analytics/blob/main/fetch.py',
          section: 'load_credentials, KickbaseClient.login und KickbaseClient.get',
          observe:
            'Untersuche, wie Geheimnisse von der Konfiguration zum Login gelangen und wie der Client einen abgelaufenen Zugang behandelt. Lies nur diese Funktionen.',
          adapt:
            'Leite deinen eigenen kleinen Adapter ab. Threading, automatische Neu-Anmeldung und angenommene Antwortfelder übernimmst du nicht ungeprüft. Führe den fremden Client nicht mit deinen Zugangsdaten aus.',
        },
        {
          title: 'HTTPX: Client und gemeinsame Header',
          url: 'https://www.python-httpx.org/advanced/clients/',
          section: 'Why use a Client? und Sharing configuration across requests',
          observe:
            'Verfolge, wo Konfiguration und gemeinsame Header an einzelne Anfragen gelangen.',
          adapt:
            'Übertrage das Prinzip der Sitzung. Weder dieses Beispiel noch ein Browser-Login legt das aktuelle Kickbase-Antwortschema fest.',
        },
        {
          title: 'Kickbase: Community-Spezifikation',
          url: 'https://github.com/kevinskyba/kickbase-api-doc/blob/master/openapi_spec.json',
          section: '/v4/user/login und GET /v4/leagues',
          observe:
            'Vergleiche Methode, Request-Body und Authentifizierung. Behandle Antwortbeispiele als zu prüfende Beobachtungen.',
          adapt:
            'Baue einen lesenden Adapter für erlaubte eigene Zugriffe. Die Community-Spezifikation ist keine öffentliche API-Freigabe des Anbieters.',
        },
      ],
      prediction:
        'Was soll beim zweiten Abruf passieren, wenn das Token seit dem ersten Abruf abgelaufen ist?',
      hints: [
        'Schreibe die möglichen Ausgänge der Anmeldung auf.',
        'Gib deinem Transport-Doppel nacheinander Erfolg, 401 und eine unvollständige Antwort.',
        'Eine erfolgreiche HTTP-Antwort genügt nicht: Prüfe den Tokenvertrag, ohne seinen Wert zu protokollieren.',
      ],
      feedback:
        'Vergleiche deine Annahme mit dem beobachteten Antwortschema. Halte nur Feldnamen und Status fest, keine persönlichen Antwortdaten.',
    },
  },
  {
    id: 'study-season-cleaning',
    title: 'Rohdaten in einen eigenen Vertrag überführen',
    result:
      'Deine Bereinigung macht fehlende, ungültige und gültige Werte unterscheidbar und lässt die Rohdaten unverändert.',
    question:
      'Welche Werte darfst du umwandeln, und bei welchen würdest du eine Bedeutung erfinden?',
    concepts: [
      {
        title: 'Ein Vertrag für deine Anwendung',
        text: 'Anbieterfelder bleiben am Rand. Dahinter verwendest du verständliche Namen, Geld in Euro und IDs als Zeichenketten. Der Vertrag des Gerüsts ist dein Zielschema, keine Behauptung über die Live-API.',
      },
      {
        title: 'Fehlend ist nicht null',
        text: 'Keine beobachteten Punkte und ein Einsatz mit null Punkten sind verschieden. Negative Kickbase-Punkte sind möglich. Fehlerhafte Marktwerte dürfen nicht stillschweigend eine günstige Kaufempfehlung erzeugen.',
      },
    ],
    assignment: [
      'Untersuche examples/clean_inventory.py. Notiere, welche Entscheidungen allgemeine Datenprüfung sind und welche nur für Lagerbestände gelten.',
      'Erstelle eine kleine Tabelle mit Rohwert, Zielwert und Begründung. Implementiere normalize_players; bestätige das echte Quellschema erst mit einem erlaubten Snapshot.',
      'Schreibe Gegenbeispiele für fehlende Punkte, negative Punkte, doppelte IDs und einen ungültigen Marktwert. Zähle angenommene und zurückgewiesene Datensätze.',
    ],
    checks: [
      'Ein negativer Punktestand bleibt erhalten; fehlende Punkte werden nicht zu null.',
      'Doppelte Identitäten verschwinden nicht ohne dokumentierte Konfliktregel.',
      'Quelle, Saison und Abrufzeit bleiben nachvollziehbar; eine zweite Bereinigung verändert das Original nicht.',
    ],
    folder: 'src/season_dashboard/cleaning.py',
    command: 'python coach.py --stage cleaning',
    hint: 'Übertrage die Reihenfolge der Prüfungen, nicht die Fachregeln des Lagerbeispiels.',
    variant:
      'Ergänze ein zusätzliches Anbieterfeld und einen fehlerhaften Zahlenwert. Bestehende gültige Daten müssen weiterhin verarbeitet werden.',
    recall:
      'Nenne je ein Beispiel für fehlend, null und ungültig und die Folge für deinen Bericht.',
    practiceIds: ['de-contract', 'de-review'],
    studyChapterId: 'study-data',
    transfer: {
      support: 'Fachregeln selbst festlegen',
      localExample: 'examples/clean_inventory.py',
      references: [
        {
          title: 'Kickbase Analytics: Saisonfelder und Minuten normalisieren',
          url: 'https://github.com/noltinho/kickbase-analytics/blob/main/fetch.py',
          section: 'extract_season und parse_minutes_num',
          observe:
            'Trenne im bestehenden Import Feldzugriff, Typumwandlung und Auswahl der Saison. Suche eine Annahme, die du mit einer anderen Eingabe prüfen würdest.',
          adapt:
            'Nutze die Funktionszerlegung für deinen eigenen Vertrag. Anbieterfelder und Saisonkennungen bestätigst du an deinem erlaubten Datenstand; die Ausgabe dieses Repos ist kein Standardformat.',
        },
        {
          title: 'pandas: fehlende Werte behandeln',
          url: 'https://pandas.pydata.org/docs/user_guide/missing_data.html',
          section: 'Values considered missing und Filling missing data',
          observe: 'Untersuche isna und die Wirkung von fillna auf die Bedeutung einer Zahl.',
          adapt:
            'Fülle Punkte nicht pauschal mit null. Ein Anbieterwechsel verlangt einen eigenen Feldvertrag, auch wenn beide Quellen JSON liefern.',
        },
      ],
      prediction: 'Wie würde fillna(0) die Reihenfolge deiner preiswertesten Spieler verändern?',
      hints: [
        'Schreibe für jedes Zielfeld Einheit und Bedeutung auf.',
        'Prüfe erst Typ und fehlenden Wert, danach die fachliche Gültigkeit.',
        'Vergleiche Anzahl und IDs vor und nach der Bereinigung; untersuche jeden Verlust.',
      ],
      feedback:
        'Nimm einen falsch behandelten Datensatz als neuen Prüffall auf. Begründe die neue Regel mit dessen Bedeutung, nicht nur mit dem bisherigen Fehler.',
    },
  },
  {
    id: 'study-season-identity',
    title: 'Spieler und Partien sicher verbinden',
    result:
      'Du verbindest Kickbase-Daten mit ergänzenden Fußballstatistiken derselben Saison und weist ungeklärte Zuordnungen aus.',
    question: 'Wie verhinderst du, dass ein plausibler Name zwei verschiedene Spieler verbindet?',
    concepts: [
      {
        title: 'Identität und Spielbezug',
        text: 'Kickbase- und Provider-IDs sind keine gemeinsamen Schlüssel. Deine bestätigte Zuordnung umfasst Spieler, Team, Saison und Partie. Name und Geburtsdatum können bei der Prüfung helfen; sie ersetzen keine dokumentierte Zuordnung.',
      },
      {
        title: 'Vergleichbare Ereignisse',
        text: 'Ein Dribble bei einem Anbieter kann eine Ballführung sein und bei einem anderen das Ausspielen eines Gegners. Zähle nur bestätigte Definitionen für dieselbe Partie. Nicht verfügbare Statistiken bleiben fehlend.',
      },
    ],
    assignment: [
      'Untersuche im Merge-Beispiel, wie die erwartete Kardinalität und nicht zugeordnete Zeilen geprüft werden.',
      'Definiere deine Zuordnungstabelle und implementiere link_player_matches. Prüfe Saison und Partie vor dem Zusammenführen.',
      'Vergleiche die Dribbling-Definitionen der tatsächlich verwendeten Quellen. Wenn die Definition oder aktuelle Abdeckung fehlt, dokumentiere die Lücke statt Punkte zu schätzen.',
    ],
    checks: [
      'Ein Join vervielfacht keine Spielereinsätze.',
      'Unbekannte IDs und gleichnamige Spieler werden sichtbar zurückgestellt.',
      'Daten von 2023/24 landen nicht in einer aktuellen Spieltagswertung.',
    ],
    folder: 'src/season_dashboard/identity.py',
    command: 'python coach.py --stage identity',
    hint: 'Beginne mit einem von Hand bestätigten Spieler und einer Partie. Vergrößere erst dann die Auswahl.',
    variant:
      'Baue einen Namensvetter und einen Vereinswechsel ein. Zeige, welche Zusatzinformation deine Zuordnung eindeutig macht.',
    recall: 'Erkläre, warum ein korrekt ausgeführter Join fachlich trotzdem falsch sein kann.',
    practiceIds: ['de-joins', 'sql-join'],
    studyChapterId: 'study-engineering',
    transfer: {
      support: 'Zuordnung selbst entwerfen',
      references: [
        {
          title: 'pandas: Zusammenführen mit Prüfungen',
          url: 'https://pandas.pydata.org/docs/user_guide/merging.html',
          section:
            'Merge key uniqueness und Database-style DataFrame or named Series joining/merging',
          observe:
            'Suche validate und indicator. Verfolge den Unterschied zwischen Schlüsselprüfung und nicht verbundenen Zeilen.',
          adapt:
            'Übernimm die Prüfungen, aber definiere eigene Spieler- und Spielschlüssel. Ein Namensvergleich reicht für dieses Projekt nicht.',
        },
      ],
      prediction:
        'Welche Zeilenanzahl erwartest du nach dem Join, und welche Beobachtung würde ihn widerlegen?',
      hints: [
        'Schreibe die fachliche Bedeutung einer Zeile auf.',
        'Prüfe die Eindeutigkeit auf beiden Seiten vor dem Join.',
        'Verwende ein absichtliches Gegenbeispiel mit zwei Einträgen für denselben Zielschlüssel.',
      ],
      feedback:
        'Bewahre den kleinsten falsch verbundenen Fall als Regression auf. Stelle erst die Zuordnung richtig und rechne anschließend die Kennzahl neu.',
    },
  },
  {
    id: 'study-season-storage',
    title: 'Datenstände und Korrekturen speichern',
    result:
      'Dein lokaler Speicher hält aktuelle Werte und frühere Beobachtungen auseinander und übersteht einen abgebrochenen Import.',
    question: 'Wie bleibt erkennbar, was du vor einer nachträglichen Punktekorrektur gesehen hast?',
    concepts: [
      {
        title: 'Beobachtungszeit und Abrufzeit',
        text: 'Spielbeginn, letzte Provideränderung und dein Abruf sind verschiedene Zeitpunkte. Speichere Quelle, Saison und Abrufzeit. Ein neuer Abruf derselben Partie kann eine Korrektur enthalten.',
      },
      {
        title: 'Gemeinsam schreiben oder zurückrollen',
        text: 'Eine unvollständige Lieferung darf den letzten brauchbaren Stand nicht ersetzen. Lege vor dem Schreiben fest, was ein identischer Wiederholungslauf und was eine neue Revision ist.',
      },
    ],
    assignment: [
      'Verfolge in examples/sqlite_weather.py einen Messwert und seine spätere Korrektur. Zeichne die Schlüssel der Tabellen.',
      'Entwirf deine Tabellen und implementiere save_snapshot mit einer Transaktion. Trenne historische Beobachtungen und die Abfrage des aktuellen Stands.',
      'Starte denselben Import zweimal und simuliere dann eine Korrektur und einen Abbruch. Vergleiche die Abfragen mit deiner Vorhersage.',
    ],
    checks: [
      'Ein identischer Wiederholungslauf erzeugt keine doppelten fachlichen Datensätze.',
      'Eine Korrektur ist als spätere Beobachtung nachvollziehbar.',
      'Ein abgebrochener Import lässt keinen halbfertigen aktuellen Stand zurück.',
    ],
    folder: 'src/season_dashboard/storage.py',
    command: 'python coach.py --stage storage',
    hint: 'Übertrage die Trennung von Messzeit und Importzeit auf Spieltag und Abrufzeit.',
    variant:
      'Importiere zwei Quellen mit unterschiedlichen Aktualisierungszeiten. Deine Abfrage muss die Datenherkunft erhalten.',
    recall:
      'Erkläre an einem korrigierten Spieltag den Unterschied zwischen Aktualisierung und Historie.',
    practiceIds: ['de-upsert', 'de-manifest'],
    studyChapterId: 'study-engineering',
    transfer: {
      support: 'Datenmodell begründen',
      localExample: 'examples/sqlite_weather.py',
      references: [
        {
          title: 'Data Engineering Lab: drei getrennte Verarbeitungsschritte',
          url: 'https://github.com/maarthala/data-engineering-lab/blob/main/azure/demo/dags/demo_sales_pipeline.py',
          section: 'demo_sales mit bronze, silver und gold',
          observe:
            'Verfolge die Reihenfolge vom Rohdatenimport bis zur Auswertung. Formuliere für jeden Übergang eine Bedingung, die vor dem nächsten Schritt gelten muss.',
          adapt:
            'Übertrage die Verantwortlichkeiten auf deinen lokalen Import. Azure, Spark und Airflow sind für dieses Saisonprojekt keine Voraussetzung; das Beispiel löst auch noch nicht deine Revisionshistorie.',
        },
        {
          title: 'Python sqlite3: Transaktionen',
          url: 'https://docs.python.org/3/library/sqlite3.html',
          section: 'Tutorial und Transaction control',
          observe:
            'Verfolge commit, rollback und Platzhalter für Parameter. Prüfe, welches Verhalten deine Python-Version verwendet.',
          adapt:
            'Übernimm atomare Schreibvorgänge und Parameterbindung. Tabellen und Revisionsschlüssel musst du für deine Beobachtungen entwerfen.',
        },
      ],
      prediction:
        'Welche Tabellenzeilen dürfen sich nach einem identischen Abruf, einer Korrektur und einem Abbruch ändern?',
      hints: [
        'Definiere den eindeutigen Beobachtungsschlüssel vor dem SQL.',
        'Schreibe einen kleinen Import in eine temporäre Datenbank.',
        'Löse zwischen zwei Schreibvorgängen einen Fehler aus und prüfe anschließend den erhaltenen Stand.',
      ],
      feedback:
        'Halte die fehlerhafte Abfolge fest: vorheriger Stand, Import, Abbruch, tatsächlicher Stand. Daraus entsteht ein gezielter Wiederholungstest.',
    },
  },
  {
    id: 'study-season-metrics',
    title: 'Kennzahlen für eine konkrete Entscheidung bauen',
    result:
      'Deine Auswertung vergleicht Punkte, Preis und Form mit angegebenem Zeitraum und ausreichender Datenbasis.',
    question: 'Beschreibt dein Preisvergleich den letzten Spieltag, die Saison oder eine Prognose?',
    concepts: [
      {
        title: 'Gleicher Zeitraum, gleiche Einheit',
        text: 'Punkte pro Million braucht einen definierten Punkteschnitt und den zugehörigen Marktwertstand. Negative Punkte sind gültig. Bei Marktwert null oder fehlenden Beobachtungen gibt es kein sinnvolles Verhältnis.',
      },
      {
        title: 'Punkte erklären statt rückwärts erfinden',
        text: 'Für einen Aktionsbeitrag brauchst du bestätigte Ereignisse und die gültige Regelversion. Teile nie Gesamtpunkte durch einen vermuteten Punktwert, um daraus eine Ereignisanzahl abzuleiten.',
      },
    ],
    assignment: [
      'Nutze das Grundlagenprojekt nur als Vergleich für die Funktionszerlegung. Markiere dessen vereinfachte Regeln, die bei echten Kickbase-Daten nicht gelten.',
      'Implementiere points_per_million und rolling_form mit eigenen handgerechneten Fällen. Berichte Anzahl der Einsätze und den Zeitraum neben dem Wert.',
      'Definiere einen Vergleich für zwei Spieler derselben Position und dokumentiere, welche Information für eine Kaufentscheidung noch fehlt.',
    ],
    checks: [
      'Negative Punkte bleiben gültig; ein fehlender Marktwert wird nicht zu einem günstigen Preis.',
      'Formwerte nennen das Fenster und unterscheiden fehlenden Einsatz von null Punkten.',
      'Eine rekonstruierte Punktekomponente ist von den tatsächlich gelieferten Kickbase-Punkten unterscheidbar.',
    ],
    folder: 'src/season_dashboard/metrics.py',
    command: 'python coach.py --stage metrics',
    hint: 'Rechne zuerst zwei Fälle auf Papier. Wähle außerdem einen Fall, bei dem deine naheliegendste Umsetzung falsch wäre.',
    variant:
      'Ändere die Mindestzahl der Einsätze. Begründe eine veränderte Rangfolge anhand der Daten, nicht anhand der Spielernamen.',
    recall:
      'Nenne drei Angaben, die du neben Punkte pro Million brauchst, bevor du danach einkaufst.',
    practiceIds: ['ds-features', 'ds-sensitivity'],
    studyChapterId: 'study-scouting',
    transfer: {
      support: 'Eigene Gegenbeispiele entwickeln',
      references: [
        {
          title: 'pandas: Zeitreihen an realen Messdaten',
          url: 'https://github.com/pandas-dev/pandas/blob/main/doc/source/getting_started/intro_tutorials/09_timeseries.rst',
          section: 'Datetime conversion, selecting time ranges und aggregating time series',
          observe: 'Verfolge, wie der Zeitbezug vor der Aggregation hergestellt wird.',
          adapt:
            'Wähle für deine Form die letzten Spieltage oder Einsätze ausdrücklich. Ein gleitender Kalendermittelwert ist dafür nicht automatisch geeignet.',
        },
      ],
      prediction:
        'Wie unterscheiden sich drei Spieltage und drei Einsätze bei einem ausgefallenen Spiel?',
      hints: [
        'Lege zuerst die Bedeutung von points und market_value fest.',
        'Trenne Zeitfenster und Behandlung fehlender Beobachtungen.',
        'Vergleiche die Rangfolge unter zwei Fenstern und erkläre den stärksten Wechsel.',
      ],
      feedback:
        'Notiere eine Entscheidung, die sich durch eine andere Definition geändert hat. Passe den Vertrag an, bevor du weitere Diagramme ergänzt.',
    },
  },
  {
    id: 'study-season-dashboard',
    title: 'Die eigene Auswertung bedienbar machen',
    result:
      'Dein Dashboard zeigt aktuelle oder zuletzt verfügbare eigene Daten mit Filtern, Datenstand und nachvollziehbaren Berechnungen.',
    question: 'Was muss beim fehlgeschlagenen Abruf noch funktionieren?',
    concepts: [
      {
        title: 'Darstellung von Verarbeitung trennen',
        text: 'Die Oberfläche liest ein vorbereitetes View Model. Anmeldung, Rohdatenprüfung und Kennzahlen gehören nicht in denselben Button-Handler. Ein Fehlerzustand zeigt den letzten erfolgreichen Stand mit dessen Alter.',
      },
      {
        title: 'Ein bedienbarer erster Schnitt',
        text: 'Beginne mit einer Spielertabelle, Positions- und Budgetfilter und einer Detailansicht. Ein laufender Abruf, fehlende Daten und ein veralteter Stand brauchen eigene erkennbare Zustände.',
      },
    ],
    assignment: [
      'Untersuche im Streamlit-Beispiel, welche Funktion Daten lädt und welche Bedienelemente nur eine Auswahl verändern.',
      'Implementiere build_view_model und eine eigene Oberfläche deiner Wahl. Zunächst reicht ein lokales Dashboard; Zugangsdaten dürfen nicht im ausgelieferten Frontend liegen.',
      'Simuliere einen Abruffehler und fehlende Zusatzstatistiken. Bitte eine andere Person, einen Spieler innerhalb eines Budgets zu vergleichen, und beobachte die Stolperstelle.',
    ],
    checks: [
      'Die Anzeige nennt Quelle, Saison und letzten erfolgreichen Abruf.',
      'Ein Netzwerkfehler löscht keine vorhandenen Daten und wird nicht als aktueller Datenstand ausgegeben.',
      'Die Anwendung benötigt keine Zugangsdaten in Git, Browser-Bundle oder Arbeitsnotizen.',
    ],
    folder: 'src/season_dashboard/dashboard.py',
    command: 'python coach.py --stage dashboard',
    hint: 'Baue zuerst die Tabellenansicht aus einem gespeicherten eigenen Snapshot. Füge den Aktualisierungsknopf erst hinzu, wenn der Fehlerfall verständlich ist.',
    variant:
      'Öffne die Ansicht auf einem schmalen Bildschirm und vergleiche zwei Spieler ohne zusätzliche Erklärung.',
    recall:
      'Zeichne die Zustände bereit, aktualisiert, fehlgeschlagen und veraltet mit ihren Übergängen.',
    practiceIds: ['de-review'],
    studyChapterId: 'study-engineering',
    transfer: {
      support: 'Nur noch Architekturhinweise',
      references: [
        {
          title: 'Streamlit: Datenexploration als Anwendung',
          url: 'https://github.com/streamlit/demo-self-driving',
          section: 'streamlit_app.py: main und Datenladen',
          observe:
            'Suche Einstiegspunkt, Datenzugriff und die Reaktion auf Auswahländerungen. Die Bildanalyse selbst ist für deine Aufgabe nicht erforderlich.',
          adapt:
            'Übertrage die Trennung von Daten und Auswahl. Modellgewichte, Bildpipeline und alte Paketversionen gehören nicht in dein Dashboard.',
        },
      ],
      prediction:
        'Welche Ansicht bekommt der Nutzer nach einem fehlgeschlagenen Abruf, wenn bereits brauchbare Daten gespeichert sind?',
      hints: [
        'Schreibe die nötigen Zustände auf.',
        'Gib build_view_model gespeicherte Daten und eine feste Uhrzeit; vergleiche das Ergebnis ohne Netzwerk.',
        'Lass eine zweite Person nur die Anzeige lesen und nach dem Alter der Daten fragen.',
      ],
      feedback:
        'Notiere die tatsächlich beobachtete Bedienhürde und ändere genau eine Sache. Wiederhole dieselbe Aufgabe, bevor du neue Funktionen ergänzt.',
    },
  },
  {
    id: 'study-season-transfer',
    title: 'Eine neue Anforderung ohne Vorlage lösen',
    result:
      'Du erweiterst deinen eigenen Ablauf und kannst Entscheidungen, Fehler und die Wirkung der Korrekturen erklären.',
    question:
      'Was kannst du inzwischen auf ein Problem übertragen, das noch nicht im Beispiel vorkam?',
    concepts: [
      {
        title: 'Feedback an eigenen Versuchen',
        text: 'Die Vorlage hilft am Anfang. Später untersuchst du die Fehler deiner eigenen Umsetzung: Erwartung festhalten, Abweichung beobachten, Ursache eingrenzen und erneut prüfen. Die Hilfestufen sind bewusst keine automatische Bewertung deiner Kompetenz.',
      },
      {
        title: 'Selbstständiger Nachweis',
        text: 'Wähle eine neue Frage wie Preisentwicklung seit dem Kauf oder stabile Punkte bei wenigen Einsätzen. Zeige Datenbasis, Definition, Ergebnis und eine Grenze. Ein hübsches Diagramm allein beantwortet die Frage nicht.',
      },
    ],
    assignment: [
      'Wähle eine zusätzliche Managerfrage und schreibe vor der Recherche auf, welche Daten und Regeln du brauchst.',
      'Implementiere eine kleine vollständige Änderung. Nutze die Quellen erst, wenn du eine konkrete Lücke benennen kannst; protokolliere den kleinsten Fehler und seine Korrektur.',
      'Lass den Ablauf aus einem frischen Arbeitsordner ausführen. Erkläre die wichtigste Fachentscheidung und löse am Folgetag eine abgewandelte Anforderung ohne Vorlage.',
    ],
    checks: [
      'Deine Erweiterung arbeitet mit einem tatsächlich geprüften Datenstand der gewählten Saison.',
      'Ein neuer Prüffall unterscheidet die fehlerhafte und die korrigierte Umsetzung.',
      'Du kannst die Änderung ohne Referenz erklären und bei anderer Eingabe anpassen. Offene Live-Nachweise bleiben als offen markiert.',
    ],
    folder: 'src/season_dashboard',
    command: 'python coach.py --stage transfer',
    hint: 'Formuliere zuerst eine Frage, die du mit den verfügbaren Daten tatsächlich beantworten kannst.',
    variant:
      'Wechsle Quelle oder Zeitraum und nenne ausdrücklich die Fachregeln, die du erneut prüfen musst.',
    recall:
      'Erkläre den gesamten Datenweg ohne Editor. Öffne danach nur die Stellen, bei denen du unsicher warst.',
    practiceIds: ['ds-review'],
    studyChapterId: 'study-science',
    transfer: {
      support: 'Eigener Entwurf und gezieltes Feedback',
      references: [],
      prediction: 'Welche Beobachtung würde deiner eigenen Empfehlung widersprechen?',
      hints: [
        'Grenze die Frage auf einen überprüfbaren Unterschied ein.',
        'Suche nur für die konkrete Lücke ein Referenzstück.',
        'Bewahre den widerlegenden Fall auf und erkläre die Wirkung deiner Korrektur.',
      ],
      feedback:
        'Für jede Runde: Frage → Vorhersage → eigener Versuch → beobachtete Abweichung → Korrektur → erneuter Versuch ohne Vorlage. Notiere, bei welchem Schritt du Hilfe gebraucht hast.',
    },
  },
];
