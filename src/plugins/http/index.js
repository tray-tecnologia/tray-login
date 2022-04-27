import axios from 'axios';
import interceptors from './interceptors';

/**
 * URL base das requisições
 */
export const httpBasic = axios.create({
  baseURL: 'https://easycentralqa.commercesuite.com.br/',
});

/**
 * URL base das requisições com "/checkout"
 */
export const http = axios.create({
  baseURL: 'https://easycentralqa.commercesuite.com.br/checkout',
});

export function setBaseUrl(baseUrl = 'checkout') {
  // http.defaults.baseURL = `/${baseUrl}`;
}

/**
 * Define o plugin Axios como propriedade do Vue
 * @param {object} store | estado da aplicação para manipulação
 */
export default function install(store) {
  interceptors(http, store);
}
