import http from 'api-client';
import {
  checkIcon,
  timesIcon,
} from '../screens/Login/screens/RecoverPassword/validators/icons';

export default {
  data() {
    return {
      /**
       * Rota usada no payload post
       * @return {string}
       */
      payloadPostEndpoint: 'my-account/api/login',
      enterKeyCode: 13,
    };
  },

  methods: {
    callbackLoginLayout: http.callbackLoginLayout,
    /**
     * Redirecionar o usuario para a url definida no callback
     *
     * @param {string} callback
     * @param {string} token
     */
    redirect(callback = '', token = '') {
      if (!callback) {
        return;
      }

      let redirectParam = '';
      if (token) {
        redirectParam = `?token=${token}`;
        if (callback.indexOf('?') > -1) {
          redirectParam = `&token='${token}`;
        }
      }

      window.location = callback + redirectParam;
    },

    /**
     * Faz o login com o post passando por parametros os dados de callpackPost
     * @param {string} callbackPost string com os parametros do callback post
     * @param {string} token
     */
    mixinCallbackLogin(callbackPost, tokenPassword) {
      const payloadPost = JSON.parse(callbackPost);
      payloadPost.token = tokenPassword;
      payloadPost.endpoint = this.payloadPostEndpoint;

      this.callbackLoginLayout(payloadPost).then((response) => {
        const { token, redirect } = response.data.data;
        this.redirect(redirect, token);
        return response;
      });
    },

    /**
     * Retorna o ícone correto de acordo com as regras de validação
     * @param {boolean} validationRule a regra de validação sendo testada
     * @return {string}
     */
    getIconName(validationRule) {
      return validationRule ? checkIcon : timesIcon;
    },

    /**
     * Verifica se é um identifier de teste da tray
     *
     * @return {boolean}
     */
    isTestIdentifier(identification) {
      const testIdentifiers = ['teste@tray.com.br', 'testepagamento@tray.net.br'];
      return testIdentifiers.includes(identification);
    },
  },
};
