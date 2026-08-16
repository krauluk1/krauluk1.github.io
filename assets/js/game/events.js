/**
 * EventBus - Observer / Publish-Subscribe Pattern
 * Provides decoupled communication between Game Engine, Rover, World, HUD, and Audio.
 */
export class EventBus {
  constructor() {
    this.listeners = new Map();
  }

  /**
   * Subscribe to an event
   * @param {string} eventName 
   * @param {Function} callback 
   */
  on(eventName, callback) {
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, []);
    }
    this.listeners.get(eventName).push(callback);
    return () => this.off(eventName, callback);
  }

  /**
   * Unsubscribe from an event
   * @param {string} eventName 
   * @param {Function} callback 
   */
  off(eventName, callback) {
    if (!this.listeners.has(eventName)) return;
    const callbacks = this.listeners.get(eventName).filter(cb => cb !== callback);
    this.listeners.set(eventName, callbacks);
  }

  /**
   * Emit an event to all subscribers
   * @param {string} eventName 
   * @param {*} data 
   */
  emit(eventName, data) {
    if (!this.listeners.has(eventName)) return;
    const callbacks = this.listeners.get(eventName).slice();
    callbacks.forEach(cb => {
      try {
        if (typeof cb === 'function') cb(data);
      } catch (err) {
        console.error(`Error handling event "${eventName}":`, err);
      }
    });
  }
}

export const globalEvents = new EventBus();
