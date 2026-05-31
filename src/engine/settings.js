export function pauseGame(game, dom, input) {
  game.state = "paused";
  input.isMouseDown = false;
  input.doubleClicked = false;
  dom.settingsMenu.classList.remove("hidden");
}

export function resumeGame(game, dom, domain) {
  game.state = "playing";
  dom.settingsMenu.classList.add("hidden");
  domain.lastTimestamp = 0;
}

export function quitToHome(game, dom, input) {
  game.state = "start";
  input.isMouseDown = false;
  input.doubleClicked = false;
  dom.settingsMenu.classList.add("hidden");
  dom.startScreen.classList.remove("hidden");
  dom.gameOverScreen.classList.add("hidden");
}

export function toggleMusic(game, dom) {
  game.musicEnabled = !game.musicEnabled;
  updateMusicButtonLabel(game, dom);
}

export function updateMusicButtonLabel(game, dom) {
  dom.settingsMusicBtn.textContent = game.musicEnabled
    ? "♪ Turn off music"
    : "♪ Turn on music";
}
