import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  WATER_SURFACE_Y,
  SEABED_WORLD_Y,
  SEABED_HEIGHT,
  BOOST_METER_MAX,
} from "../config/constant.js";

const HUD_MARGIN = 20;
const HUD_HP_BAR_WIDTH = 180;
const HUD_BOOST_BAR_WIDTH = 120;
const HUD_BAR_HEIGHT = 16;
const HUD_LABEL_GAP = 10;
const HUD_ROW_GAP = 10;
const HUD_SCORE_GAP = 12;
const HUD_LABEL_FONT = "bold 16px sans-serif";
const HUD_SCORE_FONT = "bold 22px sans-serif";
const PAUSE_BTN_RADIUS = 16;
const PAUSE_BTN_GAP = 12;

let pauseButtonHitArea = { cx: 0, cy: 0, r: PAUSE_BTN_RADIUS };

export function isPauseButtonHit(x, y) {
  const { cx, cy, r } = pauseButtonHitArea;
  const dx = x - cx;
  const dy = y - cy;
  return dx * dx + dy * dy <= r * r;
}

function getHudContentRight() {
  return CANVAS_WIDTH - HUD_MARGIN - PAUSE_BTN_RADIUS * 2 - PAUSE_BTN_GAP;
}

function drawPauseButton(ctx, cx, cy, radius) {
  pauseButtonHitArea = { cx, cy, r: radius };

  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
  ctx.fill();
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 2;
  ctx.stroke();

  const barWidth = 3;
  const barHeight = 12;
  const barGap = 4;
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(cx - barGap / 2 - barWidth, cy - barHeight / 2, barWidth, barHeight);
  ctx.fillRect(cx + barGap / 2, cy - barHeight / 2, barWidth, barHeight);
}

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

function drawStatBar(ctx, x, y, width, height, ratio, fillColor) {
  const clamped = Math.max(0, Math.min(1, ratio));
  ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
  ctx.fillRect(x, y, width, height);
  ctx.fillStyle = fillColor;
  ctx.fillRect(x, y, width * clamped, height);
}

function drawLabeledBar(ctx, label, labelRightX, barX, barY, barWidth, barHeight, ratio, fillColor) {
  ctx.font = HUD_LABEL_FONT;
  ctx.textAlign = "right";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#ffffff";
  ctx.fillText(label, labelRightX, barY + barHeight / 2);

  drawStatBar(ctx, barX, barY, barWidth, barHeight, ratio, fillColor);
}

export function drawHud(ctx, game, shark) {
  if (game.state !== "playing" && game.state !== "paused") {
    return;
  }

  const top = HUD_MARGIN;
  const rightEdge = getHudContentRight();
  const pauseCenterX = CANVAS_WIDTH - HUD_MARGIN - PAUSE_BTN_RADIUS;
  const pauseCenterY = top + HUD_BAR_HEIGHT / 2;
  const hpBarX = rightEdge - HUD_HP_BAR_WIDTH;
  const hpLabelRightX = hpBarX - HUD_LABEL_GAP;
  const boostBarX = rightEdge - HUD_BOOST_BAR_WIDTH;
  const boostLabelRightX = boostBarX - HUD_LABEL_GAP;

  drawLabeledBar(
    ctx,
    "HP",
    hpLabelRightX,
    hpBarX,
    top,
    HUD_HP_BAR_WIDTH,
    HUD_BAR_HEIGHT,
    shark.hp / 100,
    "#e53935"
  );

  drawPauseButton(ctx, pauseCenterX, pauseCenterY, PAUSE_BTN_RADIUS);

  const boostY = top + HUD_BAR_HEIGHT + HUD_ROW_GAP;
  const boostFill = shark.isActivelyBoosting ? "#42a5f5" : "#1565c0";
  drawLabeledBar(
    ctx,
    "Boost",
    boostLabelRightX,
    boostBarX,
    boostY,
    HUD_BOOST_BAR_WIDTH,
    HUD_BAR_HEIGHT,
    shark.boostMeter / BOOST_METER_MAX,
    boostFill
  );

  const scoreY = boostY + HUD_BAR_HEIGHT + HUD_SCORE_GAP;
  const scoreValue = String(Math.floor(game.score));
  ctx.font = HUD_SCORE_FONT;
  ctx.textAlign = "right";
  ctx.textBaseline = "top";
  ctx.shadowColor = "rgba(0, 0, 0, 0.55)";
  ctx.shadowBlur = 4;
  ctx.shadowOffsetX = 1;
  ctx.shadowOffsetY = 1;

  const scoreNumWidth = ctx.measureText(scoreValue).width;
  ctx.fillStyle = "#ffd700";
  ctx.fillText("★", rightEdge - scoreNumWidth - 6, scoreY);
  ctx.fillStyle = "#ffffff";
  ctx.fillText(scoreValue, rightEdge, scoreY);

  ctx.shadowColor = "transparent";
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
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
