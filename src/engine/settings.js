import { hideMainMenu, showMainMenu } from "./menu.js";

export function pauseGame(game, dom, input) {
  game.state = "paused";
  input.isMouseDown = false;
  input.doubleClicked = false;
  dom.pauseMenu.classList.remove("hidden");
}

export function resumeGame(game, dom, domain) {
  game.state = "playing";
  dom.pauseMenu.classList.add("hidden");
  domain.lastTimestamp = 0;
}

export function quitToHome(game, dom, input) {
  dom.pauseMenu.classList.add("hidden");
  showMainMenu(game, dom, input);
}

export function openMainSettings(dom) {
  dom.mainSettingsMenu.classList.remove("hidden");
}

export function closeMainSettings(dom) {
  dom.mainSettingsMenu.classList.add("hidden");
}

export function toggleMusic(game, dom) {
  game.musicEnabled = !game.musicEnabled;
  updateMusicButtonLabels(game, dom);
}

export function updateMusicButtonLabels(game, dom) {
  const label = game.musicEnabled ? "♪ Turn off music" : "♪ Turn on music";
  dom.pauseMusicBtn.textContent = label;
  dom.mainSettingsMusicBtn.textContent = label;
}
