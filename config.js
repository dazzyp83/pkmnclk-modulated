// config.js

// ─────────────────────────────────────────────────────────────────────────────
// GLOBAL CONFIGURATION
// ─────────────────────────────────────────────────────────────────────────────

// Canvas dimensions: Match the Game Boy Color's native resolution.
const CANVAS_WIDTH = 160;
const CANVAS_HEIGHT = 144;

// Development zoom factor for better visibility on a computer monitor.
const DISPLAY_ZOOM_FACTOR = 3;

// Name-box coordinates
const BACK_NAME_END_X    = 149;
const BACK_NAME_Y        = 72;
const FRONT_NAME_START_X = 11;
const FRONT_NAME_END_X   = 80;
const FRONT_NAME_Y       = 7;

// Sprite dimensions and base positions
const BACK_SPRITE_W = 80;
const BACK_SPRITE_H = 80;
const BACK_SPRITE_BASE_X = 0;
const BACK_SPRITE_BASE_Y = 35;

const FRONT_SPRITE_W = 90;
const FRONT_SPRITE_H = 90;
const FRONT_SPRITE_BASE_X = 77;
const FRONT_SPRITE_BASE_Y = -15;

// HP Bar dimensions and positions
const HP_LABEL_TEXT_SIZE = 6;
const FRONT_HP_BAR_X = 30;
const FRONT_HP_BAR_Y = 17;
const BACK_HP_BAR_X = 93;
const BACK_HP_BAR_Y = 83.5;
const HP_BAR_W = 50;
const HP_BAR_H = 5;
const HP_BAR_RADIUS = 2.5;

// Clock position and text size
const CLOCK_TEXT_SIZE = 24;
const CLOCK_X_POS = 82;
const CLOCK_Y_POS = 117;

// Winner text position and size
const WINNER_TEXT_SIZE = 10;
const WINNER_TEXT_X = 82;
const WINNER_TEXT_Y = CLOCK_Y_POS - (WINNER_TEXT_SIZE / 2);
const WINNER_TEXT_LINE_HEIGHT = WINNER_TEXT_SIZE + 2;

// Day Screen Box
const DAY_BOX_WIDTH = 120;
const DAY_BOX_HEIGHT = 30;
const DAY_BOX_X = (160 - 120) / 2;
const DAY_BOX_Y = ((144 - 30) / 2) - 10;
const DAY_TEXT_SIZE_LABEL = 8;
const DAY_TEXT_SIZE_DAY = 14;

// Animation timings
const ATTACK_LUNGE_OFFSET = 10;
const ATTACK_ANIMATION_DURATION = 300;
const HIT_ANIMATION_DURATION = 400;
const FLASH_INTERVAL = 100;
const FRONT_TRANSITION_DURATION = 500;
const BACK_TRANSITION_DURATION = 500;
const WINNER_DISPLAY_DURATION = 2000;
const WINNER_FLASH_INTERVAL = 300;
const TURN_INTERVAL = 5 * 60 * 1000;
