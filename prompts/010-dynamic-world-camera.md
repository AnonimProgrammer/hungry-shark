# Dynamic world (camera + unbounded ocean)

**What I asked the AI:** Replace the static map with a dynamic world — bigger canvas with more sky, viewport-only boundaries, and free creature movement across the ocean.

**What it gave me:** Larger 1200×800 canvas, camera module that follows the shark, world-space coordinates for all entities, scrolling sky/water/seabed background, spawn and respawn near the player, and fish recycling when they drift too far.

**What was wrong:** First pass removed canvas walls but broke world boundaries — seabed was placed at `y = 6000` so the floor never appeared on screen. Fish had no vertical limits and could swim into the sky. All entities used one generic spawn band, so poisonous fish and bombs appeared too high and too close to the surface.

**How I fixed it:** Set water depth to ~2× the on-screen water column (`WATER_COLUMN_HEIGHT`) so the seabed is reachable (~`y = 1260`). Added typed spawn helpers: common fish keep ~2 m below the surface and stay in the upper 65% of water; poisonous fish and bombs spawn in the lower half with 125–250 px clearance above the seabed. Fish `update()` now bounces within those world bands (not canvas edges). Restored a visible seabed floor band in the renderer.

**Time lost:** ~15 minutes
