# Poisonous fish + spawn randomization

**What I asked the AI:** Add poisonous fish (green, solo) that are eaten on collision but deal −20 HP; update spawn randomization for schools, poison fish, and bomb; change bomb from instant kill to −30 HP per contact.

**What it gave me:** `createInitialEntities()` randomizes school center, solo poisonous fish (`POISONOUS_FISH_COUNT`), and bomb position on start/restart; poisonous collision eats and respawns the fish while applying `POISON_DAMAGE`; bomb uses edge-triggered contact (`touchingShark`) so −30 HP applies once per touch, not every frame.

**What was wrong:** Nothing

**How I fixed it:** Nothing

**Time lost:** ~0 minutes
