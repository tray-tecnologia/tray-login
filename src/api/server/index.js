import { http } from '@/plugins/http';

export default {
  /**
   * Realiza um get para o endpoint configurado
   * @param {string} endpoint
   * @param {object} params
   * @returns {Promise}
   */
  checkUserStatus(endpoint, params) {
    return http.get(endpoint, { params }).then(response => response);
  },

  /**
   * Realiza um get para o endpoint configurado
   * @param {string} endpoint
   * @param {object} params
   * @returns {Promise}
   */
  facebookLogin(endpoint, params) {
    return http.get(endpoint, { params }).then(response => response);
  },

  /**
   * Realiza um get para o endpoint configurado
   * @param {string} endpoint
   * @param {object} params
   * @returns {Promise}
   */
  hasAccount(endpoint, params) {
    return http.get(endpoint, { params }).then(response => response);
  },

  /**
   * Realiza um get para o endpoint configurado
   * @param {string} endpoint
   * @param {object} params
   * @returns {Promise}
   */
  passwordLogin(endpoint, params) {
    return http.post(endpoint, params).then(response => response);
  },
};
