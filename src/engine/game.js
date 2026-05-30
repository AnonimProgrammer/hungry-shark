import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  HUNGER_LIMIT,
  STARVATION_DRAIN,
  HIGH_SCORE_KEY,
} from "../config/constant.js";
import { createInitialEntities } from "../domain/entities.js";
import { evaluateCollisions } from "./collision.js";
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

  if (game.hungerTimer >= HUNGER_LIMIT) {
    const starvationDrain = STARVATION_DRAIN * deltaSec;
    shark.hp = Math.max(0, shark.hp - starvationDrain);
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
  shark.x = CANVAS_WIDTH / 2;
  shark.y = CANVAS_HEIGHT / 2;
  shark.angle = 0;
  shark.hp = 100;
  shark.hitFlash = 0;

  game.score = 0;
  game.hungerTimer = 0;

  const entities = createInitialEntities();
  domain.fishes = entities.fishes;
  domain.bomb = entities.bomb;

  input.isMouseDown = false;
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

  shark.rotateToward(input.mouseX, input.mouseY);

  if (input.isMouseDown) {
    shark.moveForward(shark.baseSpeed);
  }

  domain.fishes.forEach((fish) => fish.update());
  domain.bomb.update(deltaSec);

  if (shark.hitFlash > 0) {
    shark.hitFlash -= 1;
  }

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

    render(ctx, game, shark, domain.fishes, domain.bomb);
    requestAnimationFrame(gameLoop);
  };
}
