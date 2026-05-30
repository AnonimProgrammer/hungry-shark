import {
  WATER_SURFACE_Y,
  SEABED_WORLD_Y,
  FISH_SURFACE_CLEARANCE,
  SEABED_HAZARD_CLEARANCE_MIN,
  SEABED_HAZARD_CLEARANCE_MAX,
  WATER_COLUMN_HEIGHT,
  SPAWN_SPREAD_X,
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
