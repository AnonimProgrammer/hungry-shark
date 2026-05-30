const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");

// Placeholder — game loop and entities will be added during development.

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#ffffff";
  ctx.font = "20px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("Hungry Shark — coming soon", canvas.width / 2, canvas.height / 2);

  requestAnimationFrame(gameLoop);
}

gameLoop();
