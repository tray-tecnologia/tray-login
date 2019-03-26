import axios from 'axios';
import interceptors from './interceptors';

export const http = axios.create({
  baseURL: '/checkout',
});

/**
 * Define o plugin Axios como propriedade do Vue
 * @param {object} store | estado da aplicação para manipulação
 */
export default function install({ store }) {
  interceptors(http, store);
}
