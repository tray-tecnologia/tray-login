export default {
  /**
   * Define a tela de recuperação
   * @param {object} state
   * @param {string} screen
   */
  setScreen(state, screen) {
    state.screen = screen;
  },

  /**
   * Define uma nova senha
   * @param {object} commit
   * @param {string} password
   */
  setPassword(state, password) {
    state.password = password;
  },
};
