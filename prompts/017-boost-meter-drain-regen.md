# Boost meter drain and hold

**What I asked the AI:** Replace boost burst with drain/regenerate meter; allow boost toggle off and stop meter drain.

**What it gave me:** Removed `BOOST_DURATION` / `BOOST_COOLDOWN` / `BOOST_STATES` FSM. Added `boostMeter` (0–100), `isBoosting`, and `boostIdleTimer` on `Shark`. Double-click toggles boost on/off; meter drains whenever boost mode is armed (not tied to LMB). Regen after 2 s idle over 10 s. HUD bar reflects meter level.

**What was wrong:** Two gaps vs intended controls. (1) Meter kept draining after double-click even when LMB was released — “actively in use” should mean holding the swim button, not just having boost toggled on. (2) Boost was a persistent toggle (double-click again to disarm); the real flow is double-click **and hold** LMB to boost, release LMB to stop completely, then double-click + hold again for the next boost.

**How I fixed it:** Renamed toggle state to `boostArmed`. Drain and 2× speed only while `boostArmed && isMouseDown && meter > 0`. Releasing LMB clears `boostArmed`. Removed toggle-off on second double-click; `armBoost()` only runs on double-click when meter > 0. HUD label updated to “dbl-click + hold”.

**Time lost:** ~10 minutes
