export const AudioEngine = {
  context: null,
  enabled: true,
  initialized: false,

  init() {
    if (this.initialized) {
      return;
    }

    try {
      this.context = new (window.AudioContext || window.webkitAudioContext)();
      this.initialized = true;
    } catch (error) {
      console.warn("AudioContext is not available", error);
    }
  },

  ensureRunning() {
    if (!this.context) {
      this.init();
    }

    if (this.context?.state === "suspended") {
      this.context.resume().catch(() => {});
    }
  },

  play(type) {
    if (!this.enabled) {
      return;
    }

    this.ensureRunning();

    if (!this.context) {
      return;
    }

    const profiles = {
      click: { freq: 400, wave: "triangle", volume: 0.025, duration: 0.12 },
      success: { freq: 720, wave: "triangle", volume: 0.035, duration: 0.2 },
      error: { freq: 210, wave: "sine", volume: 0.03, duration: 0.18 },
      flip: { freq: 520, wave: "sine", volume: 0.02, duration: 0.16 },
    };

    this.playTone(profiles[type] || profiles.click);
  },

  playTone(profile) {
    const now = this.context.currentTime;
    const oscillator = this.context.createOscillator();
    const gain = this.context.createGain();
    const filter = this.context.createBiquadFilter();

    oscillator.type = profile.wave;
    oscillator.frequency.setValueAtTime(profile.freq, now);

    filter.type = "lowpass";
    filter.frequency.value = 1400;

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(profile.volume, now + 0.03);
    gain.gain.linearRampToValueAtTime(0, now + profile.duration);

    oscillator.connect(filter);
    filter.connect(gain);
    gain.connect(this.context.destination);

    oscillator.start(now);
    oscillator.stop(now + profile.duration + 0.05);
  },

  setEnabled(enabled) {
    this.enabled = Boolean(enabled);
  },

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  },
};

document.addEventListener("pointerdown", () => AudioEngine.init(), { once: true });
