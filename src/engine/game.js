import {
  STARVATION_DRAIN,
  HIGH_SCORE_KEY,
  ENTITY_RECYCLE_DISTANCE,
  isStarving,
} from "../config/constant.js";
import { createInitialEntities, getDefaultSpawnCenter } from "../domain/entities.js";
import { maintainFishGroups } from "../domain/fishGroups.js";
import { maintainBombs } from "../domain/bombGroups.js";
import { recycleDistantPoisonFish } from "../domain/fish.js";
import { evaluateCollisions } from "./collision.js";
import { applyDamage, resetHpState, updateHpRegen } from "./hp.js";
import { resetStrikeState, updateStrikeChain } from "./score.js";
import { updateCamera, screenToWorld } from "./camera.js";
import { render } from "./render.js";
import { pauseGame } from "./settings.js";
import { hideMainMenu } from "./menu.js";
import { closeHowToPlayPanel } from "./howToPlay.js";

export function createGameState() {
  return {
    state: "menu",
    score: 0,
    strikeChainTimer: 0,
    lastBonus: 0,
    hungerTimer: 0,
    hpRegenTimer: 0,
    hpLostThisFrame: false,
    highScore: 0,
    musicEnabled: true,
  };
}

export function loadHighScore() {
  const stored = localStorage.getItem(HIGH_SCORE_KEY);
  return stored !== null ? Number(stored) : 0;
}

function saveHighScore(score) {
  localStorage.setItem(HIGH_SCORE_KEY, String(score));
}

export function updateHighScoreDisplay(game, dom) {
  const label = `Best: ${game.highScore}`;
  dom.mainMenuHighScoreEl.textContent = label;
  dom.gameOverHighScoreEl.textContent = label;
}

function recordHighScore(game, dom) {
  const runScore = Math.floor(game.score);

  if (runScore > game.highScore) {
    game.highScore = runScore;
    saveHighScore(runScore);
  }

  updateHighScoreDisplay(game, dom);
}

function updateTimers(game, shark, deltaSec) {
  game.hungerTimer += deltaSec;
  shark.isStarving = isStarving(game.hungerTimer);
  updateStrikeChain(game, deltaSec);

  if (shark.isStarving) {
    applyDamage(shark, game, STARVATION_DRAIN * deltaSec);
  }
}

function checkLoseCondition(game, shark, dom) {
  if (shark.hp <= 0) {
    shark.hp = 0;
    game.state = "gameOver";
    showGameOverScreen(game, dom);
  }
}

function showGameOverScreen(game, dom) {
  recordHighScore(game, dom);
  dom.finalScoreEl.textContent = `Score: ${Math.floor(game.score)}`;
  dom.gameOverScreen.classList.remove("hidden");
}

export function resetGame(game, shark, domain, input) {
  const spawnCenter = getDefaultSpawnCenter();
  shark.x = spawnCenter.x;
  shark.y = spawnCenter.y;
  shark.angle = 0;
  shark.hp = 100;
  shark.hitFlash = 0;
  shark.isStarving = false;
  resetHpState(shark, game);
  shark.resetBoost();
  shark.resetAirborne();

  resetStrikeState(game);
  game.hungerTimer = 0;
  shark.lastDirX = Math.cos(shark.angle);
  shark.lastDirY = Math.sin(shark.angle);

  const entities = createInitialEntities(shark, spawnCenter);
  domain.fishes = entities.fishes;
  domain.bombs = entities.bombs;
  domain.nextGroupId = entities.nextGroupId;

  updateCamera(domain.camera, shark.x, shark.y);

  input.isMouseDown = false;
  input.doubleClicked = false;
  domain.lastTimestamp = 0;
}

export function startGame(game, shark, domain, input, dom) {
  resetGame(game, shark, domain, input);
  game.state = "playing";
  hideMainMenu(dom);
  closeHowToPlayPanel(dom);
  dom.gameOverScreen.classList.add("hidden");
  dom.pauseMenu.classList.add("hidden");
  dom.mainSettingsMenu.classList.add("hidden");
}

function update(game, shark, domain, input, dom, deltaSec) {
  game.hpLostThisFrame = false;
  updateTimers(game, shark, deltaSec);

  const worldMouse = screenToWorld(domain.camera, input.mouseX, input.mouseY);
  const isSwimming = input.isMouseDown && !shark.isAirborne;

  if (input.doubleClicked) {
    shark.armBoost();
    input.doubleClicked = false;
  }

  shark.updateBoost(deltaSec, isSwimming);
  shark.updateMovement(deltaSec, isSwimming, worldMouse.x, worldMouse.y);

  domain.fishes.forEach((fish) => {
    fish.update();
    recycleDistantPoisonFish(fish, shark.x, shark.y, ENTITY_RECYCLE_DISTANCE);
  });
  maintainFishGroups(shark, domain.fishes, domain);
  maintainBombs(shark, domain.bombs, deltaSec);

  if (shark.hitFlash > 0) {
    shark.hitFlash -= 1;
  }

  updateCamera(domain.camera, shark.x, shark.y);

  evaluateCollisions(shark, domain.fishes, domain.bombs, game);
  updateHpRegen(game, shark, deltaSec);
  checkLoseCondition(game, shark, dom);
}

export function createGameLoop(ctx, game, shark, domain, input, dom) {
  return function gameLoop(timestamp) {
    if (game.state === "playing") {
      const deltaSec = domain.lastTimestamp
        ? (timestamp - domain.lastTimestamp) / 1000
        : 0;
      domain.lastTimestamp = timestamp;

      if (input.pauseClicked) {
        pauseGame(game, dom, input);
        input.pauseClicked = false;
      } else {
        update(game, shark, domain, input, dom, deltaSec);
      }
    }

    render(ctx, game, shark, domain.fishes, domain.bombs, domain.camera);
    requestAnimationFrame(gameLoop);
  };
}
