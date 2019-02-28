import { http } from '@/plugins/http';

export default {
  /**
   * Realiza um get para o endpoint configurado
   * @param {string} endpoint
   * @param {object} params
   * @returns {Promise}
   */
  facebookLogin(endpoint, params) {
    return http.get(endpoint, { params }).then(response => response);
  },
};
