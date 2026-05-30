const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");
const startScreen = document.getElementById("start-screen");
const gameOverScreen = document.getElementById("game-over-screen");
const startBtn = document.getElementById("start-btn");
const restartBtn = document.getElementById("restart-btn");
const finalScoreEl = document.getElementById("final-score");

const CANVAS_WIDTH = canvas.width;
const CANVAS_HEIGHT = canvas.height;
const WATER_SURFACE_Y = 80;
const SEABED_HEIGHT = 60;
const BOTTOM_LINE_Y = CANVAS_HEIGHT - SEABED_HEIGHT;
const HUNGER_LIMIT = 5;
const STARVATION_DRAIN = 10;

const game = {
  state: "start",
  score: 0,
  hungerTimer: 0,
};

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
    if (event.button === 0 && game.state === "playing") {
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
let fishes = createFishSchool(6, 200, 280);
const bomb = new Bomb(620, 380);

const INITIAL_FISH_COUNT = 6;
const INITIAL_FISH_CENTER = { x: 200, y: 280 };
const INITIAL_BOMB_POSITION = { x: 620, y: 380 };

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
      game.hungerTimer = 0;
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

function updateTimers(deltaSec) {
  game.score += deltaSec;
  game.hungerTimer += deltaSec;

  if (game.hungerTimer >= HUNGER_LIMIT) {
    shark.hp = Math.max(0, shark.hp - STARVATION_DRAIN * deltaSec);
  }
}

function checkLoseCondition() {
  if (shark.hp <= 0) {
    shark.hp = 0;
    game.state = "gameOver";
    showGameOverScreen();
  }
}

function resetGame() {
  shark.x = CANVAS_WIDTH / 2;
  shark.y = CANVAS_HEIGHT / 2;
  shark.angle = 0;
  shark.hp = 100;
  shark.hitFlash = 0;

  game.score = 0;
  game.hungerTimer = 0;

  fishes = createFishSchool(
    INITIAL_FISH_COUNT,
    INITIAL_FISH_CENTER.x,
    INITIAL_FISH_CENTER.y
  );

  bomb.x = INITIAL_BOMB_POSITION.x;
  bomb.y = INITIAL_BOMB_POSITION.y;
  bomb.active = true;

  input.isMouseDown = false;
  lastTimestamp = 0;
}

function showGameOverScreen() {
  finalScoreEl.textContent = `Survived ${Math.floor(game.score)} seconds`;
  gameOverScreen.classList.remove("hidden");
}

function startGame() {
  resetGame();
  game.state = "playing";
  startScreen.classList.add("hidden");
  gameOverScreen.classList.add("hidden");
}

function update(deltaSec) {
  updateTimers(deltaSec);

  shark.rotateToward(input.mouseX, input.mouseY);

  if (input.isMouseDown) {
    shark.moveForward(shark.baseSpeed);
  }

  fishes.forEach((fish) => fish.update());

  if (shark.hitFlash > 0) {
    shark.hitFlash -= 1;
  }

  evaluateCollisions();
  checkLoseCondition();
}

function drawHud() {
  if (game.state !== "playing") {
    return;
  }

  const isStarving = game.hungerTimer >= HUNGER_LIMIT;

  ctx.font = "16px sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";

  ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
  ctx.fillRect(8, 8, 168, 72);

  ctx.fillStyle = "#ffffff";
  ctx.fillText(`HP: ${Math.ceil(shark.hp)}`, 16, 16);
  ctx.fillText(`Score: ${Math.floor(game.score)}s`, 16, 38);
  ctx.fillStyle = isStarving ? "#ff5252" : "#ffffff";
  ctx.fillText(`Hunger: ${game.hungerTimer.toFixed(1)}s`, 16, 60);
}

function render() {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  drawBackground();

  fishes.forEach((fish) => fish.draw(ctx));
  bomb.draw(ctx);
  shark.draw(ctx);
  drawHud();
}

let lastTimestamp = 0;

function gameLoop(timestamp) {
  const deltaSec = lastTimestamp ? (timestamp - lastTimestamp) / 1000 : 0;
  lastTimestamp = timestamp;

  if (game.state === "playing") {
    update(deltaSec);
  }

  render();
  requestAnimationFrame(gameLoop);
}

bindInput();
startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", startGame);
requestAnimationFrame(gameLoop);
