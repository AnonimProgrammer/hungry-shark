# Project Design Documentation

## Project Title: Hungry Shark (Vanilla JS Browser Game)

Blueprint for a browser-based, 2D underwater survival game built strictly with **HTML5, CSS3, and Vanilla JavaScript** (no external libraries, game engines, or frameworks). The player controls a shark in a dynamic ocean, hunts schools of fish, and manages hunger, boost energy, and environmental hazards.

**Design revision:** Enhanced game rules — fish group spawning, strike-based scoring, poison over time, updated hunger/boost mechanics, and HUD redesign.

---

## 0. Rules Changelog (Current → Target)

| System | Current (implemented) | Target (this document) |
|--------|----------------------|-------------------------|
| **Common fish** | One school at start; eaten fish **respawn individually** near shark | Fish exist only in **groups**; eaten fish are **gone forever**; **new groups** spawn ahead as shark explores |
| **Poisonous fish** | Instant −20 HP on contact | **20 HP over 4 seconds** (DOT); shark **light green** while poisoned |
| **Hunger** | 5 s without food → −10 HP/s | **10 s** without food → **−5 HP/s**; shark **light red** while starving |
| **HP recovery** | +5 HP instantly on eating common fish | **No instant heal**; regen **+10 HP/s** after **2 s** clear of starvation, poison, and damage (cap 100) |
| **Score** | Time-based (`+deltaSec` every frame) | **Fish strike chain** — base +5, each next fish within 2 s doubles previous bonus |
| **Boost** | Fixed 2.5 s burst + 5 s cooldown; cannot stop early | **Meter-based** — drains while active, **stops when not boosting**; regen after **2 s idle**, **10 s** empty→full |
| **HUD** | Top-left text (HP number, hunger timer, best score) | **Top-right** bars (HP red, boost dark blue), golden score, settings menu |
| **Best score** | Shown on HUD + start/game-over screens + localStorage | **Removed from in-game HUD only**; kept on start/game-over screens (localStorage persists best strike score) |
| **Bombs** | Explosion VFX, −30 HP, respawn delay | **Unchanged** — approved as-is |

Use §7 as the implementation checklist when updating code.

---

## 1. Environmental Architecture & Screen Layout

The game uses a **dynamic world** with a camera that follows the shark. The viewport is a window into unbounded ocean coordinates — entities move in world space; only the camera position is fixed relative to the screen.

* **Sky Zone (Top Area):** Region above the ocean surface. The shark can swim into the sky. No gravity — movement is not pulled downward in the sky zone; seabed collision still applies below.
* **Water Surface Line:** Horizontal world coordinate separating Sky from the main play area.
* **Water Zone (Main Play Area):** Light-blue canvas region where gameplay happens. Fish **groups** spawn ahead of the shark; hazards float in the lower water column.
* **Bottom Line & Seabed (Floor Area):** Dark-brown solid boundary. The shark’s downward coordinate is clamped here.

**Spawn philosophy:** Content is placed relative to the shark’s world position and travel direction. New fish **groups** appear in unexplored areas ahead — not as individual respawns at eaten locations. The map should feel populated by schools the player discovers while moving, not by endless local respawns around the shark.

---

## 2. Comprehensive Entity Blueprint

### Player Character: The Shark

* **Visual:** Animated body shape (ellipse/polygon) rotating on its center point toward the mouse cursor.
* **Core stats:**
    * **HP:** `0`–`100` (starts at `100`).
    * **Hunger timer:** Seconds since last common-fish meal (see §3.1).
    * **HP regen timer:** Seconds since last blocking condition cleared — gates delayed heal (see §3.1).
    * **Boost meter:** `0`–`100`% depletable/regenerating resource (see §3.2).
    * **Poison timer:** Remaining DOT duration when poisoned (see §3.4).
    * **Strike chain timer:** Countdown for score multiplier window (see §3.3).
* **Status tints** (body color override while effect is active):
    * **Light red** (`#ef9a9a` or similar) — starvation drain active.
    * **Light green** (`#a5d6a7` or similar) — poison DOT active.
    * Default body color when neither applies.
    * *If both active simultaneously:* poison green takes visual priority (documented choice for implementation).
* **Movement:**
    * **Mouse aim:** Head/nose rotates toward cursor.
    * **LMB hold:** Swim forward along current angle toward cursor at base speed (or boost speed when boosting).
    * **Double-click:** Engage boost mode while meter > 0 (see §3.2).

### Consumables: Fish Varieties

#### Common Fish (Orange — School Groups)

