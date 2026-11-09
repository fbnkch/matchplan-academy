"""Generate independent fictional teaching records. Stdlib only; no source data/network.

The fixed seed and serialization are part of matchplan-synthetic-v1. Pass outcome
omission is an explicit provider-inspired teaching contract, not a missing value.
"""
import argparse
import hashlib
import json
import math
from pathlib import Path
import random

REVISION = 'matchplan-synthetic-v1'
ROOT = Path(__file__).resolve().parents[1]
TEAMS = ['Auenstadt FC', 'Hafenwiese SV', 'Bergtal Union', 'Lindenhain SC',
         'Morgenfeld FK', 'Waldbrueck 09', 'Sonnenried AC', 'Kuestengarten SV']


def generate():
    rng = random.Random(20261109)
    matches, events, shots = [], [], []
    for m in range(12):
        match_id = 910001 + m
        home_index, away_index = m % 8, (m + 3) % 8
        match = dict(match_id=match_id, date=f'2030-06-{1 + m // 2:02}',
                     home=TEAMS[home_index], away=TEAMS[away_index],
                     events=3474 if m < 2 else None,
                     event_coverage='complete synthetic timeline' if m < 2 else 'not supplied')
        matches.append(match)
        match_shots = {}
        for s in range(22 if m < 3 else 21):
            index = 120 + s * 145
            team_index = home_index if s % 2 == 0 else away_index
            # Continuous geometry and stochastic outcomes deliberately overlap.
            x, y = round(rng.uniform(76, 118), 2), round(rng.uniform(13, 67), 2)
            if s == 0:
                x, y = 114.0, 40.0  # close, central miss in every match
            elif s == 1:
                x, y = 83.0, 33.0  # distant goal in every match
            distance = math.hypot(120 - x, y - 40)
            probability = round(max(.015, min(.75, .62 * math.exp(-distance / 17))), 6)
            goal = int(rng.random() < probability)
            if s in (0, 1):
                goal = s
            player_number = 1 + (s * 3 + m) % 11
            shot = dict(event_id=f'mp-syn-{match_id}-e{index:04}', match_id=match_id,
                        match_date=match['date'], team=TEAMS[team_index],
                        player=f'{TEAMS[team_index]} Profil {player_number:02}',
                        x=x, y=y, goal=goal,
                        body_part=['Right Foot', 'Left Foot', 'Head'][s % 3],
                        shot_type='Free Kick' if s % 9 == 4 else 'Open Play',
                        provider_xg=probability)
            shots.append(shot)
            match_shots[index] = (shot, team_index, player_number)
        if m >= 2:
            continue
        for index in range(1, 3475):
            period = 1 if index <= 1737 else 2
            local_index = (index - 1) % 1737
            elapsed = int(local_index * 2700 / 1736)
            team_index = home_index if (index // 7) % 2 == 0 else away_index
            player_number = 1 + index % 11
            kind = ['Pass', 'Carry', 'Pass', 'Ball Receipt*', 'Pass', 'Pressure', 'Duel'][index % 7]
            if index in (1, 2):
                kind = 'Starting XI'
                team_index = home_index if index == 1 else away_index
            elif index in (3, 1738):
                kind = 'Half Start'
            elif index in (1737, 3474):
                kind = 'Half End'
            if index in match_shots:
                shot, team_index, player_number = match_shots[index]
                kind = 'Shot'
            event = dict(id=f'mp-syn-{match_id}-e{index:04}', match_id=match_id,
                         index=index, period=period,
                         timestamp=f'{elapsed // 3600:02}:{elapsed // 60 % 60:02}:{elapsed % 60:02}.000',
                         minute=(period - 1) * 45 + elapsed // 60, second=elapsed % 60,
                         type=dict(name=kind), team=dict(id=920001 + team_index, name=TEAMS[team_index]),
                         possession=1 + (index - 1) // 7)
            if kind not in ('Starting XI', 'Half Start', 'Half End'):
                event['player'] = dict(id=930001 + team_index * 20 + player_number,
                                       name=f'{TEAMS[team_index]} Profil {player_number:02}')
                event['location'] = [round(rng.uniform(0, 120), 2), round(rng.uniform(0, 80), 2)]
            if kind == 'Pass':
                event['pass'] = dict(end_location=[round(rng.uniform(0, 120), 2), round(rng.uniform(0, 80), 2)])
                if index % 5 == 0:
                    event['pass']['outcome'] = dict(name=['Incomplete', 'Out', 'Pass Offside', 'Injury Clearance', 'Unknown'][(index // 5) % 5])
            elif kind == 'Shot':
                event['location'] = [shot['x'], shot['y']]
                event['shot'] = dict(outcome=dict(name='Goal' if shot['goal'] else 'Saved' if index % 2 else 'Off T'),
                                     body_part=dict(name=shot['body_part']), type=dict(name=shot['shot_type']),
                                     generated_xg=shot['provider_xg'])
            events.append(event)
    return events, shots, matches


def write_snapshot(out):
    events, shots, matches = generate()
    out.mkdir(parents=True, exist_ok=True)
    hashes = {}
    for name, rows in [('practice-events.json', events), ('practice-shots.json', shots)]:
        payload = json.dumps(rows, ensure_ascii=False, separators=(',', ':')).encode('utf-8')
        (out / name).write_bytes(payload)
        hashes[name] = hashlib.sha256(payload).hexdigest()
    metadata = dict(provider='Matchplan synthetic teaching data', revision=REVISION,
                    generator='scripts/generate-teaching-data.py', seed=20261109,
                    competition='Fictional Matchplan teaching series 2030',
                    selection='255 generated shots from twelve fictional matches; 6,948 events covering the complete synthetic timelines of the first two matches. Other event coverage is unknown.',
                    data_origin='Independently generated from rules and a fixed seed; no real match records or values are read or transformed.',
                    probability_contract='provider_xg is a compatibility column containing generated probabilities, not estimates from an external provider. Goals are generated labels.',
                    coordinate_contract='Provider-inspired 120 x 80 teaching grid; all attacks use the goal at (120, 40). Units are not metres.',
                    matches=matches, shot_count=len(shots), event_count=len(events), sha256=hashes)
    (out / 'provenance.json').write_bytes((json.dumps(metadata, indent=2, ensure_ascii=False) + '\n').encode('utf-8'))
    print(f'{len(events)} fictional events, {len(shots)} fictional shots; {REVISION}')


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output-dir', type=Path, default=ROOT / 'src/course/datasets')
    write_snapshot(parser.parse_args().output_dir)
