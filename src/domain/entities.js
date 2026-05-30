import {
  SCHOOL_SIZE,
  POISONOUS_FISH_COUNT,
} from "../config/constant.js";
import { randomBombPosition, getDefaultSpawnCenterY } from "./spawn.js";
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

export function createInitialEntities(spawnCenter = getDefaultSpawnCenter()) {
  const fishes = createFishSchool(SCHOOL_SIZE, spawnCenter.x, spawnCenter.y);

  for (let i = 0; i < POISONOUS_FISH_COUNT; i++) {
    fishes.push(createPoisonousFish(spawnCenter.x, spawnCenter.y));
  }

  const bombPos = randomBombPosition(spawnCenter.x, spawnCenter.y);
  const bomb = new Bomb(bombPos.x, bombPos.y);

  return { fishes, bomb };
}
