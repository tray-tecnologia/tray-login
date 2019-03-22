export default {
  /**
   * Dispara a ação para definir a identificação do usuario
   * @param {function} commit
   * @param {string} identification
   */
  setIdentification({ commit }, identification) {
    commit('setIdentification', identification);
  },
};
