"""Referenz: nachvollziehbare Kennzahlen, ausschließlich Python-Standardbibliothek."""
import math
from statistics import mean, pstdev


def points_per_million(points, market_value):
    if points is None or market_value is None:
        return None
    if not math.isfinite(points) or not math.isfinite(market_value):
        return None
    if points < 0 or market_value < 0:
        raise ValueError('Negative Werte sind im synthetischen Datenvertrag ungültig')
    return points / (market_value / 1_000_000) if market_value else None


def rolling_form(points, window=3):
    """Letzte N Spieltage; None ist kein Einsatz und zählt nicht als Null."""
    if not isinstance(window, int) or window <= 0:
        raise ValueError('window muss eine positive ganze Zahl sein')
    observed = [p for p in points[-window:] if p is not None and math.isfinite(p)]
    return mean(observed) if observed else None


def profile_distance(rows, target_id, minimum_minutes=450):
    """Z-Standardisierung innerhalb derselben Position, dann euklidischer Abstand.

    Fehlende Features werden nicht mit Null aufgefüllt. Unter der Minutengrenze
    gibt es keine Aussage. Konstante Features erhalten den standardisierten Wert 0.
    """
    features = ['points', 'market_value']
    eligible = [r for r in rows if r.get('minutes') is not None
                and math.isfinite(r['minutes']) and r['minutes'] >= minimum_minutes
                and all(r.get(f) is not None and math.isfinite(r[f]) for f in features)]
    target = next((r for r in eligible if r['id'] == target_id), None)
    if target is None:
        return []
    cohort = [r for r in eligible if r['role'] == target['role']]
    deviations = {f: pstdev(r[f] for r in cohort) for f in features}
    centers = {f: mean(r[f] for r in cohort) for f in features}

    def standard(row, feature):
        return ((row[feature] - centers[feature]) / deviations[feature]
                if deviations[feature] else 0)

    result = []
    for row in cohort:
        if row['id'] == target_id:
            continue
        delta = {f: standard(row, f) - standard(target, f) for f in features}
        result.append({'id': row['id'], 'distance': math.sqrt(sum(v*v for v in delta.values())),
                       'features': features.copy(), 'delta_z': delta,
                       'cohort_size': len(cohort), 'minimum_minutes': minimum_minutes})
    return sorted(result, key=lambda r: (r['distance'], r['id']))
