export const WATER_COLOR_SHALLOW = "#81d4fa";
export const WATER_COLOR_MID = "#4fc3f7";
export const WATER_COLOR_DEEP = "#01579b";

/** World-anchored water gradient from surface line to seabed line (screen Y coords). */
export function drawWaterColumn(ctx, x, y, width, height, surfaceScreenY, seabedScreenY) {
  const gradient = ctx.createLinearGradient(x, surfaceScreenY, x, seabedScreenY);
  gradient.addColorStop(0, WATER_COLOR_SHALLOW);
  gradient.addColorStop(0.45, WATER_COLOR_MID);
  gradient.addColorStop(1, WATER_COLOR_DEEP);
  ctx.fillStyle = gradient;
  ctx.fillRect(x, y, width, height);
}

function applyFacingTransform(ctx, angle) {
  if (Math.cos(angle) < 0) {
    ctx.scale(-1, 1);
    ctx.rotate(Math.PI - angle);
    return;
  }
  ctx.rotate(angle);
}

export function drawSimpleShark(ctx, x, y, angle, radius, bodyColor, eyeRadius = 2) {
  ctx.save();
  ctx.translate(x, y);
  applyFacingTransform(ctx, angle);

  ctx.fillStyle = bodyColor;

  ctx.beginPath();
  ctx.ellipse(0, 0, radius * 1.45, radius * 0.8, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(-radius * 1.15, 0);
  ctx.lineTo(-radius * 2, -radius * 0.55);
  ctx.lineTo(-radius * 2, radius * 0.55);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#263238";
  ctx.beginPath();
  ctx.arc(radius * 0.65, -radius * 0.18, eyeRadius, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function getSharkSpriteDimensions(image, displayHeight) {
  const height = displayHeight;
  const width =
    image?.complete && image.naturalWidth > 0
      ? height * (image.width / image.height)
      : height * 1.6;
  return { width, height };
}

export function drawSharkBodyGlow(ctx, image, x, y, angle, displayHeight, color) {
  const { width, height } = getSharkSpriteDimensions(image, displayHeight);

  ctx.save();
  ctx.translate(x, y);
  applyFacingTransform(ctx, angle);
  ctx.globalAlpha = 0.38;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(0, 0, width * 0.44, height * 0.34, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export function drawSharkSprite(ctx, image, x, y, angle, displayHeight) {
  if (!image || !image.complete || image.naturalWidth === 0) {
    const radius = displayHeight / 4;
    drawSimpleShark(ctx, x, y, angle, radius, "#546e7a", 3);
    return;
  }

  const { width, height } = getSharkSpriteDimensions(image, displayHeight);

  ctx.save();
  ctx.translate(x, y);
  applyFacingTransform(ctx, angle);
  ctx.drawImage(image, -width / 2, -height / 2, width, height);
  ctx.restore();
}

export function drawSimpleFish(ctx, x, y, angle, radius, bodyColor) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  ctx.fillStyle = bodyColor;

  ctx.beginPath();
  ctx.ellipse(0, 0, radius * 1.15, radius * 0.65, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(-radius * 0.85, 0);
  ctx.lineTo(-radius * 1.5, -radius * 0.4);
  ctx.lineTo(-radius * 1.5, radius * 0.4);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#263238";
  ctx.beginPath();
  ctx.arc(radius * 0.45, -radius * 0.12, 1.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

export function drawLionfish(ctx, x, y, angle, radius) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  const spineAngles = [
    -1.15, -0.75, -0.35, 0, 0.35, 0.75, 1.15, 2.4, -2.4,
  ];

  ctx.strokeStyle = "#ef6c00";
  ctx.lineWidth = 1.3;
  ctx.lineCap = "round";
  for (const spineAngle of spineAngles) {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(spineAngle) * radius * 2.1, Math.sin(spineAngle) * radius * 2.1);
    ctx.stroke();
  }

  ctx.fillStyle = "#fff3e0";
  ctx.beginPath();
  ctx.ellipse(0, 0, radius * 1.05, radius * 0.9, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "#bf360c";
  ctx.lineWidth = 1.6;
  for (let i = -2; i <= 2; i++) {
    ctx.beginPath();
    ctx.moveTo(i * radius * 0.32, -radius * 0.9);
    ctx.lineTo(i * radius * 0.32, radius * 0.9);
    ctx.stroke();
  }

  ctx.fillStyle = "rgba(255, 111, 0, 0.8)";
  ctx.beginPath();
  ctx.moveTo(radius * 0.1, radius * 0.35);
  ctx.lineTo(-radius * 1.2, radius * 1.35);
  ctx.lineTo(radius * 0.45, radius * 0.55);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(radius * 0.1, -radius * 0.35);
  ctx.lineTo(-radius * 1.2, -radius * 1.35);
  ctx.lineTo(radius * 0.45, -radius * 0.55);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#263238";
  ctx.beginPath();
  ctx.arc(radius * 0.5, -radius * 0.22, 1.6, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/** @deprecated Use drawSimpleShark */
export const drawSharkShape = drawSimpleShark;
