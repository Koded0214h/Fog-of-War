import Phaser from 'phaser';
import { TILE, DEPTH_ENTITY } from '../constants.js';

/**
 * LightSystem — Phaser 3 PointLight dynamic lighting.
 *
 * To enable the Light2D pipeline you must call:
 *   this.lights.enable().setAmbientColor(0x111118);
 * in GameScene.create(), and set pipeline: 'Light2D' on all
 * tilemap layers and sprites that should receive lighting.
 *
 * Until real sprites are in use the placeholder graphics look
 * fine without Light2D, so the pipeline is opt-in here.
 */
export default class LightSystem {
  constructor(scene) {
    this.scene = scene;
    this._torches = [];
    this._playerLight = null;
    this._time = 0;
  }

  enable() {
    this.scene.lights.enable().setAmbientColor(0x181020);
  }

  // ── Player torch light ────────────────────────────────────────────────

  attachPlayerLight(x, y) {
    // Radius 120 instead of 180 — smaller radius = fewer pixels in the light shader
    this._playerLight = this.scene.lights.addLight(x, y, 120, 0xff8844, 1.6);
    return this._playerLight;
  }

  movePlayerLight(x, y) {
    if (this._playerLight) {
      this._playerLight.setPosition(x, y);
    }
  }

  // ── Treasure glow ─────────────────────────────────────────────────────

  addTreasureLight(tileX, tileY) {
    const x = (tileX + 0.5) * TILE;
    const y = (tileY + 0.5) * TILE;
    return this.scene.lights.addLight(x, y, 60, 0xffd700, 0.8);
  }

  // ── Wall torch ────────────────────────────────────────────────────────

  addTorchLight(worldX, worldY) {
    // Radius 60 instead of 90 — torches are decorative, keep them tight
    const light = this.scene.lights.addLight(worldX, worldY, 60, 0xff6622, 1.0);
    this._torches.push(light);
    return light;
  }

  // ── Per-frame flicker ─────────────────────────────────────────────────

  update(delta) {
    this._time += delta * 0.001;

    // Torch flicker — sine wave with small random jitter
    this._torches.forEach((torch, i) => {
      const base = 1.0 + 0.25 * Math.sin(this._time * 3.5 + i * 1.3);
      const jitter = (Math.random() - 0.5) * 0.1;
      torch.setIntensity(base + jitter);
    });

    // Player torch gentle breathe
    if (this._playerLight) {
      const breathe = 1.7 + 0.2 * Math.sin(this._time * 1.8);
      this._playerLight.setIntensity(breathe);
    }
  }

  removeLight(light) {
    if (light) this.scene.lights.removeLight(light);
  }

  destroy() {
    this._torches = [];
    this._playerLight = null;
    this.scene.lights.disable();
  }
}
