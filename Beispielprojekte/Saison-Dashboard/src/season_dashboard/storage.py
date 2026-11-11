"""Abschnitt storage: aktueller Stand und Historie sind verschiedene Abfragen."""


def save_snapshot(connection, records: list, *, fetched_at: str, season: str):
    """Speichere normalisierte Beobachtungen in einer sqlite3-Verbindung.

    Entwirf Tabellen und Schlüssel vor dem SQL: Provider, Spieler/Partie, Saison,
    Beobachtungszeit und Abrufzeit. Definiere einen wiedererkennbaren identischen
    Import sowie eine spätere Korrektur. Historische Beobachtungen bleiben lesbar.
    Schreibe einen Batch atomar oder rolle ihn zurück. Verwende SQL-Parameter.
    Nach einem Abbruch muss die Abfrage des letzten brauchbaren Stands stimmen.
    Überlege, welche Rückgabe dem Aufrufer den erfolgreichen Import belegt.
    """
    # TODO: Erst Tabellenentwurf und Fehlerfälle, dann die eigene Transaktion.
    raise NotImplementedError('Abschnitt storage: save_snapshot selbst schreiben')
