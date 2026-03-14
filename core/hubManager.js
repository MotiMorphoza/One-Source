import { AudioEngine } from "./audio.js";
import { EventBus } from "./eventBus.js";
import { HubAdapter } from "./hubAdapter.js";
import { Router } from "./router.js";
import { SessionEngine } from "./engine.js";
import { SpeechEngine } from "./speech.js";
import { Storage } from "./storage.js";
import { FlashCardsGame } from "../games/flashcards.js";
import { WordMatchGame } from "../games/wordmatch.js";
import { WordPuzzleGame } from "../games/wordpuzzle.js";
import { renderAccordionTree } from "../ui/accordion.js";
import { Modal } from "../ui/modals.js";
import { renderStats } from "../ui/stats.js";

const GAME_REGISTRY = {
  flashcards: FlashCardsGame,
  wordmatch: WordMatchGame,
  wordpuzzle: WordPuzzleGame,
};

class HubManager {
  constructor() {
    this.router = new Router();
    this.activeGame = null;
    this.selectedLang = null;
    this.selectedGame = null;
    this.selectedTopic = null;
  }

  init() {
    this.cacheDom();
    this.registerScreens();
    this.restorePreferences();
    HubAdapter.init();
    this.populateLanguages();
    this.bindUi();
    this.bindAppEvents();
    this.router.navigate("home", { record: false });
    this.registerServiceWorker();
  }

  cacheDom() {
    this.dom = {
      home: document.getElementById("screen-home"),
      game: document.getElementById("screen-game"),
      stats: document.getElementById("screen-stats"),
      languageSelect: document.getElementById("languageSelect"),
      gameButtons: [...document.querySelectorAll("[data-game]")],
      gameHint: document.getElementById("gameHint"),
      topicPanel: document.getElementById("topicPanel"),
      topicTree: document.getElementById("topicTree"),
      startButton: document.getElementById("startTopicButton"),
      openStatsButton: document.getElementById("openStatsButton"),
      gameMount: document.getElementById("gameMount"),
      statsMount: document.getElementById("statsMount"),
      backFromStatsButton: document.getElementById("backFromStatsButton"),
      resetStatsButton: document.getElementById("resetStatsButton"),
      toggleSound: document.getElementById("toggleSound"),
      toggleSpeech: document.getElementById("toggleSpeech"),
    };
  }

  registerScreens() {
    this.router.register("home", this.dom.home);
    this.router.register("game", this.dom.game);
    this.router.register("stats", this.dom.stats);
  }

  restorePreferences() {
    AudioEngine.setEnabled(Storage.getPreference("audioEnabled", true));
    SpeechEngine.setEnabled(Storage.getPreference("speechEnabled", true));
    this.updateToggleLabels();
  }

  bindUi() {
    this.dom.languageSelect.addEventListener("change", (event) => {
      this.handleLanguageChange(event.target.value);
    });

    this.dom.gameButtons.forEach((button) => {
      button.addEventListener("click", () => {
        this.handleGameSelection(button.dataset.game);
      });
    });

    this.dom.startButton.addEventListener("click", () => {
      this.startSelectedTopic();
    });

    this.dom.openStatsButton.addEventListener("click", () => {
      this.showStats();
    });

    this.dom.backFromStatsButton.addEventListener("click", () => {
      this.router.navigate("home", { record: false });
    });

    this.dom.resetStatsButton.addEventListener("click", async () => {
      const confirmed = await Modal.confirm(
        "Delete saved sessions, records, and hard-item counts?",
      );

      if (!confirmed) {
        return;
      }

      Storage.clearNamespace("sessions");
      Storage.clearNamespace("best");
      Storage.clearNamespace("hard");
      this.showStats();
    });

    this.dom.toggleSound.addEventListener("click", () => {
      const enabled = AudioEngine.toggle();
      Storage.setPreference("audioEnabled", enabled);
      this.updateToggleLabels();
    });

    this.dom.toggleSpeech.addEventListener("click", () => {
      const enabled = SpeechEngine.toggle();
      Storage.setPreference("speechEnabled", enabled);
      this.updateToggleLabels();
    });
  }

  bindAppEvents() {
    EventBus.on("app:show-home", () => {
      this.showHome();
    });

    EventBus.on("app:restart-topic", () => {
      this.restartTopic();
    });
  }

  updateToggleLabels() {
    this.dom.toggleSound.textContent = AudioEngine.enabled ? "Sound on" : "Sound off";
    this.dom.toggleSpeech.textContent = SpeechEngine.enabled
      ? "Speech on"
      : "Speech off";
  }

  populateLanguages() {
    this.dom.languageSelect.innerHTML = "";

    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "Select a language pair";
    this.dom.languageSelect.appendChild(placeholder);

    HubAdapter.getLanguages().forEach((language) => {
      const option = document.createElement("option");
      option.value = language.id;
      option.textContent = language.title;
      this.dom.languageSelect.appendChild(option);
    });
  }

