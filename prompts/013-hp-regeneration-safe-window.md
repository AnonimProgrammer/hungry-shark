# HP regeneration with safe-window delay

**What I asked the AI:** Implement Jira ticket `[DEV] Implement HP regeneration with safe-window delay` — +10 HP/s after 2 s clear of starvation, poison, and HP loss; no instant heal on eat.

**What it gave me:** New `src/engine/hp.js` with `applyDamage`, `applyPoisonContact`, `updateHpRegen`, and `resetHpState`; constants `HP_REGEN_DELAY`, `HP_REGEN_RATE`, `POISON_DURATION`; game state tracks `hpRegenTimer` and `hpLostThisFrame`; collisions route bomb/poison/starvation through shared damage helper; poison timer blocks regen for 4 s on contact (DOT ticket still pending).

**What was wrong:** Nothing broken in logic — poison still deals instant −20 until the poison DOT ticket replaces ticks.

**How I fixed it:** N/A.

**Time lost:** ~0 minutes
