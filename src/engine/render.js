import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  WATER_SURFACE_Y,
  SEABED_WORLD_Y,
  SEABED_HEIGHT,
  HUNGER_LIMIT,
  BOOST_DURATION,
  BOOST_COOLDOWN,
  BOOST_STATES,
} from "../config/constant.js";

export function drawBackground(ctx, camera) {
  const surfaceScreenY = WATER_SURFACE_Y - camera.y;
  const seabedScreenY = SEABED_WORLD_Y - camera.y;

  if (surfaceScreenY > 0) {
    ctx.fillStyle = "#b3e5fc";
    ctx.fillRect(0, 0, CANVAS_WIDTH, Math.min(surfaceScreenY, CANVAS_HEIGHT));
  }

  const waterTop = Math.max(0, surfaceScreenY);
  const waterBottom = Math.min(CANVAS_HEIGHT, seabedScreenY);
  if (waterBottom > waterTop) {
    ctx.fillStyle = "#4fc3f7";
    ctx.fillRect(0, waterTop, CANVAS_WIDTH, waterBottom - waterTop);
  }

  if (seabedScreenY < CANVAS_HEIGHT) {
    const seabedTop = Math.max(0, seabedScreenY);
    ctx.fillStyle = "#5d4037";
    ctx.fillRect(0, seabedTop, CANVAS_WIDTH, SEABED_HEIGHT);

    if (seabedTop + SEABED_HEIGHT < CANVAS_HEIGHT) {
      ctx.fillStyle = "#263238";
      ctx.fillRect(
        0,
        seabedTop + SEABED_HEIGHT,
        CANVAS_WIDTH,
        CANVAS_HEIGHT - seabedTop - SEABED_HEIGHT
      );
    }
  }

  if (surfaceScreenY >= 0 && surfaceScreenY <= CANVAS_HEIGHT) {
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, surfaceScreenY);
    ctx.lineTo(CANVAS_WIDTH, surfaceScreenY);
    ctx.stroke();
  }

  if (seabedScreenY >= 0 && seabedScreenY <= CANVAS_HEIGHT) {
    ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, seabedScreenY);
    ctx.lineTo(CANVAS_WIDTH, seabedScreenY);
    ctx.stroke();
  }
}

export function drawHud(ctx, game, shark) {
  if (game.state !== "playing") {
    return;
  }

  const isStarving = game.hungerTimer >= HUNGER_LIMIT;

  ctx.font = "16px sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";

  ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
  ctx.fillRect(8, 8, 168, 118);

  ctx.fillStyle = "#ffffff";
  ctx.fillText(`HP: ${Math.ceil(shark.hp)}`, 16, 16);
  ctx.fillText(`Score: ${Math.floor(game.score)}s`, 16, 38);
  ctx.fillStyle = isStarving ? "#ff5252" : "#ffffff";
  ctx.fillText(`Hunger: ${game.hungerTimer.toFixed(1)}s`, 16, 60);
  ctx.fillStyle = "#ffd54f";
  ctx.fillText(`Best: ${game.highScore}s`, 16, 82);

  drawBoostMeter(ctx, shark, 16, 100);
}

function drawBoostMeter(ctx, shark, x, y) {
  const barWidth = 140;
  const barHeight = 10;

  let label;
  let fillRatio;
  let fillColor;

  if (shark.boostStatus === BOOST_STATES.ACTIVE) {
    label = "Boost: ACTIVE";
    fillRatio = shark.boostTimer / BOOST_DURATION;
    fillColor = "#76ff03";
  } else if (shark.boostStatus === BOOST_STATES.COOLDOWN) {
    label = "Boost: cooldown";
    fillRatio = 1 - shark.boostTimer / BOOST_COOLDOWN;
    fillColor = "#ff9100";
  } else {
    label = "Boost: ready (dbl-click)";
    fillRatio = 1;
    fillColor = "#69f0ae";
  }

  ctx.fillStyle = "#ffffff";
  ctx.fillText(label, x, y);

  const barY = y + 18;
  ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
  ctx.fillRect(x, barY, barWidth, barHeight);
  ctx.fillStyle = fillColor;
  ctx.fillRect(x, barY, barWidth * fillRatio, barHeight);
}

export function render(ctx, game, shark, fishes, bomb, camera) {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  drawBackground(ctx, camera);

  ctx.save();
  ctx.translate(-camera.x, -camera.y);

  fishes.forEach((fish) => fish.draw(ctx));
  bomb.draw(ctx);
  shark.draw(ctx);

  ctx.restore();

  drawHud(ctx, game, shark);
}
