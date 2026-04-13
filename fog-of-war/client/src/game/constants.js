// World dimensions
export const TILE       = 16;
export const GRID_W     = 128;
export const GRID_H     = 128;
export const WORLD_W    = GRID_W * TILE;  // 2048
export const WORLD_H    = GRID_H * TILE;  // 2048

// Fog / visibility
export const FOG_RADIUS = 5;   // tiles visible around player
export const SPAWN_X    = 64;
export const SPAWN_Y    = 64;

// Tile IDs (used in procedural map)
export const TILE_VOID  = 0;
export const TILE_FLOOR = 1;
export const TILE_FLOOR2 = 2;
export const TILE_WALL  = 3;

// Rendering depths
export const DEPTH_GROUND    = 0;
export const DEPTH_DECOR     = 5;
export const DEPTH_FOOTPRINT = 8;
export const DEPTH_TREASURE  = 10;
export const DEPTH_ENTITY    = 20;
export const DEPTH_PARTICLE  = 30;
export const DEPTH_FOG       = 50;
export const DEPTH_BLOODHUNT = 60;
export const DEPTH_UI        = 70;

// Character palette (one color per character slot 0-7)
export const CHAR_COLORS = [
  0x00ff88,  // 0 — teal green   (local player default)
  0x4488ff,  // 1 — sky blue
  0xff8844,  // 2 — orange
  0xcc44ff,  // 3 — purple
  0xffdd00,  // 4 — gold
  0xff4444,  // 5 — red (bots)
  0x44ffcc,  // 6 — aqua
  0xff44aa,  // 7 — pink
];

// Dark fantasy UI palette (matches CSS variables)
export const COLOR_BG      = 0x050508;
export const COLOR_FOG     = 0x050508;
export const COLOR_ACCENT  = 0xc0392b;
export const COLOR_GOLD    = 0xd4af37;
export const COLOR_SAFE    = 0x2ecc71;
export const COLOR_DANGER  = 0xff2244;
