/**
 * GameEngine - Core Game Loop & Viewport Pipeline
 * Implements Game Loop and State Machine Pattern with Mobile Viewport Resilience
 */
export class GameEngine {
  constructor(canvas, rover, world, particles, hudController, soundSynthesizer) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.rover = rover;
    this.world = world;
    this.particles = particles;
    this.hud = hudController;
    this.sound = soundSynthesizer;

    this.camera = { x: 0, y: 0 };
    this.lastTime = performance.now();
    this.isRunning = false;

    this.handleResize();
    this.centerCameraOnRover();

    window.addEventListener('resize', () => {
      this.handleResize();
      if (!this.isRunning) this.centerCameraOnRover();
    });
    window.addEventListener('orientationchange', () => {
      setTimeout(() => {
        this.handleResize();
        this.centerCameraOnRover();
      }, 100);
    });
  }

  centerCameraOnRover() {
    if (!this.canvas || !this.rover || !this.world) return;
    const targetCamX = this.rover.x - this.canvas.width / 2;
    const targetCamY = this.rover.y - this.canvas.height / 2;

    const maxCamX = Math.max(0, this.world.width - this.canvas.width);
    const maxCamY = Math.max(0, this.world.height - this.canvas.height);

    this.camera.x = Math.max(0, Math.min(maxCamX, targetCamX));
    this.camera.y = Math.max(0, Math.min(maxCamY, targetCamY));
  }

  handleResize() {
    const width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth || 800;
    const height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight || 600;
    
    if (this.canvas.width !== width || this.canvas.height !== height) {
      this.canvas.width = width;
      this.canvas.height = height;
    }
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.handleResize();
    this.centerCameraOnRover();
    this.lastTime = performance.now();
    // Render initial frame immediately so viewport is never blank or uncentered
    this.render();
    requestAnimationFrame((t) => this.loop(t));
  }

  stop() {
    this.isRunning = false;
  }

  loop(currentTime) {
    if (!this.isRunning) return;

    const dt = Math.min((currentTime - this.lastTime) / 1000, 0.1);
    this.lastTime = currentTime;

    try {
      // 1. Update Game State
      this.update(dt);

      // 2. Render Scene
      this.render();
    } catch (err) {
      console.error('Error in game loop frame:', err);
    }

    requestAnimationFrame((t) => this.loop(t));
  }

  update(dt) {
    // Update Rover Physics
    this.rover.update(dt, this.world);

    // Update World triggers & collectables
    this.world.update(dt, this.rover);

    // Update Particles
    this.particles.update(dt);

    // Smooth Camera Follow (Lerp)
    const targetCamX = this.rover.x - this.canvas.width / 2;
    const targetCamY = this.rover.y - this.canvas.height / 2;

    const maxCamX = Math.max(0, this.world.width - this.canvas.width);
    const maxCamY = Math.max(0, this.world.height - this.canvas.height);

    const clampedTargetX = Math.max(0, Math.min(maxCamX, targetCamX));
    const clampedTargetY = Math.max(0, Math.min(maxCamY, targetCamY));

    this.camera.x += (clampedTargetX - this.camera.x) * 0.1;
    this.camera.y += (clampedTargetY - this.camera.y) * 0.1;
  }

  render() {
    // Clear screen
    this.ctx.fillStyle = '#090d16';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.save();
    // Translate camera
    this.ctx.translate(-Math.round(this.camera.x), -Math.round(this.camera.y));

    // 1. Render World & Sectors
    this.world.render(this.ctx, this.camera);

    // 2. Render Particles
    this.particles.render(this.ctx);

    // 3. Render Player Rover
    this.rover.render(this.ctx);

    this.ctx.restore();

    // 4. Update HUD Minimap
    this.hud.renderMinimap(this.rover, this.world);
  }
}
