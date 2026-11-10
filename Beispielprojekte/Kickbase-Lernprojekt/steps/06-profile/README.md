# 6 - Ein unabhängiger Profilbericht

Implementiere profile_distance in exercises/metrics.py. Definiere zuerst eigene Tests.
Vergleiche nur dieselbe Position und mindestens 450 Minuten. Die vollständige Kohorte
bestimmt Mittelwert und Populationsstandardabweichung für Punkte und Marktwert.
Standardisiere beide Features; konstante Features werden 0. Fehlende/NaN-Werte schließen
Spieler aus. Keine Imputation mit 0. Ungültiger Zielspieler -> leere Ergebnisliste.
Euklidischer Abstand ohne Selbstvergleich; bei Gleichstand nach ID sortieren.
Ergebnisfelder: id, distance, features, delta_z, cohort_size, minimum_minutes.
Berichte Einheit, Datenstand, Gruppengröße und die Grenzen synthetischer Daten.
Prüfe andere Minutenfilter und Featureauswahl, bevor du eine Ähnlichkeit behauptest.
Referenzprüfung: `python -m unittest tests.learner_suite.LearnerMetricTests.test_profile -v`.
