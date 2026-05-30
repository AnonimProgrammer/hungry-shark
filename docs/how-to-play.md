# How to play

Quick reference for playing Hungry Shark. Full rules, constants, and HUD spec live in [Project design](project-design.md) (§3–§4).

---

## Controls

| Input | Action |
|-------|--------|
| **Mouse move** | Shark rotates to face the cursor |
| **Left mouse button (hold)** | Swim forward along current angle toward the cursor |
| **Double-click** | Activate boost (drains boost meter while in use) |

---

## Objective

Hunt common fish schools to reset hunger and rack up **strike score**. Chain eats within 2 seconds to double each bonus (5 → 10 → 20 → …). Avoid poisonous fish and underwater bombs.

---

## Win / lose

| Outcome | Condition |
|---------|-----------|
| **Win** | No fixed win state — maximize score through efficient school hunting. |
| **Lose** | HP drops to 0 from starvation, poison, or bomb damage. Game Over overlay shows final score. |

---

## Hunger & HP

**Starvation:** no common fish within **10 seconds** → **−5 HP/sec** (light red signal).

**HP regen:** no instant heal on eat. Regen **+10 HP/sec** starts only after **2 seconds** with no starvation, no active poison, and no HP loss (bombs, poison ticks, or starvation). Cap: 100 HP.

---

## Strike scoring

| Rule | Value |
|------|-------|
| First fish in a chain | +5 points |
| Each next fish (within 2s) | Previous bonus × 2, **max +80 per fish** |
| Chain expires | After 2 seconds without eating |

Example chain: 5 → 10 → 20 → 40 → 80 → 80 → 80 (stays at cap).

---

## Boost

Double-click toggles boost (2× speed). Meter drains **only while boosting** and stops when boost is off. After **2 seconds** idle, meter regenerates from empty to full in **10 seconds**.

---

## HUD & settings

Top-right overlay: red HP bar, dark blue boost bar (no numeric HP), golden score below. Settings (⚙) offers Continue, Restart, and a mock Turn off music toggle. Best score is shown on start and game-over screens only (persisted in `localStorage`).
