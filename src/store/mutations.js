export default {
  /**
   * Define a identificação do usuário
   * @param {object} state
   * @param {string} identification
   */
  setIdentification(state, identification) {
    state.identification = identification;
  },

  /**
   * Define as langs
   * @param {object} state
   * @param {object} lang
   */
  setLang(state, lang) {
    state.lang = lang;
  },

  /**
   * Define o bloqueio de usuario
   * @param {object} state
   * @param {boolean} blockedUser
   */
  setBlockedUser(state, blockedUser) {
    state.blockedUser = blockedUser;
  },

  /**
   * Define a url base da aplicação
   * @param {object} state
   * @param {string} baseUrl
   */
  setBaseUrl(state, baseUrl) {
    state.baseUrl = baseUrl;
  },
};