Common fish never exist as isolated spawns. They always belong to a **group**.

**Group lifecycle:**

1. **Spawn together** — A group of `SCHOOL_SIZE` fish (default: 6–8) appears at one world anchor point, placed **ahead of the shark** in the direction of recent travel (or default forward if stationary).
2. **Disperse locally** — Each fish immediately swims toward a slightly different nearby position within a small radius of the anchor (~80 px horizontal, ~50 px vertical spread). They continue autonomous drift/swim within water bounds. This mimics a school breaking apart slightly while staying loosely clustered.
3. **On eat** — Fish is consumed and **removed permanently** (`active = false`, no respawn). **No individual respawn at close distance after death.**
4. **Group replenishment** — When the shark moves into new territory, **new groups** spawn ahead. Maintain a target number of active groups in the “frontier” around the shark (implementation: spawn when group count drops below threshold or shark travels far enough from last spawn).

**On eat effects:**
* Reset hunger timer to `0` (ends starvation immediately — one of three regen blockers cleared; see §3.1).
* Award strike score (§3.3).
* **No instant HP restore** — recovery is passive regen while fed, not a direct heal on contact.

#### Poisonous Fish (Green — Solo)

* **Count:** Intentionally small (default: 2) — rare hazard, not a swarm.
* **Behavior:** Swim **alone**, not in schools. Solo spawn and optional solo respawn at distance after eaten (small population maintained).
* **Poison damage:** Contact applies **20 HP total over 4 seconds** as damage-over-time — **not** instant −20.
    * Recommended tick: **5 HP/s for 4 s** (or smooth fractional drain totalling 20).
    * Re-contact while already poisoned: **refresh** the 4 s duration (reset DOT, do not stack beyond 20 per application cycle).
* **Visual feedback:** Shark **light green** for the duration of active poison DOT.
* **On eat:** Fish consumed and removed; may respawn at a distant solo position (unchanged population target).

### Hazards: Underwater Bomb

* **Visual:** Dark, spiky circular object.
* **Behavior:** Slow-moving or static in the lower water column.
* **Status:** **Approved as-is** — spawn placement, explosion VFX, respawn delay (`BOMB_RESPAWN_DELAY = 5 s`), and contact damage (−30 HP) remain unchanged unless a future pass says otherwise.

### Future Extensions (Out of Scope)

* **Humans:** Surface swimmers or boats — high-risk, high-reward targets.
* **Advanced Bad Fish:** Aggressive predators that chase the player.

---

## 3. Game State & Logic Rules

```
                       [ MOUSE MOVEMENT ]
                                │
                                ▼
                     Shark Rotates to Cursor
                                │
         ┌──────────────────────┴──────────────────────┐
   [ LMB HOLD ]                                [ DOUBLE CLICK ]
         │                                             │
         ▼                                             ▼
Standard Swim Speed                         Toggle / Engage Boost
         │                                    (drains meter while active)
         └──────────────────────┬──────────────────────┘
                                ▼
                     [ SHARK COORDINATES ]
                                │
       ┌────────────────────────┼────────────────────────┐
       ▼                        ▼                        ▼
  (Explore World)         (Y > Seabed)            (Touch Fish/Bomb)
       │                        │                        │
       ▼                        ▼                        ▼
  Spawn New Fish Groups    Stop Y-Movement         Trigger Collision
  Ahead of Shark           (Lock to Seabed)        (Score / HP / DOT)
```

### 3.1 Hunger & HP Regeneration

#### Starvation (hunger)

| Rule | Value |
|------|-------|
| Grace period | **10 seconds** without eating a common fish |
| Starvation drain | **−5 HP per second** once grace period expires |
| Status signal | Shark **light red** while starvation drain is active |
| Reset | Eating any common fish sets hunger timer to `0` and stops drain immediately |

**Starving** = `hungerTimer ≥ HUNGER_LIMIT` (10 s since last common-fish meal).

#### HP regeneration

Regen is **passive** — no instant heal on eating fish. Recovery only runs when the shark has been **safe** for long enough.

| Rule | Value |
|------|-------|
| Regen rate | **+10 HP per second** once conditions met |
| Regen delay | **2 seconds** continuously clear of all blocking conditions (below) |
| Cap | HP clamped to **100** |

**Regen is blocked** while any of these apply:

| Blocker | Meaning |
|---------|---------|
| **Starving** | `hungerTimer ≥ HUNGER_LIMIT` (10 s without common fish) |
| **Poisoned** | Active poison DOT (`poisonTimer > 0`) |
| **Damaged** | Any HP loss this frame (bomb hit, poison tick, starvation tick) |

