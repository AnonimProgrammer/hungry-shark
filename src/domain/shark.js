import {
  SEABED_WORLD_Y,
  BOOST_MULTIPLIER,
  BOOST_DURATION,
  BOOST_COOLDOWN,
  BOOST_STATES,
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
    this.isStarving = false;
    this.isPoisoned = false;
    this.lastDirX = 1;
    this.lastDirY = 0;
    this.poisonTimer = 0;
    this.poisonDamageRemaining = 0;
    this.boostStatus = BOOST_STATES.READY;
    this.boostTimer = 0;
  }

  getSpeed() {
    if (this.boostStatus === BOOST_STATES.ACTIVE) {
      return this.baseSpeed * BOOST_MULTIPLIER;
    }
    return this.baseSpeed;
  }

  tryActivateBoost() {
    if (this.boostStatus !== BOOST_STATES.READY) {
      return false;
    }
    this.boostStatus = BOOST_STATES.ACTIVE;
    this.boostTimer = BOOST_DURATION;
    return true;
  }

  updateBoost(deltaSec) {
    if (this.boostStatus === BOOST_STATES.ACTIVE) {
      this.boostTimer -= deltaSec;
      if (this.boostTimer <= 0) {
        this.boostStatus = BOOST_STATES.COOLDOWN;
        this.boostTimer = BOOST_COOLDOWN;
      }
    } else if (this.boostStatus === BOOST_STATES.COOLDOWN) {
      this.boostTimer -= deltaSec;
      if (this.boostTimer <= 0) {
        this.boostStatus = BOOST_STATES.READY;
        this.boostTimer = 0;
      }
    }
  }

  resetBoost() {
    this.boostStatus = BOOST_STATES.READY;
    this.boostTimer = 0;
  }

  rotateToward(targetX, targetY) {
    this.angle = Math.atan2(targetY - this.y, targetX - this.x);
  }

  moveForward(speed) {
    this.lastDirX = Math.cos(this.angle);
    this.lastDirY = Math.sin(this.angle);
    this.x += this.lastDirX * speed;
    this.y += this.lastDirY * speed;
    this.applyWorldPhysics();
  }

  applyWorldPhysics() {
    const floorY = SEABED_WORLD_Y - this.radius;
    if (this.y > floorY) {
      this.y = floorY;
    }
  }

  draw(ctx) {
    let bodyColor = "#546e7a";
    if (this.hitFlash > 0) {
      bodyColor = "#ef5350";
    } else if (this.isPoisoned) {
      bodyColor = "#a5d6a7";
    } else if (this.isStarving) {
      bodyColor = "#ef9a9a";
    }
    drawSharkShape(ctx, this.x, this.y, this.angle, this.radius, bodyColor, 3);
  }
}
