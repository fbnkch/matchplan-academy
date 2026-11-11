"""Eigene kleine Referenz: echte öffentliche OpenLigaDB-Spielplandaten lesen.

Quellen zum Vergleich, kein übernommener Originalcode:
https://github.com/OpenLigaDB/OpenLigaDB-Samples
https://docs.python.org/3/library/urllib.request.html
Keine Kickbase-Anmeldung, Punkte oder Spielerstatistiken.
"""
import argparse
from datetime import datetime, timezone
import json
from urllib.error import HTTPError, URLError
from urllib.request import urlopen


def read_matches(season=None):
    """Ohne Saison den aktuellen BL1-Spieltag, sonst die angefragte Saison laden."""
    endpoint = 'https://api.openligadb.de/getmatchdata/bl1'
    if season is not None:
        endpoint += '/' + str(season)
    try:
        with urlopen(endpoint, timeout=15) as response:
            matches = json.load(response)
    except HTTPError as error:
        raise RuntimeError(f'Anbieter antwortet mit HTTP {error.code}.') from None
    except (TimeoutError, URLError):
        raise RuntimeError('Anbieter nicht rechtzeitig erreichbar.') from None
    except (json.JSONDecodeError, UnicodeDecodeError):
        raise RuntimeError('Die Antwort ist kein gültiges JSON.') from None
    if not isinstance(matches, list):
        raise ValueError('Eine Liste von Spielen erwartet.')
    return {
        'source': 'OpenLigaDB',
        'endpoint': endpoint,
        'requested_season': season,
        'fetched_at': datetime.now(timezone.utc).isoformat(),
        'matches': matches,
    }


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--season', type=int, help='Saisonbeginn als Jahr; ohne Angabe aktueller Spieltag')
    arguments = parser.parse_args()
    if arguments.season is not None and not 1963 <= arguments.season <= 2100:
        parser.error('Saisonjahr außerhalb des erwarteten Bereichs.')
    snapshot = read_matches(arguments.season)
    print(f"Quelle: {snapshot['source']} | Abruf: {snapshot['fetched_at']}")
    print(f"{len(snapshot['matches'])} gelieferte Spiele; Abdeckung selbst prüfen.")
    for match in snapshot['matches'][:3]:
        print(match.get('matchID'), match.get('team1', {}).get('teamName'),
              '-', match.get('team2', {}).get('teamName'), match.get('matchDateTimeUTC'))


if __name__ == '__main__':
    main()
