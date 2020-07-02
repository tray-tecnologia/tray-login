<template>
  <section id="send-security-code">
    <input
      @keyup="$event.keyCode !== 13 ? clearErrors() : $event.preventDefault()"
      v-on:load="this.load()"
      v-model="securityCode"
      type="text"
      id="password-code"
      class="tray-input"
      :class="securityCodeClassses"
      :placeholder="$lang['otp-title']"/>
    <small class="tray-feedbacks" v-show="errors.length">
      <span class="tray-error-message" v-html="errors[errors.length - 1]">
      </span>
    </small>
    <section class="tray-loading" v-show="loading">
      <div class="tray-loading-mask">
        <div class="tray-loading-line"></div>
      </div>
      <svg class="tray-loading-icon tray-icon-locked" viewBox="0 0 1024 1024">
        <!-- eslint-disable-next-line -->
        <path class="path1" d="M796.467 417.109v-132.642c0-155.58-128.956-284.467-284.467-284.467s-284.467 128.887-284.467 284.467v132.642c-64.444 0-113.801 49.289-113.801 113.801v379.29c0.068 64.444 49.289 113.801 113.801 113.801h568.866c64.444 0 113.801-49.289 113.801-113.801v-379.29c0.068-60.689-49.289-113.801-113.732-113.801zM265.489 284.399c0-136.533 109.978-246.511 246.511-246.511s246.511 109.978 246.511 246.511v132.71h-37.956v-132.71c0-113.801-94.822-208.623-208.623-208.623s-208.555 94.822-208.555 208.623v132.71h-37.956l0.068-132.71zM682.667 284.399v132.71h-341.333v-132.71c0-94.822 75.844-170.667 170.667-170.667s170.667 75.844 170.667 170.667zM872.311 568.798v75.844h-341.333v37.956h341.333v75.844h-341.333v37.956h341.333v75.844h-341.333v37.956h341.333c0 41.711-34.133 75.844-75.844 75.844h-568.866c-41.711 0-75.844-34.133-75.844-75.844v-379.221c0-41.711 34.133-75.844 75.844-75.844h568.866c41.711 0 75.844 34.133 75.844 75.844h-341.333v37.956l341.333-0.137z"></path>
      </svg>
    </section>
  </section>
</template>

<script>
import client from 'api-client';
import { mapActions } from 'vuex';
import screenHandler from '@/mixins/screenHandler';

export default {
  name: 'AppConfirmCode',
  mixins: [screenHandler],
  props: {
    endpoint: {
      type: String,
      default: 'password-update',
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
    password: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      securityCode: '',
    };
  },
  computed: {
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
    ...mapActions('Login', {
      backTo: 'setScreen',
    }),

    ...mapActions('Login/RecoverPassword', {
      nextStep: 'setScreen',
      setPassword: 'setPassword',
      setConfirmation: 'setConfirmation',
    }),


    /**
     * Reseta o módulo de recuperação de senha
     * @param {string}
     */
    reset() {
      this.setPassword('');
      this.setConfirmation('');
      this.nextStep('New');
      this.backTo('Main');
    },

    /**
     * Envia o código de segurança
     * @param {object} event
     * @param {object} payload
     */
    load(event, payload = {
      ...this.params,
      code: this.securityCode,
      endpoint: this.endpoint,
      identification: this.identification,
      password: this.password,
      [this.identificationType]: this.identification,
    }) {
      console.log(event)
      this.setLoading(true);

      if (!this.isValidSecurityCode) {
        this.setError(this.$lang['invalid-code']);
        this.setLoading(false);
        return;
      }

      this.updatePassword(payload).then(() => {
        this.setLoading(false);
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
