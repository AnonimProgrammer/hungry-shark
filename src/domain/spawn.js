import {
  CANVAS_WIDTH,
  WATER_SURFACE_Y,
  BOTTOM_LINE_Y,
} from "../config/constant.js";

export function randomWaterPosition() {
  const margin = 40;
  return {
    x: margin + Math.random() * (CANVAS_WIDTH - margin * 2),
    y:
      WATER_SURFACE_Y +
      margin +
      Math.random() * (BOTTOM_LINE_Y - WATER_SURFACE_Y - margin * 2),
  };
}
