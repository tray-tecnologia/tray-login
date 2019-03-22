import { http } from '@/plugins/http';

export default {
  /**
   * Realiza um get para o endpoint configurado
   * @param {object} payload
   * @returns {Promise}
   */
  checkUserStatus(payload = {
    endpoint: 'check-status',
    identification: '',
    identification_type: '',
    store_id: '',
  }) {
    const { endpoint, ...params } = payload;
    return http.get(endpoint, { params }).then(response => response);
  },

  /**
   * Realiza um get para o endpoint configurado
   * @param {string} endpoint
   * @param {object} params
   * @returns {Promise}
   */
  facebookLogin(payload = {
    callback: '',
    crossdm: '',
    endpoint: 'facebook/url',
    session_id: '',
    store_id: '',
  }) {
    const { endpoint, ...params } = payload;
    return http.get(endpoint, { params }).then(response => response);
  },

  /**
   * Realiza um get para o endpoint configurado
   * @param {string} endpoint
   * @param {object} payload
   * @returns {Promise}
   */
  generateSecurityCode(payload = {
    endpoint: 'generate-security-code',
    identification: '',
    identification_type: '',
    session_id: '',
    store_id: '',
  }) {
    const { endpoint, ...params } = payload;
    return http.post(endpoint, params).then(response => response);
  },

  /**
   * Realiza um get para o endpoint configurado
   * @param {string} endpoint
   * @param {object} params
   * @returns {Promise}
   */
  hasAccount(payload = {
    identification: '',
    endpoint: 'has-account',
    session_id: '',
    store_id: '',
  }) {
    const { endpoint, ...params } = payload;
    return http.get(endpoint, { params }).then(response => response);
  },

  /**
   * Realiza um get para o endpoint configurado
   * @param {string} endpoint
   * @param {object} params
   * @returns {Promise}
   */
  passwordLogin(payload = {
    identification: '',
    endpoint: 'password',
    session_id: '',
    store_id: '',
    identification_type: '',
  }) {
    const { endpoint, ...params } = payload;
    return http.post(endpoint, params).then(response => response);
  },
};
