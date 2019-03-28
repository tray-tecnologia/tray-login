import checkStatusSuccess from './data/check-status.json';
import langs from './data/langs.json';
import checkStatusBlocked from './data/check-status-blocked.json';

import facebookResponse from './data/facebook.json';

import securityCodeResponse from './data/generate-security-code.json';

import hasAccountResponse from './data/has-account.json';
import hasAccountResponseError from './data/error/has-account.json';

import passwordLoginSucces from './data/password.json';
import passwordLoginError from './data/error/password.json';

import passwordUpdateSucces from './data/password-update.json';
import passwordUpdateError from './data/error/password-update.json';

import otpLoginSucces from './data/otp.json';
import otpLoginError from './data/error/otp.json';

/*
 * Cria uma promisse para o mock desejado
 * @param {json} mockData
 * @param {number} delay em milisegundos
 */
// eslint-disable-next-line
const fetch = (mockData, delay = delay, isValid = true) => {
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

const delay = 300;

/**
 * Exporta os mocks com o delay definido
 */
export default {
  /**
   * Mock para verificar o status do usúario
   * @param {object} payload
   * @return {Promise}
   */
  checkUserStatus(payload = {
    identification: '',
  }) {
    const { identification } = payload;
    let mockData = checkStatusSuccess;

    if (blockedusers.indexOf(identification) !== -1) {
      mockData = checkStatusBlocked;
    }

    return fetch(mockData, delay);
  },

  facebookLogin() {
    return fetch(facebookResponse, delay).then(response => response);
  },

  /**
   * Mock com as langs definidas na plataforma
   * @param {string} endpoint
   * @param {object} payload
   * @returns {Promise}
   */
  getLangs() {
    return fetch(langs, delay).then(response => response.data);
  },

  generateSecurityCode() {
    return fetch(securityCodeResponse, delay).then(response => response);
  },

  /**
   * Mock para verificar se existe uma conta cadastrada
   * @param {object} payload
   * @return {Promise}
   */
  hasAccount(payload = {
    identification: '',
  }) {
    const { identification } = payload;

    let isValid = false;
    let mockData = hasAccountResponseError;

    if (users.indexOf(identification) !== -1) {
      isValid = true;
      mockData = hasAccountResponse;
    }

    return fetch(mockData, delay, isValid);
  },

  /**
   * Mock para o login com OTP
   * @param {object} payload
   */
  otpLogin(payload = {
    code: '',
  }) {
    const { code } = payload;
    let isValid = false;
    let mockData = otpLoginError;

    if (code === 'ABC123') {
      isValid = true;
      mockData = otpLoginSucces;
    }

    return fetch(mockData, delay, isValid);
  },

  /**
   * Mock para o login de senha
   * @param {object} payload
   * @return {Promise}
   */
  passwordLogin(payload = {
    password: '',
  }) {
    const { password } = payload;
    let isValid = false;
    let mockData = passwordLoginError;

    if (password === 'senhacorreta') {
      isValid = true;
      mockData = passwordLoginSucces;
    }

    return fetch(mockData, delay, isValid);
  },

  /**
   * Mock para o login de senha
   * @param {object} payload
   * @return {Promise}
   */
  updatePassword(payload = {
    code: '',
  }) {
    const { code } = payload;
    let isValid = false;
    let mockData = passwordUpdateError;

    if (code === 'ABC123') {
      isValid = true;
      mockData = passwordUpdateSucces;
    }

    return fetch(mockData, delay, isValid);
  },
};
