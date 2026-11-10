"""Absichtlich zunächst rot: python -m unittest tests.learner_suite -v."""
from tests.test_reference import MetricTests
from unittest.mock import patch
from exercises import metrics


class LearnerMetricTests(MetricTests):
    def setUp(self):
        for name in ('points_per_million', 'rolling_form', 'profile_distance'):
            replacement = patch('tests.test_reference.' + name, getattr(metrics, name))
            replacement.start()
            self.addCleanup(replacement.stop)


# Die importierte Basisklasse soll im expliziten Modul nicht doppelt laufen.
del MetricTests
