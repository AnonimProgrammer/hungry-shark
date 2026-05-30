# Fish group spawning and no respawn on eat

**What I asked the AI:** Combine two Jira tickets — spawn common fish as groups ahead of the shark (maintain 2 active groups) and remove individual common fish respawn on eat.

**What it gave me:** New `fishGroups.js` with `maintainFishGroups`, `spawnFishGroupAhead`, `getGroupSpawnAnchor`; fish carry `groupId`; shark tracks `lastDirX/Y` for travel direction; common fish stay dead when eaten; only poisonous fish use `respawnPoisonFish` / distance recycle.

**What was wrong:** Nothing broken on first pass — `applyDamage` import dropped from collision during refactor and was restored for bomb hits.

**How I fixed it:** (follow-up) Schools spawned 600–900 px in one direction only; stray survivors still counted as full groups and blocked respawn. Closer spawn (280–450 px), angular spread, replenish when total living common fish < 6, slower school drift.

**Later tuning:** 12 fish per group; group depleted at ≤3 fish; min 2 / max 6 active groups; new group every 2s at 900–1500 px ahead.

**Time lost:** ~2 minutes
