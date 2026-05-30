import {
  SCHOOL_SIZE,
  MIN_ACTIVE_GROUPS,
  MAX_ACTIVE_GROUPS,
  GROUP_DEPLETED_THRESHOLD,
  GROUP_SPAWN_INTERVAL,
  POISONOUS_FISH_COUNT,
} from "../config/constant.js";
import {
  getDefaultSpawnCenterY,
  getGroupSpawnAnchor,
  randomBombPosition,
} from "./spawn.js";
import { Bomb } from "./bomb.js";
import {
  createFishSchool,
  createPoisonousFish,
} from "./fish.js";

export function getDefaultSpawnCenter() {
  return {
    x: 0,
    y: getDefaultSpawnCenterY(),
  };
}

/** Group counts as active only while it has more than GROUP_DEPLETED_THRESHOLD fish. */
export function countActiveCommonFishInGroup(fishes, groupId) {
  return fishes.filter(
    (fish) =>
      fish.type === "common" && fish.active && fish.groupId === groupId
  ).length;
}

export function countActiveCommonGroups(fishes) {
  const groupIds = new Set();

  fishes.forEach((fish) => {
    if (fish.type === "common" && fish.active && Number.isInteger(fish.groupId)) {
      groupIds.add(fish.groupId);
    }
  });

  let activeCount = 0;
  groupIds.forEach((groupId) => {
    if (countActiveCommonFishInGroup(fishes, groupId) > GROUP_DEPLETED_THRESHOLD) {
      activeCount += 1;
    }
  });

  return activeCount;
}

export function spawnFishGroupAhead(shark, fishes, nextGroupId, spawnIndex, totalSpawns) {
  const anchor = getGroupSpawnAnchor(shark, spawnIndex, totalSpawns);
  const school = createFishSchool(SCHOOL_SIZE, anchor.x, anchor.y, nextGroupId);
  fishes.push(...school);
  return nextGroupId + 1;
}

function ensureMinimumGroups(shark, fishes, domain) {
  let nextGroupId = domain.nextGroupId ?? 0;
  let spawned = 0;

  while (
    countActiveCommonGroups(fishes) < MIN_ACTIVE_GROUPS &&
    spawned < MIN_ACTIVE_GROUPS
  ) {
    nextGroupId = spawnFishGroupAhead(
      shark,
      fishes,
      nextGroupId,
      spawned,
      MIN_ACTIVE_GROUPS
    );
    spawned += 1;
  }

  domain.nextGroupId = nextGroupId;
}

export function maintainFishGroups(shark, fishes, domain, deltaSec) {
  ensureMinimumGroups(shark, fishes, domain);

  domain.groupSpawnTimer = (domain.groupSpawnTimer ?? 0) + deltaSec;

  if (domain.groupSpawnTimer < GROUP_SPAWN_INTERVAL) {
    return;
  }

  domain.groupSpawnTimer = 0;

  if (countActiveCommonGroups(fishes) >= MAX_ACTIVE_GROUPS) {
    return;
  }

  domain.nextGroupId = spawnFishGroupAhead(
    shark,
    fishes,
    domain.nextGroupId ?? 0,
    0,
    1
  );
}

export function createInitialEntities(shark, spawnCenter = getDefaultSpawnCenter()) {
  const fishes = [];

  for (let i = 0; i < POISONOUS_FISH_COUNT; i++) {
    fishes.push(createPoisonousFish(spawnCenter.x, spawnCenter.y));
  }

  const bombPos = randomBombPosition(spawnCenter.x, spawnCenter.y);
  const bomb = new Bomb(bombPos.x, bombPos.y);

  const domain = { nextGroupId: 0, groupSpawnTimer: 0 };
  ensureMinimumGroups(shark, fishes, domain);

  return {
    fishes,
    bomb,
    nextGroupId: domain.nextGroupId,
    groupSpawnTimer: 0,
  };
}
