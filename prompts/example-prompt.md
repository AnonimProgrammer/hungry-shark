# Example Prompt

Detailed logs of AI interactions referenced from [AI_DIARY.md](../AI_DIARY.md).

## Naming

`NNN-short-kebab-title.md` — zero-padded sequence number + short descriptive slug.

Examples:

- `001-canvas-setup.md`
- `002-shark-movement-bug.md`

## File format

Each file documents one significant AI interaction (especially when something went wrong):

```markdown
# [Short title]

**What I asked the AI:** ...

**What it gave me:** ...

**What was wrong:** ...

**How I fixed it:** ...

**Time lost:** ~X minutes
```

## Diary reference format

In `AI_DIARY.md`, link entries like:

```markdown
### [2026-05-30] — Canvas not clearing between frames
1. [canvas-not-clearing](001-canvas-not-clearing.md) — AI forgot ctx.clearRect() in the loop
```
