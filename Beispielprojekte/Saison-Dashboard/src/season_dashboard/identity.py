"""Abschnitt identity: Personen und Partien haben providerspezifische IDs."""


def link_player_matches(kickbase_rows: list, provider_rows: list, links: list) -> dict:
    """Verbinde nur bestätigte Spieler/Partien derselben Saison.

    Definiere links mit kickbase_player_id, provider_player_id, kickbase_match_id,
    provider_match_id und season. Halte eigene normalisierte IDs von originalen
    Provider-IDs unterscheidbar. Ergebnis: matched und unmatched mit Ursachen.
    Erwarte höchstens eine passende Providerzeile je Kickbase-Spielereinsatz;
    verletzte Kardinalität ist ein Fehler, kein stilles drop_duplicates.
    Keine automatische Zuordnung allein über den Namen. Nicht zugeordnete oder
    fehlende Statistik ist nicht 0. Prüfe auch die Gleichheit der Ereignisdefinition.
    """
    # TODO: Eigenen Zuordnungsvertrag und Gegenbeispiele implementieren.
    raise NotImplementedError('Abschnitt identity: link_player_matches selbst schreiben')
