import { vuex as Login } from './Login';

// Inicia a extração dos modulos vuex
const vuex = { Login };

const keys = Object.keys(vuex);

/**
 * Este código reduz a imutabilidade final com o spread operator para gerar novo objeto e array
 * referencias
 * - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce
 * - https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Operators/Spread_operator
 * - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions
 */
const modules = keys.reduce((acc, key) => ({ ...acc, [key]: vuex[key].module }), {});

// Shorthand para ‘modules: modules’
export default { modules };
