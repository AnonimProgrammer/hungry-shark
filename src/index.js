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
import {
  resumeGame,
  quitToHome,
  toggleMusic,
  updateMusicButtonLabel,
} from "./engine/settings.js";

async function loadSettingsMenu(container) {
  const response = await fetch("page/settings-menu.html");
  if (!response.ok) {
    throw new Error(`Failed to load settings menu: ${response.status}`);
  }
  container.insertAdjacentHTML("beforeend", await response.text());
}

function createDomRefs() {
  return {
    startScreen: document.getElementById("start-screen"),
    gameOverScreen: document.getElementById("game-over-screen"),
    settingsMenu: document.getElementById("settings-menu"),
    startBtn: document.getElementById("start-btn"),
    restartBtn: document.getElementById("restart-btn"),
    settingsResumeBtn: document.getElementById("settings-resume-btn"),
    settingsQuitBtn: document.getElementById("settings-quit-btn"),
    settingsMusicBtn: document.getElementById("settings-music-btn"),
    finalScoreEl: document.getElementById("final-score"),
    startHighScoreEl: document.getElementById("start-high-score"),
    gameOverHighScoreEl: document.getElementById("game-over-high-score"),
  };
}

async function init() {
  const container = document.getElementById("game-container");
  await loadSettingsMenu(container);

  const canvas = document.getElementById("game-canvas");
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  const ctx = canvas.getContext("2d");
  const dom = createDomRefs();

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
  updateMusicButtonLabel(game, dom);

  dom.startBtn.addEventListener("click", () => startGame(game, shark, domain, input, dom));
  dom.restartBtn.addEventListener("click", () => startGame(game, shark, domain, input, dom));
  dom.settingsResumeBtn.addEventListener("click", () => resumeGame(game, dom, domain));
  dom.settingsQuitBtn.addEventListener("click", () => quitToHome(game, dom, input));
  dom.settingsMusicBtn.addEventListener("click", () => toggleMusic(game, dom));

  requestAnimationFrame(createGameLoop(ctx, game, shark, domain, input, dom));
}

init();
