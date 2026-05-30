import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  WATER_SURFACE_Y,
  SEABED_HEIGHT,
  BOTTOM_LINE_Y,
  HUNGER_LIMIT,
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
  ctx.fillRect(8, 8, 168, 94);

  ctx.fillStyle = "#ffffff";
  ctx.fillText(`HP: ${Math.ceil(shark.hp)}`, 16, 16);
  ctx.fillText(`Score: ${Math.floor(game.score)}s`, 16, 38);
  ctx.fillStyle = isStarving ? "#ff5252" : "#ffffff";
  ctx.fillText(`Hunger: ${game.hungerTimer.toFixed(1)}s`, 16, 60);
  ctx.fillStyle = "#ffd54f";
  ctx.fillText(`Best: ${game.highScore}s`, 16, 82);
}

export function render(ctx, game, shark, fishes, bomb) {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  drawBackground(ctx);

  fishes.forEach((fish) => fish.draw(ctx));
  bomb.draw(ctx);
  shark.draw(ctx);
  drawHud(ctx, game, shark);
}
