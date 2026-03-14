// hub.js - Main controller
const GameHub = {
  selectedGame: null,
  selectedLang: null,
  selectedFile: null,

  init() {
    this.loadLanguages();
    this.attachEvents();
  },

  loadLanguages() {
    const select = document.getElementById('langSelect');
    HUB_INDEX.languages.forEach(lang => {
      select.add(new Option(lang.title, lang.id));
    });
  },

  attachEvents() {
    document.querySelectorAll('.game-card').forEach(card => {
      card.onclick = () => this.selectGame(card.dataset.game);
    });
  },

  selectGame(gameName) {
    this.selectedGame = gameName;
    this.showTopicSelection();
  },

  showTopicSelection() {
    const container = document.getElementById('topicSelect');
    container.innerHTML = GameLib.ui.buildAccordion(
      HUB_INDEX, 
      this.selectedLang,
      this.getGameCategory()
    );
    container.classList.remove('hidden');
  },

  getGameCategory() {
    const map = {
      'flashcards': 'words',
      'wordmatch': 'words',
      'wordpuzzle': 'sentences'
    };
    return map[this.selectedGame] || 'words';
  },

  async startGame(filePath) {
    const data = await GameLib.hub.loadFile(filePath);
    
    // Hide hub, show game
    document.getElementById('hub').classList.add('hidden');
    
    // Load game module
    switch(this.selectedGame) {
      case 'flashcards':
        FlashCards.start(data);
        break;
      case 'wordmatch':
        WordMatch.start(data);
        break;
      case 'wordpuzzle':
        WordPuzzle.start(data);
        break;
    }
  },

  exitToHub() {
    document.getElementById('hub').classList.remove('hidden');
    document.getElementById('game-container').innerHTML = '';
  }
};

// Initialize
GameHub.init();
