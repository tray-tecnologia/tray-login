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
      <fieldset class="tray-input-group">
        <label for="input-password">
          <figure class="tray-input-icon">
            <svg class="tray-icon-locked" viewBox="0 0 1024 1024">
              <!-- eslint-disable-next-line -->
              <path class="path1" d="M796.467 417.109v-132.642c0-155.58-128.956-284.467-284.467-284.467s-284.467 128.887-284.467 284.467v132.642c-64.444 0-113.801 49.289-113.801 113.801v379.29c0.068 64.444 49.289 113.801 113.801 113.801h568.866c64.444 0 113.801-49.289 113.801-113.801v-379.29c0.068-60.689-49.289-113.801-113.732-113.801zM265.489 284.399c0-136.533 109.978-246.511 246.511-246.511s246.511 109.978 246.511 246.511v132.71h-37.956v-132.71c0-113.801-94.822-208.623-208.623-208.623s-208.555 94.822-208.555 208.623v132.71h-37.956l0.068-132.71zM682.667 284.399v132.71h-341.333v-132.71c0-94.822 75.844-170.667 170.667-170.667s170.667 75.844 170.667 170.667zM872.311 568.798v75.844h-341.333v37.956h341.333v75.844h-341.333v37.956h341.333v75.844h-341.333v37.956h341.333c0 41.711-34.133 75.844-75.844 75.844h-568.866c-41.711 0-75.844-34.133-75.844-75.844v-379.221c0-41.711 34.133-75.844 75.844-75.844h568.866c41.711 0 75.844 34.133 75.844 75.844h-341.333v37.956l341.333-0.137z"></path>
            </svg>
          </figure>
          <button class="tray-login-hide-password"
            type="button"
            @click="toggleType">
            {{ showPassword ? 'OCULTAR' : 'MOSTRAR' }}
          </button>
        </label>
        <input v-model="password"
          :type="showPassword ? 'text' : 'password'"
          id="input-password"
          class="tray-input"
          ref="input-password"
          placeholder="Senha"/>
      </fieldset>
      <small class="tray-feedbacks" v-show="errors.length">
        <span class="tray-error-message" v-html="lastError"></span>
      </small>
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

export default {
  name: 'AppMain',
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
      password: '',
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
      password: this.password,
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
