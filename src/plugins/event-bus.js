/**
 * Plugin responsável por disparar eventos customizados
 */
const emitEvent = {
  /**
   * Dispara um evento customizado
   * @param {string} name
   * @param {object} details
   */
  custom(name = 'custom', details = {}) {
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

  /**
   * Dispara um evento de login
   * @param {object} label
   */
  click(label) {
    const event = new CustomEvent('tray-login-click', {
      detail: {
        response: label,
        type: 'click',
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
