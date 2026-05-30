export function drawSharkShape(ctx, x, y, angle, radius, bodyColor, eyeRadius = 2) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);

  ctx.fillStyle = bodyColor;
  ctx.beginPath();
  ctx.ellipse(0, 0, radius * 1.4, radius, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(-radius * 1.1, 0);
  ctx.lineTo(-radius * 2, -radius * 0.55);
  ctx.lineTo(-radius * 2, radius * 0.55);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#263238";
  ctx.beginPath();
  ctx.arc(radius * 0.6, -radius * 0.25, eyeRadius, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}
