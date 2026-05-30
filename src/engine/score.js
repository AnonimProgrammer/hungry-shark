import {
  STRIKE_BASE_BONUS,
  STRIKE_CHAIN_WINDOW,
  STRIKE_MULTIPLIER,
} from "../config/constant.js";

export function awardStrikeOnCommonFishEat(game) {
  const bonus =
    game.strikeChainTimer > 0
      ? game.lastBonus * STRIKE_MULTIPLIER
      : STRIKE_BASE_BONUS;

  game.score += bonus;
  game.lastBonus = bonus;
  game.strikeChainTimer = STRIKE_CHAIN_WINDOW;
}

export function updateStrikeChain(game, deltaSec) {
  if (game.strikeChainTimer <= 0) {
    return;
  }

  game.strikeChainTimer -= deltaSec;

  if (game.strikeChainTimer <= 0) {
    game.strikeChainTimer = 0;
    game.lastBonus = 0;
  }
}

export function resetStrikeState(game) {
  game.score = 0;
  game.strikeChainTimer = 0;
  game.lastBonus = 0;
}
