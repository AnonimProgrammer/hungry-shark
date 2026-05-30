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
    this.hp = 100;
    this.hitFlash = 0;
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

    ctx.fillStyle = this.hitFlash > 0 ? "#ef5350" : "#546e7a";
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

class Fish {
  constructor(x, y, type = "common") {
    this.x = x;
    this.y = y;
    this.radius = 10;
    this.type = type;
    this.speedX = (Math.random() - 0.5) * 1.6;
    this.speedY = (Math.random() - 0.5) * 1.2;
    this.active = true;
  }

  update() {
    if (!this.active) {
      return;
    }

    this.x += this.speedX;
    this.y += this.speedY;

    const minY = WATER_SURFACE_Y + this.radius;
    const maxY = BOTTOM_LINE_Y - this.radius;

    if (this.x - this.radius < 0 || this.x + this.radius > CANVAS_WIDTH) {
      this.speedX *= -1;
      this.x = Math.max(this.radius, Math.min(CANVAS_WIDTH - this.radius, this.x));
    }

    if (this.y < minY || this.y > maxY) {
      this.speedY *= -1;
      this.y = Math.max(minY, Math.min(maxY, this.y));
    }
  }

  draw(ctx) {
    if (!this.active) {
      return;
    }

    ctx.fillStyle = this.type === "common" ? "#ff9800" : "#4caf50";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

class Bomb {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 16;
    this.active = true;
  }

  draw(ctx) {
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

function checkCollision(entityA, entityB) {
  const dx = entityA.x - entityB.x;
  const dy = entityA.y - entityB.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance < entityA.radius + entityB.radius;
}

function randomWaterPosition() {
  const margin = 40;
  return {
    x: margin + Math.random() * (CANVAS_WIDTH - margin * 2),
    y:
      WATER_SURFACE_Y +
      margin +
      Math.random() * (BOTTOM_LINE_Y - WATER_SURFACE_Y - margin * 2),
  };
}

function createFishSchool(count, centerX, centerY) {
  const fish = [];
  for (let i = 0; i < count; i++) {
    fish.push(
      new Fish(
        centerX + (Math.random() - 0.5) * 80,
        centerY + (Math.random() - 0.5) * 50,
        "common"
      )
    );
  }
  return fish;
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
const fishes = createFishSchool(6, 200, 280);
const bomb = new Bomb(620, 380);

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

function handleFishCollisions() {
  fishes.forEach((fish) => {
    if (!fish.active || !checkCollision(shark, fish)) {
      return;
    }

    if (fish.type === "common") {
      shark.hp = Math.min(100, shark.hp + 5);
      fish.active = false;

      const respawn = randomWaterPosition();
      fish.x = respawn.x;
      fish.y = respawn.y;
      fish.speedX = (Math.random() - 0.5) * 1.6;
      fish.speedY = (Math.random() - 0.5) * 1.2;
      fish.active = true;
    }
  });
}

function handleBombCollision() {
  if (!bomb.active || !checkCollision(shark, bomb)) {
    return;
  }

  shark.hp = Math.max(0, shark.hp - 30);
  shark.hitFlash = 12;
}

function evaluateCollisions() {
  handleFishCollisions();
  handleBombCollision();
}

function update() {
  shark.rotateToward(input.mouseX, input.mouseY);

  if (input.isMouseDown) {
    shark.moveForward(shark.baseSpeed);
  }

  fishes.forEach((fish) => fish.update());

  if (shark.hitFlash > 0) {
    shark.hitFlash -= 1;
  }

  evaluateCollisions();
}

function render() {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  drawBackground();

  fishes.forEach((fish) => fish.draw(ctx));
  bomb.draw(ctx);
  shark.draw(ctx);
}

function gameLoop() {
  update();
  render();
  requestAnimationFrame(gameLoop);
}

bindInput();
gameLoop();
