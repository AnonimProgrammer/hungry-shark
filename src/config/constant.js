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
export const BOMB_RESPAWN_DELAY = 10;
export const BOMB_EXPLOSION_DURATION = 0.45;
export const BOMB_EXPLOSION_START_RADIUS = 28;
export const BOMB_EXPLOSION_MAX_RADIUS = 120;
export const BOMB_TARGET_COUNT = 5;
/** Active bombs required within this radius of the shark. */
export const BOMB_VICINITY_RADIUS = 2000;
/** Minimum distance between any two bombs when placing. */
export const BOMB_MIN_SEPARATION = 500;
/** Bomb placement distance from the shark (spawn ring). */
export const BOMB_SPAWN_MIN_DISTANCE = 500;
export const BOMB_SPAWN_MAX_DISTANCE = 2000;
/** Bombs farther than this from the shark may be relocated into the vicinity. */
export const BOMB_FAR_RELOCATE_DISTANCE = 3000;
export const HIGH_SCORE_KEY = "hungry-shark-best-score";
export const STRIKE_BASE_BONUS = 5;
export const STRIKE_MAX_BONUS = 80;
export const STRIKE_CHAIN_WINDOW = 2;
export const STRIKE_MULTIPLIER = 2;
export const SCHOOL_SIZE = 12;
export const MIN_ACTIVE_GROUPS = 2;
export const MAX_ACTIVE_GROUPS = 6;
/** Active fish schools required within this radius of the shark. */
export const FISH_VICINITY_RADIUS = 4000;
export const FISH_TARGET_SCHOOL_COUNT = 6;
/** Groups with this many fish or fewer are treated as eaten (no longer active). */
export const GROUP_DEPLETED_THRESHOLD = 3;
export const GROUP_SPAWN_INTERVAL = 2;
export const GROUP_SPAWN_AHEAD_MIN = 900;
export const GROUP_SPAWN_AHEAD_MAX = 1500;
export const GROUP_SPAWN_ANGLE_SPREAD = 0.75;
export const POISONOUS_FISH_COUNT = 2;

/** On-screen shark sprite height (collision still uses Shark.radius). */
export const SHARK_SPRITE_HEIGHT = 180;
export const MENU_SHARK_SPRITE_HEIGHT = 440;

export const BOOST_MULTIPLIER = 2;
export const BOOST_METER_MAX = 100;
export const BOOST_DRAIN_DURATION = 2.5;
export const BOOST_REGEN_DELAY = 2;
export const BOOST_REGEN_DURATION = 10;

/** Downward acceleration when the shark is above the water surface (px/s²). */
export const GRAVITY = 520;

/** Converts per-frame swim speed to px/s (matches ~60 fps baseline). */
export const SHARK_SPEED_FPS = 60;

/** How far from the shark new entities spawn in world space. */
export const SPAWN_SPREAD_X = 700;
export const SPAWN_SPREAD_Y = 500;

/** Fish too far from the shark are recycled back into the active area. */
export const ENTITY_RECYCLE_DISTANCE = 2200;
