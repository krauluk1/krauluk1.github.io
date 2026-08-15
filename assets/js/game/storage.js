/**
 * StorageService - Game Progression & Settings Persistence
 * Implements Service / Repository Pattern
 */
const STORAGE_KEY = 'krauluk1_odyssey_save_v1';

export class StorageService {
  constructor() {
    this.memoryStore = {};
  }

  /**
   * Loads saved game state
   */
  load() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('LocalStorage unavailable, using in-memory state:', e);
    }
    return {
      unlockedSectors: ['spawn'],
      collectedItems: [],
      fastPassUsed: false,
      soundMuted: false
    };
  }

  /**
   * Saves game state
   * @param {Object} state 
   */
  save(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      this.memoryStore = { ...state };
    }
  }

  /**
   * Reset save data
   */
  reset() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      this.memoryStore = {};
    }
  }
}

export const storageService = new StorageService();
