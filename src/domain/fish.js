import { drawSharkShape } from "./drawing.js";
import {
  randomCommonFishPosition,
  randomPoisonFishPosition,
  getFishVerticalBounds,
} from "./spawn.js";

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

    const { minY, maxY } = getFishVerticalBounds(this.radius, this.type);

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
  const schoolCenter = randomCommonFishPosition(centerX, centerY);

  for (let i = 0; i < count; i++) {
    fish.push(
      new Fish(
        schoolCenter.x + (Math.random() - 0.5) * 80,
        schoolCenter.y + (Math.random() - 0.5) * 50,
        "common"
      )
    );
  }
  return fish;
}

export function createPoisonousFish(centerX, centerY) {
  const pos = randomPoisonFishPosition(centerX, centerY);
  return new Fish(pos.x, pos.y, "poisonous");
}

export function respawnFish(fish, centerX, centerY) {
  const respawn =
    fish.type === "poisonous"
      ? randomPoisonFishPosition(centerX, centerY)
      : randomCommonFishPosition(centerX, centerY);

  fish.x = respawn.x;
  fish.y = respawn.y;
  fish.speedX = (Math.random() - 0.5) * 1.6;
  fish.speedY = (Math.random() - 0.5) * 1.2;
  fish.active = true;
}

export function recycleDistantFish(fish, centerX, centerY, maxDistance) {
  if (!fish.active) {
    return;
  }

  const dx = fish.x - centerX;
  const dy = fish.y - centerY;
  if (dx * dx + dy * dy > maxDistance * maxDistance) {
    respawnFish(fish, centerX, centerY);
  }
}
