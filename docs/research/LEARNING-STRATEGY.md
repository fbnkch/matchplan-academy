# Lernstrategie für das Kickbase-Dashboard

Recherche: 10. November 2026. Ausgangspunkt: Python-Syntax ist vertraut,
selbstständiges Programmieren noch unsicher; SQL und Statistik brauchen Auffrischung.

## Empfehlung und Reichweite

Ein kleines, lauffähiges Beispiel in der eigenen IDE bearbeiten: erst erklären,
dann verändern, dann fehlende Teile ergänzen und schließlich eine neue Funktion
selbst entwickeln. Theorie begleitet den jeweiligen Arbeitsschritt. Das ist eine
begründete Anwendung der Forschung auf dieses Vorhaben, kein experimenteller
Nachweis für den individuell schnellsten Lernweg und keine Jobgarantie.

## Befunde

- Ausgearbeitete Beispiele mit schrittweise entfernten Lösungsschritten können
  den Übergang zum selbstständigen Problemlösen unterstützen. Die Befunde zum
  nahen Transfer sind stärker als eine pauschale Übertragung auf neue Probleme.
  Selbsterklärungen sind ein wichtiger ergänzender Ansatz.
  [Renkl et al., 2002](https://www.tandfonline.com/doi/abs/10.1080/00220970209599510),
  [Atkinson, Renkl und Merrill, 2003](https://experts.azregents.edu/en/publications/transitioning-from-studying-examples-to-solving-problems-effects-/).
- Aktives Abrufen und zeitlich verteiltes Üben werden in einer breiten Übersicht
  günstiger bewertet als bloßes Wiederlesen. Daraus folgt keine universelle
  Prozentaufteilung zwischen Theorie und Praxis.
  [Dunlosky et al., 2013](https://www.psychologicalscience.org/publications/journals/pspi/learning-techniques.html).
- Beispielcode allein beseitigt die Einstiegshürden nicht: Eine Untersuchung mit
  44 Programmieranfängern in Snap fand Schwierigkeiten bei Entscheidung, Suche
  und Integration. Das stützt die Auswahl weniger passender Beispiele und
  konkreter Änderungsaufträge; die Studie untersucht kein Python-Kickbase-Projekt.
  [Wang et al., 2021](https://arxiv.org/abs/2104.11806).
- Problemlösen vor einer Erklärung kann unter passenden didaktischen Bedingungen
  helfen. Die Forschung zu produktivem Scheitern ist keine Empfehlung, Anfänger
  ohne Aufarbeitung vor eine beliebig große Aufgabe zu setzen.
  [Sinha und Kapur, 2021](https://journals.sagepub.com/doi/10.3102/00346543211019105).

## Konkreter Ablauf

1. Ein kleines Dashboard mit dokumentierter CSV und vorbereiteter Anzeige starten.
2. Ausgabe vorhersagen und Datenfluss erklären: einlesen, prüfen, berechnen, anzeigen.
3. Eine Kennzahl ändern; anschließend die Berechnungsfunktion selbst ergänzen.
4. Eine neue Kennzahl ohne Musterlösung schreiben und an Randfällen prüfen.
5. Einige Tage später eine Variante ohne Lösungsvorlage bearbeiten.
6. Datenimport, Historisierung und Spielervergleich als getrennte Ausbauschritte ergänzen.

KI unterstützt zuerst durch Fragen, Fehlermeldungserklärung und kleine Hinweise.
Vollständige Lösungen bleiben verfügbar, werden aber anschließend erklärt und
an einer neuen Variante überprüft. Dokumentation nachzuschlagen bleibt erlaubt.

Die Lernwebsite sollte pro Meilenstein Fragestellung, nötige Begriffe, einen
zugeordneten IDE-Ordner, Arbeitsaufträge und nachvollziehbare Erfolgskriterien
zeigen. Längere Theorie und weitere Repositories bleiben Vertiefung.

## Erste Projektquellen und Datenfragen

[noltinho/kickbase-analytics](https://github.com/noltinho/kickbase-analytics)
enthält laut Projektbeschreibung Marktwert-/Punkteanalysen und eine Trennung
zwischen Datenverarbeitung und statischer Anzeige. Es ist eine Architekturreferenz,
kein hier ausgeführtes oder als anfängertauglich bestätigtes Startprojekt.

Die gefundenen [Python-Clients](https://github.com/kevinskyba/kickbase-api-python)
sind inoffiziell. Zugang und Nutzungsbedingungen echter Daten müssen vor einer
Integration geprüft werden. Ein reproduzierbarer Snapshot trennt das Lernen der
Analyse von Login- und Schnittstellenproblemen.

Punkte je Million Marktwert, Punkte je Million Kaufpreis und Prognosen für
künftige Spieltage sind unterschiedliche Fragestellungen. Der
[Kickbase-Marktwert](https://en.help.kickbase.com/en/help/how-is-a-players-market-value-calculated-in-kickbase)
beruht laut Anbieter auf Angebot und Nachfrage. Für Vergleiche müssen Zeitraum,
Einsätze und Ausfallrisiko sichtbar bleiben.
