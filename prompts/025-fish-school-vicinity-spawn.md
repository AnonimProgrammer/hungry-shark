# Fish school vicinity spawning

**What I asked the AI:** Apply bomb-style vicinity logic to fish — always 6 active schools within 5000px of the shark; respawn or relocate when the shark swims away; keep existing ahead spawn distance rules.

**What it gave me:** `FISH_VICINITY_RADIUS` / `FISH_TARGET_SCHOOL_COUNT`; `ensureVicinitySchools` relocates far schools then spawns new groups via `getGroupSpawnAnchor`; removed 2s spawn interval timer.

**What was wrong:** *(pending playtest)*

**How I fixed it:** *(n/a yet)*

**Time lost:** ~0 minutes
