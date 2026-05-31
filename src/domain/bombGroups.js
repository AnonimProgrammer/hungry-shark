import {
  BOMB_TARGET_COUNT,
  BOMB_VICINITY_RADIUS,
} from "../config/constant.js";
import { findBombSpawnPosition } from "./spawn.js";
import { Bomb } from "./bomb.js";

function distanceToShark(bomb, sharkX, sharkY) {
  return Math.hypot(bomb.x - sharkX, bomb.y - sharkY);
}

function countBombsNearShark(bombs, sharkX, sharkY) {
  return bombs.filter(
    (bomb) =>
      bomb.active &&
      !bomb.exploding &&
      distanceToShark(bomb, sharkX, sharkY) <= BOMB_VICINITY_RADIUS
  ).length;
}

export function createInitialBombs(sharkX, sharkY) {
  const bombs = [];

  for (let i = 0; i < BOMB_TARGET_COUNT; i++) {
    const pos = findBombSpawnPosition(sharkX, sharkY, bombs);
    bombs.push(new Bomb(pos.x, pos.y));
  }

  return bombs;
}

function relocateBomb(bomb, shark, bombs) {
  const pos = findBombSpawnPosition(
    shark.x,
    shark.y,
    bombs.filter((candidate) => candidate !== bomb),
    bomb
  );
  bomb.x = pos.x;
  bomb.y = pos.y;
}

export function maintainBombs(shark, bombs, deltaSec) {
  bombs.forEach((bomb) => bomb.update(deltaSec, shark, bombs));

  let nearbyCount = countBombsNearShark(bombs, shark.x, shark.y);
  if (nearbyCount >= BOMB_TARGET_COUNT) {
    return;
  }

  const relocationCandidates = bombs
    .filter(
      (bomb) =>
        bomb.active &&
        !bomb.exploding &&
        distanceToShark(bomb, shark.x, shark.y) > BOMB_VICINITY_RADIUS
    )
    .sort(
      (a, b) =>
        distanceToShark(b, shark.x, shark.y) - distanceToShark(a, shark.x, shark.y)
    );

  for (const bomb of relocationCandidates) {
    if (nearbyCount >= BOMB_TARGET_COUNT) {
      break;
    }
    relocateBomb(bomb, shark, bombs);
    nearbyCount = countBombsNearShark(bombs, shark.x, shark.y);
  }
}
