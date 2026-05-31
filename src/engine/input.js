import { CANVAS_WIDTH, CANVAS_HEIGHT } from "../config/constant.js";
import { isPauseButtonHit } from "./render.js";

export function createInputState() {
  return {
    mouseX: CANVAS_WIDTH / 2,
    mouseY: CANVAS_HEIGHT / 2,
    isMouseDown: false,
    doubleClicked: false,
    pauseClicked: false,
  };
}

function canvasCoords(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  return {
    x: (event.clientX - rect.left) * scaleX,
    y: (event.clientY - rect.top) * scaleY,
  };
}

export function bindInput(canvas, input, getGameState) {
  canvas.addEventListener("mousemove", (event) => {
    const { x, y } = canvasCoords(canvas, event);
    input.mouseX = x;
    input.mouseY = y;
  });

  canvas.addEventListener("mousedown", (event) => {
    if (event.button !== 0) {
      return;
    }

    const { x, y } = canvasCoords(canvas, event);
    const state = getGameState();

    if (state === "playing" && isPauseButtonHit(x, y)) {
      input.pauseClicked = true;
      return;
    }

    if (state === "playing") {
      input.isMouseDown = true;
      if (event.detail >= 2) {
        input.doubleClicked = true;
      }
    }
  });

  canvas.addEventListener("mouseup", () => {
    input.isMouseDown = false;
  });

  canvas.addEventListener("mouseleave", () => {
    input.isMouseDown = false;
  });
}
