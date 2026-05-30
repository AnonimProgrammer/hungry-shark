export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 600;
export const WATER_SURFACE_Y = 80;
export const SEABED_HEIGHT = 60;
export const BOTTOM_LINE_Y = CANVAS_HEIGHT - SEABED_HEIGHT;

export const HUNGER_LIMIT = 5;
export const STARVATION_DRAIN = 10;
export const POISON_DAMAGE = 20;
export const BOMB_DAMAGE = 30;
export const BOMB_RESPAWN_DELAY = 5;
export const BOMB_EXPLOSION_DURATION = 0.45;
export const HIGH_SCORE_KEY = "hungry-shark-high-score";
export const SCHOOL_SIZE = 6;
export const POISONOUS_FISH_COUNT = 2;

export const BOOST_MULTIPLIER = 2;
export const BOOST_DURATION = 2.5;
export const BOOST_COOLDOWN = 5;

export const BOOST_STATES = {
  READY: "READY",
  ACTIVE: "ACTIVE",
  COOLDOWN: "COOLDOWN",
};
