# Hunger and starvation mechanic (enhanced rules)

**What I asked the AI:** Implement Jira ticket `[DEV] Update hunger and starvation mechanic` from the enhanced rules design — 10 s grace period, −5 HP/s drain, light red shark signal, hunger reset on eat (no instant HP heal).

**What it gave me:** Updated `HUNGER_LIMIT` and `STARVATION_DRAIN`, shared `isStarving()` helper, game loop starvation drain, shark light-red tint, HUD “Starving!” label, removed +5 HP on common fish eat, start-screen copy to 10 s.

**What was wrong:** No AI diary entry was added after the work — skipped incorrectly by treating it as polish on the design-doc prompt (011) instead of a new implementation milestone.

**How I fixed it:** Added this prompt file and index line in `AI_DIARY.md` (012).

**Time lost:** ~0 minutes
