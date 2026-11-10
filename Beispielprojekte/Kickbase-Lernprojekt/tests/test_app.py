import json
from pathlib import Path
import tempfile
import unittest
from app import dashboard_data, render, ROOT
from pipeline import import_snapshot


class ProjectTests(unittest.TestCase):
    def test_dashboard_is_computed_from_fixture(self):
        rows = dashboard_data()
        self.assertEqual(len(rows), 6)
        self.assertEqual(rows[0]['points_per_million'], 20)
        self.assertEqual(rows[0]['form_last_3'], 80)
        self.assertIn('Mira Nord', render())
        json.dumps(rows, allow_nan=False)

    def test_join_and_history_are_repeatable_without_overwrite(self):
        with tempfile.TemporaryDirectory() as directory:
            path = import_snapshot(ROOT/'data/players.csv', ROOT/'data/matchdays.csv', directory, '2026-01-01')
            payload = json.loads(path.read_text(encoding='utf-8'))
            self.assertEqual(len(payload['players'][0]['matchdays']), 3)
            with self.assertRaises(FileExistsError):
                import_snapshot(ROOT/'data/players.csv', ROOT/'data/matchdays.csv', directory, '2026-01-01')
            bad = Path(directory)/'bad.csv'
            bad.write_text('id,matchday,points\nmissing,1,80\n', encoding='utf-8')
            with self.assertRaises(ValueError):
                import_snapshot(ROOT/'data/players.csv', bad, directory, '2026-01-02')
            self.assertFalse((Path(directory)/'2026-01-02.json').exists())
