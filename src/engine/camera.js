import { CANVAS_WIDTH, CANVAS_HEIGHT } from "../config/constant.js";

export function createCamera() {
  return { x: 0, y: 0 };
}

export function updateCamera(camera, targetX, targetY) {
  camera.x = targetX - CANVAS_WIDTH / 2;
  camera.y = targetY - CANVAS_HEIGHT / 2;
}

export function screenToWorld(camera, screenX, screenY) {
  return {
    x: screenX + camera.x,
    y: screenY + camera.y,
  };
}
