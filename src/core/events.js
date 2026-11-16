// Центральная шина событий (Pub/Sub) и реестр команд (DIP / OCP)
// Позволяет доменным слоям и сервисам уведомлять UI без циклических импортов.

class EventBus {
  constructor() {
    this._listeners = new Map();
  }

  on(event, handler) {
    if (!this._listeners.has(event)) {
      this._listeners.set(event, new Set());
    }
    this._listeners.get(event).add(handler);
    return () => this.off(event, handler);
  }

  off(event, handler) {
    const set = this._listeners.get(event);
    if (set) set.delete(handler);
  }

  emit(event, payload) {
    const set = this._listeners.get(event);
    if (!set) return;
    for (const handler of set) {
      handler(payload);
    }
  }
}

export const bus = new EventBus();

const _actionHandlers = Object.create(null);

export function registerActions(map) {
  Object.assign(_actionHandlers, map);
}

export const actions = new Proxy(_actionHandlers, {
  get(target, prop) {
    if (typeof prop === 'string' && typeof target[prop] === 'function') {
      return target[prop];
    }
    return () => {};
  }
});
