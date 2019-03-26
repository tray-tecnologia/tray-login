/**
 * Esse mixin é responsável por definir métodos comuns para
 * o controle de cada tela
 */
export default {
  data() {
    return {
      errors: [],
      loading: false,
    };
  },
  methods: {
    /**
     * Limpa os erros de login inválido
     */
    clearErrors() {
      this.errors = [];
    },

    /**
     * Adiciona um erro de login inválildo
     * @param {string} error
     */
    setError(error = '') {
      this.errors.push(error);
    },

    /**
     * Define o status do loading da tela
     * @param {boolean} loading
     */
    setLoading(loading = true) {
      this.loading = loading;
    },

    /**
     * Define a tela que será exibida
     * @param {string} screen
     */
    setScreen(screen = 'Main') {
      this.screen = screen;
    },
  },
};