All three must be **absent for 2 full seconds** before regen begins. Any blocker starting or any HP loss **resets** the regen timer to `0`.

**Pseudocode:**

```
onHpLoss(amount):                  // bomb, poison tick, starvation tick
  shark.hp = max(0, shark.hp - amount)
  hpRegenTimer = 0

onPoisonContact():
  poisonTimer = POISON_DURATION     // 4 s — blocks regen entire duration
  hpRegenTimer = 0

onEatCommonFish():
  hungerTimer = 0                   // ends starvation only; does not skip poison/damage blocks

eachFrame(deltaSec):
  hungerTimer += deltaSec
  const starving = hungerTimer >= HUNGER_LIMIT
  const poisoned = poisonTimer > 0

  if (starving) shark.hp -= STARVATION_DRAIN * deltaSec   // also triggers onHpLoss reset
  if (poisoned) applyPoisonTick(deltaSec)                   // ticks trigger onHpLoss reset

  if (starving || poisoned || hpLostThisFrame):
    hpRegenTimer = 0
  else:
    hpRegenTimer += deltaSec
    if (hpRegenTimer >= HP_REGEN_DELAY && shark.hp < 100):
      shark.hp = min(100, shark.hp + HP_REGEN_RATE * deltaSec)
```

**Examples:**
* Eat fish at 50 HP while poisoned → hunger resets, but regen stays off until poison ends **plus** 2 s.
* Bomb hit at 80 HP → regen off; after 2 s with no starvation/poison/damage, regen +10/s toward 100.
* Starvation ends on eat → still need 2 s without poison or new damage before regen starts.

Starvation, poison, and bomb damage remain independent sources of HP loss — they can stack in the same frame.

### 3.2 Boost Mechanic

Replaces the old timed burst (`BOOST_DURATION` / `BOOST_COOLDOWN` state machine).

| Rule | Value |
|------|-------|
| Activation | **Double-click** engages boost (2× swim speed while meter > 0) |
| Consumption | Meter **decreases only while boost is actively in use** |
| Stop | When boost is **not** in use, consumption **stops immediately** — meter does not keep draining |
| Regen delay | **2 seconds** after last boost use before regeneration begins |
| Regen duration | **10 seconds** to refill from empty to full |
| Depletion | At 0%, boost speed unavailable until partially or fully regenerated |

**Boost state machine (target):**

```
                    ┌─────────────────────────────────────┐
                    │            IDLE (not boosting)       │
                    │  meter holds current level           │
                    │  after 2s idle → REGENERATING        │
                    └──────────┬──────────────▲────────────┘
                               │              │
                    double-click│              │ meter full
                    meter > 0  │              │ or player stops
                               ▼              │
                    ┌─────────────────────────────────────┐
                    │         BOOSTING (active)            │
                    │  2× speed, meter drains per frame    │
                    └──────────┬──────────────────────────┘
                               │ meter = 0
                               ▼
                    ┌─────────────────────────────────────┐
                    │         DEPLETED                     │
                    │  normal speed only; regen after 2s   │
                    └─────────────────────────────────────┘
```

**Implementation note:** Double-click toggles boost on. Boost turns off when the player double-clicks again **or** when the meter hits 0 — either event stops drain. Regeneration clock starts when boosting stops.

### 3.3 Strike Scoring (Fish-Based Score)

Score is **not** time-based. Points come **only** from eating common fish.

| Rule | Value |
|------|-------|
| Base bonus (first fish in chain) | **+5** points |
| Chain multiplier | Each consecutive fish eaten **within the chain window** awards **2× the previous fish’s bonus** |
| Chain window | **2 seconds** — timer resets on each eat; if it expires with no eat, chain resets to base |
| Example (rapid 8-fish school hunt) | 5 → 10 → 20 → 40 → 80 → 160 → 320 → 640 |

**Pseudocode:**

```
onEatCommonFish():
  if strikeChainTimer > 0:
    bonus = lastBonus * 2
  else:
    bonus = STRIKE_BASE_BONUS   // 5
  score += bonus
  lastBonus = bonus
  strikeChainTimer = STRIKE_CHAIN_WINDOW   // 2.0 s

eachFrame(deltaSec):
  if strikeChainTimer > 0:
    strikeChainTimer -= deltaSec
    if strikeChainTimer <= 0:
      lastBonus = 0   // chain expired; next eat starts at 5
```

### 3.4 Poison DOT

