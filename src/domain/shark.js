import {
  SEABED_WORLD_Y,
  BOOST_MULTIPLIER,
  BOOST_METER_MAX,
  BOOST_DRAIN_DURATION,
  BOOST_REGEN_DELAY,
  BOOST_REGEN_DURATION,
  SHARK_SPRITE_HEIGHT,
} from "../config/constant.js";
import { drawSharkSprite, drawSharkBodyGlow } from "./drawing.js";
import { getSharkSprite } from "../engine/assets.js";

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
    this.boostMeter = BOOST_METER_MAX;
    this.boostArmed = false;
    this.isActivelyBoosting = false;
    this.boostIdleTimer = 0;
  }

  isBoostActive(isSwimming) {
    return this.boostArmed && isSwimming && this.boostMeter > 0;
  }

  getSpeed(isSwimming) {
    if (this.isBoostActive(isSwimming)) {
      return this.baseSpeed * BOOST_MULTIPLIER;
    }
    return this.baseSpeed;
  }

  armBoost() {
    if (this.boostMeter <= 0) {
      return false;
    }
    this.boostArmed = true;
    this.boostIdleTimer = 0;
    return true;
  }

  updateBoost(deltaSec, isSwimming) {
    if (!isSwimming) {
      this.boostArmed = false;
    }

    this.isActivelyBoosting = this.isBoostActive(isSwimming);

    if (this.isActivelyBoosting) {
      this.boostIdleTimer = 0;
      const drainRate = BOOST_METER_MAX / BOOST_DRAIN_DURATION;
      this.boostMeter -= drainRate * deltaSec;
      if (this.boostMeter <= 0) {
        this.boostMeter = 0;
        this.boostArmed = false;
        this.isActivelyBoosting = false;
      }
      return;
    }

    this.boostIdleTimer += deltaSec;
    if (
      this.boostIdleTimer >= BOOST_REGEN_DELAY &&
      this.boostMeter < BOOST_METER_MAX
    ) {
      const regenRate = BOOST_METER_MAX / BOOST_REGEN_DURATION;
      this.boostMeter = Math.min(
        BOOST_METER_MAX,
        this.boostMeter + regenRate * deltaSec
      );
    }
  }

  resetBoost() {
    this.boostMeter = BOOST_METER_MAX;
    this.boostArmed = false;
    this.isActivelyBoosting = false;
    this.boostIdleTimer = 0;
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
    let statusColor = null;
    if (this.hitFlash > 0) {
      statusColor = "#ef5350";
    } else if (this.isPoisoned) {
      statusColor = "#a5d6a7";
    } else if (this.isStarving) {
      statusColor = "#ef9a9a";
    }

    if (statusColor) {
      drawSharkBodyGlow(
        ctx,
        getSharkSprite(),
        this.x,
        this.y,
        this.angle,
        SHARK_SPRITE_HEIGHT,
        statusColor
      );
    }

    drawSharkSprite(
      ctx,
      getSharkSprite(),
      this.x,
      this.y,
      this.angle,
      SHARK_SPRITE_HEIGHT
    );
  }
}
