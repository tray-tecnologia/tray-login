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
   * Define o valor do código de segurança
   * @param {object} state
   * @param {string} identification
   */
  setSecurityCode(state, securityCode) {
    state.securityCode = securityCode;
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

  /**
   * Define a resolução do dispositivo que
   * a aplicação está sendo executa
   * @param {object} state
   * @param {number} resolution
   */
  setResolution(state, resolution) {
    state.resolution = resolution;
  },
};
