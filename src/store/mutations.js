export default {
  /**
   * Define a identificação do usuário
   * e-mail | cpf | cnpj
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
  setGeneralLoading(state, loading) {
    state.loading = loading;
  },

  /**
   * Adiciona um erro geral a aplicação
   * @param {object} state
   * @param {string} error
   */
  setGeneralError(state, error) {
    state.errors.push(error);
  },
};
