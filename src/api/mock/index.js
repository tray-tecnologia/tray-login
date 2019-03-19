import checkStatusSuccess from './data/check-status.json';
import checkStatusBlocked from './data/check-status-blocked.json';

import facebookResponse from './data/facebook.json';

import passwordLoginSucces from './data/password.json';
import passwordLoginError from './data/error/password.json';

import hasAccountResponse from './data/has-account.json';
import hasAccountResponseError from './data/error/has-account.json';

/**
 * Cria uma promisse para o mock desejado
 * @param {json} mockData
 * @param {number} delay em milisegundos
 */
// eslint-disable-next-line
const fetch = (mockData, delay = 0, isValid = true) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!isValid) {
        reject(mockData);
      }

      resolve(mockData);
    }, delay);
  });
};

const users = [
  'teste@tray.com.br',
  'usuariobloqueado@tray.com.br',
];

const blockedusers = [
  'usuariobloqueado@tray.com.br',
];

/**
 * Retorna os mocks com o delay definido
 * @return {obj} response
 */
export default {
  checkUserStatus(endpoint, params) {
    const { identification } = params;
    let mockData = checkStatusSuccess;

    if (blockedusers.indexOf(identification) !== -1) {
      mockData = checkStatusBlocked;
    }

    return fetch(mockData, 1000);
  },

  facebookLogin() {
    return fetch(facebookResponse, 1000).then(response => response);
  },

  hasAccount(endpoint, params) {
    const { identification } = params;
    let isValid = false;
    let mockData = hasAccountResponseError;

    if (users.indexOf(identification) !== -1) {
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
