import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  WATER_SURFACE_Y,
  SEABED_HEIGHT,
  BOTTOM_LINE_Y,
  HUNGER_LIMIT,
  BOOST_DURATION,
  BOOST_COOLDOWN,
  BOOST_STATES,
} from "../config/constant.js";

export function drawBackground(ctx) {
  ctx.fillStyle = "#b3e5fc";
  ctx.fillRect(0, 0, CANVAS_WIDTH, WATER_SURFACE_Y);

  ctx.fillStyle = "#4fc3f7";
  ctx.fillRect(0, WATER_SURFACE_Y, CANVAS_WIDTH, BOTTOM_LINE_Y - WATER_SURFACE_Y);

  ctx.fillStyle = "#5d4037";
  ctx.fillRect(0, BOTTOM_LINE_Y, CANVAS_WIDTH, SEABED_HEIGHT);

  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, WATER_SURFACE_Y);
  ctx.lineTo(CANVAS_WIDTH, WATER_SURFACE_Y);
  ctx.stroke();
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

export function render(ctx, game, shark, fishes, bomb) {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  drawBackground(ctx);

  fishes.forEach((fish) => fish.draw(ctx));
  bomb.draw(ctx);
  shark.draw(ctx);
  drawHud(ctx, game, shark);
}
