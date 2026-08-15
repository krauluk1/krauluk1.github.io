/**
 * InputManager - Input Handling & Controller Adapter
 * Implements Adapter and Command Pattern
 */
export class InputManager {
  constructor(rover, camera, canvas, soundSynthesizer) {
    this.rover = rover;
    this.camera = camera;
    this.canvas = canvas;
    this.sound = soundSynthesizer;

    this.keys = {};
    this.initKeyboard();
    this.initPointer();
    this.initTouchControls();
  }

  initKeyboard() {
    window.addEventListener('keydown', (e) => {
      this.sound.init(); // Initialize audio on first key press
      const key = e.key.toLowerCase();
      this.keys[key] = true;

      if (['arrowup', 'w'].includes(key)) this.rover.inputs.forward = true;
      if (['arrowdown', 's'].includes(key)) this.rover.inputs.backward = true;
      if (['arrowleft', 'a'].includes(key)) this.rover.inputs.left = true;
      if (['arrowright', 'd'].includes(key)) this.rover.inputs.right = true;
      if (key === ' ') {
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

  initPointer() {
    if (!this.canvas) return;

    this.canvas.addEventListener('click', (e) => {
      this.sound.init();
      // Calculate world coordinates from screen click
      const rect = this.canvas.getBoundingClientRect();
      const screenX = e.clientX - rect.left;
      const screenY = e.clientY - rect.top;

      const worldX = screenX + this.camera.x;
      const worldY = screenY + this.camera.y;

      this.rover.setWaypoint(worldX, worldY);
    });
  }

  initTouchControls() {
    // Touch D-pad buttons
    const btnUp = document.getElementById('touch-up');
    const btnDown = document.getElementById('touch-down');
    const btnLeft = document.getElementById('touch-left');
    const btnRight = document.getElementById('touch-right');

    const bindTouch = (btn, inputProp) => {
      if (!btn) return;
      const startHandler = (e) => {
        e.preventDefault();
        this.sound.init();
        this.rover.clearWaypoint();
        this.rover.inputs[inputProp] = true;
        btn.classList.add('active');
      };
      const endHandler = (e) => {
        e.preventDefault();
        this.rover.inputs[inputProp] = false;
        btn.classList.remove('active');
      };

      btn.addEventListener('touchstart', startHandler, { passive: false });
      btn.addEventListener('touchend', endHandler, { passive: false });
      btn.addEventListener('mousedown', startHandler);
      btn.addEventListener('mouseup', endHandler);
      btn.addEventListener('mouseleave', endHandler);
    };

    bindTouch(btnUp, 'forward');
    bindTouch(btnDown, 'backward');
    bindTouch(btnLeft, 'left');
    bindTouch(btnRight, 'right');
  }
}
