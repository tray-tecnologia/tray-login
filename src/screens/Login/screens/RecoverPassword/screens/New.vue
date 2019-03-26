<template>
  <form class="tray-login__recover-password__new-password" method='POST' @submit.prevent="submit">
    <header>
      <strong class="tray-title tray-login__title">
        {{ texts.title }}
      </strong>
      <p class="tray-action">{{ texts.action }}</p>
      <label class="tray-well">
        {{ identification }}
      </label>
    </header>
    <app-toggle-password
      v-model="passwordHandler"
      id="recover-password">
    </app-toggle-password>
    <small class="tray-feedbacks" v-show="errors.length">
      <span class="tray-error-message" v-html="errors[errors.length - 1]">
      </span>
    </small>
    <button class="tray-btn-primary"
      type="submit"
      @click="dispatch">
      Continuar
    </button>
    <button class="tray-btn-primary"
      type="reset"
      @click="reset">
      Escolher outra opção
    </button>
    <section class="tray-loading" v-show="loading">
      <div class="tray-loading-mask">
        <div class="tray-loading-line"></div>
      </div>
      <svg class="tray-loading-icon tray-icon-locked" viewBox="0 0 1024 1024">
        <!-- eslint-disable-next-line -->
        <path class="path1" d="M796.467 417.109v-132.642c0-155.58-128.956-284.467-284.467-284.467s-284.467 128.887-284.467 284.467v132.642c-64.444 0-113.801 49.289-113.801 113.801v379.29c0.068 64.444 49.289 113.801 113.801 113.801h568.866c64.444 0 113.801-49.289 113.801-113.801v-379.29c0.068-60.689-49.289-113.801-113.732-113.801zM265.489 284.399c0-136.533 109.978-246.511 246.511-246.511s246.511 109.978 246.511 246.511v132.71h-37.956v-132.71c0-113.801-94.822-208.623-208.623-208.623s-208.555 94.822-208.555 208.623v132.71h-37.956l0.068-132.71zM682.667 284.399v132.71h-341.333v-132.71c0-94.822 75.844-170.667 170.667-170.667s170.667 75.844 170.667 170.667zM872.311 568.798v75.844h-341.333v37.956h341.333v75.844h-341.333v37.956h341.333v75.844h-341.333v37.956h341.333c0 41.711-34.133 75.844-75.844 75.844h-568.866c-41.711 0-75.844-34.133-75.844-75.844v-379.221c0-41.711 34.133-75.844 75.844-75.844h568.866c41.711 0 75.844 34.133 75.844 75.844h-341.333v37.956l341.333-0.137z"></path>
      </svg>
    </section>
  </form>
</template>

<script>
import client from 'api-client';
import screenHandler from '@/mixins/screenHandler';
import { mapState, mapActions } from 'vuex';
import AppTogglePassword from '@/components/TogglePassword.vue';

export default {
  name: 'AppNewPassword',
  mixins: [screenHandler],
  components: {
    AppTogglePassword,
  },
  props: {
    endpoint: {
      type: String,
      default: 'generate-security-code',
    },
    identification: {
      type: String,
      default: '',
    },
    identificationType: {
      type: String,
      default: '',
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
  },
  data() {
    return {
      errors: [],
      loading: false,
      texts: {
        title: 'Recuperação de senha',
        action: 'Você receberá um código de segurança em seu e-mail para validar sua nova senha.',
        errors: {
          'invalid-password': 'A nova senha deve possuir no mínimo 6 caracteres.',
        },
      },
    };
  },
  computed: {
    ...mapState('Login/RecoverPassword', [
      'password',
    ]),

    /**
     * Estado mapeado da vuex,
     * https://vuex.vuejs.org/guide/forms.html#two-way-computed-property
     */
    passwordHandler: {
      get() {
        return this.password;
      },
      set(password) {
        return this.setPassword(password);
      },
    },
  },
  methods: {
    generateSecurityCode: client.generateSecurityCode,
    ...mapActions('Login/RecoverPassword', {
      setPassword: 'setPassword',
      nextStep: 'setScreen',
    }),

    ...mapActions('Login', {
      backTo: 'setScreen',
    }),

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
    checkValidity(password = this.password) {
      return password.length >= 6;
    },

    /**
     * Reseta o módulo de recuperação de senha
     * @param {string}
     */
    reset() {
      this.setPassword('');
      this.backTo('Main');
    },

    /**
     * Gera um novo codigo de segurança
     * @param {object} event
     * @param {object} payload
     */
    submit(event, payload = {
      ...this.params,
      identification: this.identification,
      [this.identificationType]: this.identification,
      endpoint: this.endpoint,
    }) {
      if (!this.checkValidity(this.password)) {
        this.setError(this.texts.errors['invalid-password']);
        return;
      }

      this.setLoading(true);
      this.generateSecurityCode(payload).then((response) => {
        this.setLoading(false);

        this.nextStep('ConfirmCode');
        return response;
      });

      this.clearErrors();
    },
  },
};
</script>
