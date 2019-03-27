/**
 * Plugin responsável por disparar eventos customizados
 */
const emitEvent = {
  /**
   * Dispara um evento de ação
   * @param {object} payload
   */
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

  /**
   * Dispara um evento customizado
   * @param {object} payload
   */
  custom({ name, details = {} } = {}) {
    const event = new CustomEvent(`tray-login#${name}`, {
      details,
    });

    window.dispatchEvent(event);
  },

  /**
   * Dispara um evento de login
   * @param {object} event
   */
  login(loginEvent = {
    response: '',
    type: '',
    method: '',
  }) {
    const { response, type, method } = loginEvent;
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
