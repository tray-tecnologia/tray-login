import axios from 'axios';
import interceptors from './interceptors';

export const http = axios.create({
  baseURL: '/checkout',
});

/**
 * Define o plugin Axios como propriedade do Vue
 */
export default function install(Vue) {
  interceptors(http);
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty
  Object.defineProperties(Vue.prototype, {
    $http: {
      get() {
        return http;
      },
    },
  });
}
