const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");

const CANVAS_WIDTH = canvas.width;
const CANVAS_HEIGHT = canvas.height;
const WATER_SURFACE_Y = 80;
const SEABED_HEIGHT = 60;
const BOTTOM_LINE_Y = CANVAS_HEIGHT - SEABED_HEIGHT;

class Shark {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.angle = 0;
    this.radius = 18;
    this.baseSpeed = 3;
  }

  rotateToward(targetX, targetY) {
    this.angle = Math.atan2(targetY - this.y, targetX - this.x);
  }

  moveForward(speed) {
    this.x += Math.cos(this.angle) * speed;
    this.y += Math.sin(this.angle) * speed;
    this.clampToBounds();
  }

  clampToBounds() {
    this.x = Math.max(this.radius, Math.min(CANVAS_WIDTH - this.radius, this.x));
    this.y = Math.max(
      WATER_SURFACE_Y + this.radius,
      Math.min(BOTTOM_LINE_Y - this.radius, this.y)
    );
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    ctx.fillStyle = "#546e7a";
    ctx.beginPath();
    ctx.ellipse(0, 0, this.radius * 1.4, this.radius, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(-this.radius * 1.1, 0);
    ctx.lineTo(-this.radius * 2, -this.radius * 0.55);
    ctx.lineTo(-this.radius * 2, this.radius * 0.55);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#263238";
    ctx.beginPath();
    ctx.arc(this.radius * 0.6, -this.radius * 0.25, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}

const input = {
  mouseX: CANVAS_WIDTH / 2,
  mouseY: CANVAS_HEIGHT / 2,
  isMouseDown: false,
};

function bindInput() {
  canvas.addEventListener("mousemove", (event) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    input.mouseX = (event.clientX - rect.left) * scaleX;
    input.mouseY = (event.clientY - rect.top) * scaleY;
  });

  canvas.addEventListener("mousedown", (event) => {
    if (event.button === 0) {
      input.isMouseDown = true;
    }
  });

  canvas.addEventListener("mouseup", () => {
    input.isMouseDown = false;
  });

  canvas.addEventListener("mouseleave", () => {
    input.isMouseDown = false;
  });
}

const shark = new Shark(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);

function drawBackground() {
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

function update() {
  shark.rotateToward(input.mouseX, input.mouseY);

  if (input.isMouseDown) {
    shark.moveForward(shark.baseSpeed);
  }
}

function render() {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  drawBackground();
  shark.draw(ctx);
}

function gameLoop() {
  update();
  render();
  requestAnimationFrame(gameLoop);
}

bindInput();
gameLoop();
