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

export const circleIcon = `<svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M4 1.77778C5.225 1.77778 6.22222 2.775 6.22222 4C6.22222 5.225 5.225 6.22222 4 6.22222C2.775 6.22222 1.77778 5.225 1.77778 4C1.77778 2.775 2.775 1.77778 4 1.77778ZM4 0C1.79167 0 0 1.79167 0 4C0 6.20833 1.79167 8 4 8C6.20833 8 8 6.20833 8 4C8 1.79167 6.20833 0 4 0Z" fill="#DBDADA"/>
</svg>`;

export const timesIcon = `<svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M5.51636 4L7.79068 1.72568C8.06977 1.44659 8.06977 0.994091 7.79068 0.714773L7.28523 0.209318C7.00614 -0.0697727 6.55364 -0.0697727 6.27432 0.209318L4 2.48364L1.72568 0.209318C1.44659 -0.0697727 0.994091 -0.0697727 0.714773 0.209318L0.209318 0.714773C-0.0697727 0.993864 -0.0697727 1.44636 0.209318 1.72568L2.48364 4L0.209318 6.27432C-0.0697727 6.55341 -0.0697727 7.00591 0.209318 7.28523L0.714773 7.79068C0.993864 8.06977 1.44659 8.06977 1.72568 7.79068L4 5.51636L6.27432 7.79068C6.55341 8.06977 7.00614 8.06977 7.28523 7.79068L7.79068 7.28523C8.06977 7.00614 8.06977 6.55364 7.79068 6.27432L5.51636 4Z" fill="#FF5858"/>
</svg>`;

export const checkIcon = `<svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M3.39644 7.31067L0.146441 4.06066C-0.0488135 3.86541 -0.0488135 3.54883 0.146441 3.35355L0.853531 2.64644C1.04879 2.45117 1.36539 2.45117 1.56064 2.64644L3.75 4.83578L8.43936 0.146441C8.63461 -0.0488135 8.95121 -0.0488135 9.14647 0.146441L9.85356 0.853551C10.0488 1.0488 10.0488 1.36539 9.85356 1.56066L4.10355 7.31069C3.90828 7.50594 3.5917 7.50594 3.39644 7.31067Z" fill="#6ABF57"/>
</svg>`;
