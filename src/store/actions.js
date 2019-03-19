// eslint-disable-next-line
import client from 'api-client';

export default {
  /**
   * Verifica o status do usuário
   * @param {function} commit
   */
  checkUserStatus({ commit }, payload = {
    endpoint: 'check-status',
    identification: '',
    identification_type: '',
    store_id: '',
  }) {
    /* eslint no-unused-vars: ["error", { "args": "none" }] */
    const { endpoint, ...params } = payload;

    return client.checkUserStatus(endpoint, params)
      .then(response => response)
      .catch((error) => { throw error; });
  },

  /**
   * Dispara a ação para remover os erros da aplicação
   * @param {function} commit
   */
  clearErrors({ commit }) {
    commit('clearErrors');
  },

  /**
   * Verifica se o usuário possui uma conta
   * @param {function} commit
   * @param {object} payload
   */
  checkHasAccount({ commit }, payload = {
    identification: '',
    endpoint: 'has-account',
    session_id: '',
    store_id: '',
  }) {
    /* eslint no-unused-vars: ["error", { "args": "none" }] */
    const { endpoint, ...params } = payload;
    return client.hasAccount(endpoint, params)
      .then(response => response)
      .catch((error) => { throw error; });
  },

  /**
   * Envia os dados para o endpoint do facebook
   * @param {function} commit
   * @param {object} payload
   */
  facebookLogin({ commit }, payload = {
    callback: '',
    crossdm: '',
    endpoint: 'facebook/url',
    session_id: '',
    store_id: '',
  }) {
    /* eslint no-unused-vars: ["error", { "args": "none" }] */
    const { endpoint, ...params } = payload;
    return client.facebookLogin(endpoint, params)
      .then(response => response)
      .catch((error) => { throw error; });
  },

  /**
   * Gera um codigo de segurança
   * @param {function} commit
   * @param {object} payload
   */
  generateSecurityCode({ commit }, payload = {
    endpoint: 'generate-security-code',
    identification: '',
    identification_type: '',
    session_id: '',
    store_id: '',
  }) {
    /* eslint no-unused-vars: ["error", { "args": "none" }] */
    const { endpoint, ...params } = payload;
    return client.generateSecurityCode(endpoint, params)
      .then(response => response)
      .catch((error) => { throw error; });
  },

  /**
   * Dispara a ação para realizar o login com senha
   * @param {function} commit
   * @param {object} payload
   */
  passwordLogin({ commit }, payload = {
    identification: '',
    endpoint: 'password',
    session_id: '',
    store_id: '',
    [this.state.identification_type]: '',
  }) {
    /* eslint no-unused-vars: ["error", { "args": "none" }] */
    const { endpoint, ...params } = payload;
    return client.passwordLogin(endpoint, params)
      .then(response => response)
      .catch((error) => { throw error; });
  },

  /**
   * Redirecionar o usuario para a url definida no callback
   * @param {function} commit
   * @param {object} payload
   */
  redirect({ commit }, payload = {
    callback: this.state.url_callback,
    token: '',
  }) {
    /* eslint no-unused-vars: ["error", { "args": "none" }] */
    const { callback, token } = payload;

    if (!callback) {
      return;
    }

    let redirectParam = '';

    if (token) {
      redirectParam = `?token=${token}`;
      if (callback.indexOf('?') > -1) {
        redirectParam = `&token='${token}`;
      }
    }

    window.location = callback + redirectParam;
  },

  /**
   * Dispara ação para definir se as ações "default" devem ser disparadas
   * @param {function} commit
   * @param {boolean} defaultActions
   */
  setDefaultActions({ commit }, defaultActions) {
    commit('setDefaultActions', defaultActions);
  },

  /**
   * Dispara a ação para adicionar um erro ao estado
   * @param {function} commit
   * @param {string} feedback
   */
  setError({ commit }, feedback) {
    commit('setError', feedback);
  },

  /**
   * Dispara a ação para definir a identificação do usuario
   * @param {function} commit
   * @param {string} identification
   */
  setIdentification({ commit }, identification) {
    commit('setIdentification', identification);
  },

  /**
   * Dispara a ação para definir o estado do loading
   * @param {function} commit
   * @param {boolean} loading
   */
  setLoading({ commit }, loading) {
    commit('setLoading', loading);
  },

  /**
   * Dispara a ação para definir a tela do usuário
   * @param {function} commit
   * @param {string} screen
   */
  setScreen({ commit }, screen) {
    commit('setScreen', screen);
  },
};
