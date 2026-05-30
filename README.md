# Hungry Shark

A browser-based 2D underwater survival game built with **HTML, CSS, and vanilla JavaScript** — no libraries, frameworks, or game engines.

**Full design spec:** [docs/project-design.md](docs/project-design.md)

---

## Game Description

You control a hungry shark in an ocean ecosystem. Swim through the water, hunt schools of fish to stay fed, and avoid hazards. You can break the surface and jump into the sky — gravity pulls you back down. Survive as long as you can before hunger or damage ends the run.

The playfield is a fixed-camera viewport divided into zones from top to bottom:

| Zone | Description |
|------|-------------|
| **Sky** | Above the water surface. Gravity applies when the shark is airborne. |
| **Water surface line** | Boundary between sky and the main play area. |
| **Water zone** | Light-blue main play area — shark, fish, and hazards live here. |
| **Seabed** | Dark-brown floor at the bottom. Hard stop for downward movement. |

### Entities

| Entity | Type | Behavior |
|--------|------|----------|
| **Shark** | Player | Rotates toward mouse; swims on LMB hold; 2× speed boost on double-click + hold. HP 0–100, hunger timer, boost state (`READY` / `ACTIVE` / `COOLDOWN`). |
| **Common fish** | Consumable | Orange circles in schools. +5 HP (cap 100) and reset hunger timer on contact. |
| **Poisonous fish** | Hazard | Green circles, swim alone. Deal contact damage on collision. |
| **Underwater bomb** | Hazard | Dark spiky circle in the water zone. MVP: avoid contact; later −30 HP on touch. |
| **HUD** | UI overlay | Displays HP, hunger timer, and boost meter. |

**Future scope (not in MVP):** humans at the surface, aggressive predator fish.

### Game Sketch (Excalidraw)

![Hungry Shark — Excalidraw game sketch](hungry_shark_excalidraw.png)

---

## How to Play

### Controls

| Input | Action |
|-------|--------|
| **Mouse move** | Shark rotates to face the cursor |
| **Left mouse button (hold)** | Swim forward along current angle toward the cursor |
| **Double-click + hold LMB** | 2× speed boost for ~2–3 seconds, then cooldown until `READY` again |

### Objective

Eat common orange fish to restore HP and reset the hunger timer. Avoid poisonous fish and underwater bombs.

### Win / Lose

| Outcome | Condition |
|---------|-----------|
| **Win** | No fixed win state — survive as long as possible; score = survival duration. |
| **Lose** | HP drops to 0 from starvation, poison, or bomb damage. Game Over overlay shows final score/time. |

### Hunger Rule

If the shark does not eat a common fish within any rolling **5-second** window, starvation triggers and drains **−10 HP/sec** until food is caught.

---

## Tech Decisions

**Approach: hybrid OOP + functional** (see [docs/project-design.md §4](docs/project-design.md#4-technical-architecture--loop-design))

| Layer | Style | What |
|-------|-------|------|
| **Entities** | OOP | `Shark`, `Fish`, `Bomb` classes — own position, state, and `.draw(ctx)` |
| **Systems** | Functional | Input, collision (`checkCollision`), timers, game state, `requestAnimationFrame` loop |

**Why hybrid:** Entities naturally bundle their data and rendering. Shared systems stay decoupled — no deep inheritance, easy to add new entity types without rewriting the loop.

### Game loop (each frame)

1. Clear canvas (`ctx.clearRect`)
2. Process input (mouse position, click states)
3. Update physics & logic (movement, timers, fish arrays)
4. Evaluate collisions
5. Render (background, entities, HUD)

---

## AI Development Log

Prompt details live in [`prompts/`](prompts/). The diary indexes them:

**[AI_DIARY.md](AI_DIARY.md)**

---

## Live Demo

<!-- Replace with your GitHub Pages URL once deployed -->
**GitHub Pages:** _Coming soon_

---

## Known Bugs / What I'd Fix Next

_Game not yet implemented — updated as development progresses._

- [x] Scaffold `index.html`, canvas, and main game loop
- [ ] Implement `Shark` boost state machine (2× speed on double-click)
- [ ] Spawn fish schools and poisonous solo fish
- [ ] Add collision detection and HP / hunger mechanics
- [ ] Game Over screen with survival score
- [ ] Bomb contact damage (−30 HP)
- [ ] Tune boost cooldown and spawn rates

---

## Project Structure

```
hungry-shark/
├── docs/
│   └── project-design.md       # Full game design blueprint
├── prompts/                    # Detailed AI prompt logs
├── AI_DIARY.md                 # AI diary index
├── hungry_shark_excalidraw.png # Excalidraw sketch
├── index.html
├── css/
│   └── style.css
├── js/
│   └── index.js
└── README.md
```

## Stack & Constraints

| Allowed | Not allowed |
|---------|-------------|
| HTML, CSS, vanilla JS | jQuery, Three.js, Phaser, Pixi.js |
| Canvas API, DOM manipulation | Tailwind, Bootstrap, CSS frameworks |
| Free AI tools | Paid AI plans / API keys |

---

Ironhack bootcamp — individual project.
