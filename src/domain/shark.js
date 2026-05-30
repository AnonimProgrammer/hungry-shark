import {
  CANVAS_WIDTH,
  WATER_SURFACE_Y,
  BOTTOM_LINE_Y,
} from "../config/constant.js";
import { drawSharkShape } from "./drawing.js";

export class Shark {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.angle = 0;
    this.radius = 18;
    this.baseSpeed = 3;
    this.hp = 100;
    this.hitFlash = 0;
  }

  rotateToward(targetX, targetY) {
    this.angle = Math.atan2(targetY - this.y, targetX - this.x);
  }

  moveForward(speed) {
    this.x += Math.cos(this.angle) * speed;
    this.y += Math.sin(this.angle) * speed;
    this.clampToBounds();
  }

  clampToBounds() {
    this.x = Math.max(this.radius, Math.min(CANVAS_WIDTH - this.radius, this.x));
    this.y = Math.max(
      WATER_SURFACE_Y + this.radius,
      Math.min(BOTTOM_LINE_Y - this.radius, this.y)
    );
  }

  draw(ctx) {
    const bodyColor = this.hitFlash > 0 ? "#ef5350" : "#546e7a";
    drawSharkShape(ctx, this.x, this.y, this.angle, this.radius, bodyColor, 3);
  }
}
