import {
  POISON_DAMAGE,
  BOMB_DAMAGE,
} from "../config/constant.js";
import { respawnFish } from "../domain/fish.js";

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
      shark.hp = Math.min(100, shark.hp + 5);
      game.hungerTimer = 0;
    } else if (fish.type === "poisonous") {
      shark.hp = Math.max(0, shark.hp - POISON_DAMAGE);
      shark.hitFlash = 12;
    }

    fish.active = false;
    respawnFish(fish, shark.x, shark.y);
  });
}

export function handleBombCollision(shark, bomb) {
  if (bomb.active && checkCollision(shark, bomb)) {
    shark.hp = Math.max(0, shark.hp - BOMB_DAMAGE);
    shark.hitFlash = 12;
    bomb.explode();
  }
}

export function evaluateCollisions(shark, fishes, bomb, game) {
  handleFishCollisions(shark, fishes, game);
  handleBombCollision(shark, bomb);
}
