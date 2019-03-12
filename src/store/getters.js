import { isValidCpf, isValidCnpj } from '@brazilian-utils/validators';

/**
 * Retorna o tipo da identificação preenchida pelo usuário
 * @param {object} state
 */
// eslint-disable-next-line
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
