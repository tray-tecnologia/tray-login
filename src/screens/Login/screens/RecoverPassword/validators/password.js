const MIN_LENGTH = 8;
/**
 * Valida o comprimento da string
 * @param {int} minLen Mínimo comprimento requerido
 * @return {bool}
 */
export const isValidLength = value => value.length >= MIN_LENGTH;
/**
 * Valida se a senha possui letras
 * @return {bool}
 */
export const containsLetter = value => /[a-zA-Z]/.test(value);
/**
 * Valida se a senha possui números
 * @return {bool}
 */
export const containsNumber = value => /[0-9]/.test(value);
