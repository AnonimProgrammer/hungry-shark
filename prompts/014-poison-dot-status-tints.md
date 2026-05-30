# Poison DOT and shark status tints

**What I asked the AI:** Combine two Jira tickets — poison damage over time (20 HP over 4 s at 5 HP/s, refresh on re-contact) and shark status tints (light red starving, light green poisoned; green overrides red).

**What it gave me:** `applyPoisonDot` in `hp.js` with `poisonDamageRemaining`; removed instant −20 on contact; `POISON_TICK_RATE` constant; `shark.isPoisoned` flag; draw priority hitFlash → poison green → starve red → default.

**What was wrong:** Nothing broken — first combined implementation pass.

**How I fixed it:** N/A.

**Time lost:** ~0 minutes
