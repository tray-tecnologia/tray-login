<template>
  <form method='POST' @submit.prevent="submit">
    <app-toggle-password :ref="newPasswordRef"
      :id="newPasswordRef">
    </app-toggle-password>
    <small class="tray-feedbacks" v-show="errors.length">
      <span class="tray-error-message" v-html="lastError">
      </span>
    </small>
    <button
      class="tray-btn-primary"
      type="submit"
      @click="dispatch">
      Continuar
    </button>
  </form>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex';
import AppTogglePassword from '@/components/TogglePassword.vue';

export default {
  name: 'AppNewPassword',
  components: {
    AppTogglePassword,
  },
  props: {
    endpoint: {
      type: String,
      default: 'generate-security-code',
    },
    params: {
      type: Object,
      default() {
        return {
          session_id: '',
          store_id: '',
          identification: '',
        };
      },
    },
    texts: {
      type: Object,
      default() {
        return {
          errors: {
            'invalid-password': 'A nova senha deve possuir no mínimo 6 caracteres.',
          },
        };
      },
    },
  },
  data() {
    return {
      password: '',
      newPasswordRef: 'recover-password',
      showPassword: false,
    };
  },
  computed: {
    ...mapState([
      'errors',
      'identification',
    ]),

    ...mapGetters(['lastError', 'identificationType']),
  },
  mounted() {
    this.clearErrors();
  },
  methods: {
    ...mapActions([
      'clearErrors',
      'generateSecurityCode',
      'setLoading',
      'setScreen',
      'setError',
    ]),

    /**
     * Dispara o evento para identificar que
     * o usuario verificou se existe uma conta registrada
     * @param {object} event
     */
    dispatch(event) {
      this.$emitEvent.action({
        action: 'recover-password',
        type: event.type,
        element: event.target,
      });
    },

    /**
     * Verifica se a senha é valida
     * @param {string}
     * @return {boolean}
     */
    checkValidity(password = this.$refs[this.newPasswordRef].password) {
      return password.length >= 6;
    },

    /**
     * Envia os dados
     * @param {object} event
     * @param {object} payload
     */
    submit(event, payload = {
      ...this.params,
      endpoint: this.endpoint,
    }) {
      if (!this.checkValidity()) {
        this.setError(this.texts.errors['invalid-password']);
        return;
      }

      this.setLoading(true);
      this.generateSecurityCode(payload).then((response) => {
        this.setLoading(false);

        // @doing
        return response;
      });
      this.clearErrors();
    },
  },
};
</script>
