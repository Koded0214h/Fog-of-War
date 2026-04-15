/**
 * prefetchAssets — warm the browser HTTP cache before Phaser's loader runs.
 *
 * Called once on app mount (App.jsx). While the user is on the Landing screen
 * (wallet connect, character select, lobby wait) the browser silently fetches
 * every game asset in the background. By the time Phaser's PreloadScene fires
 * this.load.image() / this.load.audio(), most files are already cached and the
 * in-game loading bar completes almost instantly.
 *
 * Images  → new Image() with src set  (browser fetches + caches, zero JS overhead)
 * Audio   → fetch() with cache:'force-cache'  (populates the HTTP cache for audio)
 * BGM     → fetched last at low priority (it's large, ~5 MB)
 */

const FRAMES  = '/assets/0x72_DungeonTilesetII_v1.7/frames/';
const KENNEY  = '/assets/kenney_particle-pack/PNG (Transparent)/';
const RPG     = '/assets/sounds/kenney_rpg-audio/Audio/';
const SOUNDS  = '/assets/sounds/';

const CHAR_NAMES = [
  'knight_m', 'elf_m', 'lizard_m', 'wizzard_m',
  'dwarf_m', 'orc_warrior', 'knight_f', 'elf_f',
];

function buildImageUrls() {
  const urls = [];

  // ── Character sprites ────────────────────────────────────────────────────
  CHAR_NAMES.forEach(name => {
    for (let f = 0; f < 4; f++) {
      urls.push(`${FRAMES}${name}_idle_anim_f${f}.png`);
      urls.push(`${FRAMES}${name}_run_anim_f${f}.png`);
    }
    if (name !== 'orc_warrior') {
      urls.push(`${FRAMES}${name}_hit_anim_f0.png`);
    }
  });

  // ── Floor tiles ──────────────────────────────────────────────────────────
  for (let i = 1; i <= 8; i++) urls.push(`${FRAMES}floor_${i}.png`);

  // ── Wall tiles ───────────────────────────────────────────────────────────
  [
    'wall_mid', 'wall_left', 'wall_right',
    'wall_top_mid', 'wall_top_left', 'wall_top_right',
    'wall_outer_mid_left', 'wall_outer_mid_right',
    'wall_outer_front_left', 'wall_outer_front_right',
  ].forEach(k => urls.push(`${FRAMES}${k}.png`));

  // ── Decor ────────────────────────────────────────────────────────────────
  ['crate', 'skull', 'column', 'hole', 'wall_banner_red', 'wall_banner_blue']
    .forEach(k => urls.push(`${FRAMES}${k}.png`));

  // ── Chest & coin ─────────────────────────────────────────────────────────
  for (let f = 0; f < 3; f++) {
    urls.push(`${FRAMES}chest_full_open_anim_f${f}.png`);
    urls.push(`${FRAMES}chest_empty_open_anim_f${f}.png`);
  }
  urls.push(`${FRAMES}coin_anim_f0.png`);

  // ── Particles ────────────────────────────────────────────────────────────
  ['flare_01', 'fire_01', 'magic_04', 'circle_05', 'circle_01']
    .forEach(k => urls.push(`${KENNEY}${k}.png`));

  // ── Weapons (placeholder) ────────────────────────────────────────────────
  urls.push(`${FRAMES}weapon_bow.png`);
  urls.push(`${FRAMES}weapon_arrow.png`);

  return urls;
}

function buildAudioUrls() {
  return [
    `${RPG}metalClick.ogg`,
    `${RPG}footstep00.ogg`,
    `${RPG}handleCoins.ogg`,
    `${RPG}knifeSlice.ogg`,
    `${RPG}chop.ogg`,
  ];
}

let _started = false;

export function prefetchAssets() {
  if (_started) return;
  _started = true;

  // Images: new Image() is the lightest possible way — browser fetches and
  // caches without involving JS memory for the decoded pixels.
  buildImageUrls().forEach(url => {
    const img = new Image();
    img.src = url;
  });

  // Audio: fetch with cache:'force-cache' so the HTTP cache is populated.
  // Errors silently ignored — if files are missing Phaser will handle it.
  buildAudioUrls().forEach(url => {
    fetch(url, { cache: 'force-cache' }).catch(() => {});
  });

  // BGM is large — fetch last, lowest priority.
  fetch(`${SOUNDS}YuraSoop - Dark Ambient.mp3`, { cache: 'force-cache' }).catch(() => {});
}
