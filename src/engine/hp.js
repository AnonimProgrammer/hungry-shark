import {
  HP_REGEN_DELAY,
  HP_REGEN_RATE,
  POISON_DURATION,
} from "../config/constant.js";

export function applyDamage(shark, game, amount) {
  if (amount <= 0) {
    return;
  }

  shark.hp = Math.max(0, shark.hp - amount);
  game.hpRegenTimer = 0;
  game.hpLostThisFrame = true;
}

export function applyPoisonContact(shark, game) {
  shark.poisonTimer = POISON_DURATION;
  game.hpRegenTimer = 0;
}

function tickPoisonTimer(shark, deltaSec) {
  if (shark.poisonTimer > 0) {
    shark.poisonTimer = Math.max(0, shark.poisonTimer - deltaSec);
  }
}

export function updateHpRegen(game, shark, deltaSec) {
  tickPoisonTimer(shark, deltaSec);

  const regenBlocked =
    shark.isStarving || shark.poisonTimer > 0 || game.hpLostThisFrame;

  if (regenBlocked) {
    game.hpRegenTimer = 0;
    return;
  }

  game.hpRegenTimer += deltaSec;

  if (game.hpRegenTimer >= HP_REGEN_DELAY && shark.hp < 100) {
    shark.hp = Math.min(100, shark.hp + HP_REGEN_RATE * deltaSec);
  }
}

export function resetHpState(shark, game) {
  shark.poisonTimer = 0;
  game.hpRegenTimer = 0;
  game.hpLostThisFrame = false;
}
