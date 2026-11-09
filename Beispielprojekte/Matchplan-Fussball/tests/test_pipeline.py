import json
from pathlib import Path
import sys
import tempfile
import unittest

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "src"))
from matchplan_data.pipeline import read_players, run

SOURCE = Path(__file__).resolve().parents[1] / "data" / "players.csv"


class PipelineTests(unittest.TestCase):
    def test_sample_ranking_and_repeatable_output(self):
        with tempfile.TemporaryDirectory() as directory:
            output = Path(directory) / "reports"
            rows = run(SOURCE, output)
            self.assertEqual([row["player_id"] for row in rows], ["p4", "p2", "p1"])
            self.assertEqual([row["progressive_passes_p90"] for row in rows], [2.6, 2.25, 2.0])
            first = (output / "shortlist.csv").read_bytes()
            run(SOURCE, output)
            self.assertEqual((output / "shortlist.csv").read_bytes(), first)
            manifest = json.loads((output / "manifest.json").read_text())
            self.assertEqual(manifest["input_rows"], 5)
            self.assertEqual(manifest["selected_rows"], 3)

    def test_invalid_delivery_does_not_create_output(self):
        with tempfile.TemporaryDirectory() as directory:
            source = Path(directory) / "broken.csv"
            source.write_text("player_id,name,position,minutes,progressive_passes\nx,Ada,MF,0,3\n")
            output = Path(directory) / "reports"
            with self.assertRaises(ValueError):
                run(source, output)
            self.assertFalse(output.exists())

    def test_duplicate_ids_are_rejected(self):
        with self.assertRaises(ValueError):
            read_players(b"player_id,name,position,minutes,progressive_passes\nx,Ada,MF,90,1\nx,Nora,MF,90,2\n")

    def test_empty_selection_keeps_csv_header(self):
        with tempfile.TemporaryDirectory() as directory:
            output = Path(directory)
            self.assertEqual(run(SOURCE, output, minimum=2000), [])
            self.assertEqual(len((output / "shortlist.csv").read_text().splitlines()), 1)


if __name__ == "__main__":
    unittest.main()
