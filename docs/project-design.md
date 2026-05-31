# Project Design Documentation

## Project Title: Hungry Shark (Vanilla JS Browser Game)

Blueprint for a browser-based, 2D underwater survival game built strictly with **HTML5, CSS3, and Vanilla JavaScript** (no external libraries, game engines, or frameworks). The player controls a shark in a dynamic ocean, hunts schools of fish, and manages hunger, boost energy, and environmental hazards.

**Related docs:** [Introduction](introduction.md) (overview & entities) · [How to play](how-to-play.md) (controls & objectives) · [README](../README.md) (documentation index) · [AI diary](../AI_DIARY.md)

**Last updated:** 2026-05-31 — reflects implemented boost meter, HUD, menus, gravity, vicinity spawning, and tutorial.

---

## 0. Implementation Status

| System | Status | Notes |
|--------|--------|-------|
| Fish groups (no common respawn) | **Done** | 6 active schools within 4000 px; ahead spawn 900–1500 px; relocate far schools |
| Poison DOT + lionfish visual | **Done** | 20 HP / 4 s; light green glow |
| Hunger / HP regen | **Done** | 10 s grace, −5 HP/s; +10 HP/s after 2 s safe window |
| Strike score | **Done** | Chain 5→80, 2 s window |
| Boost meter | **Done** | Double-click + hold LMB; drain while boosting; 2 s idle → 10 s regen |
| HUD (top-right bars) | **Done** | HP, boost, golden score; pause button |
| Main menu + How to play | **Done** | 3-slide tutorial; mock shark shop |
| Pause / Game over | **Done** | Quit to menu on both; mock music toggle |
| Multi-bomb vicinity | **Done** | 5 bombs / 2000 px; 500 px min spacing; 10 s respawn |
| Sky gravity + splash depth | **Done** | Ballistic arcs; dive depth = jump height |
| Water depth gradient | **Done** | Lighter at surface, darker at seabed |
| Shark / fish sprites | **Done** | `shark.png`; simple fish + lionfish drawings |
| Sound effects / music | **Planned** | Toggle UI mock only — see §9 |

---

## 1. Environmental Architecture & Screen Layout

The game uses a **dynamic world** with a camera that follows the shark. The viewport is a window into unbounded ocean coordinates — entities move in world space; only the camera position is fixed relative to the screen.

* **Sky Zone:** Region above `WATER_SURFACE_Y`. The shark can jump out of the water. **Gravity** (`GRAVITY = 520 px/s²`) applies — ballistic motion, no mouse swim control while airborne. Re-entry continues momentum underwater to a depth equal to peak jump height above the surface.
* **Water Surface Line:** Horizontal world coordinate separating sky from the main play area.
* **Water Zone:** Depth-tinted gradient (`#81d4fa` → `#4fc3f7` → `#01579b` from surface to seabed). Fish schools and hazards spawn relative to the shark.
* **Seabed:** Dark-brown floor at `SEABED_WORLD_Y`. Shark `y` is clamped here.

**Spawn philosophy:** Content is kept in a **vicinity** around the shark. Fish schools and bombs that fall outside the monitored radius are **relocated** or **respawned** so the world stays populated as the player explores.

---

## 2. Comprehensive Entity Blueprint

### Player Character: The Shark

* **Visual:** `assets/images/shark.png` sprite (`SHARK_SPRITE_HEIGHT = 180` in-game); horizontal flip when swimming left. Oval body-aligned glow for status effects.
* **Core stats:** HP 0–100, hunger timer, HP regen timer, boost meter 0–100%, poison timer, strike chain timer.
* **Status glows:** light red (starving), light green (poisoned), red flash (damage).
* **Movement (water):** Mouse aim; LMB hold swim; double-click + **hold LMB** boost at 2× while meter > 0.
* **Movement (sky):** Velocity-based arc; angle follows trajectory; boost disabled.

### Common Fish (Orange — School Groups)

* **Group size:** `SCHOOL_SIZE = 12`.
* **Vicinity:** `FISH_TARGET_SCHOOL_COUNT = 6` active schools within `FISH_VICINITY_RADIUS = 4000` px of the shark.
* **Spawn ahead:** `GROUP_SPAWN_AHEAD_MIN/MAX = 900–1500` px, biased in travel direction (`GROUP_SPAWN_ANGLE_SPREAD = 0.75`).
* **Active group:** More than `GROUP_DEPLETED_THRESHOLD = 3` living fish.
* **On eat:** Fish removed permanently; hunger reset; strike score; no instant HP heal.
* **Replenishment:** `maintainFishGroups()` in `fishGroups.js` — relocate far schools or spawn new groups when nearby count < 6.

### Poisonous Fish (Lionfish — Solo)

