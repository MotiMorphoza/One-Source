import { EventBus } from "../core/eventBus.js";

export class GameInterface {
  constructor(gameType) {
    this.gameType = gameType;
    this.container = null;
    this.context = null;
    this.engine = null;
    this.destroyed = false;
  }

  async init(container, context, engine) {
    if (this.destroyed) {
      throw new Error(`${this.gameType} has already been destroyed`);
    }

    this.container = container;
    this.context = context;
    this.engine = engine;

    await this.onInit();
  }

  async onInit() {
    throw new Error("onInit() must be implemented by the game module");
  }

  render() {
    throw new Error("render() must be implemented by the game module");
  }

  emit(eventName, payload) {
    EventBus.emit(eventName, payload);
  }

  onDestroy() {}

  destroy() {
    if (this.destroyed) {
      return;
    }

    this.onDestroy();
    this.engine?.destroy();

    if (this.container) {
      this.container.innerHTML = "";
    }

    this.container = null;
    this.context = null;
    this.engine = null;
    this.destroyed = true;
  }
}