  handleLanguageChange(lang) {
    this.selectedLang = lang || null;
    this.selectedGame = null;
    this.selectedTopic = null;
    this.dom.topicPanel.hidden = true;
    this.dom.startButton.disabled = true;
    this.dom.startButton.textContent = "Select a topic first";
    this.dom.topicTree.innerHTML = "";
    this.dom.gameHint.textContent = this.selectedLang
      ? "Select one of the training modes below."
      : "Choose a language pair to unlock the games.";

    this.dom.gameButtons.forEach((button) => {
      button.classList.remove("is-selected");
    });
  }

  handleGameSelection(gameId) {
    if (!this.selectedLang) {
      Modal.alert("Choose a language pair first.");
      return;
    }

    this.selectedGame = gameId;
    this.selectedTopic = null;
    this.dom.startButton.disabled = true;
    this.dom.startButton.textContent = "Select a topic first";

    this.dom.gameButtons.forEach((button) => {
      button.classList.toggle("is-selected", button.dataset.game === gameId);
    });

    this.renderTopicTree();
  }

  renderTopicTree() {
    if (!this.selectedLang || !this.selectedGame) {
      return;
    }

    const category = this.selectedGame === "wordpuzzle" ? "sentences" : null;
    const tree = HubAdapter.buildTree(this.selectedLang, category);

    this.dom.topicPanel.hidden = false;
    this.dom.topicTree.innerHTML = "";
    this.dom.topicTree.appendChild(
      renderAccordionTree(tree, {
        selectedId: this.selectedTopic?.id || null,
        onSelect: (fileMeta) => {
          this.selectedTopic = fileMeta;
          this.dom.startButton.disabled = false;
          this.dom.startButton.textContent = `Start ${this.getGameLabel()}`;
          this.renderTopicTree();
        },
      }),
    );
  }

  getGameLabel() {
    const labels = {
      flashcards: "Flash Cards",
      wordmatch: "Word Match",
      wordpuzzle: "Word Puzzle",
    };

    return labels[this.selectedGame] || "Session";
  }

  async startSelectedTopic() {
    if (!this.selectedGame || !this.selectedTopic) {
      Modal.alert("Select both a game and a topic.");
      return;
    }

    this.dom.startButton.disabled = true;
    this.dom.startButton.textContent = "Loading...";

    try {
      await this.launchGame(this.selectedGame, this.selectedTopic);
    } catch (error) {
      Modal.error(`Could not start the session: ${error.message}`);
      this.dom.startButton.disabled = false;
      this.dom.startButton.textContent = `Start ${this.getGameLabel()}`;
    }
  }

  async launchGame(gameId, topicMeta) {
    this.destroyActiveGame();

    const data = await HubAdapter.loadTopic(topicMeta);
    if (!data.length) {
      throw new Error("The selected file does not contain usable rows.");
    }

    const GameModule = GAME_REGISTRY[gameId];
    if (!GameModule) {
      throw new Error(`Unknown game "${gameId}"`);
    }

    const engine = new SessionEngine(gameId, {
      id: topicMeta.id,
      name: topicMeta.name,
      path: topicMeta.path,
      lang: topicMeta.lang,
      branch: topicMeta.branch,
      group: topicMeta.group,
    });

    this.activeGame = new GameModule();
    await this.activeGame.init(
      this.dom.gameMount,
      {
        lang: topicMeta.lang,
        topic: topicMeta,
        data,
      },
      engine,
    );

    this.router.navigate("game");
  }

  async restartTopic() {
    if (!this.selectedGame || !this.selectedTopic) {
      this.showHome();
      return;
    }

    try {
      await this.launchGame(this.selectedGame, this.selectedTopic);
    } catch (error) {
      Modal.error(`Could not restart the session: ${error.message}`);
      this.showHome();
    }
  }

  showHome() {
    this.destroyActiveGame();
    this.router.navigate("home", { record: false });
    this.dom.startButton.disabled = !this.selectedTopic;
    this.dom.startButton.textContent = this.selectedTopic
      ? `Start ${this.getGameLabel()}`
      : "Select a topic first";
  }

  showStats() {
    this.destroyActiveGame();
    renderStats(this.dom.statsMount, {
      sessions: Storage.getAllSessions(),
      hardItems: Storage.getAllHardItems(),
      fileCount: HubAdapter.countFiles(),
      languageCount: HubAdapter.getLanguages().length,
      storageUsage: Storage.getUsage(),
    });
    this.router.navigate("stats");
  }

  destroyActiveGame() {
    if (!this.activeGame) {
      return;
    }

    this.activeGame.destroy();
    this.activeGame = null;
    this.dom.gameMount.innerHTML = "";
  }

  registerServiceWorker() {
    if (!("serviceWorker" in navigator)) {
      return;
    }

    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./sw.js").catch((error) => {
        console.warn("Service worker registration failed", error);
      });
    });
  }
}

function boot() {
  const app = new HubManager();
  app.init();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