* **Count:** `POISONOUS_FISH_COUNT = 2`.
* **Visual:** `drawLionfish()` — striped hazard sprite.
* **Damage:** 20 HP over 4 s DOT; refresh on re-contact.
* **Respawn:** Solo respawn at distance after eaten; `recycleDistantPoisonFish()` beyond `ENTITY_RECYCLE_DISTANCE`.

### Hazards: Underwater Bombs

* **Count:** `BOMB_TARGET_COUNT = 5` within `BOMB_VICINITY_RADIUS = 2000` px.
* **Spacing:** ≥ `BOMB_MIN_SEPARATION = 500` px between bombs; spawn ring 500–2000 px from shark.
* **Damage:** −30 HP on contact; large explosion VFX (`BOMB_EXPLOSION_MAX_RADIUS = 120`).
* **Respawn:** `BOMB_RESPAWN_DELAY = 10` s after explosion; `maintainBombs()` in `bombGroups.js` relocates far bombs when vicinity count drops.

### Future Extensions (Out of Scope)

* **Humans:** Surface swimmers or boats.
* **Advanced Bad Fish:** Aggressive predators that chase the player.

---

## 3. Game State & Logic Rules

(Summary — see [How to play](how-to-play.md) for player-facing copy.)

### 3.1 Hunger & HP Regeneration

Starvation after **10 s** without common fish → **−5 HP/s**. Regen **+10 HP/s** after **2 s** clear of starvation, poison, and damage. No instant heal on eat.

### 3.2 Boost Mechanic

Double-click **arms** boost; **hold LMB** while swimming to drain meter at 2× speed. Release LMB stops boost drain. **2 s** idle → **10 s** full regen. Boost disabled while airborne.

### 3.3 Strike Scoring

+5 base; ×2 chain within 2 s; cap +80 per fish. Score is points only (not time-based).

### 3.4 Poison DOT

20 HP / 4 s; light green glow; blocks regen.

### 3.5 Fish Group Spawning (Implemented)

```
FISH_TARGET_SCHOOL_COUNT = 6
FISH_VICINITY_RADIUS = 4000
GROUP_DEPLETED_THRESHOLD = 3
GROUP_SPAWN_AHEAD_MIN/MAX = 900 / 1500

eachFrame:
  maintainFishGroups(shark, fishes, domain)
    count active schools with anchor within 4000 px of shark
    while count < 6:
      relocate farthest active school into vicinity (same ahead rules)
      else spawn new school ahead via getGroupSpawnAnchor()
```

**Removed:** per-fish `respawnFish()` for common fish; timed `GROUP_SPAWN_INTERVAL` throttle (immediate vicinity fill).

### 3.6 Bomb Spawning (Implemented)

```
BOMB_TARGET_COUNT = 5
BOMB_VICINITY_RADIUS = 2000
BOMB_MIN_SEPARATION = 500
BOMB_RESPAWN_DELAY = 10

eachFrame:
  maintainBombs(shark, bombs, deltaSec)
    count active bombs within 2000 px
    while count < 5:
      relocate farthest bomb beyond 2000 px into valid ring position
```

### 3.7 Boundary & Gravity

* Seabed: clamp `Shark.y`.
* Sky: gravity on `velocityY`; horizontal velocity preserved; splash dive to `WATER_SURFACE_Y + peakAirHeight`.

### 3.8 Win / Loss

* **Loss:** HP ≤ 0 → Game Over (Play Again / Quit to menu).
* **Win:** No fixed win — maximize strike score.

---

## 4. UI & Menus

### 4.1 In-Game HUD (top-right)

HP bar (red), boost bar (dark blue), golden ★ score, circular pause (‖). No best score during run.

### 4.2 Main Menu

Title, animated menu shark, best score, settings gear (mock music), **How to play?** (3 slides), mock shark shop, **Play**.

### 4.3 Pause Menu

Resume, Quit to menu, mock Turn off music.

### 4.4 Game Over

Final score, best score, **Play Again**, **Quit to menu**.

### 4.5 How to Play Tutorial

Slide 1: HUD callouts. Slide 2: shark chasing fish. Slide 3: bomb + lionfish split panels.

### 4.6 Audio (Mock)

Music toggle in pause menu and main settings — **no audio playback**. Sound effects not implemented — see §9.

---

## 5. Technical Architecture & Loop Design

### Program Structure

Hybrid **OOP + functional:**

* **OOP:** `Shark`, `Fish`, `Bomb` — position, state, `.draw(ctx)`.
* **Functional:** Input, collision, timers, `maintainFishGroups`, `maintainBombs`, game state, `requestAnimationFrame` loop.
* **Pages:** HTML fragments in `pages/` loaded via `fetch()` (main menu, pause, settings, how-to-play).

### Animation Frame Loop (each frame)

