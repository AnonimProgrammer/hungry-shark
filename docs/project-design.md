# Project Design Documentation

## Project Title: Hungry Shark MVP (Vanilla JS Browser Game)

This documentation serves as the blueprint for a browser-based, 2D underwater survival game built strictly with **HTML5, CSS3, and Vanilla JavaScript** (no external libraries, game engines, or frameworks). The core gameplay loop focuses on a player-controlled shark navigating an ocean ecosystem, hunting schools of fish while managing hunger and environmental hazards.

---

## 1. Environmental Architecture & Screen Layout

The game field uses a fixed-camera coordinate viewport divided horizontally into distinct physics and logic zones from top to bottom:

* **Sky Zone (Top Area):** The region above the ocean surface line. This acts as a temporary aerial boundary. The shark can use momentum to break the surface and jump into the sky, where a global gravity variable immediately takes effect, pulling the shark down until it re-enters the water.
* **Water Surface Line:** A definitive horizontal coordinate threshold separating the Sky Zone from the main play area. It acts as the trigger boundary for changing states between underwater swimming and airborne gravity.
* **Water Zone (Main Play Area):** A **light-blue filled canvas region** where the bulk of the gameplay takes place. The shark swims freely here, schools of fish spawn and wander, and environmental hazards float.
* **Bottom Line & Seabed (Floor Area):** A **dark-brown filled solid boundary** at the base of the canvas. This acts as a hard collision limit; the shark’s downward coordinate updates are strictly stopped here, preventing the player from swimming past the visible ocean floor.

---

## 2. Comprehensive Entity Blueprint

### Player Character: The Shark
* **Visual Representation:** A primary animated body shape (ellipse/polygon) that dynamically rotates on its center point.
* **Core Stats:** * Health Points (HP): Ranges from `0` to `100` (Starts at `100`).
    * Hunger Status Tracker: Counts seconds elapsed since the last feeding.
    * Speed Boost Status: State-machine tracking `READY`, `ACTIVE`, or `COOLDOWN`.
* **Movement Controls:** * *Directional Facing:* The shark's head/nose always looks and rotates towards the active coordinates of the **Mouse Cursor**.
    * *Standard Swim:* Holding down the **Left Mouse Button (LMB)** moves the shark forward along its current angle towards the cursor.
    * *Speed Boost:* Double-clicking and holding **LMB** doubles ($2\times$) the swimming speed for a brief $2\text{ to }3\text{ second}$ burst. Once finished, the boost goes on a temporary timed cooldown before regenerating back to a `READY` state.

### Consumables: Fish Varieties
Fish are dynamic entities spawned programmatically into the Water Zone:
* **Common Fish (Orange Circles):** These represent the primary food supply. To mimic natural behavior, they spawn and travel together in tight **schools/groups**. Colliding with one awards the shark $+5\text{ HP}$ (capped at $100$) and completely resets the starvation timer.
* **Poisonous Fish (Green Circles):** A rare, hazardous variant. Unlike the common fish, these swim **completely alone**. Consuming a poisonous fish hurts the shark, dealing contact damage and reducing HP.

### Hazards: Underwater Bomb
* **Visual Representation:** A distinct, dark, spiky circular object.
* **Behavior:** A slow-moving or static hazard positioned in the Water Zone. For the initial Minimum Viable Product (MVP), players must actively avoid contact with it. In immediate subsequent updates, touching a bomb will inflict heavy instantaneous damage (e.g., $-30\text{ HP}$).

### Future Extensions (Dashed Scope Boundary)
* **Humans:** Surface-level entities (swimmers or fishers in boats) restricted to the Water Surface line, serving as high-risk, high-reward targets.
* **Advanced Bad Fish:** Additional aggressive marine predators that track and attack the player.

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
Standard Swim Speed                            2x Speed Boost (2-3s)
         │                                             │
         └──────────────────────┬──────────────────────┘
                                ▼
                     [ SHARK COORDINATES ]
                                │
       ┌────────────────────────┼────────────────────────┐
       ▼                        ▼                        ▼
  (Y < Surface)         (Y > Bottom Line)       (Touch Fish/Bomb)
       │                        │                        │
       ▼                        ▼                        ▼
  Apply Gravity Vector       Stop Y-Movement        Trigger Collision
  (Pull back to Ocean)      (Lock to Seabed)       (Apply HP Changes)
```

* **The Starvation Mechanic:** The game enforces a strict survival window. If the shark does not collide with a common orange fish within any rolling $5\text{-second}$ window, a starvation state triggers. This state drains player life rapidly at a rate of $-10\text{ HP per second}$ until food is successfully caught.
* **Boundary Enforcement:**
    * If `Shark.y < WaterSurface.y`: Physics simulation applies an acceleration down ($+y$).
    * If `Shark.y > BottomLine.y`: Physics sets `Shark.y = BottomLine.y`, stopping downward momentum completely.
* **Win/Loss Conditions:** The game runs continuously via a main frame loop. If the `Shark.hp` drops to $\le 0$ due to starvation or damage, the loop terminates immediately and triggers a "Game Over" overlay screen showing the player's final survival duration or score.

---

## 4. Technical Architecture & Loop Design

### Program Structure
The project uses a clean **hybrid approach**:
* **Object-Oriented Programming (OOP)** is used to construct individual game elements. Classes like `Shark`, `Fish`, and `Bomb` manage internal properties (position vectors, speeds, active states) and feature a `.draw(ctx)` method to handle their canvas renderings.
* **Functional Programming** handles global logic. Universal operations like event tracking, basic 2D radial/box collision functions (`checkCollision(entity1, entity2)`), state changes, and the core animation loop run as decoupled global functions.

### The Animation Frame Loop
Executed at the monitor's native refresh rate using `requestAnimationFrame()`, each frame performs these operations in order:
1.  **Clear Canvas:** Wipes the viewport clean using `ctx.clearRect()`.
2.  **Process Input:** Reads active mouse position and click states.
3.  **Update Physics & Logic:** Computes new player positions, registers speed modifiers, checks timers, and updates fish arrays.
4.  **Evaluate Collisions:** Loops through entity arrays to detect overlaps.
5.  **Render Graphics:** Draws the background layout colors (light blue ocean, dark brown floor), paints active objects, and updates the text-based Head-Up Display (HUD) overlay tracking player status.
