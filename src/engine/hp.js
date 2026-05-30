import {
  HP_REGEN_DELAY,
  HP_REGEN_RATE,
  POISON_DAMAGE,
  POISON_DURATION,
  POISON_TICK_RATE,
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
  shark.poisonDamageRemaining = POISON_DAMAGE;
  game.hpRegenTimer = 0;
}

function applyPoisonDot(shark, game, deltaSec) {
  if (shark.poisonTimer <= 0) {
    shark.poisonDamageRemaining = 0;
    shark.isPoisoned = false;
    return;
  }

  shark.isPoisoned = true;

  const tickAmount = Math.min(
    shark.poisonDamageRemaining,
    POISON_TICK_RATE * deltaSec
  );

  if (tickAmount > 0) {
    applyDamage(shark, game, tickAmount);
    shark.poisonDamageRemaining -= tickAmount;
  }

  shark.poisonTimer = Math.max(0, shark.poisonTimer - deltaSec);

  if (shark.poisonTimer <= 0) {
    shark.poisonDamageRemaining = 0;
    shark.isPoisoned = false;
  }
}

export function updateHpRegen(game, shark, deltaSec) {
  applyPoisonDot(shark, game, deltaSec);

  const regenBlocked =
    shark.isStarving || shark.isPoisoned || game.hpLostThisFrame;

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
  shark.poisonDamageRemaining = 0;
  shark.isPoisoned = false;
  game.hpRegenTimer = 0;
  game.hpLostThisFrame = false;
}
