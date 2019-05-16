/**
 * Esse mixin é responsável por definir métodos comuns para
 * o controle de cada tela
 */
import { mapState } from 'vuex';

export default {
  data() {
    return {
      errors: [],
      loading: false,
    };
  },
  directives: {
    /**
     * Através da diretiva v-focus o input será
     * focado automaticamente ao ser renderizado
     */
    autofocus: {
      inserted(input) {
        input.focus();
      },
    },
  },
  computed: {
    ...mapState({
      $lang: state => state.lang,
    }),
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
      if (!error) return;
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
