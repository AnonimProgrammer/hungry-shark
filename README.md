# Hungry Shark

A browser-based 2D underwater survival game: control a shark in an unbounded ocean, hunt fish schools for strike score, manage hunger and HP, and avoid poison and bombs. Built with **HTML, CSS, and vanilla JavaScript** (no game engine or frameworks).

## Live demo

**GitHub Pages:** [https://anonimprogrammer.github.io/hungry-shark/](https://anonimprogrammer.github.io/hungry-shark/)

## Project tracking

- [Jira (SI)](https://anonimprogrammer.atlassian.net/jira/software/projects/SI/boards/68) — backlog and issues for this project.

## AI development log

Feature prompts and iteration notes are indexed in **[AI_DIARY.md](AI_DIARY.md)** (detailed prompt files under [`prompts/`](prompts/)).

---

## Documentation guide

### Game

- [Introduction](docs/introduction.md) — description, world zones, entity list, Excalidraw sketch.
- [How to play](docs/how-to-play.md) — controls, menus, objective, hunger, scoring, boost, HUD.

### Architecture & design

- [Project design](docs/project-design.md) — full blueprint: rules, entity specs, spawn systems, game loop, **technical architecture (OOP + functional hybrid, §5)**, constants, implementation status.

### Development

- [AI diary](AI_DIARY.md) — index of AI-assisted work (25+ entries).
- [`prompts/`](prompts/) — per-feature prompt logs linked from the diary.

---

## Known bugs

- **Starvation ends too soon after eating** — eating a single fish can incorrectly stop starvation damage; hunger reset / starvation state is not behaving as intended.
- **Spawning breaks far from start** — fish schools and hazards do not spawn or relocate reliably when the shark travels far from the initial spawn area.

---

## What’s next

Planned work (see [Project design §9](docs/project-design.md#9-planned-work)):

- **[DEV] Sound effects** — eat, damage, explosion, UI feedback (music toggle exists as mock only today).
- **Future gameplay** — humans at the surface, aggressive predator fish (see [introduction](docs/introduction.md)).
