"""Download optional StatsBomb data for private local study, never for app distribution."""
import argparse
import concurrent.futures
import hashlib
import json
import pathlib
import urllib.request

REVISION = '4b73468fc5b0f1950f9f66fada70ad3a4f9327cb'
BASE = f'https://raw.githubusercontent.com/hudl/open-data/{REVISION}'
ROOT = pathlib.Path(__file__).resolve().parents[1]
OUT = ROOT / '.local/external-data/statsbomb'

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--accept-source-terms', action='store_true', help='Confirm you have reviewed the StatsBomb user agreement for your own use.')
args = parser.parse_args()
if not args.accept_source_terms:
    parser.error('Review https://github.com/hudl/open-data/blob/master/LICENSE.pdf, then pass --accept-source-terms. Downloaded data stays in ignored .local/ and is not bundled in the application.')

def get(path):
    with urllib.request.urlopen(BASE + '/' + path, timeout=60) as response:
        return json.load(response)

matches = sorted(get('data/matches/43/106.json'), key=lambda m: (m['match_date'], m['kick_off'], m['match_id']))[:12]
def load_match(match):
    return match, get(f"data/events/{match['match_id']}.json")

shots, events, manifest = [], [], []
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
    for index, (match, rows) in enumerate(pool.map(load_match, matches)):
        match_id = match['match_id']
        manifest.append({'match_id': match_id, 'date': match['match_date'], 'home': match['home_team']['home_team_name'], 'away': match['away_team']['away_team_name'], 'events': len(rows)})
        for event in rows:
            if index < 2:
                keys = ['id', 'index', 'period', 'timestamp', 'minute', 'second', 'type', 'team', 'player', 'location', 'pass', 'shot', 'possession']
                # Keep the nesting relevant to ETL, drop bulky freeze frames/related_events.
                row = {key: event[key] for key in keys if key in event}
                row['match_id'] = match_id
                if 'shot' in row:
                    row['shot'] = {key: value for key, value in row['shot'].items() if key != 'freeze_frame'}
                events.append(row)
            if event['type']['name'] == 'Shot':
                shot = event['shot']
                shots.append({'event_id': event['id'], 'match_id': match_id, 'match_date': match['match_date'], 'team': event['team']['name'], 'player': event.get('player', {}).get('name', ''), 'x': event['location'][0], 'y': event['location'][1], 'goal': int(shot['outcome']['name'] == 'Goal'), 'body_part': shot['body_part']['name'], 'shot_type': shot['type']['name'], 'provider_xg': shot['statsbomb_xg']})

OUT.mkdir(parents=True, exist_ok=True)
for name, rows in [('practice-events.json', events), ('practice-shots.json', shots)]:
    (OUT / name).write_text(json.dumps(rows, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')
metadata = {'provider': 'StatsBomb', 'repository': 'https://github.com/hudl/open-data', 'revision': REVISION, 'competition': 'FIFA World Cup 2022 (43/106)', 'selection': 'First 12 matches chronologically; all shots, projected event objects from first two matches.', 'matches': manifest, 'shot_count': len(shots), 'event_count': len(events), 'sha256': {name: hashlib.sha256((OUT / name).read_bytes()).hexdigest() for name in ['practice-events.json', 'practice-shots.json']}}
(OUT / 'provenance.json').write_text(json.dumps(metadata, indent=2, ensure_ascii=False), encoding='utf-8')
print(f'{len(events)} events, {len(shots)} shots, {len(matches)} matches; revision {REVISION}')
