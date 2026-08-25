/* ============================================
   LOST IN THE CLOUD — Audio Manager
   ============================================
   Abstraction layer for future audio integration.
   No-op implementations — ready for audio files.
   ============================================ */

const CHANNELS = {
  AMBIENT: 'ambient',
  SFX: 'sfx',
  UI: 'ui',
  CINEMATIC: 'cinematic',
};

const SOUND_EVENTS = {
  // UI
  CLICK: 'ui_click',
  HOVER: 'ui_hover',
  NOTIFICATION: 'ui_notification',

  // Terminal
  TERMINAL_KEYSTROKE: 'terminal_keystroke',
  TERMINAL_ENTER: 'terminal_enter',
  TERMINAL_ERROR: 'terminal_error',
  TERMINAL_SUCCESS: 'terminal_success',

  // Cinematic
  SCENE_TRANSITION: 'cinematic_transition',
  DIALOGUE_APPEAR: 'cinematic_dialogue',
  MISSION_COMPLETE: 'cinematic_mission_complete',

  // Incident
  INCIDENT_ALARM: 'incident_alarm',
  INCIDENT_RESOLVE: 'incident_resolve',

  // Ambient
  OFFICE_AMBIENT: 'ambient_office',
  SERVER_ROOM: 'ambient_server_room',
  KEYBOARD_AMBIENT: 'ambient_keyboard',
};

class AudioManagerCore {
  constructor() {
    this.enabled = false;
    this.volumes = {
      [CHANNELS.AMBIENT]: 0.3,
      [CHANNELS.SFX]: 0.7,
      [CHANNELS.UI]: 0.5,
      [CHANNELS.CINEMATIC]: 0.8,
    };
    this.currentAmbient = null;
  }

  initialize() {
    // Future: Initialize Web Audio API context
    console.log('[AudioManager] Initialized (no-op)');
  }

  play(/* soundEvent, channel = CHANNELS.SFX */) {
    // Future: Play sound from audio sprite or file
  }

  stop(/* channel */) {
    // Future: Stop channel playback
  }

  setVolume(channel, volume) {
    this.volumes[channel] = Math.max(0, Math.min(1, volume));
  }

  getVolume(channel) {
    return this.volumes[channel] || 0;
  }

  setEnabled(enabled) {
    this.enabled = enabled;
  }

  crossfade(/* fromChannel, toChannel, duration */) {
    // Future: Cross-fade between ambient tracks
  }

  playAmbient(/* soundEvent */) {
    // Future: Loop ambient sound
  }

  stopAll() {
    // Future: Stop all channels
  }
}

const AudioManager = new AudioManagerCore();

export { CHANNELS, SOUND_EVENTS };
export default AudioManager;
