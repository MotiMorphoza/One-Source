export const SpeechEngine = {
  enabled: true,
  voices: [],
  initialized: false,
  supported: "speechSynthesis" in window,

  async init() {
    if (!this.supported || this.initialized) {
      return;
    }

    await new Promise((resolve) => {
      const loadVoices = () => {
        this.voices = speechSynthesis.getVoices();
        if (this.voices.length > 0) {
          this.initialized = true;
          resolve();
        }
      };

      speechSynthesis.onvoiceschanged = loadVoices;
      loadVoices();

      setTimeout(() => {
        if (!this.initialized) {
          this.voices = speechSynthesis.getVoices();
          this.initialized = true;
          resolve();
        }
      }, 300);
    });
  },

  getLangCode(langPair) {
    const first = String(langPair || "en").split("-")[0];
    const map = {
      ar: "ar-SA",
      en: "en-US",
      es: "es-ES",
      he: "he-IL",
      pl: "pl-PL",
    };

    return map[first] || "en-US";
  },

  findVoice(langCode) {
    const prefix = langCode.split("-")[0];
    return this.voices.find((voice) => voice.lang.startsWith(prefix)) || null;
  },

  async speak(text, langPair, options = {}) {
    if (!this.supported || !this.enabled || !text) {
      return;
    }

    await this.init();

    const langCode = this.getLangCode(langPair);
    const utterance = new SpeechSynthesisUtterance(text);
    const voice = this.findVoice(langCode);

    if (voice) {
      utterance.voice = voice;
    }

    utterance.lang = langCode;
    utterance.rate = options.rate || 0.8;
    utterance.pitch = options.pitch || 1;
    utterance.volume = options.volume || 1;

    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  },

  stop() {
    if (this.supported) {
      speechSynthesis.cancel();
    }
  },

  setEnabled(enabled) {
    this.enabled = Boolean(enabled);
    if (!this.enabled) {
      this.stop();
    }
  },

  toggle() {
    this.setEnabled(!this.enabled);
    return this.enabled;
  },
};
