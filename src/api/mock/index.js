import facebookResponse from './data/facebook.json';

/**
 * Cria uma promisse para o mock desejado
 * @param {json} mockData
 * @param {number} delay em milisegundos
 */
// eslint-disable-next-line
const fetch = (mockData, delay = 0) => {
  // eslint-disable-next-line
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(mockData);
    }, delay);
  });
};

export default {
  /**
   * Retorna o mock com o delay de 1 segundo
   * @return {obj} response
   */
  facebookLogin() {
    return fetch(facebookResponse, 1000).then(response => response.data);
  },
};