1. Clear canvas; draw world-anchored water gradient background.
2. Process input (mouse, LMB, double-click, pause hit test).
3. Update shark movement (water swim or air physics), boost meter, timers, fish/bomb vicinity systems, entity updates.
4. Evaluate collisions (fish eat, poison, bombs).
5. Render entities, HUD, overlays when paused/menu.

---

## 6. Constants Reference (Current)

| Constant | Value | Notes |
|----------|-------|-------|
| `HUNGER_LIMIT` | `10` | seconds |
| `STARVATION_DRAIN` | `5` | HP/s |
| `HP_REGEN_DELAY` | `2` | seconds |
| `HP_REGEN_RATE` | `10` | HP/s |
| `POISON_DAMAGE` | `20` | total over 4 s |
| `POISON_DURATION` | `4` | seconds |
| `STRIKE_BASE_BONUS` | `5` | points |
| `STRIKE_MAX_BONUS` | `80` | cap per fish |
| `STRIKE_CHAIN_WINDOW` | `2` | seconds |
| `BOOST_MULTIPLIER` | `2` | |
| `BOOST_REGEN_DELAY` | `2` | seconds |
| `BOOST_REGEN_DURATION` | `10` | seconds |
| `GRAVITY` | `520` | px/s² (sky) |
| `BOMB_DAMAGE` | `30` | |
| `BOMB_RESPAWN_DELAY` | `10` | seconds |
| `BOMB_TARGET_COUNT` | `5` | |
| `BOMB_VICINITY_RADIUS` | `2000` | px |
| `BOMB_MIN_SEPARATION` | `500` | px |
| `FISH_TARGET_SCHOOL_COUNT` | `6` | |
| `FISH_VICINITY_RADIUS` | `4000` | px |
| `SCHOOL_SIZE` | `12` | |
| `GROUP_DEPLETED_THRESHOLD` | `3` | |
| `GROUP_SPAWN_AHEAD_MIN/MAX` | `900` / `1500` | px |
| `POISONOUS_FISH_COUNT` | `2` | |
| `HIGH_SCORE_KEY` | `hungry-shark-best-score` | localStorage |

**Deprecated (unused in code):** `MIN_ACTIVE_GROUPS`, `MAX_ACTIVE_GROUPS`, `GROUP_SPAWN_INTERVAL` — replaced by vicinity spawning.

---

## 7. Key Source Files

| Area | File(s) |
|------|---------|
| Constants | `src/config/constant.js` |
| Shark + gravity | `src/domain/shark.js` |
| Fish groups | `src/domain/fishGroups.js` |
| Bombs | `src/domain/bomb.js`, `src/domain/bombGroups.js` |
| Spawn helpers | `src/domain/spawn.js` |
| Drawing / water | `src/domain/drawing.js` |
| Game loop | `src/engine/game.js` |
| HUD / background | `src/engine/render.js` |
| Menus | `src/engine/menu.js`, `src/engine/howToPlay.js`, `src/engine/settings.js` |
| Pages | `pages/*.html`, `css/*.css` |

---

## 8. Testing Checklist

- [ ] 6 fish schools within ~4000 px; schools repopulate when shark swims away
- [ ] 5 bombs within ~2000 px; 10 s respawn after explosion
- [ ] Sky jump: gravity arc; splash depth matches jump height
- [ ] Boost: double-click + hold LMB; drain stops on release
- [ ] Strike chain, hunger, poison DOT, HP regen windows
- [ ] Main menu → play; pause → quit; game over → quit
- [ ] How to play tutorial navigates all 3 slides
- [ ] Best score on menu/game over only (not in-run HUD)

---

## 9. Planned Work

| Item | Description |
|------|-------------|
| **[DEV] Sound effects** | Eat fish, damage, bomb explosion, UI clicks; wire to Web Audio or `<audio>`; extend mock music toggle into a real audio manager |
| **Humans at surface** | High-risk surface targets |
| **Aggressive predator fish** | Chase behavior |

---

## 10. Historical Changelog (Design → Code)

The table below records the original 2026 design migration. All rows except audio are **implemented** as of diary entry 025.

| System | Was (early MVP) | Now (implemented) |
|--------|-----------------|-------------------|
| Common fish | Individual respawn | Groups only; vicinity spawning |
| Poison | Instant −20 | 4 s DOT |
| Hunger | 5 s / −10 HP/s | 10 s / −5 HP/s |
| HP on eat | +5 instant | Delayed regen only |
| Score | Time-based | Strike chain |
| Boost | Fixed burst + cooldown | Meter + hold LMB |
| HUD | Top-left text | Top-right bars |
| Bombs | Single bomb, 5 s respawn | 5 bombs / 2000 px, 10 s respawn |
| Sky | No gravity | Gravity + splash depth |
