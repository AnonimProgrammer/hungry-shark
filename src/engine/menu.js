import { drawSharkSprite } from "../domain/drawing.js";
import { getSharkSprite } from "./assets.js";
import { MENU_SHARK_SPRITE_HEIGHT } from "../config/constant.js";

let menuSharkFrameId = null;

export function startMenuSharkAnimation(canvas) {
  stopMenuSharkAnimation();

  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  let time = 0;

  function frame() {
    const menu = document.getElementById("main-menu");
    if (!menu || menu.classList.contains("hidden")) {
      menuSharkFrameId = null;
      return;
    }

    time += 0.025;
    const bob = Math.sin(time) * 8;
    const wiggle = Math.sin(time * 0.7) * 0.08;

    ctx.clearRect(0, 0, width, height);
    drawSharkSprite(
      ctx,
      getSharkSprite(),
      width / 2,
      height / 2 + bob,
      wiggle,
      MENU_SHARK_SPRITE_HEIGHT
    );

    menuSharkFrameId = requestAnimationFrame(frame);
  }

  menuSharkFrameId = requestAnimationFrame(frame);
}

export function stopMenuSharkAnimation() {
  if (menuSharkFrameId !== null) {
    cancelAnimationFrame(menuSharkFrameId);
    menuSharkFrameId = null;
  }
}

export function showMainMenu(game, dom, input) {
  game.state = "menu";
  input.isMouseDown = false;
  input.doubleClicked = false;

  dom.mainMenu.classList.remove("hidden");
  dom.pauseMenu.classList.add("hidden");
  dom.mainSettingsMenu.classList.add("hidden");
  dom.gameOverScreen.classList.add("hidden");

  startMenuSharkAnimation(dom.menuSharkCanvas);
}

export function hideMainMenu(dom) {
  dom.mainMenu.classList.add("hidden");
  stopMenuSharkAnimation();
}

export function bindMockMenuButtons(dom) {
  dom.howToPlayBtn.addEventListener("click", () => {
    console.info("[mock] How to play — coming soon");
  });

  dom.sharkShopBtn.addEventListener("click", () => {
    console.info("[mock] Shark shop — coming soon");
  });
}
