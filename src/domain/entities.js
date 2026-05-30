import {
  SCHOOL_SIZE,
  POISONOUS_FISH_COUNT,
} from "../config/constant.js";
import { randomWaterPosition } from "./spawn.js";
import { Bomb } from "./bomb.js";
import {
  createFishSchool,
  createPoisonousFish,
} from "./fish.js";

export function createInitialEntities() {
  const schoolCenter = randomWaterPosition();
  const fishes = createFishSchool(SCHOOL_SIZE, schoolCenter.x, schoolCenter.y);

  for (let i = 0; i < POISONOUS_FISH_COUNT; i++) {
    fishes.push(createPoisonousFish());
  }

  const bombPos = randomWaterPosition();
  const bomb = new Bomb(bombPos.x, bombPos.y);

  return { fishes, bomb };
}
