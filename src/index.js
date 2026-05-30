import { CANVAS_WIDTH, CANVAS_HEIGHT } from "./config/constant.js";
import { Shark } from "./domain/shark.js";
import { createInitialEntities, getDefaultSpawnCenter } from "./domain/entities.js";
import { createInputState, bindInput } from "./engine/input.js";
import { createCamera, updateCamera } from "./engine/camera.js";
import {
  createGameState,
  loadHighScore,
  updateHighScoreDisplay,
  startGame,
  createGameLoop,
} from "./engine/game.js";

const canvas = document.getElementById("game-canvas");
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
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

const spawnCenter = getDefaultSpawnCenter();
const game = createGameState();
const shark = new Shark(spawnCenter.x, spawnCenter.y);
const input = createInputState();
const camera = createCamera();

const { fishes, bomb, nextGroupId } = createInitialEntities(shark, spawnCenter);
const domain = { fishes, bomb, camera, lastTimestamp: 0, nextGroupId, groupSpawnTimer: 0 };

updateCamera(camera, shark.x, shark.y);

bindInput(canvas, input, () => game.state);

game.highScore = loadHighScore();
updateHighScoreDisplay(game, dom);

dom.startBtn.addEventListener("click", () => startGame(game, shark, domain, input, dom));
dom.restartBtn.addEventListener("click", () => startGame(game, shark, domain, input, dom));

requestAnimationFrame(createGameLoop(ctx, game, shark, domain, input, dom));
