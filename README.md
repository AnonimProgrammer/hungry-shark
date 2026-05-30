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
- [How to play](docs/how-to-play.md) — controls, objective, win/lose, hunger, scoring, boost, HUD.

### Architecture & design

- [Project design](docs/project-design.md) — full blueprint: rules changelog, entity specs, game loop, **technical architecture (OOP + functional hybrid, §5)**, constants, implementation and testing checklists.

### Development

- [AI diary](AI_DIARY.md) — index of AI-assisted work (16+ entries).
- [`prompts/`](prompts/) — per-feature prompt logs linked from the diary.

---

## What’s next

Design targets in [Project Design](docs/project-design.md) are ahead of code in a few areas:

- **Boost meter** — drain only while boosting, 2 s idle before regen, 10 s empty→full refill (replace fixed burst/cooldown).
- **HUD** — top-right HP/boost bars and settings menu; best score off in-game HUD only (start/game-over unchanged).
- **Future gameplay** — humans at the surface, aggressive predator fish (see [introduction](docs/introduction.md)).
