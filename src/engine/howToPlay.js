import { BOMB_EXPLOSION_DURATION } from "../config/constant.js";
import {
  drawSharkSprite,
  drawSharkBodyGlow,
  drawSimpleFish,
  drawLionfish,
  drawWaterColumn,
} from "../domain/drawing.js";
import { drawBombExplosion } from "../domain/bomb.js";
import { getSharkSprite } from "./assets.js";
import { hideMainMenu, showMainMenu } from "./menu.js";

let animationFrameId = null;
let currentSlide = 0;
const SLIDE_COUNT = 3;

const HTP_EAT_SHARK_HEIGHT = 150;
const HTP_DANGER_SHARK_HEIGHT = 95;

function stopHowToPlayAnimation() {
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
}

function drawWaterBackground(ctx, width, height) {
  drawWaterColumn(ctx, 0, 0, width, height, 0, height);
}

function animateEatCanvas(canvas, time) {
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;

  drawWaterBackground(ctx, width, height);

  const schoolX = width * 0.72;
  const schoolY = height * 0.5;
  for (let i = 0; i < 7; i++) {
    const fx = schoolX + (i % 4) * 22 - 33;
    const fy = schoolY + Math.floor(i / 4) * 18 - 8 + Math.sin(time * 2 + i) * 4;
    drawSimpleFish(ctx, fx, fy, 0, 9, "#ff9800");
  }

  const sharkX = 50 + ((time * 48) % (width * 0.38));
  const sharkY = schoolY + Math.sin(time * 3) * 6;
  drawSharkSprite(ctx, getSharkSprite(), sharkX, sharkY, 0, HTP_EAT_SHARK_HEIGHT);
}

function drawStaticBomb(ctx, x, y) {
  ctx.fillStyle = "#212121";
  ctx.beginPath();
  ctx.arc(x, y, 14, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "#424242";
  ctx.lineWidth = 2;
  for (let i = 0; i < 8; i++) {
    const spikeAngle = (Math.PI * 2 * i) / 8;
    ctx.beginPath();
    ctx.moveTo(x + Math.cos(spikeAngle) * 14, y + Math.sin(spikeAngle) * 14);
    ctx.lineTo(x + Math.cos(spikeAngle) * 22, y + Math.sin(spikeAngle) * 22);
    ctx.stroke();
  }
}

function animateBombCanvas(canvas, time) {
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  const sharkX = width * 0.58;
  const sharkY = height * 0.54;
  const bombX = width * 0.28;
  const bombY = height * 0.52;

  drawWaterBackground(ctx, width, height);

  const explosionPhase = (Math.sin(time * 2.2) + 1) / 2;
  const explosionTime = BOMB_EXPLOSION_DURATION * (1 - explosionPhase);
  drawBombExplosion(ctx, bombX, bombY, explosionTime);
  drawStaticBomb(ctx, bombX, bombY);

  const hitPulse = Math.sin(time * 8) > 0;
  if (hitPulse) {
    drawSharkBodyGlow(ctx, getSharkSprite(), sharkX, sharkY, Math.PI * 0.15, HTP_DANGER_SHARK_HEIGHT, "#ef5350");
  }

  drawSharkSprite(ctx, getSharkSprite(), sharkX, sharkY, Math.PI * 0.15, HTP_DANGER_SHARK_HEIGHT);
}

function animatePoisonCanvas(canvas, time) {
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  const sharkX = width * 0.34;
  const sharkY = height * 0.56;
  const lionX = width * 0.78;
  const lionY = height * 0.5;

  drawWaterBackground(ctx, width, height);

  drawLionfish(ctx, lionX, lionY, Math.PI, 14);
  drawSharkBodyGlow(ctx, getSharkSprite(), sharkX, sharkY, -Math.PI * 0.12, HTP_DANGER_SHARK_HEIGHT, "#a5d6a7");
  drawSharkSprite(ctx, getSharkSprite(), sharkX, sharkY, -Math.PI * 0.12, HTP_DANGER_SHARK_HEIGHT);
}

function startHowToPlayAnimation(dom) {
  stopHowToPlayAnimation();
  let time = 0;

  function frame() {
    const screen = dom.howToPlayScreen;
    if (!screen || screen.classList.contains("hidden")) {
      animationFrameId = null;
      return;
    }

    time += 0.016;

    if (currentSlide === 1 && dom.htpEatCanvas) {
      animateEatCanvas(dom.htpEatCanvas, time);
    } else if (currentSlide === 2) {
      if (dom.htpBombCanvas) {
        animateBombCanvas(dom.htpBombCanvas, time);
      }
      if (dom.htpPoisonCanvas) {
        animatePoisonCanvas(dom.htpPoisonCanvas, time);
      }
    }

    animationFrameId = requestAnimationFrame(frame);
  }

  animationFrameId = requestAnimationFrame(frame);
}

function updateSlideView(dom) {
  dom.htpSlides.forEach((slide, index) => {
    slide.classList.toggle("htp-slide-active", index === currentSlide);
  });

  dom.htpBackBtn.disabled = currentSlide === 0;
  dom.htpNextBtn.textContent = currentSlide === SLIDE_COUNT - 1 ? "Done" : "Next";
  dom.htpStepLabel.textContent = `${currentSlide + 1} / ${SLIDE_COUNT}`;

  startHowToPlayAnimation(dom);
}

export function showHowToPlay(dom) {
  hideMainMenu(dom);
  currentSlide = 0;
  dom.howToPlayScreen.classList.remove("hidden");
  updateSlideView(dom);
}

export function closeHowToPlayPanel(dom) {
  stopHowToPlayAnimation();
  dom.howToPlayScreen.classList.add("hidden");
}

export function hideHowToPlay(game, dom, input) {
  closeHowToPlayPanel(dom);
  showMainMenu(game, dom, input);
}

export function bindHowToPlay(game, dom, input) {
  dom.howToPlayBtn.addEventListener("click", () => showHowToPlay(dom));

  dom.htpCloseBtn.addEventListener("click", () => hideHowToPlay(game, dom, input));

  dom.htpBackBtn.addEventListener("click", () => {
    if (currentSlide > 0) {
      currentSlide -= 1;
      updateSlideView(dom);
    }
  });

  dom.htpNextBtn.addEventListener("click", () => {
    if (currentSlide < SLIDE_COUNT - 1) {
      currentSlide += 1;
      updateSlideView(dom);
    } else {
      hideHowToPlay(game, dom, input);
    }
  });
}
