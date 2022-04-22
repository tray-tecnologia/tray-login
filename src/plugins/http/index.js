import axios from 'axios';
import interceptors from './interceptors';

export const httpBasic = axios.create({
  baseURL: '',
});

export const http = axios.create({
  baseURL: '/checkout',
});

export function setBaseUrl(baseUrl = 'checkout') {
  http.defaults.baseURL = `/${baseUrl}`;
}

/**
 * Define o plugin Axios como propriedade do Vue
 * @param {object} store | estado da aplicação para manipulação
 */
export default function install(store) {
  interceptors(http, store);
}
