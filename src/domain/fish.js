import {
  CANVAS_WIDTH,
  WATER_SURFACE_Y,
  BOTTOM_LINE_Y,
} from "../config/constant.js";
import { drawSharkShape } from "./drawing.js";
import { randomWaterPosition } from "./spawn.js";

export class Fish {
  constructor(x, y, type = "common") {
    this.x = x;
    this.y = y;
    this.radius = 10;
    this.type = type;
    this.speedX = (Math.random() - 0.5) * 1.6;
    this.speedY = (Math.random() - 0.5) * 1.2;
    this.active = true;
  }

  update() {
    if (!this.active) {
      return;
    }

    this.x += this.speedX;
    this.y += this.speedY;

    const minY = WATER_SURFACE_Y + this.radius;
    const maxY = BOTTOM_LINE_Y - this.radius;

    if (this.x - this.radius < 0 || this.x + this.radius > CANVAS_WIDTH) {
      this.speedX *= -1;
      this.x = Math.max(this.radius, Math.min(CANVAS_WIDTH - this.radius, this.x));
    }

    if (this.y < minY || this.y > maxY) {
      this.speedY *= -1;
      this.y = Math.max(minY, Math.min(maxY, this.y));
    }
  }

  draw(ctx) {
    if (!this.active) {
      return;
    }

    const bodyColor = this.type === "common" ? "#ff9800" : "#4caf50";
    const angle = Math.atan2(this.speedY, this.speedX);
    drawSharkShape(ctx, this.x, this.y, angle, this.radius, bodyColor, 2);
  }
}

export function createFishSchool(count, centerX, centerY) {
  const fish = [];
  for (let i = 0; i < count; i++) {
    fish.push(
      new Fish(
        centerX + (Math.random() - 0.5) * 80,
        centerY + (Math.random() - 0.5) * 50,
        "common"
      )
    );
  }
  return fish;
}

export function createPoisonousFish() {
  const pos = randomWaterPosition();
  return new Fish(pos.x, pos.y, "poisonous");
}

export function respawnFish(fish) {
  const respawn = randomWaterPosition();
  fish.x = respawn.x;
  fish.y = respawn.y;
  fish.speedX = (Math.random() - 0.5) * 1.6;
  fish.speedY = (Math.random() - 0.5) * 1.2;
  fish.active = true;
}
