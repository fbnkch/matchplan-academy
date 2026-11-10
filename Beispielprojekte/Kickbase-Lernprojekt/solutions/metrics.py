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
    observed_points = [
        matchday_points for matchday_points in points[-window:]
        if matchday_points is not None and math.isfinite(matchday_points)
    ]
    return mean(observed_points) if observed_points else None


def profile_distance(rows, target_id, minimum_minutes=450):
    """Z-Standardisierung innerhalb derselben Position, dann euklidischer Abstand.

    Fehlende Features werden nicht mit Null aufgefüllt. Unter der Minutengrenze
    gibt es keine Aussage. Konstante Features erhalten den standardisierten Wert 0.
    """
    features = ['points', 'market_value']
    eligible_players = [
        player for player in rows
        if player.get('minutes') is not None
        and math.isfinite(player['minutes'])
        and player['minutes'] >= minimum_minutes
        and all(
            player.get(feature_name) is not None and math.isfinite(player[feature_name])
            for feature_name in features
        )
    ]
    target_player = next((player for player in eligible_players if player['id'] == target_id), None)
    if target_player is None:
        return []
    comparison_group = [player for player in eligible_players if player['role'] == target_player['role']]
    feature_standard_deviations = {
        feature_name: pstdev(player[feature_name] for player in comparison_group)
        for feature_name in features
    }
    feature_means = {
        feature_name: mean(player[feature_name] for player in comparison_group)
        for feature_name in features
    }

    def calculate_standard_score(player, feature_name):
        return (
            (player[feature_name] - feature_means[feature_name])
            / feature_standard_deviations[feature_name]
            if feature_standard_deviations[feature_name] else 0
        )

    similar_players = []
    for player in comparison_group:
        if player['id'] == target_id:
            continue
        feature_differences = {
            feature_name: calculate_standard_score(player, feature_name)
            - calculate_standard_score(target_player, feature_name)
            for feature_name in features
        }
        similar_players.append({
            'id': player['id'],
            'distance': math.sqrt(sum(
                standardized_difference * standardized_difference
                for standardized_difference in feature_differences.values()
            )),
            'features': features.copy(),
            'delta_z': feature_differences,
            'cohort_size': len(comparison_group),
            'minimum_minutes': minimum_minutes,
        })
    return sorted(similar_players, key=lambda similar_player: (
        similar_player['distance'], similar_player['id'],
    ))
