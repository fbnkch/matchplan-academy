from pathlib import Path
import pandas as pd
shots = pd.read_csv(Path(__file__).parent / "data/shots.csv")

import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import brier_score_loss
import matplotlib.pyplot as plt
shots = shots.copy()
dx = 105 - shots["x"]
dy = shots["y"] - 34
shots["distance"] = np.hypot(dx, dy)
shots["angle"] = np.arctan2(7.32 * dx, dx ** 2 + dy ** 2 - (7.32 / 2) ** 2)
train = shots.loc[shots["match_id"] <= 12].copy()
test = shots.loc[shots["match_id"] > 12].copy()
features = ["distance", "angle"]
model = LogisticRegression(max_iter=500, random_state=42)
model.fit(train[features], train["goal"])
predictions = model.predict_proba(test[features])[:, 1]
baseline = np.full(len(test), train["goal"].mean())
model_brier = float(brier_score_loss(test["goal"], predictions))
baseline_brier = float(brier_score_loss(test["goal"], baseline))
print({"Testspiele": sorted(test["match_id"].unique().tolist()), "Modell-Brier": round(model_brier, 4), "Baseline-Brier": round(baseline_brier, 4)})
calibration = pd.DataFrame({"p": predictions, "goal": test["goal"].to_numpy()})
calibration["bin"] = pd.cut(calibration["p"], [0, .1, .2, .4, 1], include_lowest=True)
calibration.groupby("bin", observed=True).agg(predicted=("p", "mean"), observed=("goal", "mean")).plot(style="o-", ylim=(0, 1), title="Kalibrierung auf synthetischen Testdaten")


# Grafiken als Dateien sichern.
import sys as _sys
if "matplotlib.pyplot" in _sys.modules:
    _plt = _sys.modules["matplotlib.pyplot"]
    for _number in _plt.get_fignums():
        _plt.figure(_number).savefig(Path(__file__).parent / f"grafik-{_number}.png", dpi=160, bbox_inches="tight")
