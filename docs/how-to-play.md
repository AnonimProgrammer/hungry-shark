# How to play

Quick reference for playing Hungry Shark. Full rules, constants, and HUD spec live in [Project design](project-design.md) (§3–§4).

---

## Menus

| Screen | Actions |
|--------|---------|
| **Main menu** | **▶ Play** starts a run. **How to play?** opens a 3-slide tutorial. **⚙ Settings** (gear) — mock music toggle. Best score shown top-right. |
| **Pause** (in-game **‖** button, top-right) | **Resume**, **Quit to menu**, mock **Turn off music**. |
| **Game over** | **Play Again** or **Quit to menu**. Shows run score and best score. |

---

## Controls

| Input | Action |
|-------|--------|
| **Mouse move** | Shark rotates to face the cursor (in water only) |
| **Left mouse button (hold)** | Swim forward along current angle toward the cursor |
| **Double-click + hold LMB** | Boost at 2× speed while the boost meter drains (must double-click and keep holding to boost again after release) |
| **Jump above water** | Swim up through the surface — gravity takes over in the sky; you cannot steer freely while airborne |

---

## Objective

Hunt common fish schools to reset hunger and rack up **strike score**. Chain eats within 2 seconds to double each bonus (5 → 10 → 20 → …). Avoid lionfish (poison) and underwater bombs.

---

## Win / lose

| Outcome | Condition |
|---------|-----------|
| **Win** | No fixed win state — maximize score through efficient school hunting. |
| **Lose** | HP drops to 0 from starvation, poison, or bomb damage. Game Over overlay shows final score. |

---

## Hunger & HP

**Starvation:** no common fish within **10 seconds** → **−5 HP/sec** (light red glow).

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

**Double-click + hold LMB** for 2× speed. Meter drains **only while boosting and swimming**; release LMB to stop. After **2 seconds** idle, meter regenerates from empty to full in **10 seconds**.

---

## Sky & water

- **Water** darkens with depth (lighter at the surface, darker near the seabed).
- **Above the surface**, gravity pulls the shark down. Jump angle determines fall arc; landing splashes back in to a depth equal to how high you jumped.

---

## HUD

Top-right overlay: red **HP** bar, dark blue **Boost** bar, golden **★ score** below, circular **pause** button to the right of HP. Best score is **not** shown during a run — only on the main menu and game over screen (`localStorage`).

---

## Audio (planned)

Music toggle buttons exist but **no sound effects or music play yet**. **[DEV] Sound effects** (eat, hit, explosion, UI) are planned — see [Project design §9](project-design.md#9-planned-work).
