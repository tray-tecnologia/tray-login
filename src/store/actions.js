export default {
  /**
   * Dispara a ação para definir a identificação do usuario
   * @param {function} commit
   * @param {string} identification
   */
  setIdentification({ commit }, identification) {
    commit('setIdentification', identification);
  },

  /**
   * Dispara a ação com para definir as langs
   * @param {function} commit
   * @param {object} lang
   */
  setLang({ commit }, lang) {
    commit('setLang', lang);
  },
};
