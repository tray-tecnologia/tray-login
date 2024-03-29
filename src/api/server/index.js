import { http, httpBasic } from '@/plugins/http';

export default {
  /**
   * Verifica se o usúario está bloqueado
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
   * Realiza o login com o facebook
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
   * Realiza o login com o google
   * @param {object} payload
   * @returns {Promise}
   */
  googleLogin(payload = {
    callback: '',
    endpoint: 'login/google/url',
    session_id: '',
    store_id: '',
  }) {
    const { endpoint, ...params } = payload;
    return http.get(endpoint, { params }).then(response => response);
  },

  /**
   * Recupera o status da toggle de login com o google da loja no easycheckout
   * @param {string} endpoint
   * @param {object} payload
   * @returns {Promise}
   */
  googleLoginEasyToggle(payload = {
    endpoint: 'login/google/active',
    store_id: '',
  }) {
    const { endpoint, ...params } = payload;
    return http.get(endpoint, { params }).then(response => response.data);
  },

  /**
   * Recupera as langs definidas na plataforma
   * @param {string} endpoint
   * @param {object} payload
   * @returns {Promise}
   */
  getLangs(payload = {
    endpoint: 'langs/login_compoenent',
    store_id: '',
  }) {
    const { endpoint, ...params } = payload;
    return http.get(endpoint, { params }).then(response => response.data);
  },

  /**
   * Gera um novo codigo de segurança
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
    return http.post(endpoint, params).then(response => response.data);
  },

  /**
   * Verifica se existe uma conta
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
    return http.get(endpoint, { params }).then(response => response.data);
  },

  /**
   * Efetua o login utilizando o codigo OTP
   * @param {string} endpoint
   * @param {object} params
   * @returns {Promise}
   */
  otpLogin(payload = {
    identification: '',
    endpoint: 'otp',
    session_id: '',
    store_id: '',
    identification_type: '',
  }) {
    const { endpoint, ...params } = payload;
    return http.get(endpoint, { params }).then(response => response);
  },

  /**
   * Efetua o login utilizando a senha
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

  /**
   * Atualiza a senha
   * @param {string} endpoint
   * @param {object} params
   * @returns {Promise}
   */
  updatePassword(payload = {
    identification: '',
    endpoint: 'password-update',
    session_id: '',
    store_id: '',
    identification_type: '',
  }) {
    const { endpoint, ...params } = payload;
    return http.post(endpoint, params).then(response => response);
  },

  /**
   * Recupera o email mascarado do cliente a partir do CPF
   * @param {string} endpoint
   * @param {object} payload
   * @returns {Promise}
   */
  getMaskedEmail(payload = {
    identification: '',
    endpoint: 'retrieve-masked-email',
    session_id: '',
    store_id: '',
    identification_type: '',
  }) {
    const { endpoint, ...params } = payload;
    return http.get(endpoint, { params }).then(response => response);
  },

  /**
   * Recupera o token para o login
   * @param {object} payload
   * @returns {Promisse}
   */
  callbackLoginLayout(payload = {
    endpoint: 'my-account/api/login',
  }) {
    const { endpoint, ...params } = payload;
    return httpBasic.post(endpoint, params)
      .then(response => response)
      .catch(() => {
        /**
         * Dispara um evento informando que houve erro no post de login
         */
        const errorPostLogin = new CustomEvent('errorPostLogin');
        window.dispatchEvent(errorPostLogin);
        localStorage.setItem('jwtToken', false);
      });
  },
};
