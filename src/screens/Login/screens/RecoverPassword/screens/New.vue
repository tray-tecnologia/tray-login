<template>
  <form id="change-password"
    class="tray-login__new-password" method='POST' @submit.prevent="submit">
    <div>
      <strong class="tray-title tray-login__title">
        {{ $lang['new-password-title']}}
      </strong>
      <div class="tray-login__recover-password__header">
        <figure class="tray-login__recover-password__figure">
          <svg class="tray-user-lock" viewBox="0 0 640 512">
            <!-- eslint-disable-next-line -->
            <path class="path1" d="M224 256A128 128 0 1 0 96 128a128 128 0 0 0 128 128zm96 64a63.08 63.08 0 0 1 8.1-30.5c-4.8-.5-9.5-1.5-14.5-1.5h-16.7a174.08 174.08 0 0 1-145.8 0h-16.7A134.43 134.43 0 0 0 0 422.4V464a48 48 0 0 0 48 48h280.9a63.54 63.54 0 0 1-8.9-32zm288-32h-32v-80a80 80 0 0 0-160 0v80h-32a32 32 0 0 0-32 32v160a32 32 0 0 0 32 32h224a32 32 0 0 0 32-32V320a32 32 0 0 0-32-32zM496 432a32 32 0 1 1 32-32 32 32 0 0 1-32 32zm32-144h-64v-80a32 32 0 0 1 64 0z"></path>
          </svg>
        </figure>
      </div>
      <p class="tray-action">
        {{ $lang['new-password-code'] }}
        <b>{{ maskedEmail || identification }}</b>
        {{ $lang['new-password-create'] }}
      </p>
    </div>
    <fieldset class="tray-input-group">
      <label for="security-code-input">
        <figure class="tray-input-icon">
          <svg class="tray-icon-locked" viewBox="0 0 512 512">
            <!-- eslint-disable-next-line -->
            <path class="path1" d="M176 216h160c8.84 0 16-7.16 16-16v-16c0-8.84-7.16-16-16-16H176c-8.84 0-16 7.16-16 16v16c0 8.84 7.16 16 16 16zm-16 80c0 8.84 7.16 16 16 16h160c8.84 0 16-7.16 16-16v-16c0-8.84-7.16-16-16-16H176c-8.84 0-16 7.16-16 16v16zm96 121.13c-16.42 0-32.84-5.06-46.86-15.19L0 250.86V464c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48V250.86L302.86 401.94c-14.02 10.12-30.44 15.19-46.86 15.19zm237.61-254.18c-8.85-6.94-17.24-13.47-29.61-22.81V96c0-26.51-21.49-48-48-48h-77.55c-3.04-2.2-5.87-4.26-9.04-6.56C312.6 29.17 279.2-.35 256 0c-23.2-.35-56.59 29.17-73.41 41.44-3.17 2.3-6 4.36-9.04 6.56H96c-26.51 0-48 21.49-48 48v44.14c-12.37 9.33-20.76 15.87-29.61 22.81A47.995 47.995 0 0 0 0 200.72v10.65l96 69.35V96h320v184.72l96-69.35v-10.65c0-14.74-6.78-28.67-18.39-37.77z"></path>
          </svg>
        </figure>
      </label>
      <input v-autofocus
        autocomplete="new-password"
        @keyup="$event.keyCode !== 13 ? clearErrors() : $event.preventDefault()"
        v-model="securityCode"
        id="security-code-input"
        maxlength="6"
        @input="filterInput()"
        class="tray-input"
        :placeholder="$lang['otp-title']"/>
    </fieldset>
    <app-toggle-password
      autocomplete="new-password"
      :state="errors.length >= 1 ? 'invalid' : 'valid'"
      v-model="passwordHandler"
      @keyup.native="$event.keyCode !== 13 ? clearErrors() : $event.preventDefault()"
      id="new-pswrd-input">
    </app-toggle-password>
    <app-confirm-password
      autocomplete="new-password"
      :state="errors.length >= 1 ? 'invalid' : 'valid'"
      v-model="passwordConfirmation"
      @keyup.native="$event.keyCode !== 13 ? clearErrors() : $event.preventDefault()"
      id="confirm-pswrd-input">
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

export default {
  name: 'AppNewPassword',
  mixins: [screenHandler],
  components: {
    AppTogglePassword,
    AppConfirmPassword,
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
      passwordConfirmation: '',
      securityCode: '',
      maskedEmail: '',
    };
  },

  mounted() {
    const isValidDocument = this.identificationType !== 'email';
    if (isValidDocument) {
      this.getUserMaskedMail();
    }
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

    /**
     * Objeto de classes utilizadas na personalização do input
     * @return {object}
     */
    securityCodeClassses() {
      return {
        'tray-input-invalid': this.errors.length >= 1,
      };
    },

    /**
     * Verifica se o codigo de segurança preenchido é valido
     * @return {boolean}
     */
    isValidSecurityCode() {
      if (this.securityCode.length < 6) {
        return false;
      }

      const onlyNumbersPattern = /^\d+$/;
      return onlyNumbersPattern.test(this.securityCode);
    },
  },
  methods: {
    updatePassword: client.updatePassword,
    getMaskedEmail: client.getMaskedEmail,
    ...mapActions('Login/RecoverPassword', {
      setPassword: 'setPassword',
      nextStep: 'setScreen',
    }),

    ...mapActions('Login', {
      backTo: 'setScreen',
    }),

    /**
     * Verifica se a senha é valida
     * @param {string}
     * @return {boolean}
     */
    checkValidity(password = this.password) {
      return password.length >= 6;
    },

    /**
     * Verifica se as senhas são iguais
     * @param {string} password a senha digitada
     * @param {string} confirmation a confirmação da senha
     * @return {boolean}
     */
    checkEquality(password = this.password, confirmation = this.passwordConfirmation) {
      return password === confirmation;
    },

    /**
     * Recupera o email mascarado do cliente a partir do CPF
     * @param {object} payload os parâmetros enviados para o endpoint
     * @return {undefined}
     */
    getUserMaskedMail(payload = {
      ...this.params,
      endpoint: 'retrieve-masked-email',
      identification: this.identification,
      [this.identificationType]: this.identification,
    }) {
      this.getMaskedEmail(payload).then((response) => {
        this.maskedEmail = response.data.data.responseData.maskedEmail;
      }).catch((error) => {
        throw error;
      });
    },

    /**
     * Valida se o input possui apenas números
     * @return {undefined}
     */
    filterInput() {
      this.securityCode = this.securityCode.replace(/[^0-9]+/g, '');
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
     * Valida os campos
     */
    submit() {
      if (!this.checkEquality(this.password, this.confirmation)) {
        this.setError(this.$lang['non-equal-password']);
        return;
      }
      if (!this.checkValidity(this.password)) {
        this.setError(this.$lang['invalid-password']);
        return;
      }

      if (!this.isValidSecurityCode) {
        this.setError(this.$lang['invalid-code']);
        return;
      }

      this.update();
    },

    /**
     * Atualiza a senha
     */
    update(event, payload = {
      ...this.params,
      code: this.securityCode,
      endpoint: 'password-update',
      identification: this.identification,
      password: this.password,
      [this.identificationType]: this.identification,
    }) {
      this.updatePassword(payload).then(() => {
        this.params.code = this.securityCode;
        this.setLoading(true);
        this.nextStep('Login');
      }).catch((error) => {
        const { message = this.$lang['invalid-code'] } = error.data.data;
        this.setError(message);
        this.setLoading(false);
      });
    },
  },
};
</script>