| Rule | Value |
|------|-------|
| Total damage | **20 HP** |
| Duration | **4 seconds** |
| Tick rate | **5 HP/s** (or equivalent smooth drain) |
| Status signal | Shark **light green** while `poisonTimer > 0` |
| Re-contact | Refresh duration to 4 s; do not stack multiple concurrent DOT instances |

### 3.5 Fish Group Spawning (Algorithm Sketch)

```
TARGET_ACTIVE_GROUPS = 2        // tunable — keeps map from feeling empty
GROUP_SPAWN_AHEAD_DISTANCE = 600–900 px from shark, biased in travel direction

eachFrame():
  activeGroups = countGroupsWithLivingFish()
  if activeGroups < TARGET_ACTIVE_GROUPS:
    spawnAnchor = shark.position + forwardVector * GROUP_SPAWN_AHEAD_DISTANCE
    createFishSchool(SCHOOL_SIZE, spawnAnchor.x, spawnAnchor.y)

onEatCommonFish(fish):
  fish.active = false
  // NO respawnFish() call for common fish

onSharkMovedFarFromGroup():
  // optional: despawn empty/depleted groups behind shark to save entities
```

**Remove:** `respawnFish()` for common fish in collision handler. **Remove or repurpose:** `recycleDistantFish()` — distant eaten fish should not recycle; only living fish in active groups matter.

Poisonous fish may still use distance-based recycle or solo respawn — small count, unchanged feel.

### 3.6 Boundary Enforcement

* If `Shark.y > Seabed.y`: clamp `Shark.y = Seabed.y`.
* Sky zone: no gravity (see §1).

### 3.7 Win / Loss Conditions

* **Loss:** `Shark.hp ≤ 0` from starvation, poison, or bomb → Game Over overlay with **final score** (strike points, not seconds).
* **Win:** No fixed win state — survive and maximize score through efficient school hunting.

---

## 4. HUD & Settings UI

All in-game HUD elements anchor to the **top-right** of the viewport (not top-left).

### 4.1 Layout (top → bottom, right-aligned)

```
                              [=========] HP  [⚙]
                              [=========]
                              Score: 1234
                              (golden)
```

| Element | Specification |
|---------|---------------|
| **HP bar** | Horizontal bar, **red** fill on dark track. Label `HP` immediately to the **right** of the bar. **No numeric HP.** Concept: `[=============] HP` |
| **Boost bar** | Directly **below** HP bar. **Dark blue** fill (`#1565c0` or similar) on dark track. Same dimensions as HP bar. **No numeric text.** |
| **Score** | **Below** boost bar. **Golden** font (`#ffd700` / `#ffc107`). Shows current run strike score (integer). |
| **Best score** | **Not shown** on the in-game HUD. |
| **Settings ⚙** | Icon/button to the **right** of the HP bar row. Opens overlay/panel with three items |

### 4.2 Settings Menu (Mock)

| Option | Behavior |
|--------|----------|
| **Continue game** | Closes menu; game resumes (pause while menu open — implementation choice) |
| **Restart** | Calls `resetGame()` — full state reset, returns to playing or start per existing flow |
| **Turn off music** | Mock toggle — no audio system yet; button exists for future wiring |

### 4.3 Game Over Screen (updated copy)

* Show **final score** as points: e.g. `Score: 340` — not `Survived N seconds`.
* **Keep best score** line: e.g. `Best: 1200` (highest strike score from localStorage).

### 4.4 Start Screen (updated copy)

* Update instructions to reflect: 10 s hunger window, strike scoring, boost meter, fish schools.
* **Keep best score** display: e.g. `Best: 1200`.

---

## 5. Technical Architecture & Loop Design

### Program Structure

Hybrid **OOP + functional**:

* **OOP:** `Shark`, `Fish`, `Bomb` — position, state, `.draw(ctx)`.
* **Functional:** Input, collision, timers, game state, `requestAnimationFrame` loop.

### Animation Frame Loop (each frame)

1. **Clear canvas** — `ctx.clearRect()`.
2. **Process input** — mouse position, LMB, double-click / boost toggle.
3. **Update logic** — movement, boost meter drain/regen, hunger timer, HP regen timer, poison DOT, strike chain timer, fish group spawning, entity updates.
4. **Evaluate collisions** — score, HP, DOT, fish removal (no common-fish respawn).
5. **Render** — background, entities with status tints, top-right HUD, settings affordance.

---

## 6. Constants Reference (Target)

