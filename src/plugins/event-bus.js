/**
 * Plugin responsável por disparar eventos customizados
 */
const emitEvent = {
  custom({ name, details } = {}) {
    const event = new CustomEvent(`tray-login#${name}`, {
      details,
    });

    window.dispatchEvent(event);
  },

  action({ type, action, element } = {}) {
    const event = new CustomEvent('tray-login#action', {
      detail: {
        type,
        action,
        element,
      },
    });

    window.dispatchEvent(event);
  },

  login({ response, type, method } = {}) {
    const event = new CustomEvent('tray-login', {
      detail: {
        response,
        type,
        method,
      },
    });

    window.dispatchEvent(event);
  },
};

export default function install(Vue) {
  Object.defineProperties(Vue.prototype, {
    $emitEvent: {
      get() {
        return emitEvent;
      },
    },
  });
}
