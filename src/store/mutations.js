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
    state.lang = { ...state.lang, lang };
  },
};
