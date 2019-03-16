import facebookResponse from './data/facebook.json';
import hasAccountResponse from './data/has-account.json';
import hasAccountResponseError from './data/error/has-account.json';

import passwordLoginSucces from './data/password.json';
import passwordLoginError from './data/error/password.json';

/**
 * Cria uma promisse para o mock desejado
 * @param {json} mockData
 * @param {number} delay em milisegundos
 */
// eslint-disable-next-line
const fetch = (mockData, delay = 0, isValid) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!isValid) {
        reject(mockData);
      }

      resolve(mockData);
    }, delay);
  });
};

/**
 * Retorna os mocks com o delay definido
 * @return {obj} response
 */
export default {
  facebookLogin() {
    return fetch(facebookResponse, 1000).then(response => response);
  },

  hasAccount(endpoint, params) {
    const { identification } = params;
    let isValid = false;
    let mockData = hasAccountResponseError;

    if (identification === 'teste@tray.com.br') {
      isValid = true;
      mockData = hasAccountResponse;
    }

    return fetch(mockData, 1000, isValid);
  },

  passwordLogin(endpoint, params) {
    const { password } = params;
    let isValid = false;
    let mockData = passwordLoginError;

    if (password === 'senhacorreta') {
      isValid = true;
      mockData = passwordLoginSucces;
    }

    return fetch(mockData, 1000, isValid);
  },
};
