import {
  BOMB_DAMAGE,
} from "../config/constant.js";
import { respawnPoisonFish } from "../domain/fish.js";
import { applyDamage, applyPoisonContact } from "./hp.js";
import { awardStrikeOnCommonFishEat } from "./score.js";

export function checkCollision(entityA, entityB) {
  const dx = entityA.x - entityB.x;
  const dy = entityA.y - entityB.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance < entityA.radius + entityB.radius;
}

export function handleFishCollisions(shark, fishes, game) {
  fishes.forEach((fish) => {
    if (!fish.active || !checkCollision(shark, fish)) {
      return;
    }

    if (fish.type === "common") {
      game.hungerTimer = 0;
      shark.isStarving = false;
      awardStrikeOnCommonFishEat(game);
      fish.active = false;
    } else if (fish.type === "poisonous") {
      applyPoisonContact(shark, game);
      fish.active = false;
      respawnPoisonFish(fish, shark.x, shark.y);
    }
  });
}

export function handleBombCollisions(shark, bombs, game) {
  bombs.forEach((bomb) => {
    if (bomb.active && checkCollision(shark, bomb)) {
      applyDamage(shark, game, BOMB_DAMAGE);
      shark.hitFlash = 12;
      bomb.explode();
    }
  });
}

export function evaluateCollisions(shark, fishes, bombs, game) {
  handleFishCollisions(shark, fishes, game);
  handleBombCollisions(shark, bombs, game);
}
