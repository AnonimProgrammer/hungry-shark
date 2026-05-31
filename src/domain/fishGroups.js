import {
  SCHOOL_SIZE,
  GROUP_DEPLETED_THRESHOLD,
  POISONOUS_FISH_COUNT,
  FISH_VICINITY_RADIUS,
  FISH_TARGET_SCHOOL_COUNT,
} from "../config/constant.js";
import {
  getDefaultSpawnCenterY,
  getGroupSpawnAnchor,
} from "./spawn.js";
import { createInitialBombs } from "./bombGroups.js";
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

export function getActiveGroupIds(fishes) {
  const groupIds = new Set();

  fishes.forEach((fish) => {
    if (fish.type === "common" && fish.active && Number.isInteger(fish.groupId)) {
      groupIds.add(fish.groupId);
    }
  });

  return [...groupIds].filter(
    (groupId) =>
      countActiveCommonFishInGroup(fishes, groupId) > GROUP_DEPLETED_THRESHOLD
  );
}

export function countActiveCommonGroups(fishes) {
  return getActiveGroupIds(fishes).length;
}

function getGroupAnchor(fishes, groupId) {
  const members = fishes.filter(
    (fish) => fish.type === "common" && fish.active && fish.groupId === groupId
  );

  if (members.length === 0) {
    return null;
  }

  const x = members.reduce((sum, fish) => sum + fish.x, 0) / members.length;
  const y = members.reduce((sum, fish) => sum + fish.y, 0) / members.length;
  return { x, y };
}

function distanceToShark(x, y, sharkX, sharkY) {
  return Math.hypot(x - sharkX, y - sharkY);
}

function countSchoolsNearShark(fishes, sharkX, sharkY) {
  return getActiveGroupIds(fishes).filter((groupId) => {
    const anchor = getGroupAnchor(fishes, groupId);
    if (!anchor) {
      return false;
    }
    return distanceToShark(anchor.x, anchor.y, sharkX, sharkY) <= FISH_VICINITY_RADIUS;
  }).length;
}

function findFarthestActiveGroup(fishes, sharkX, sharkY) {
  let farthestGroupId = null;
  let farthestDistance = FISH_VICINITY_RADIUS;

  getActiveGroupIds(fishes).forEach((groupId) => {
    const anchor = getGroupAnchor(fishes, groupId);
    if (!anchor) {
      return;
    }

    const dist = distanceToShark(anchor.x, anchor.y, sharkX, sharkY);
    if (dist > farthestDistance) {
      farthestDistance = dist;
      farthestGroupId = groupId;
    }
  });

  return farthestGroupId;
}

export function spawnFishGroupAhead(shark, fishes, nextGroupId, spawnIndex, totalSpawns) {
  const anchor = getGroupSpawnAnchor(shark, spawnIndex, totalSpawns);
  const school = createFishSchool(SCHOOL_SIZE, anchor.x, anchor.y, nextGroupId);
  fishes.push(...school);
  return nextGroupId + 1;
}

function relocateSchool(shark, fishes, groupId, spawnIndex, totalSpawns) {
  const anchor = getGroupSpawnAnchor(shark, spawnIndex, totalSpawns);

  fishes.forEach((fish) => {
    if (fish.type !== "common" || !fish.active || fish.groupId !== groupId) {
      return;
    }

    fish.x = anchor.x + (Math.random() - 0.5) * 80;
    fish.y = anchor.y + (Math.random() - 0.5) * 50;
    fish.speedX = (Math.random() - 0.5) * 0.9;
    fish.speedY = (Math.random() - 0.5) * 0.7;
  });
}

function ensureVicinitySchools(shark, fishes, domain) {
  let nearbyCount = countSchoolsNearShark(fishes, shark.x, shark.y);
  let spawnIndex = 0;
  let safety = 0;

  while (
    nearbyCount < FISH_TARGET_SCHOOL_COUNT &&
    safety < FISH_TARGET_SCHOOL_COUNT * 3
  ) {
    safety += 1;
    const before = nearbyCount;
    const farGroupId = findFarthestActiveGroup(fishes, shark.x, shark.y);

    if (farGroupId !== null) {
      relocateSchool(
        shark,
        fishes,
        farGroupId,
        spawnIndex,
        FISH_TARGET_SCHOOL_COUNT
      );
      nearbyCount = countSchoolsNearShark(fishes, shark.x, shark.y);
      if (nearbyCount > before) {
        spawnIndex += 1;
        continue;
      }
    }

    domain.nextGroupId = spawnFishGroupAhead(
      shark,
      fishes,
      domain.nextGroupId ?? 0,
      spawnIndex,
      FISH_TARGET_SCHOOL_COUNT
    );
    nearbyCount = countSchoolsNearShark(fishes, shark.x, shark.y);
    spawnIndex += 1;

    if (nearbyCount <= before) {
      break;
    }
  }
}

export function maintainFishGroups(shark, fishes, domain) {
  ensureVicinitySchools(shark, fishes, domain);
}

export function createInitialEntities(shark, spawnCenter = getDefaultSpawnCenter()) {
  const fishes = [];

  for (let i = 0; i < POISONOUS_FISH_COUNT; i++) {
    fishes.push(createPoisonousFish(spawnCenter.x, spawnCenter.y));
  }

  const bombs = createInitialBombs(spawnCenter.x, spawnCenter.y);

  const domain = { nextGroupId: 0 };
  ensureVicinitySchools(shark, fishes, domain);

  return {
    fishes,
    bombs,
    nextGroupId: domain.nextGroupId,
  };
}
