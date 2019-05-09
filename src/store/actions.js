import { setBaseUrl as setHttpBaseUrl } from '@/plugins/http';

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

  /**
   * Dispara a ação para definir se o bloqueio do usuario
   * @param {function} commit
   * @param {boolean} blocked_user
   */
  setBlockedUser({ commit }, blockedUser) {
    commit('setBlockedUser', blockedUser);
  },

  /**
   * Dispara a ação para definir a url base da aplicação
   * @param {function} commit
   * @param {string} baseUrl
   */
  setBaseUrl({ commit }, baseUrl) {
    setHttpBaseUrl(baseUrl);
    commit('setBaseUrl', baseUrl);
  },

  /**
   * Dispara a ação para definir a resolução em que
   * a aplicação está sendo executada
   * @param {function} commit
   * @param {number} resolution
   */
  setResolution({ commit }, resolution) {
    commit('setResolution', resolution);
  },
};
