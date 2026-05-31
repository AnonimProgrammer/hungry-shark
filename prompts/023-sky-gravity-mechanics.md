# Sky gravity & jump physics

**What I asked the AI:** Add gravity when the shark leaves the water — no more flying in the sky. Jumps should follow ballistic arcs: straight up falls straight down; angled jumps mirror on the way down (/ becomes \, \ becomes /).

**What it gave me:** Airborne state with horizontal velocity preserved and vertical gravity (`GRAVITY = 520 px/s²`); mouse swim disabled in air; shark angle follows velocity vector; boost disabled while airborne; splash back into water resumes normal control.

**What was wrong:** Landing stopped at the surface — jump height did not carry through into the water.

**How I fixed it:** Track `peakAirHeight` during the arc; after re-entry, keep ballistic motion until the shark reaches the same depth below the surface, then restore swim control.

**Time lost:** ~0 minutes
