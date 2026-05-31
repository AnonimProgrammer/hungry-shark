const SHARK_SPRITE_PATH = "assets/images/shark.png";

let sharkSprite = null;

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    image.src = src;
  });
}

function stripNearBlackBackground(image) {
  const canvas = document.createElement("canvas");
  canvas.width = image.width;
  canvas.height = image.height;
  const ctx = canvas.getContext("2d");
  ctx.drawImage(image, 0, 0);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const pixels = imageData.data;

  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    if (r < 40 && g < 40 && b < 40) {
      pixels[i + 3] = 0;
    }
  }

  ctx.putImageData(imageData, 0, 0);

  return new Promise((resolve, reject) => {
    const processed = new Image();
    processed.onload = () => resolve(processed);
    processed.onerror = () => reject(new Error("Failed to process shark sprite"));
    processed.src = canvas.toDataURL("image/png");
  });
}

export async function loadGameAssets() {
  const raw = await loadImage(SHARK_SPRITE_PATH);
  sharkSprite = await stripNearBlackBackground(raw);
}

export function getSharkSprite() {
  return sharkSprite;
}
