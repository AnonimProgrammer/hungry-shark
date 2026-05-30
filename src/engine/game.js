import {
  STARVATION_DRAIN,
  HIGH_SCORE_KEY,
  ENTITY_RECYCLE_DISTANCE,
  isStarving,
} from "../config/constant.js";
import { createInitialEntities, getDefaultSpawnCenter } from "../domain/entities.js";
import { recycleDistantFish } from "../domain/fish.js";
import { evaluateCollisions } from "./collision.js";
import { updateCamera, screenToWorld } from "./camera.js";
import { render } from "./render.js";

export function createGameState() {
  return {
    state: "start",
    score: 0,
    hungerTimer: 0,
    highScore: 0,
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
  const label = `Best: ${game.highScore}s`;
  dom.startHighScoreEl.textContent = label;
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
  game.score += deltaSec;
  game.hungerTimer += deltaSec;
  shark.isStarving = isStarving(game.hungerTimer);

  if (shark.isStarving) {
    shark.hp = Math.max(0, shark.hp - STARVATION_DRAIN * deltaSec);
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
  dom.finalScoreEl.textContent = `Survived ${Math.floor(game.score)} seconds`;
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
  shark.resetBoost();

  game.score = 0;
  game.hungerTimer = 0;

  const entities = createInitialEntities(spawnCenter);
  domain.fishes = entities.fishes;
  domain.bomb = entities.bomb;

  updateCamera(domain.camera, shark.x, shark.y);

  input.isMouseDown = false;
  input.doubleClicked = false;
  domain.lastTimestamp = 0;
}

export function startGame(game, shark, domain, input, dom) {
  resetGame(game, shark, domain, input);
  game.state = "playing";
  dom.startScreen.classList.add("hidden");
  dom.gameOverScreen.classList.add("hidden");
}

function update(game, shark, domain, input, dom, deltaSec) {
  updateTimers(game, shark, deltaSec);

  const worldMouse = screenToWorld(domain.camera, input.mouseX, input.mouseY);
  shark.rotateToward(worldMouse.x, worldMouse.y);

  if (input.doubleClicked) {
    shark.tryActivateBoost();
    input.doubleClicked = false;
  }

  shark.updateBoost(deltaSec);

  if (input.isMouseDown) {
    shark.moveForward(shark.getSpeed());
  }

  domain.fishes.forEach((fish) => {
    fish.update();
    recycleDistantFish(fish, shark.x, shark.y, ENTITY_RECYCLE_DISTANCE);
  });
  domain.bomb.update(deltaSec, shark.x, shark.y);

  if (shark.hitFlash > 0) {
    shark.hitFlash -= 1;
  }

  updateCamera(domain.camera, shark.x, shark.y);

  evaluateCollisions(shark, domain.fishes, domain.bomb, game);
  checkLoseCondition(game, shark, dom);
}

export function createGameLoop(ctx, game, shark, domain, input, dom) {
  return function gameLoop(timestamp) {
    const deltaSec = domain.lastTimestamp
      ? (timestamp - domain.lastTimestamp) / 1000
      : 0;
    domain.lastTimestamp = timestamp;

    if (game.state === "playing") {
      update(game, shark, domain, input, dom, deltaSec);
    }

    render(ctx, game, shark, domain.fishes, domain.bomb, domain.camera);
    requestAnimationFrame(gameLoop);
  };
}