| Constant | Target value | Notes |
|----------|--------------|-------|
| `HUNGER_LIMIT` | `10` (seconds) | was `5` |
| `STARVATION_DRAIN` | `5` (HP/s) | was `10` |
| `HP_REGEN_DELAY` | `2` (seconds) | clear of starvation, poison, and damage before regen |
| `HP_REGEN_RATE` | `10` (HP/s) | while regen active |
| `POISON_TOTAL_DAMAGE` | `20` | was instant |
| `POISON_DURATION` | `4` (seconds) | new |
| `POISON_TICK_RATE` | `5` (HP/s) | optional helper |
| `STRIKE_BASE_BONUS` | `5` (points) | new |
| `STRIKE_CHAIN_WINDOW` | `2` (seconds) | new |
| `STRIKE_MULTIPLIER` | `2` | per consecutive fish |
| `BOOST_REGEN_DELAY` | `2` (seconds) | replaces cooldown |
| `BOOST_REGEN_DURATION` | `10` (seconds) | replaces fixed burst refill |
| `BOOST_MULTIPLIER` | `2` | unchanged |
| `BOMB_DAMAGE` | `30` | unchanged |
| `BOMB_RESPAWN_DELAY` | `5` | unchanged |
| `SCHOOL_SIZE` | `6`–`8` | group size |
| `POISONOUS_FISH_COUNT` | `2` | unchanged |
| `TARGET_ACTIVE_GROUPS` | `2` | new — spawn ahead logic |

**Remove or deprecate:** `BOOST_DURATION`, `BOOST_COOLDOWN`, `BOOST_STATES` (READY/ACTIVE/COOLDOWN).

**Keep:** `HIGH_SCORE_KEY` — persists best **strike score** (points), shown on start/game-over screens only.

---

## 7. Implementation Gap Checklist

Map each target rule to likely code touchpoints:

| Area | Current file(s) | Change required |
|------|-----------------|-----------------|
| Fish group spawn / no respawn | `src/domain/fish.js`, `src/domain/entities.js`, `src/engine/collision.js`, `src/engine/game.js` | Remove `respawnFish()` for common fish; add ahead-of-shark group spawning; track groups |
| Poison DOT | `src/engine/collision.js`, `src/domain/shark.js`, `src/engine/game.js` | Replace instant damage with 4 s DOT timer; light green tint |
| Hunger & HP regen | `src/config/constant.js`, `src/engine/game.js` | Starvation + HP regen (+10/s after 2s clear of starve/poison/damage); light red tint |
| Strike score | `src/engine/game.js`, `src/engine/collision.js` | Remove `score += deltaSec`; add chain state + bonus on fish eat |
| Boost meter | `src/domain/shark.js`, `src/config/constant.js`, `src/engine/input.js` | Replace burst/cooldown FSM with meter drain/regen; toggle off support |
| HUD bars | `src/engine/render.js`, `css/style.css`, possibly `index.html` | Top-right layout; HP red bar, boost dark blue bar, golden score; no numbers |
| Settings menu | `index.html`, `css/style.css`, `src/index.js` | ⚙ button + Continue / Restart / Music mock |
| Best score (HUD only) | `src/engine/render.js` | Remove best score from in-game HUD; keep on start/game-over via `game.js` / `index.html` |
| Start/game-over copy | `index.html`, `src/engine/game.js` | Update score labels to points; keep best score display (localStorage) |
| Bombs | — | **No changes** |

---

## 8. Testing Checklist (Post-Implementation)

- [ ] Eat common fish → score +5, hunger resets, fish gone, no respawn at that spot
- [ ] Eat 3 fish within 2 s each → score +5, +10, +20
- [ ] Wait 2 s after eat → next fish scores +5 again
- [ ] 10 s without food → light red shark, −5 HP/s; no regen while starving
- [ ] Eat fish while damaged → regen only after 2 s with no starvation, poison, or HP loss
- [ ] Bomb or poison → regen paused; resumes 2 s after last damage/poison clears
- [ ] Eat fish → no instant HP bump; hunger reset only (does not bypass poison/damage blocks)
- [ ] Poisonous fish → light green shark, −20 HP over 4 s total
- [ ] Double-click boost → 2× speed, meter drains; stop boosting → drain stops
- [ ] 2 s after boost stops → meter refills over 10 s
- [ ] New fish groups appear ahead as shark swims — map never feels permanently empty
- [ ] HUD top-right: red HP bar, dark blue boost bar, golden score — no best score on HUD
- [ ] Start and game-over screens still show best score (points, localStorage)
- [ ] Settings menu: continue, restart, music mock all respond
- [ ] Game over shows point score, not survival seconds
- [ ] Bombs still behave exactly as before
