# Introduction — Hungry Shark

Browser-based 2D underwater survival game built with **HTML, CSS, and vanilla JavaScript** — no libraries, frameworks, or game engines.

For controls and win/lose conditions, see [How to play](how-to-play.md). For full rules, architecture, and tech decisions, see [Project design](project-design.md).

---

## Game description

You control a hungry shark in a dynamic ocean ecosystem. Swim through an unbounded world, hunt **schools of fish** to stay fed and build score, and avoid hazards. The camera follows you as you explore — fish schools and bombs are kept in range as you move. Survive as long as you can before hunger or damage ends the run.

The playfield is a camera viewport into world coordinates divided into zones from top to bottom:

| Zone | Description |
|------|-------------|
| **Sky** | Above the water surface. The shark can jump out of the water; **gravity** pulls it down on ballistic arcs (no free flight). Re-entry splashes to a depth matching jump height. |
| **Water surface line** | Boundary between sky and the main play area. |
| **Water zone** | Main play area — depth-tinted water (lighter near surface, darker toward the seabed). Shark, fish schools, and hazards live here. |
| **Seabed** | Dark-brown floor at the bottom. Hard stop for downward movement. |

---

## Entities

| Entity | Type | Behavior |
|--------|------|----------|
| **Shark** | Player | `shark.png` sprite; rotates toward mouse in water; swims on LMB hold; **double-click + hold LMB** for boost (meter-based). Sky jumps follow gravity. HP 0–100. Status glow: light red (starving), light green (poisoned), red flash (damage). |
| **Common fish** | Consumable | Orange simple fish in **groups** of 12. **6 active schools** maintained within **4000 px** of the shark; new groups spawn ahead (900–1500 px) or far schools relocate. Eaten fish are **gone** — no individual respawn. Feeding resets hunger and earns strike score. |
| **Poisonous fish (lionfish)** | Hazard | Striped lionfish sprite (small count: 2). **20 HP over 4 seconds** (DOT). Light-green shark glow while poisoned. Solo respawn at distance after eaten. |
| **Underwater bombs** | Hazard | **5 bombs** within **2000 px** of the shark (≥500 px apart). Dark spiky circle; large explosion VFX; **−30 HP**; **10 s** respawn after detonation; far bombs relocate when the shark moves away. |
| **HUD** | UI overlay | Top-right: HP bar (red), boost bar (dark blue), golden score, circular pause button. |
| **Main menu** | UI | Title, animated shark, best score, settings gear, How to play?, Play. |
| **Pause / Game over** | UI | Pause: Resume, Quit to menu, mock music toggle. Game over: final score, best score, Play Again, Quit to menu. |

**Future scope (not in MVP):** sound effects and music, humans at the surface, aggressive predator fish.

---

## Game sketch (Excalidraw)

![Hungry Shark — Excalidraw game sketch](../hungry_shark_excalidraw.png)

---

## Stack & constraints

| Allowed | Not allowed |
|---------|-------------|
| HTML, CSS, vanilla JS | jQuery, Three.js, Phaser, Pixi.js |
| Canvas API, DOM manipulation | Tailwind, Bootstrap, CSS frameworks |
| Free AI tools | Paid AI plans / API keys |
