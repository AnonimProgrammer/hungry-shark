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
  updateMusicButtonLabels,
  openMainSettings,
  closeMainSettings,
} from "./engine/settings.js";
import { bindMockMenuButtons, showMainMenu } from "./engine/menu.js";

async function loadPage(container, path) {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Failed to load ${path}: ${response.status}`);
  }
  container.insertAdjacentHTML("beforeend", await response.text());
}

async function loadOverlays(container) {
  await loadPage(container, "page/main-menu.html");
  await loadPage(container, "page/pause-menu.html");
  await loadPage(container, "page/main-settings.html");
}

function createDomRefs() {
  return {
    mainMenu: document.getElementById("main-menu"),
    gameOverScreen: document.getElementById("game-over-screen"),
    pauseMenu: document.getElementById("pause-menu"),
    mainSettingsMenu: document.getElementById("main-settings-menu"),
    menuSharkCanvas: document.getElementById("menu-shark-canvas"),
    playBtn: document.getElementById("play-btn"),
    restartBtn: document.getElementById("restart-btn"),
    mainSettingsBtn: document.getElementById("main-settings-btn"),
    howToPlayBtn: document.getElementById("how-to-play-btn"),
    sharkShopBtn: document.getElementById("shark-shop-btn"),
    pauseResumeBtn: document.getElementById("pause-resume-btn"),
    pauseQuitBtn: document.getElementById("pause-quit-btn"),
    pauseMusicBtn: document.getElementById("pause-music-btn"),
    mainSettingsMusicBtn: document.getElementById("main-settings-music-btn"),
    mainSettingsCloseBtn: document.getElementById("main-settings-close-btn"),
    finalScoreEl: document.getElementById("final-score"),
    mainMenuHighScoreEl: document.getElementById("main-menu-high-score"),
    gameOverHighScoreEl: document.getElementById("game-over-high-score"),
  };
}

async function init() {
  const container = document.getElementById("game-container");
  await loadOverlays(container);

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
  updateMusicButtonLabels(game, dom);
  showMainMenu(game, dom, input);

  bindMockMenuButtons(dom);

  dom.playBtn.addEventListener("click", () => startGame(game, shark, domain, input, dom));
  dom.restartBtn.addEventListener("click", () => startGame(game, shark, domain, input, dom));
  dom.mainSettingsBtn.addEventListener("click", () => openMainSettings(dom));
  dom.mainSettingsCloseBtn.addEventListener("click", () => closeMainSettings(dom));
  dom.pauseResumeBtn.addEventListener("click", () => resumeGame(game, dom, domain));
  dom.pauseQuitBtn.addEventListener("click", () => quitToHome(game, dom, input));
  dom.pauseMusicBtn.addEventListener("click", () => toggleMusic(game, dom));
  dom.mainSettingsMusicBtn.addEventListener("click", () => toggleMusic(game, dom));

  requestAnimationFrame(createGameLoop(ctx, game, shark, domain, input, dom));
}

init();
