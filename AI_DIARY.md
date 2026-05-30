# AI Diary — Hungry Shark

A log of AI-assisted development for this project. Each numbered entry below links to a detailed prompt file in [`prompts/`](prompts/). Keep this file as a clean index; put the full conversation breakdown in the linked file.

---

## AI Tools Used

| Tool | Why |
|------|-----|
| **Cursor (Claude)** | Primary coding assistant — inline edits, repo context, and iterative debugging in the IDE |
| _(add others as you use them)_ | e.g. ChatGPT free, Gemini free for brainstorming or quick questions |

---

## Entries

<!-- Add new entries at the top. Format:
### [YYYY-MM-DD] — Short title
{order number (e.g. 1, 2, 3 ...)}. [prompt-title](prompts/00N-prompt-title.md) — one-line summary
-->

### [2026-05-30] — Score & lose condition
3. [score-lose](prompts/003-score-lose.md) — Survival score, starvation drain, HUD, game-over when HP = 0

### [2026-05-30] — Collision (fish & bomb)
2. [collision-fish-bomb](prompts/002-collision-fish-bomb.md) — Fish school, bomb hazard, circle collision + eat/damage

### [2026-05-30] — Player movement (Shark + mouse swim)
1. [player-movement](prompts/001-player-movement.md) — Shark class, mouse aim, LMB hold to swim forward

---

## How to Add an Entry

1. Create `prompts/NNN-short-kebab-title.md` (next number in sequence, e.g. `001-canvas-setup.md`).
2. Fill in the prompt file using the template below.
3. Add a dated line to **Entries** above linking to that file.

### Prompt file template

```markdown
# [Short title]

**What I asked the AI:** ...

**What it gave me:** ...

**What was wrong:** ...

**How I fixed it:** ...

**Time lost:** ~X minutes
```
