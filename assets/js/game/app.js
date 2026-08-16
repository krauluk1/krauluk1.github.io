/**
 * App Bootstrap - Dependency Injection & Game Initialization
 * Robust bootstrap supporting all desktop and mobile browsers.
 */
import { initPortfolioContent } from './content.js';
import { globalEvents } from './events.js';
import { soundSynthesizer } from './audio.js';
import { storageService } from './storage.js';
import { ParticleSystem } from './particles.js';
import { Rover } from './rover.js';
import { WorldMap } from './world.js';
import { HUDController } from './hud.js';
import { InputManager } from './input.js';
import { GameEngine } from './engine.js';

let isBootstrapped = false;

function bootstrapGame() {
  if (isBootstrapped) return;

  const canvas = document.getElementById('game-canvas');
  if (!canvas) {
    console.error('Game canvas element not found!');
    return;
  }

  isBootstrapped = true;

  // 1. Instantiate Core Systems (Synchronous, Immediate, Zero Network Delay)
  const particles = new ParticleSystem();
  const world = new WorldMap(particles, soundSynthesizer, globalEvents);
  
  // Rover spawns in the center command hub (1600, 1600)
  const rover = new Rover(1600, 1600, particles, soundSynthesizer, globalEvents);

  // HUD & UI Controller
  const hud = new HUDController(globalEvents, soundSynthesizer, storageService, particles);

  // Synchronize any pre-existing saved state into world entities immediately
  world.syncSavedState(Array.from(hud.unlockedSectors), Array.from(hud.collectedItems));

  // Main Engine
  const engine = new GameEngine(canvas, rover, world, particles, hud, soundSynthesizer);

  // Input Manager (Keyboard, Pointer, and Mobile Virtual D-Pad)
  const input = new InputManager(rover, engine.camera, canvas, soundSynthesizer);

  // 2. Start Engine immediately on frame 0
  engine.start();

  console.log('%c⚡ Autonomous Rover Odyssey Loaded Successfully! ⚡', 'color:#00e5ff; font-weight:bold; font-size:14px;');

  // 3. Non-blocking background JSON hydration
  initPortfolioContent().then(() => {
    world.syncSavedState(Array.from(hud.unlockedSectors), Array.from(hud.collectedItems));
    hud.updateProgress();
  }).catch(err => {
    console.warn('Portfolio data loaded with warnings:', err);
  });
}

// Ensure execution even if DOMContentLoaded already fired (common on mobile browsers)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrapGame);
} else {
  bootstrapGame();
}
