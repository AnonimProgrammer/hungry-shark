# Start & game over screens

**What I asked the AI:** Add a start screen and game over screen for the mandatory `feat: start & game over screen` milestone.

**What it gave me:** HTML overlay panels over the canvas — start screen with title, instructions, and Start button; game over screen with final survival score. Game state starts at `start`, transitions to `playing` on button click, then `gameOver` on death.

**What was wrong:** On page load, the game title and rules stacked on top of each other. On game over, "Game Over" and the survived-seconds text overlapped the same way — unreadable UI.

**How I fixed it:** Removed `line-height: 0` from `#game-container` (it was inherited by overlay text and collapsed every line). Wrapped screen content in a `.screen-panel` with explicit `line-height`, `gap`, and margins reset on headings/paragraphs.

**Time lost:** ~5 minutes
