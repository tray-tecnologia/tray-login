export default {
  /**
   * Dispara a ação para definir a tela de recuperação de senha
   * @param {function} commit
   * @param {string} screen
   */
  setScreen({ commit }, screen) {
    commit('setScreen', screen);
  },

  /**
   * Dispara a ação para definir uma nova senha
   * @param {function} commit
   * @param {string} password
   */
  setPassword({ commit }, password) {
    commit('setPassword', password);
  },
};
