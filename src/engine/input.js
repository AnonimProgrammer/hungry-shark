import { CANVAS_WIDTH, CANVAS_HEIGHT } from "../config/constant.js";

export function createInputState() {
  return {
    mouseX: CANVAS_WIDTH / 2,
    mouseY: CANVAS_HEIGHT / 2,
    isMouseDown: false,
    doubleClicked: false,
  };
}

export function bindInput(canvas, input, getGameState) {
  canvas.addEventListener("mousemove", (event) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    input.mouseX = (event.clientX - rect.left) * scaleX;
    input.mouseY = (event.clientY - rect.top) * scaleY;
  });

  canvas.addEventListener("mousedown", (event) => {
    if (event.button === 0 && getGameState() === "playing") {
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
