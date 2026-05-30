import { CANVAS_WIDTH, CANVAS_HEIGHT } from "./config/constant.js";
import { Shark } from "./domain/shark.js";
import { createInitialEntities } from "./domain/entities.js";
import { createInputState, bindInput } from "./engine/input.js";
import {
  createGameState,
  loadHighScore,
  updateHighScoreDisplay,
  startGame,
  createGameLoop,
} from "./engine/game.js";

const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");

const dom = {
  startScreen: document.getElementById("start-screen"),
  gameOverScreen: document.getElementById("game-over-screen"),
  startBtn: document.getElementById("start-btn"),
  restartBtn: document.getElementById("restart-btn"),
  finalScoreEl: document.getElementById("final-score"),
  startHighScoreEl: document.getElementById("start-high-score"),
  gameOverHighScoreEl: document.getElementById("game-over-high-score"),
};

const game = createGameState();
const shark = new Shark(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
const input = createInputState();

const { fishes, bomb } = createInitialEntities();
const domain = { fishes, bomb, lastTimestamp: 0 };

bindInput(canvas, input, () => game.state);

game.highScore = loadHighScore();
updateHighScoreDisplay(game, dom);

dom.startBtn.addEventListener("click", () => startGame(game, shark, domain, input, dom));
dom.restartBtn.addEventListener("click", () => startGame(game, shark, domain, input, dom));

requestAnimationFrame(createGameLoop(ctx, game, shark, domain, input, dom));
