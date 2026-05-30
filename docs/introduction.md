# Introduction — Hungry Shark

Browser-based 2D underwater survival game built with **HTML, CSS, and vanilla JavaScript** — no libraries, frameworks, or game engines.

For controls and win/lose conditions, see [How to play](how-to-play.md). For full rules, architecture, and tech decisions, see [Project design](project-design.md).

---

## Game description

You control a hungry shark in a dynamic ocean ecosystem. Swim through an unbounded world, hunt **schools of fish** to stay fed and build score, and avoid hazards. The camera follows you as you explore — new fish groups appear ahead as you move. Survive as long as you can before hunger or damage ends the run.

The playfield is a camera viewport into world coordinates divided into zones from top to bottom:

| Zone | Description |
|------|-------------|
| **Sky** | Above the water surface. Shark can enter; no gravity in current scope. |
| **Water surface line** | Boundary between sky and the main play area. |
| **Water zone** | Light-blue main play area — shark, fish schools, and hazards live here. |
| **Seabed** | Dark-brown floor at the bottom. Hard stop for downward movement. |

---

## Entities

| Entity | Type | Behavior |
|--------|------|----------|
| **Shark** | Player | Rotates toward mouse; swims on LMB hold; boost on double-click (meter-based). HP 0–100. Status tints: light red (starving), light green (poisoned). |
| **Common fish** | Consumable | Orange mini-sharks in **groups** that spawn together and disperse. Eaten fish are **gone** — new groups appear as the shark explores. Feeding resets hunger and earns strike score. |
| **Poisonous fish** | Hazard | Green solo fish (small count). **20 HP over 4 seconds** (DOT), not instant. Light-green shark signal while poisoned. |
| **Underwater bomb** | Hazard | Dark spiky circle. Explosion VFX, −30 HP, respawns after delay. |
| **HUD** | UI overlay | Top-right: HP bar (red), boost bar (dark blue), golden score, settings menu. |

**Future scope (not in MVP):** humans at the surface, aggressive predator fish.

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
