# Strike chain scoring and best score migration

**What I asked the AI:** Combine two Jira tickets — replace time-based score with strike chain (5 base, 2× within 2 s) and migrate best score localStorage from survival seconds to strike points.

**What it gave me:** New `src/engine/score.js` with `awardStrikeOnCommonFishEat`, `updateStrikeChain`, `resetStrikeState`; removed `score += deltaSec`; strike constants; localStorage key changed to `hungry-shark-best-score`; HUD/start/game-over labels show points without `s` suffix.

**What was wrong:** Nothing broken — old `hungry-shark-high-score` key left in localStorage unused (intentional clean break from second-based records).

**How I fixed it:** N/A. Later: per-fish strike cap at 80 (5 → 10 → 20 → 40 → 80).

**Time lost:** ~0 minutes
