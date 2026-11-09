from pathlib import Path
import pandas as pd
shots = pd.read_csv(Path(__file__).parent / "data/shots.csv")

import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import brier_score_loss
# 1. Merkmale berechnen
# 2. Spiele trennen
# 3. Modell und Baseline fitten
# 4. Brier-Scores berechnen
predictions = []

# Grafiken als Dateien sichern.
import sys as _sys
if "matplotlib.pyplot" in _sys.modules:
    _plt = _sys.modules["matplotlib.pyplot"]
    for _number in _plt.get_fignums():
        _plt.figure(_number).savefig(Path(__file__).parent / f"grafik-{_number}.png", dpi=160, bbox_inches="tight")
