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

export const isMobile = state => state.resolution <= 768;
