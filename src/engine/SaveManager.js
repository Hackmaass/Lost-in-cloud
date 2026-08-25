/* ============================================
   LOST IN THE CLOUD — Save Manager
   ============================================
   Persistence abstraction with pluggable backends.
   Default: localStorage.
   Can be replaced with IndexedDB, server API, etc.
   ============================================ */

import GAME_CONFIG from '../data/config';

const STORAGE_KEY = GAME_CONFIG.save.storageKey;

class SaveManagerBackend {
  save(data) {
    try {
      const serialized = JSON.stringify(data);
      localStorage.setItem(STORAGE_KEY, serialized);
      return true;
    } catch (error) {
      console.error('[SaveManager] Failed to save:', error);
      return false;
    }
  }

  load() {
    try {
      const serialized = localStorage.getItem(STORAGE_KEY);
      if (!serialized) return null;
      return JSON.parse(serialized);
    } catch (error) {
      console.error('[SaveManager] Failed to load:', error);
      return null;
    }
  }

  hasSave() {
    try {
      return localStorage.getItem(STORAGE_KEY) !== null;
    } catch {
      return false;
    }
  }

  deleteSave() {
    try {
      localStorage.removeItem(STORAGE_KEY);
      return true;
    } catch (error) {
      console.error('[SaveManager] Failed to delete save:', error);
      return false;
    }
  }
}

// Singleton instance
const SaveManager = new SaveManagerBackend();

export default SaveManager;
