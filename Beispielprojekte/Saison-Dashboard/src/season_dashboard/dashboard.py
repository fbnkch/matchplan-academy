"""Abschnitt dashboard: eigene Datenbasis vor Darstellung und Interaktion."""


def build_view_model(records: list, *, now):
    """Erzeuge die darzustellenden Daten, ohne Anmeldung oder HTTP auszuführen.

    now ist eine vorgegebene Uhrzeit mit Zeitzone. Zeige Quelle, Saison und letzten
    erfolgreichen Abruf; definiere eine nachvollziehbare Regel für veraltete Daten.
    Fehlende Kennzahlen bleiben fehlend. Ein Abruffehler löscht keine vorhandenen
    Beobachtungen. Keine Tokens, Rohantworten oder anderen Geheimnisse ausgeben.
    Entwirf die Rückgabe passend zu deiner Tabellen- und Detailansicht. Schreibe
    deine Filter danach in einer separaten Oberfläche deiner Wahl.
    """
    # TODO: View Model entwerfen; dieselben Daten mit zwei Uhrzeiten prüfen.
    raise NotImplementedError('Abschnitt dashboard: build_view_model selbst schreiben')
