"""Abschnitt auth: Anmeldung erst nach geklärtem erlaubtem Zugang ausführen."""


def extract_access_token(payload: dict) -> str:
    """Prüfe eine Anmeldeantwort nach deinem bestätigten Providervertrag.

    Liefere genau ein nichtleeres Token. Fehlende oder ungültige Felder erzeugen
    einen Schemafehler, der den Inhalt der Antwort nicht offenlegt. Die Community-
    Dokumentation ersetzt keinen beobachteten Vertrag; Feldnamen nicht raten.
    """
    # TODO: Vertrag festlegen, Gegenbeispiele schreiben, dann auslesen.
    raise NotImplementedError('Abschnitt auth: Antwortvertrag selbst implementieren')


def sign_in(transport, email: str, password: str) -> str:
    """Melde deinen eigenen Account über einen austauschbaren Transport an.

    Definiere zuerst, wie dein transport einen JSON-Body sendet. Nutze im ersten
    Versuch ein Transport-Doppel mit erkennbar erfundenen Testantworten. Echte
    Eingaben später lokal mit getpass erfassen, nur an den bestätigten Anbieter
    senden und weder protokollieren noch in Snapshots oder Arbeitsnotizen ablegen.
    Liefere ein geprüftes Token. Bei 401/403 oder ungültigem Schema abbrechen.
    Das Dashboard führt keine Käufe, Verkäufe oder Aufstellungsänderungen aus.
    """
    # TODO: Transportvertrag und Anmeldung selbst schreiben.
    raise NotImplementedError('Abschnitt auth: sign_in selbst implementieren')
