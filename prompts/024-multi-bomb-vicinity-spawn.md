# Multi-bomb vicinity spawning

**What I asked the AI:** Replace single bomb with 5 bombs within 2000px of the shark, at least 500px apart, respawn 10s after explosion; if the shark swims away and fewer than 5 are nearby, relocate or spawn replacements.

**What it gave me:** `bombGroups.js` with `createInitialBombs` and `maintainBombs`; `findBombSpawnPosition` in spawn.js; `domain.bombs` array; exploded bombs respawn after 10s; far bombs relocate into the 2000px ring when the vicinity count drops.

**What was wrong:** *(pending playtest)*

**How I fixed it:** *(n/a yet)*

**Time lost:** ~0 minutes
