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

async function bootstrapGame() {
  const canvas = document.getElementById('game-canvas');
  if (!canvas) {
    console.error('Game canvas element not found!');
    return;
  }

  // 1. Initialize Single Source of Truth Portfolio Data
  try {
    await initPortfolioContent();
  } catch (err) {
    console.warn('Portfolio data loaded with warnings:', err);
  }

  // 2. Instantiate Core Systems
  const particles = new ParticleSystem();
  const world = new WorldMap(particles, soundSynthesizer, globalEvents);
  
  // Rover spawns in the center command hub (1600, 1600)
  const rover = new Rover(1600, 1600, particles, soundSynthesizer, globalEvents);

  // HUD & UI Controller
  const hud = new HUDController(globalEvents, soundSynthesizer, storageService, particles);

  // Main Engine
  const engine = new GameEngine(canvas, rover, world, particles, hud, soundSynthesizer);

  // Input Manager (Keyboard, Pointer, and Mobile Virtual D-Pad)
  const input = new InputManager(rover, engine.camera, canvas, soundSynthesizer);

  // 3. Start Engine
  engine.start();

  console.log('%c⚡ Autonomous Rover Odyssey Loaded Successfully! ⚡', 'color:#00e5ff; font-weight:bold; font-size:14px;');
}

// Ensure execution even if DOMContentLoaded already fired (common on mobile browsers)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrapGame);
} else {
  bootstrapGame();
}
