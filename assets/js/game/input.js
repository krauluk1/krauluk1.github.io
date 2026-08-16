/**
 * InputManager - Input Handling & Mobile Touch Controller Adapter
 * Implements Adapter and Command Pattern
 * Supports keyboard (WASD / Arrows), Mouse click navigation, and Mobile Virtual D-Pad / Touch Autopilot.
 */
export class InputManager {
  constructor(rover, camera, canvas, soundSynthesizer) {
    this.rover = rover;
    this.camera = camera;
    this.canvas = canvas;
    this.sound = soundSynthesizer;

    this.keys = {};
    this.initKeyboard();
    this.initPointerAndTouch();
    this.initVirtualDpad();
  }

  initKeyboard() {
    window.addEventListener('keydown', (e) => {
      this.sound.init(); // Initialize audio on user gesture
      const key = e.key.toLowerCase();
      this.keys[key] = true;

      if (['arrowup', 'w'].includes(key)) this.rover.inputs.forward = true;
      if (['arrowdown', 's'].includes(key)) this.rover.inputs.backward = true;
      if (['arrowleft', 'a'].includes(key)) this.rover.inputs.left = true;
      if (['arrowright', 'd'].includes(key)) this.rover.inputs.right = true;
      if (key === ' ' || key === 'spacebar') {
        this.rover.speed *= 0.5; // Handbrake
      }

      // Any manual steering clears waypoint auto-pilot
      if (['arrowup', 'w', 'arrowdown', 's', 'arrowleft', 'a', 'arrowright', 'd'].includes(key)) {
        this.rover.clearWaypoint();
      }
    });

    window.addEventListener('keyup', (e) => {
      const key = e.key.toLowerCase();
      this.keys[key] = false;

      if (['arrowup', 'w'].includes(key)) this.rover.inputs.forward = false;
      if (['arrowdown', 's'].includes(key)) this.rover.inputs.backward = false;
      if (['arrowleft', 'a'].includes(key)) this.rover.inputs.left = false;
      if (['arrowright', 'd'].includes(key)) this.rover.inputs.right = false;
    });
  }

  initPointerAndTouch() {
    if (!this.canvas) return;

    const handleCanvasTap = (clientX, clientY) => {
      this.sound.init();
      const rect = this.canvas.getBoundingClientRect();
      const screenX = clientX - rect.left;
      const screenY = clientY - rect.top;

      const worldX = screenX + this.camera.x;
      const worldY = screenY + this.camera.y;

      this.rover.setWaypoint(worldX, worldY);
    };

    // Pointer event for unified mouse and stylus
    this.canvas.addEventListener('click', (e) => {
      handleCanvasTap(e.clientX, e.clientY);
    });

    // Touch event for mobile canvas tap
    let touchStartTime = 0;
    let touchStartX = 0;
    let touchStartY = 0;

    this.canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        touchStartTime = Date.now();
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    }, { passive: true });

    this.canvas.addEventListener('touchend', (e) => {
      if (e.changedTouches.length === 1) {
        const touchEndTime = Date.now();
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        const dist = Math.hypot(touchEndX - touchStartX, touchEndY - touchStartY);

        // Tap detected (quick touch without dragging)
        if (touchEndTime - touchStartTime < 350 && dist < 15) {
          handleCanvasTap(touchEndX, touchEndY);
        }
      }
    }, { passive: true });
  }

  initVirtualDpad() {
    const bindControl = (btnId, onStart, onEnd) => {
      const btn = document.getElementById(btnId);
      if (!btn) return;

      const start = (e) => {
        if (e.cancelable) e.preventDefault();
        this.sound.init();
        btn.classList.add('active');
        onStart();
      };

      const end = (e) => {
        if (e.cancelable) e.preventDefault();
        btn.classList.remove('active');
        onEnd();
      };

      // Pointer events for maximum cross-browser mobile support
      btn.addEventListener('pointerdown', start);
      btn.addEventListener('pointerup', end);
      btn.addEventListener('pointercancel', end);
      btn.addEventListener('pointerleave', end);

      // Touch events fallback
      btn.addEventListener('touchstart', start, { passive: false });
      btn.addEventListener('touchend', end, { passive: false });
      btn.addEventListener('touchcancel', end, { passive: false });
    };

    // Forward
    bindControl('touch-up', 
      () => { this.rover.clearWaypoint(); this.rover.inputs.forward = true; },
      () => { this.rover.inputs.forward = false; }
    );

    // Backward
    bindControl('touch-down',
      () => { this.rover.clearWaypoint(); this.rover.inputs.backward = true; },
      () => { this.rover.inputs.backward = false; }
    );

    // Turn Left
    bindControl('touch-left',
      () => { this.rover.clearWaypoint(); this.rover.inputs.left = true; },
      () => { this.rover.inputs.left = false; }
    );

    // Turn Right
    bindControl('touch-right',
      () => { this.rover.clearWaypoint(); this.rover.inputs.right = true; },
      () => { this.rover.inputs.right = false; }
    );

    // Handbrake / Stop
    bindControl('touch-brake',
      () => {
        this.rover.clearWaypoint();
        this.rover.speed *= 0.2;
        this.sound.playBump();
      },
      () => {}
    );
  }
}
