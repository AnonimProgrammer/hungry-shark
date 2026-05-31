# Main menu screen

**What I asked the AI:** Add main menu on game open — title, animated shark center, best score left, mock How to play, settings (music only), mock shark shop button, play button bottom-right.

**What it gave me:** `pages/main-menu.html`, `pages/main-settings.html`, `pages/pause-menu.html`, `css/main-menu.css`, `src/engine/menu.js`. Flow: menu → play → game; quit returns to main menu; old start screen removed.

**What was wrong:** Layout needed several passes — best score moved to top-right beside settings; title clipped once menu shark was enlarged; settings ⚙ emoji sat off-center in its circle; play and shark shop buttons were different sizes/colors; `page/` folder renamed to `pages/`.

**How I fixed it:** Top-right header (best score + SVG gear settings); footer row with matching 92px cyan 🦈 / ▶ buttons and centered “How to play?”; title+shark block lowered (`top: 54%`, centered transform); menu shark sprite at 440px; responsive canvas width.

**Time lost:** ~15 minutes
