# 4 - Eigene Tests, eigene Implementierung

Schreibe tests/test_my_form.py und importiere darin exercises.metrics.rolling_form.
Beweise: Fenster 3 auf [10, None, 30, 50] ergibt 40 und nicht 30.
Fenster zuerst wählen, danach fehlende Werte ausschließen. Nur fehlende Werte -> None.
Ungültiges Fenster -> ValueError. Schreibe auch einen Test, der deine erste Idee widerlegt.
`python -m unittest tests.test_my_form -v`
Danach: `python -m unittest tests.learner_suite.LearnerMetricTests.test_form -v`
