export const CANVAS_WIDTH = 1200;
export const CANVAS_HEIGHT = 800;

/** Fixed world Y where sky meets water — not tied to the viewport. */
export const WATER_SURFACE_Y = 220;

/** Playable water depth: roughly twice a typical on-screen water column. */
export const WATER_COLUMN_HEIGHT = (CANVAS_HEIGHT - 280) * 2;
export const SEABED_WORLD_Y = WATER_SURFACE_Y + WATER_COLUMN_HEIGHT;
export const SEABED_HEIGHT = 80;

/** Fish keep ~2 m below the surface (game scale: ~25 px ≈ 1 m). */
export const FISH_SURFACE_CLEARANCE = 50;

/** Hazards float 5–10 m above the seabed (not resting on the floor). */
export const SEABED_HAZARD_CLEARANCE_MIN = 125;
export const SEABED_HAZARD_CLEARANCE_MAX = 250;

export const HUNGER_LIMIT = 10;
export const STARVATION_DRAIN = 5;

export function isStarving(hungerTimer) {
  return hungerTimer >= HUNGER_LIMIT;
}

export const HP_REGEN_DELAY = 2;
export const HP_REGEN_RATE = 10;
export const POISON_DURATION = 4;
export const POISON_DAMAGE = 20;
export const POISON_TICK_RATE = 5;
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

/** How far from the shark new entities spawn in world space. */
export const SPAWN_SPREAD_X = 700;
export const SPAWN_SPREAD_Y = 500;

/** Fish too far from the shark are recycled back into the active area. */
export const ENTITY_RECYCLE_DISTANCE = 2200;
