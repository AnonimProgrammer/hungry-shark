import {
  WATER_SURFACE_Y,
  SEABED_WORLD_Y,
  FISH_SURFACE_CLEARANCE,
  SEABED_HAZARD_CLEARANCE_MIN,
  SEABED_HAZARD_CLEARANCE_MAX,
  WATER_COLUMN_HEIGHT,
  SPAWN_SPREAD_X,
  GROUP_SPAWN_AHEAD_MIN,
  GROUP_SPAWN_AHEAD_MAX,
  GROUP_SPAWN_ANGLE_SPREAD,
} from "../config/constant.js";

const WATER_BOUNDS = {
  surfaceY: WATER_SURFACE_Y,
  seabedY: SEABED_WORLD_Y,
  fishMinY: WATER_SURFACE_Y + FISH_SURFACE_CLEARANCE,
  fishMaxY: SEABED_WORLD_Y - 30,
  commonFishMaxY: WATER_SURFACE_Y + WATER_COLUMN_HEIGHT * 0.65,
  hazardMinY: WATER_SURFACE_Y + WATER_COLUMN_HEIGHT * 0.5,
  poisonMinY: WATER_SURFACE_Y + WATER_COLUMN_HEIGHT * 0.55,
};

export function getWaterBounds() {
  return WATER_BOUNDS;
}

function randomHazardMaxY() {
  return (
    SEABED_WORLD_Y -
    (SEABED_HAZARD_CLEARANCE_MIN +
      Math.random() * (SEABED_HAZARD_CLEARANCE_MAX - SEABED_HAZARD_CLEARANCE_MIN))
  );
}

function randomPositionInBand(centerX, centerY, minY, maxY) {
  const safeMinY = Math.min(minY, maxY);
  const safeMaxY = Math.max(minY, maxY);

  return {
    x: centerX + (Math.random() - 0.5) * SPAWN_SPREAD_X * 2,
    y: safeMinY + Math.random() * (safeMaxY - safeMinY),
  };
}

export function randomCommonFishPosition(centerX, centerY) {
  const bounds = getWaterBounds();
  return randomPositionInBand(
    centerX,
    centerY,
    bounds.fishMinY,
    Math.min(bounds.commonFishMaxY, bounds.fishMaxY)
  );
}

export function randomPoisonFishPosition(centerX, centerY) {
  const bounds = getWaterBounds();
  return randomPositionInBand(
    centerX,
    centerY,
    bounds.poisonMinY,
    randomHazardMaxY()
  );
}

export function randomBombPosition(centerX, centerY) {
  const bounds = getWaterBounds();
  return randomPositionInBand(
    centerX,
    centerY,
    bounds.hazardMinY,
    randomHazardMaxY()
  );
}

export function getFishVerticalBounds(radius, type = "common") {
  const bounds = getWaterBounds();
  const minY =
    type === "poisonous"
      ? bounds.poisonMinY + radius
      : bounds.fishMinY + radius;
  const maxY =
    type === "common"
      ? Math.min(bounds.commonFishMaxY, bounds.fishMaxY) - radius
      : bounds.fishMaxY - radius;

  return { minY, maxY };
}

export function getDefaultSpawnCenterY() {
  return WATER_SURFACE_Y + WATER_COLUMN_HEIGHT * 0.35;
}

function getSharkForward(shark) {
  const len = Math.hypot(shark.lastDirX, shark.lastDirY);
  if (len > 0.01) {
    return { x: shark.lastDirX / len, y: shark.lastDirY / len };
  }

  return { x: Math.cos(shark.angle), y: Math.sin(shark.angle) };
}

export function getGroupSpawnAnchor(shark, spawnIndex = 0, totalSpawns = 1) {
  const bounds = getWaterBounds();
  const forward = getSharkForward(shark);
  const baseAngle = Math.atan2(forward.y, forward.x);
  const center = (totalSpawns - 1) / 2;
  const spreadAngle = (spawnIndex - center) * GROUP_SPAWN_ANGLE_SPREAD;
  const angle = baseAngle + spreadAngle;
  const distance =
    GROUP_SPAWN_AHEAD_MIN +
    Math.random() * (GROUP_SPAWN_AHEAD_MAX - GROUP_SPAWN_AHEAD_MIN);

  const minY = bounds.fishMinY + 10;
  const maxY = Math.min(bounds.commonFishMaxY, bounds.fishMaxY) - 10;

  return {
    x: shark.x + Math.cos(angle) * distance,
    y: Math.max(minY, Math.min(maxY, shark.y + Math.sin(angle) * distance)),
  };
}
