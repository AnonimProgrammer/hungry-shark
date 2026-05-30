import {
  BOMB_RESPAWN_DELAY,
  BOMB_EXPLOSION_DURATION,
} from "../config/constant.js";
import { randomWaterPosition } from "./spawn.js";

export class Bomb {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 16;
    this.active = true;
    this.exploding = false;
    this.explosionTimer = 0;
    this.respawnTimer = 0;
  }

  explode() {
    this.active = false;
    this.exploding = true;
    this.explosionTimer = BOMB_EXPLOSION_DURATION;
  }

  update(deltaSec) {
    if (this.exploding) {
      this.explosionTimer -= deltaSec;
      if (this.explosionTimer <= 0) {
        this.exploding = false;
        this.respawnTimer = BOMB_RESPAWN_DELAY;
      }
      return;
    }

    if (!this.active && this.respawnTimer > 0) {
      this.respawnTimer -= deltaSec;
      if (this.respawnTimer <= 0) {
        const pos = randomWaterPosition();
        this.x = pos.x;
        this.y = pos.y;
        this.active = true;
      }
    }
  }

  draw(ctx) {
    if (this.exploding) {
      drawBombExplosion(ctx, this.x, this.y, this.explosionTimer);
      return;
    }

    if (!this.active) {
      return;
    }

    ctx.fillStyle = "#212121";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#424242";
    ctx.lineWidth = 2;
    for (let i = 0; i < 8; i++) {
      const spikeAngle = (Math.PI * 2 * i) / 8;
      ctx.beginPath();
      ctx.moveTo(
        this.x + Math.cos(spikeAngle) * this.radius,
        this.y + Math.sin(spikeAngle) * this.radius
      );
      ctx.lineTo(
        this.x + Math.cos(spikeAngle) * (this.radius + 8),
        this.y + Math.sin(spikeAngle) * (this.radius + 8)
      );
      ctx.stroke();
    }

    ctx.fillStyle = "#ff5722";
    ctx.beginPath();
    ctx.arc(this.x, this.y - this.radius - 4, 4, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawBombExplosion(ctx, x, y, timeLeft) {
  const progress = 1 - timeLeft / BOMB_EXPLOSION_DURATION;
  const baseRadius = 16 + progress * 48;

  ctx.save();
  ctx.globalAlpha = 1 - progress * 0.85;

  ctx.fillStyle = "#ffeb3b";
  ctx.beginPath();
  ctx.arc(x, y, baseRadius * 0.55, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#ff9800";
  ctx.beginPath();
  ctx.arc(x, y, baseRadius * 0.85, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "#ff5722";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(x, y, baseRadius, 0, Math.PI * 2);
  ctx.stroke();

  for (let i = 0; i < 10; i++) {
    const angle = (Math.PI * 2 * i) / 10 + progress * 0.6;
    const sparkLength = baseRadius * (0.9 + (i % 3) * 0.15);
    ctx.strokeStyle = i % 2 === 0 ? "#ff5722" : "#ffeb3b";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x + Math.cos(angle) * baseRadius * 0.4, y + Math.sin(angle) * baseRadius * 0.4);
    ctx.lineTo(x + Math.cos(angle) * sparkLength, y + Math.sin(angle) * sparkLength);
    ctx.stroke();
  }

  ctx.restore();
}
