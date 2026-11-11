"""Abschnitt api: übertrage den Transport aus examples/http_results.py."""


def get_json(url: str, *, access_token: str | None = None, timeout: float = 15):
    """Lies JSON über eine erlaubte HTTP-Anfrage.

    Ergebnis: dekodiertes dict oder list. Unterscheide Timeout/Verbindungsfehler,
    Fehlerstatus und ungültiges JSON. Vereinbare dafür erkennbare Fehlertypen.
    Begrenze Wiederholungen und beachte eine gelieferte Retry-After-Angabe.
    Sende ein Token nur an den bestätigten HTTPS-Anbieter; verhindere dessen
    Weitergabe durch fremde Redirect-Ziele. Keine Geheimnisse in URL oder Log.

    Leite deinen Entwurf zuerst aus dem öffentlichen Beispiel ab. Eine leere
    gültige Antwort darf nicht mit einer fehlgeschlagenen Anfrage verschmelzen.
    """
    # TODO: Deinen HTTP-Vertrag implementieren und die Fehlerfälle unterscheiden.
    raise NotImplementedError('Abschnitt api: get_json selbst implementieren')
