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

  methods: {
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
