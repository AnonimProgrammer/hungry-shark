# AI Diary — Hungry Shark

A log of AI-assisted development for this project. Each numbered entry below links to a detailed prompt file in [`prompts/`](prompts/). Keep this file as a clean index; put the full conversation breakdown in the linked file.

---

## AI Tools Used

| Tool | Why |
|------|-----|
| **Cursor (Claude)** | Primary coding assistant — inline edits, repo context, and iterative debugging in the IDE |
| _(add others as you use them)_ | e.g. ChatGPT free, Gemini free for brainstorming or quick questions |

---

## Entries

### [2026-05-30] — Hunger & starvation (enhanced rules)
12. [hunger-starvation-mechanic](prompts/012-hunger-starvation-mechanic.md) — 10 s grace, −5 HP/s drain, light red shark tint, eat resets hunger only

### [2026-05-30] — Enhanced game rules (design doc)
11. [enhance-game-rules-design](prompts/011-enhance-game-rules-design.md) — Fish groups without individual respawn, strike scoring, poison DOT, hunger/boost/HUD spec in project-design.md

### [2026-05-30] — Dynamic world (camera + unbounded ocean)
10. [dynamic-world-camera](prompts/010-dynamic-world-camera.md) — Bigger canvas, camera follows shark, world coords; follow-up fixed seabed depth and fish/hazard spawn bands

### [2026-05-30] — Shark boost (double-click)
9. [shark-boost-double-click](prompts/009-shark-boost-double-click.md) — 2× speed burst on double-click, boost state machine, HUD meter

### [2026-05-30] — Bomb explosion + mini-shark fish
8. [bomb-explosion-fish-visuals](prompts/008-bomb-explosion-fish-visuals.md) — Explosion VFX, 5s bomb respawn, fish drawn as small sharks

### [2026-05-30] — Poisonous fish + spawn randomization
7. [poisonous-fish](prompts/007-poisonous-fish.md) — Green solo fish (−20 HP on eat), randomized spawns, bomb −30 HP once per contact

### [2026-05-30] — High score (localStorage)
6. [high-score](prompts/006-high-score.md) — Persist best survival time in localStorage, display on HUD and screens

### [2026-05-30] — Game restart
5. [game-restart](prompts/005-game-restart.md) — resetGame(), Play Again button, full state reset without page reload

### [2026-05-30] — Start & game over screens
4. [start-game-over-screens](prompts/004-start-game-over-screens.md) — HTML overlays, Start button, game-over panel with final score

### [2026-05-30] — Score & lose condition
3. [score-lose](prompts/003-score-lose.md) — Survival score, starvation drain, HUD, game-over when HP = 0

### [2026-05-30] — Collision (fish & bomb)
2. [collision-fish-bomb](prompts/002-collision-fish-bomb.md) — Fish school, bomb hazard, circle collision + eat/damage

### [2026-05-30] — Player movement (Shark + mouse swim)
1. [player-movement](prompts/001-player-movement.md) — Shark class, mouse aim, LMB hold to swim forward

---

## How to Add an Entry

1. Create `prompts/NNN-short-kebab-title.md` (next number in sequence, e.g. `001-canvas-setup.md`).
2. Fill in the prompt file using the template below.
3. Add a dated line to **Entries** above linking to that file.

### Prompt file template

```markdown
# [Short title]

**What I asked the AI:** ...

**What it gave me:** ...

**What was wrong:** ...

**How I fixed it:** ...

**Time lost:** ~X minutes
```
