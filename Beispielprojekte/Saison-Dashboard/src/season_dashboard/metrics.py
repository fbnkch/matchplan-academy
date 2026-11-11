"""Abschnitt metrics: Definition und Gegenbeispiele vor die Berechnung stellen."""


def points_per_million(points, market_value):
    """Punkteschnitt / Marktwert in Millionen Euro; beide Zeitbezüge dokumentieren.

    Negative endliche Punkte sind gültig. Bei fehlenden/nicht endlichen Angaben
    oder Marktwert 0 ist kein Verhältnis definiert: None. Negativer Marktwert ist
    ein ValueError. Keine Rundung vor nachfolgenden Berechnungen.
    """
    # TODO: Handgerechnete Fälle und eigene Umsetzung.
    raise NotImplementedError('Abschnitt metrics: points_per_million selbst schreiben')


def rolling_form(points: list, window: int = 3):
    """Mittlere beobachtete Punkte der letzten N Spieltage, älteste zuerst.

    Wähle erst die letzten N Spieltage, schließe danach None aus. Fehlende Einsätze
    ziehen keine älteren Spieltage nach; nur fehlende Werte liefern None.
    Negative Punkte und 0 zählen als beobachtet. Weise nicht endliche Werte als
    ungültige Eingaben zurück. window muss eine positive ganze Zahl sein, kein bool.
    """
    # TODO: Fehlender Einsatz und Einsatz mit 0 müssen unterscheidbar bleiben.
    raise NotImplementedError('Abschnitt metrics: rolling_form selbst schreiben')
