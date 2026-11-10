import math
import unittest
from solutions.metrics import points_per_million, rolling_form, profile_distance

class MetricTests(unittest.TestCase):
    def test_value(self):
        self.assertEqual(points_per_million(80, 4_000_000), 20)
        self.assertIsNone(points_per_million(80, 0))
        self.assertIsNone(points_per_million(None, 4_000_000))
        self.assertEqual(points_per_million(0, 4_000_000), 0)
        self.assertIsNone(points_per_million(80, float('nan')))
        self.assertIsNone(points_per_million(float('inf'), 4_000_000))
        with self.assertRaises(ValueError):
            points_per_million(-1, 2_000_000)

    def test_form(self):
        self.assertEqual(rolling_form([10, None, 30, 50], 3), 40)
        self.assertIsNone(rolling_form([None, None], 2))
        self.assertEqual(rolling_form([100, None, 0], 2), 0)
        self.assertIsNone(rolling_form([], 3))
        self.assertEqual(rolling_form([float('nan'), 30], 3), 30)
        with self.assertRaises(ValueError):
            rolling_form([10], 0)

    def test_profile(self):
        rows = [dict(id='a', role='MID', minutes=900, points=10, market_value=1_000_000),
                dict(id='b', role='MID', minutes=900, points=30, market_value=3_000_000),
                dict(id='c', role='DEF', minutes=900, points=10, market_value=1_000_000),
                dict(id='d', role='MID', minutes=0, points=10, market_value=1_000_000),
                dict(id='e', role='MID', minutes=900, points=float('nan'), market_value=2_000_000),
                dict(id='f', role='MID', minutes=None, points=10, market_value=1_000_000),
                dict(id='g', role='MID', minutes=float('nan'), points=10, market_value=1_000_000)]
        result = profile_distance(rows, 'a')
        self.assertEqual([r['id'] for r in result], ['b'])
        self.assertAlmostEqual(result[0]['distance'], math.sqrt(8))
        self.assertEqual(result[0]['features'], ['points', 'market_value'])
        self.assertEqual(profile_distance(rows, 'd'), [])
        self.assertEqual(profile_distance(rows, 'e'), [])
        self.assertEqual(profile_distance(rows, 'f'), [])
        self.assertEqual(profile_distance(rows, 'g'), [])
        self.assertEqual(profile_distance(rows, 'missing'), [])
        equal = [dict(r, points=10, market_value=1_000_000) for r in rows[:2]]
        self.assertEqual(profile_distance(equal, 'a')[0]['distance'], 0)

if __name__ == '__main__':
    unittest.main()
