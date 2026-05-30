# Enhance game rules (design doc)

**What I asked the AI:** Update project design documentation for Jira task `[DESIGN] Enhance game rules and add details`. New rules: fish spawn and move as groups (no individual respawn on eat; new groups ahead as shark moves), poison DOT over 4 s with light green signal, hunger 10 s then −5 HP/s with light red signal, strike-based scoring (5 base, 2× chain, 2 s window), boost meter drain/regen (2 s delay, 10 s refill, stoppable), top-right HUD with HP/boost bars and settings menu, remove best score. Bombs unchanged.

**What it gave me:** Expanded `docs/project-design.md` with changelog table, detailed entity specs, state machines, pseudocode for strike scoring and fish group spawning, constants reference, file-level implementation checklist, and testing checklist. README aligned to target rules.

**What was wrong:** Nothing broken — documentation-only pass; code still on old rules (see §7 gap table in project-design.md).

**How I fixed it:** N/A — design phase complete; implementation is the next step.

**Time lost:** ~0 minutes
