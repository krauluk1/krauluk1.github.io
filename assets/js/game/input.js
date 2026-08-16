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
    this.initFocusHandlers();
  }

  isModalActive() {
    const modal = document.getElementById('dossier-modal');
    return !!(modal && modal.classList.contains('active'));
  }

  initFocusHandlers() {
    // Defensive reset on tab switch / window blur to prevent ghost driving
    window.addEventListener('blur', () => {
      this.keys = {};
      if (this.rover && this.rover.inputs) {
        this.rover.inputs.forward = false;
        this.rover.inputs.backward = false;
        this.rover.inputs.left = false;
        this.rover.inputs.right = false;
      }
    });
  }

  initKeyboard() {
    window.addEventListener('keydown', (e) => {
      if (this.sound && typeof this.sound.init === 'function') {
        this.sound.init(); // Initialize audio on user gesture
      }

      // Ignore driving inputs if user is viewing a modal/dossier
      if (this.isModalActive()) return;

      const key = (e.key || '').toLowerCase();
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
      const key = (e.key || '').toLowerCase();
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
      if (this.isModalActive()) return;

      if (this.sound && typeof this.sound.init === 'function') {
        this.sound.init();
      }
      const rect = this.canvas.getBoundingClientRect();
      const screenX = clientX - rect.left;
      const screenY = clientY - rect.top;

      const worldX = screenX + (this.camera ? this.camera.x : 0);
      const worldY = screenY + (this.camera ? this.camera.y : 0);

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
      if (e.touches && e.touches.length === 1) {
        touchStartTime = Date.now();
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    }, { passive: true });

    this.canvas.addEventListener('touchend', (e) => {
      if (e.changedTouches && e.changedTouches.length === 1) {
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

      let isPressed = false;

      const start = (e) => {
        if (isPressed) return;
        isPressed = true;
        if (e && e.cancelable) e.preventDefault();
        if (this.sound && typeof this.sound.init === 'function') this.sound.init();
        btn.classList.add('active');
        onStart();
      };

      const end = (e) => {
        if (!isPressed) return;
        isPressed = false;
        if (e && e.cancelable) e.preventDefault();
        btn.classList.remove('active');
        onEnd();
      };

      if (window.PointerEvent) {
        btn.addEventListener('pointerdown', start);
        btn.addEventListener('pointerup', end);
        btn.addEventListener('pointercancel', end);
        btn.addEventListener('pointerleave', end);
      } else {
        btn.addEventListener('touchstart', start, { passive: false });
        btn.addEventListener('touchend', end, { passive: false });
        btn.addEventListener('touchcancel', end, { passive: false });
        btn.addEventListener('mousedown', start);
        btn.addEventListener('mouseup', end);
        btn.addEventListener('mouseleave', end);
      }
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
        if (this.sound && typeof this.sound.playBump === 'function') this.sound.playBump();
      },
      () => {}
    );
  }
}
