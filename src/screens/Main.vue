<template>
  <section id="tray-login-identify" class="tray-login__identify">
    <header>
      <strong class="tray-title tray-login__title">
        {{ texts.title }}
      </strong>
      <p class="tray-action">{{ texts.action }}</p>
      <label class="tray-well">
        {{ identification }}
      </label>
    </header>
    <form method='POST' @submit.prevent="submit">
      <app-toggle-password :ref="passwordRef" :id="passwordRef">

      </app-toggle-password>
      <small class="tray-feedbacks" v-show="errors.length">
        <span class="tray-error-message" v-html="lastError"></span>
      </small>
      <p class="tray-action">
        <a v-if="false"
          @click.prevent="setScreen('RecoverPassword')"
          class="tray-link"
          href="#">
          Esqueci ou não tenho senha
        </a>
      </p>
      <button
        class="tray-btn-primary"
        type="submit">
        Continuar
      </button>
    </form>
    <div class="tray-general-separator">
      <span class="tray-general-separator-line">
        {{ texts.separator }}
      </span>
    </div>
    <slot name="app-facebook-login"></slot>
    <slot name="back-step"></slot>
  </section>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex';
import AppTogglePassword from '../components/TogglePassword.vue';

export default {
  name: 'AppMain',
  components: {
    AppTogglePassword,
  },
  props: {
    callback: {
      type: String,
      default: '',
    },
    defaultActions: {
      type: Boolean,
      default: true,
    },
    endpoint: {
      type: String,
      default: 'password',
    },
    params: {
      type: Object,
      default() {
        return {
          session_id: '',
          store_id: '',
        };
      },
    },
    texts: {
      type: Object,
      default() {
        return {
          title: 'Autenticação',
          action: 'Escolha uma das opções para se identificar:',
          separator: 'ou utilize uma das opções abaixo',
          errors: {
            incorrect: 'Autentica\u00e7\u00e3o incorreta.',
          },
        };
      },
    },
  },
  data() {
    return {
      passwordRef: 'input-password',
      showPassword: false,
    };
  },
  mounted() {
    const payload = {
      ...this.params,
      endpoint: 'check-status',
      identification: this.identification,
      [this.identificationType]: this.identification,
    };

    this.setLoading(true);
    this.checkUserStatus(payload).then((response) => {
      if (response.data.data.blocked) {
        this.setScreen('Blocked');
      }

      this.setLoading(false);
    });
  },

  computed: {
    ...mapState([
      'errors',
      'identification',
    ]),

    ...mapGetters(['identificationType', 'lastError']),
  },
  methods: {
    ...mapActions([
      'checkUserStatus',
      'clearErrors',
      'passwordLogin',
      'setError',
      'setLoading',
      'setScreen',
      'redirect',
    ]),

    /**
     * Altera o atributo type do input password
     */
    toggleType() {
      this.showPassword = !this.showPassword;
    },

    /**
     * Tenta realizar o login com senha
     * @param {event} event
     * @param {object} payload dados necessarios para realizar o login
     */
    submit(event, payload = {
      ...this.params,
      endpoint: this.endpoint,
      password: this.$refs[this.passwordRef].password,
      identification: this.identification,
      [this.identificationType]: this.identification,
    }) {
      this.setLoading(true);
      this.passwordLogin(payload)
        .then((response) => {
          this.clearErrors();
          this.$emitEvent.login({
            details: {
              response,
              method: 'password',
              type: 'success',
            },
          });

          if (this.defaultActions) {
            this.redirect({
              callback: this.callback,
              token: response.data.data.token,
            });

            return response;
          }

          this.setLoading(false);
          return response;
        })
        .catch((error) => {
          this.$emitEvent.login({
            response: error,
            method: 'password',
            type: 'error',
          });

          const errorMessage = error.data.message || this.texts.errors.incorrect;
          this.setError(errorMessage);
          this.setLoading(false);

          return error;
        });
    },
  },
};
</script>
