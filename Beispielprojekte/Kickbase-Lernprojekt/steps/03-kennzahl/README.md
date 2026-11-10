# 3 - Eine fehlende Funktion

Implementiere points_per_million in exercises/metrics.py, erst nach einem roten Test.
`python -m unittest tests.learner_suite.LearnerMetricTests.test_value -v`
Vertrag: Punkte je Einsatz / (Marktwert Euro / 1_000_000).
None, NaN, unendliche Werte oder Null-Marktwert -> None; negative Werte -> ValueError.
Die Funktion muss andere Eingaben verarbeiten, keine Namen oder Ergebnisse fest codieren.
Kontrolliere erst am Ende solutions/metrics.py. Dashboard nutzt die Referenz weiterhin.
