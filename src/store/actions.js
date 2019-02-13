// eslint-disable-next-line
import client from 'api-client';

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
   * Dispara a ação para adicionar um erro ao estado
   * @param {function} commit
   * @param {string} feedback
   */
  setGeneralError({ commit }, feedback) {
    commit('setGeneralError', feedback);
  },

  /**
   * Dispara a ação para definir o estado do loading
   * @param {function} commit
   * @param {boolean} loading
   */
  setGeneralLoading({ commit }, loading) {
    commit('setGeneralLoading', loading);
  },

  /**
   * Envia os dados para o endpoint do facebook
   * @param {function} commit
   * @param {string} endpoint
   * @param {object} params
   */
  facebookLogin({ commit }, payload) {
    /* eslint no-unused-vars: ["error", { "args": "none" }] */
    const { endpoint, ...params } = payload;
    this.dispatch('setGeneralLoading', true);

    return client.facebookLogin(endpoint, params).then((response) => {
      this.dispatch('setGeneralLoading', false);
      return response;
    }).catch((error) => {
      this.dispatch('setGeneralError', 'Não foi possível verificar seu cadastro, tente novamente.');
      this.dispatch('setGeneralLoading', false);
    });
  },
};
