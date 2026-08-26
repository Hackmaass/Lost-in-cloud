/* ============================================
   LOST IN THE CLOUD — Web Audio Synthesizer
   ============================================
   Zero-dependency, pure Web Audio API synthesizer
   for zero-latency sound effects, alarms, and ambience.
   ============================================ */

export const CHANNELS = {
  AMBIENT: 'ambient',
  SFX: 'sfx',
  UI: 'ui',
  CINEMATIC: 'cinematic',
};

export const SOUND_EVENTS = {
  // UI
  CLICK: 'ui_click',
  HOVER: 'ui_hover',
  NOTIFICATION: 'ui_notification',
  ACHIEVEMENT: 'achievement_unlocked',

  // Terminal
  TERMINAL_KEYSTROKE: 'terminal_keystroke',
  TERMINAL_ENTER: 'terminal_enter',
  TERMINAL_ERROR: 'terminal_error',
  TERMINAL_SUCCESS: 'terminal_success',

  // Cinematic & Incidents
  SCENE_TRANSITION: 'cinematic_transition',
  INCIDENT_ALARM: 'incident_alarm',
  INCIDENT_RESOLVE: 'incident_resolve',

  // Ambient
  SERVER_ROOM: 'ambient_server_room',
};

class AudioManagerCore {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.masterVolume = 0.6;
    this.volumes = {
      [CHANNELS.AMBIENT]: 0.3,
      [CHANNELS.SFX]: 0.7,
      [CHANNELS.UI]: 0.5,
      [CHANNELS.CINEMATIC]: 0.8,
    };
    this.ambientSource = null;
    this.ambientGain = null;
  }

  initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  play(soundEvent, channel = CHANNELS.SFX) {
    if (!this.enabled) return;
    this.initContext();
    if (!this.ctx) return;

    const chanVol = (this.volumes[channel] ?? 0.7) * this.masterVolume;
    if (chanVol <= 0) return;

    try {
      switch (soundEvent) {
        case SOUND_EVENTS.CLICK:
        case 'ui_click':
          this._playClick(chanVol);
          break;

        case SOUND_EVENTS.TERMINAL_KEYSTROKE:
        case 'terminal_keystroke':
          this._playKeystroke(chanVol);
          break;

        case SOUND_EVENTS.TERMINAL_ENTER:
        case 'terminal_enter':
          this._playEnter(chanVol);
          break;

        case SOUND_EVENTS.TERMINAL_SUCCESS:
        case SOUND_EVENTS.INCIDENT_RESOLVE:
        case 'terminal_success':
        case 'incident_resolve':
          this._playSuccess(chanVol);
          break;

        case SOUND_EVENTS.TERMINAL_ERROR:
        case SOUND_EVENTS.INCIDENT_ALARM:
        case 'terminal_error':
        case 'incident_alarm':
          this._playAlarm(chanVol);
          break;

        case SOUND_EVENTS.ACHIEVEMENT:
        case 'achievement_unlocked':
          this._playAchievement(chanVol);
          break;

        default:
          this._playClick(chanVol);
          break;
      }
    } catch (e) {
      // Ignore audio synthesis errors on locked browsers
    }
  }

  _playClick(volume) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const t = this.ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, t);
    osc.frequency.exponentialRampToValueAtTime(300, t + 0.03);

    gain.gain.setValueAtTime(volume * 0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.03);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.035);
  }

  _playKeystroke(volume) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const t = this.ctx.currentTime;

    const freq = 1200 + Math.random() * 600;
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, t);
    osc.frequency.exponentialRampToValueAtTime(400, t + 0.02);

    gain.gain.setValueAtTime(volume * 0.15, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.02);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.025);
  }

  _playEnter(volume) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const t = this.ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, t);
    osc.frequency.exponentialRampToValueAtTime(880, t + 0.06);

    gain.gain.setValueAtTime(volume * 0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.07);
  }

  _playSuccess(volume) {
    const freqs = [523.25, 659.25, 783.99]; // C5, E5, G5 major triad
    const t = this.ctx.currentTime;

    freqs.forEach((f, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startT = t + idx * 0.06;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, startT);

      gain.gain.setValueAtTime(0, startT);
      gain.gain.linearRampToValueAtTime(volume * 0.25, startT + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startT + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startT);
      osc.stop(startT + 0.42);
    });
  }

  _playAlarm(volume) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const t = this.ctx.currentTime;

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(480, t);
    osc.frequency.setValueAtTime(360, t + 0.1);
    osc.frequency.setValueAtTime(480, t + 0.2);

    gain.gain.setValueAtTime(volume * 0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.36);
  }

  _playAchievement(volume) {
    const freqs = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    const t = this.ctx.currentTime;

    freqs.forEach((f, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startT = t + idx * 0.08;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, startT);

      gain.gain.setValueAtTime(0, startT);
      gain.gain.linearRampToValueAtTime(volume * 0.3, startT + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startT + 0.5);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startT);
      osc.stop(startT + 0.52);
    });
  }

  startServerRoomHum() {
    if (!this.enabled || this.ambientSource) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(58, this.ctx.currentTime); // 58Hz electrical hum

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(140, this.ctx.currentTime);

      gain.gain.setValueAtTime((this.volumes[CHANNELS.AMBIENT] || 0.3) * this.masterVolume * 0.1, this.ctx.currentTime);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      this.ambientSource = osc;
      this.ambientGain = gain;
    } catch (e) {
      // Ambience fallback
    }
  }

  stopServerRoomHum() {
    if (this.ambientSource) {
      try {
        this.ambientSource.stop();
        this.ambientSource.disconnect();
      } catch (e) {}
      this.ambientSource = null;
      this.ambientGain = null;
    }
  }

  setMasterVolume(val) {
    this.masterVolume = Math.max(0, Math.min(1, val));
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.setValueAtTime(
        (this.volumes[CHANNELS.AMBIENT] || 0.3) * this.masterVolume * 0.1,
        this.ctx.currentTime
      );
    }
  }

  setVolume(channel, volume) {
    this.volumes[channel] = Math.max(0, Math.min(1, volume));
  }

  setEnabled(enabled) {
    this.enabled = !!enabled;
    if (!this.enabled) {
      this.stopServerRoomHum();
    }
  }
}

const AudioManager = new AudioManagerCore();
export default AudioManager;
