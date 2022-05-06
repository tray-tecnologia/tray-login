import http from 'api-client';
import {
  checkIcon,
  timesIcon,
} from '../screens/Login/screens/RecoverPassword/validators/icons';

export default {
  data() {
    return {
      enterKeyCode: 13,
    };
  },

  computed: {
    /**
     * Rota usada no payload post
     * @return {string}
     */
    payloadPostEndpoint() {
      return 'my-account/api/login';
    },
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

      this.callbackLoginLayout(payloadPost).then((res) => {
        const { token = '', redirect = '' } = res.data.data;
        this.redirect(redirect, token);
        return res;
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
