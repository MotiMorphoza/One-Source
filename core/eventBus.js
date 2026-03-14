const listeners = new Map();

export const EventBus = {
  on(eventName, handler) {
    if (!listeners.has(eventName)) {
      listeners.set(eventName, new Set());
    }

    listeners.get(eventName).add(handler);

    return () => {
      this.off(eventName, handler);
    };
  },

  off(eventName, handler) {
    const handlers = listeners.get(eventName);
    if (!handlers) {
      return;
    }

    handlers.delete(handler);

    if (handlers.size === 0) {
      listeners.delete(eventName);
    }
  },

  emit(eventName, payload) {
    const handlers = listeners.get(eventName);
    if (!handlers) {
      return;
    }

    handlers.forEach((handler) => {
      try {
        handler(payload);
      } catch (error) {
        console.error(`EventBus handler failed for "${eventName}"`, error);
      }
    });
  },

  clear() {
    listeners.clear();
  },
};
