# Shark and lionfish visuals

**What I asked the AI:** Update shark and poisonous fish details — poisonous fish as lionfish, player shark as the simplest shark silhouette; later use `assets/images/shark.png` for player/menu shark.

**What it gave me:** `drawSimpleFish` / `drawLionfish` for hazards and schools; `drawSimpleShark` vector fallback; then `assets.js` + `drawSharkSprite` for PNG; `applyFacingTransform` for left/right facing; `drawSharkBodyGlow` oval status overlay (starve / poison / damage).

**What was wrong:** First PNG pass was tiny (~40px), black background showed as a box, color tint painted over the whole sprite; left-facing mirror used wrong angle math (head pointed away from cursor); status circles used collision radius (~29px) and were invisible behind the 180px sprite.

**How I fixed it:** Strip near-black pixels on load; draw image only (no sprite tint); scale to `SHARK_SPRITE_HEIGHT` 180 (game) / 440 (menu); fix flip with `scale(-1,1)` + `rotate(π - angle)` when `cos(angle) < 0`; replace circle with body-aligned oval glow sized to sprite aspect ratio.

**Time lost:** ~20 minutes
