export default {
  /**
   * Dispara a ação para definir a tela de login do usúario
   * @param {function} commit
   * @param {string} screen
   */
  setScreen({ commit }, screen) {
    commit('setScreen', screen);
  },
};
