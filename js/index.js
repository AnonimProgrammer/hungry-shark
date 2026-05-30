const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");
const startScreen = document.getElementById("start-screen");
const gameOverScreen = document.getElementById("game-over-screen");
const startBtn = document.getElementById("start-btn");
const restartBtn = document.getElementById("restart-btn");
const finalScoreEl = document.getElementById("final-score");
const startHighScoreEl = document.getElementById("start-high-score");
const gameOverHighScoreEl = document.getElementById("game-over-high-score");

const CANVAS_WIDTH = canvas.width;
const CANVAS_HEIGHT = canvas.height;
const WATER_SURFACE_Y = 80;
const SEABED_HEIGHT = 60;
const BOTTOM_LINE_Y = CANVAS_HEIGHT - SEABED_HEIGHT;
const HUNGER_LIMIT = 5;
const STARVATION_DRAIN = 10;
const POISON_DAMAGE = 20;
const BOMB_DAMAGE = 30;
const BOMB_RESPAWN_DELAY = 5;
const BOMB_EXPLOSION_DURATION = 0.45;
const HIGH_SCORE_KEY = "hungry-shark-high-score";
const SCHOOL_SIZE = 6;
const POISONOUS_FISH_COUNT = 2;

const game = {
  state: "start",
  score: 0,
  hungerTimer: 0,
  highScore: 0,
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
    const bodyColor = this.hitFlash > 0 ? "#ef5350" : "#546e7a";
    drawSharkShape(ctx, this.x, this.y, this.angle, this.radius, bodyColor, 3);
  }
}

function drawSharkShape(ctx, x, y, angle, radius, bodyColor, eyeRadius = 2) {
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

    const bodyColor = this.type === "common" ? "#ff9800" : "#4caf50";
    const angle = Math.atan2(this.speedY, this.speedX);
    drawSharkShape(ctx, this.x, this.y, angle, this.radius, bodyColor, 2);
  }
}

class Bomb {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 16;
    this.active = true;
    this.exploding = false;
    this.explosionTimer = 0;
    this.respawnTimer = 0;
  }

  explode() {
    this.active = false;
    this.exploding = true;
    this.explosionTimer = BOMB_EXPLOSION_DURATION;
  }

  update(deltaSec) {
    if (this.exploding) {
      this.explosionTimer -= deltaSec;
      if (this.explosionTimer <= 0) {
        this.exploding = false;
        this.respawnTimer = BOMB_RESPAWN_DELAY;
      }
      return;
    }

    if (!this.active && this.respawnTimer > 0) {
      this.respawnTimer -= deltaSec;
      if (this.respawnTimer <= 0) {
        const pos = randomWaterPosition();
        this.x = pos.x;
        this.y = pos.y;
        this.active = true;
      }
    }
  }

  draw(ctx) {
    if (this.exploding) {
      drawBombExplosion(ctx, this.x, this.y, this.explosionTimer);
      return;
    }

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

function drawBombExplosion(ctx, x, y, timeLeft) {
  const progress = 1 - timeLeft / BOMB_EXPLOSION_DURATION;
  const baseRadius = 16 + progress * 48;

  ctx.save();
  ctx.globalAlpha = 1 - progress * 0.85;

  ctx.fillStyle = "#ffeb3b";
  ctx.beginPath();
  ctx.arc(x, y, baseRadius * 0.55, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#ff9800";
  ctx.beginPath();
  ctx.arc(x, y, baseRadius * 0.85, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "#ff5722";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(x, y, baseRadius, 0, Math.PI * 2);
  ctx.stroke();

  for (let i = 0; i < 10; i++) {
    const angle = (Math.PI * 2 * i) / 10 + progress * 0.6;
    const sparkLength = baseRadius * (0.9 + (i % 3) * 0.15);
    ctx.strokeStyle = i % 2 === 0 ? "#ff5722" : "#ffeb3b";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x + Math.cos(angle) * baseRadius * 0.4, y + Math.sin(angle) * baseRadius * 0.4);
    ctx.lineTo(x + Math.cos(angle) * sparkLength, y + Math.sin(angle) * sparkLength);
    ctx.stroke();
  }

  ctx.restore();
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

function createPoisonousFish() {
  const pos = randomWaterPosition();
  return new Fish(pos.x, pos.y, "poisonous");
}

function respawnFish(fish) {
  const respawn = randomWaterPosition();
  fish.x = respawn.x;
  fish.y = respawn.y;
  fish.speedX = (Math.random() - 0.5) * 1.6;
  fish.speedY = (Math.random() - 0.5) * 1.2;
  fish.active = true;
}

function createInitialEntities() {
  const schoolCenter = randomWaterPosition();
  const fishes = createFishSchool(SCHOOL_SIZE, schoolCenter.x, schoolCenter.y);

  for (let i = 0; i < POISONOUS_FISH_COUNT; i++) {
    fishes.push(createPoisonousFish());
  }

  const bombPos = randomWaterPosition();
  const bomb = new Bomb(bombPos.x, bombPos.y);

  return { fishes, bomb };
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
let { fishes, bomb } = createInitialEntities();

function loadHighScore() {
  const stored = localStorage.getItem(HIGH_SCORE_KEY);
  return stored !== null ? Number(stored) : 0;
}

function saveHighScore(score) {
  localStorage.setItem(HIGH_SCORE_KEY, String(score));
}

function updateHighScoreDisplay() {
  const label = `Best: ${game.highScore}s`;
  startHighScoreEl.textContent = label;
  gameOverHighScoreEl.textContent = label;
}

function recordHighScore() {
  const runScore = Math.floor(game.score);

  if (runScore > game.highScore) {
    game.highScore = runScore;
    saveHighScore(runScore);
  }

  updateHighScoreDisplay();
}

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
    } else if (fish.type === "poisonous") {
      shark.hp = Math.max(0, shark.hp - POISON_DAMAGE);
      shark.hitFlash = 12;
    }

    fish.active = false;
    respawnFish(fish);
  });
}

function handleBombCollision() {
  if (bomb.active && checkCollision(shark, bomb)) {
    shark.hp = Math.max(0, shark.hp - BOMB_DAMAGE);
    shark.hitFlash = 12;
    bomb.explode();
  }
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

  ({ fishes, bomb } = createInitialEntities());

  input.isMouseDown = false;
  lastTimestamp = 0;
}

function showGameOverScreen() {
  recordHighScore();
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
  bomb.update(deltaSec);

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
  ctx.fillRect(8, 8, 168, 94);

  ctx.fillStyle = "#ffffff";
  ctx.fillText(`HP: ${Math.ceil(shark.hp)}`, 16, 16);
  ctx.fillText(`Score: ${Math.floor(game.score)}s`, 16, 38);
  ctx.fillStyle = isStarving ? "#ff5252" : "#ffffff";
  ctx.fillText(`Hunger: ${game.hungerTimer.toFixed(1)}s`, 16, 60);
  ctx.fillStyle = "#ffd54f";
  ctx.fillText(`Best: ${game.highScore}s`, 16, 82);
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
game.highScore = loadHighScore();
updateHighScoreDisplay();
startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", startGame);
requestAnimationFrame(gameLoop);
