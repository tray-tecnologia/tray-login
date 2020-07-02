<template>
  <form id="change-password"
    class="tray-login__new-password" method='POST' @submit.prevent="submit">
    <div>
      <strong class="tray-title tray-login__title">
        {{ $lang['new-password-title']}}
      </strong>
      <header class="tray-login__recover-password__header">
        <figure class="tray-login__recover-password__figure">
          <svg class="tray-user-lock" viewBox="0 0 640 512">
            <!-- eslint-disable-next-line -->
            <path class="path1" d="M224 256A128 128 0 1 0 96 128a128 128 0 0 0 128 128zm96 64a63.08 63.08 0 0 1 8.1-30.5c-4.8-.5-9.5-1.5-14.5-1.5h-16.7a174.08 174.08 0 0 1-145.8 0h-16.7A134.43 134.43 0 0 0 0 422.4V464a48 48 0 0 0 48 48h280.9a63.54 63.54 0 0 1-8.9-32zm288-32h-32v-80a80 80 0 0 0-160 0v80h-32a32 32 0 0 0-32 32v160a32 32 0 0 0 32 32h224a32 32 0 0 0 32-32V320a32 32 0 0 0-32-32zM496 432a32 32 0 1 1 32-32 32 32 0 0 1-32 32zm32-144h-64v-80a32 32 0 0 1 64 0z"></path>
          </svg>
        </figure>
      </header>
      <p class="tray-action">
        {{ $lang['new-password-code'] }}
        <b>{{ identification }}</b>
        {{ $lang['new-password-create'] }}
      </p>
    </div>
    <app-confirm-code
      :identification="identification"
      :identificationType="identificationType"
      :params="this.params"
      :password="this.password">
    </app-confirm-code>
    <app-toggle-password
      :state="errors.length >= 1 ? 'invalid' : 'valid'"
      v-model="passwordHandler"
      @keyup.native="$event.keyCode !== 13 ? clearErrors() : $event.preventDefault()"
      id="new-password-input">
    </app-toggle-password>
    <app-confirm-password
      :state="errors.length >= 1 ? 'invalid' : 'valid'"
      v-model="confirmationHandler"
      @keyup.native="$event.keyCode !== 13 ? clearErrors() : $event.preventDefault()"
      id="confirm-password-input">
    </app-confirm-password>
    <small class="tray-feedbacks"
      v-show="errors.length">
      <span class="tray-error-message"
        v-html="errors[errors.length - 1]">
      </span>
    </small>
    <button id="new-password-submit"
      class="tray-btn-primary"
      type="submit">
      {{ $lang['new-password-submit'] }}
    </button>
    <button class="tray-btn-default tray-btn-other-option"
      type="reset"
      @click="reset">
      {{ $lang['other-option'] }}
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
import AppConfirmPassword from '@/components/ConfirmPassword.vue';
import AppConfirmCode from '@/screens/Login/screens/RecoverPassword/screens/ConfirmCode.vue';

export default {
  name: 'AppNewPassword',
  mixins: [screenHandler],
  components: {
    AppTogglePassword,
    AppConfirmPassword,
    AppConfirmCode,
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
  computed: {
    ...mapState('Login/RecoverPassword', [
      'password',
      'confirmation',
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

    confirmationHandler: {
      get() {
        return this.confirmation;
      },
      set(confirmation) {
        return this.setConfirmation(confirmation);
      },
    },
  },
  methods: {
    generateSecurityCode: client.generateSecurityCode,
    ...mapActions('Login/RecoverPassword', {
      setPassword: 'setPassword',
      setConfirmation: 'setConfirmation',
      nextStep: 'setScreen',
    }),

    ...mapActions('Login', {
      backTo: 'setScreen',
    }),

    /**
     * Verifica se a senha está vazia
     * @param {string}
     * @return {boolean}
     */
    checkEmptyPassword(password = this.password) {
      return password === null;
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
     * Verifica as senhas são iguais
     * @param {string}
     * @return {boolean}
     */
    checkEquality(password = this.password, confirmation = this.confirmation) {
      return password === confirmation;
    },

    /**
     * Reseta o módulo de recuperação de senha
     * @param {string}
     */
    reset() {
      this.setPassword('');
      this.setConfirmation('');
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
      if (!this.checkEmptyPassword(this.password)) {
        this.setError(this.$lang['empty-password']);
        return;
      }
      if (!this.checkValidity(this.password)) {
        this.setError(this.$lang['invalid-password']);
        return;
      }
      if (!this.checkEquality(this.password, this.confirmation)) {
        this.setError(this.$lang['invalid-password']);
        return;
      }

      this.setLoading(true);
      this.generateSecurityCode(payload).then(() => {
        this.setLoading(false);
      });
    },
  },
};
</script>

<style lang="scss">
  @import '@/assets/sass/app.scss';
</style>
