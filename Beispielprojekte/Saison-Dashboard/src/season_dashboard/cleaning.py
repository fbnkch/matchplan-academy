"""Abschnitt cleaning: verständliches eigenes Zielschema am Rand herstellen."""


def normalize_players(payload, *, fetched_at: str) -> dict:
    """Überführe beobachtete Rohdaten in accepted und rejected (je eine Liste).

    Dein Zielschema: player_id als string, name, position, market_value in ganzen
    Euro, average_points als endliche Zahl oder None, season und fetched_at als
    ISO-Zeit mit Zeitzone. Dies ist ein eigener Lernvertrag, kein Live-API-Schema.
    Fehlende Punkte bleiben None; 0 und negative Punkte sind gültige Beobachtungen.
    Bei Fehlern einen Grund und nur eine nicht-sensitive Quellenkennung ablegen.
    Weise unklare Duplikate zurück, statt eine beliebige Version zu behalten.
    Ändere payload nicht. Definiere die tatsächliche Feldzuordnung erst nach
    Prüfung einer erlaubten Providerantwort und notiere Einheiten explizit.
    """
    # TODO: Fachregeln ableiten; Lagerbestandsregeln nicht einfach übernehmen.
    raise NotImplementedError('Abschnitt cleaning: normalize_players selbst schreiben')
