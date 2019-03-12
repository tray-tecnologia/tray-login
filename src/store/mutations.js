export default {
  /**
   * Remove todos os erros definidos na aplicação
   * @param {object} state
   */
  clearErrors(state) {
    state.errors = [];
  },

  /**
   * Adiciona um erro geral a aplicação
   * @param {object} state
   * @param {string} error
   */
  setError(state, error) {
    state.errors.push(error);
  },

  /**
   * Define a identificação do usuário
   * @param {object} state
   * @param {string} identification
   */
  setIdentification(state, identification) {
    state.identification = identification;
  },

  /**
   * Define o loading geral da aplicação
   * @param {object} state
   * @param {boolean} loading
   */
  setLoading(state, loading) {
    state.loading = loading;
  },

  /**
   * Define a tela do usuario
   * @param {object} state
   * @param {string} screen
   */
  setScreen(state, screen) {
    state.screen = screen;
  },
};
