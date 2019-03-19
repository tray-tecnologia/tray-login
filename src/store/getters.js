import { isValidCpf, isValidCnpj } from '@brazilian-utils/validators';

/**
 * Retorna o tipo da identificação preenchida pelo usuário
 * @param {object} state
 */
export const identificationType = (state) => {
  let type = 'email';

  if (isValidCpf(state.identification)) {
    type = 'cpf';
  }

  if (isValidCnpj(state.identification)) {
    type = 'cnpj';
  }

  return type;
};

/**
 * Retorna o ultimo erro definido na aplicação
 * @param {object} state
 * @return {string} html error
 */
export const lastError = state => state.errors[state.errors.length - 1];
