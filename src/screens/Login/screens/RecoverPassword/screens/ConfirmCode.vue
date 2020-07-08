<template>
  <fieldset class="tray-input-group">
    <label :for="id">
      <figure class="tray-input-icon" :class="inputClass">
        <svg class="tray-icon-locked" viewBox="0 0 512 512">
          <!-- eslint-disable-next-line -->
          <path class="path1" d="M176 216h160c8.84 0 16-7.16 16-16v-16c0-8.84-7.16-16-16-16H176c-8.84 0-16 7.16-16 16v16c0 8.84 7.16 16 16 16zm-16 80c0 8.84 7.16 16 16 16h160c8.84 0 16-7.16 16-16v-16c0-8.84-7.16-16-16-16H176c-8.84 0-16 7.16-16 16v16zm96 121.13c-16.42 0-32.84-5.06-46.86-15.19L0 250.86V464c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48V250.86L302.86 401.94c-14.02 10.12-30.44 15.19-46.86 15.19zm237.61-254.18c-8.85-6.94-17.24-13.47-29.61-22.81V96c0-26.51-21.49-48-48-48h-77.55c-3.04-2.2-5.87-4.26-9.04-6.56C312.6 29.17 279.2-.35 256 0c-23.2-.35-56.59 29.17-73.41 41.44-3.17 2.3-6 4.36-9.04 6.56H96c-26.51 0-48 21.49-48 48v44.14c-12.37 9.33-20.76 15.87-29.61 22.81A47.995 47.995 0 0 0 0 200.72v10.65l96 69.35V96h320v184.72l96-69.35v-10.65c0-14.74-6.78-28.67-18.39-37.77z"></path>
        </svg>
      </figure>
    </label>
    <input v-autofocus
      @keyup="$event.keyCode !== 13 ? clearErrors() : $event.preventDefault()"
      v-model="securityCode"
      :id="id"
      :class="inputClass"
      class="tray-input"
      :placeholder="$lang['otp-title']"/>
    <small class="tray-feedbacks" v-show="errors.length">
      <span class="tray-error-message" v-html="errors[errors.length - 1]"></span>
    </small>
  </fieldset>
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
    id: {
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

    inputClass() {
      const { state } = this;

      if (state === '') {
        return 'tray-input-initial';
      }

      if (state === true || state === 'valid') {
        return 'tray-input-valid';
      }

      if (state === false || state === 'invalid') {
        return 'tray-input-invalid';
      }

      return 'tray-input-initial';
    },
  },
  methods: {
    updatePassword: client.updatePassword,
    ...mapActions('Login', {
      backTo: 'setScreen',
    }),

    ...mapActions('Login/RecoverPassword', {
      nextStep: 'setScreen',
    }),


    /**
     * Reseta o módulo de recuperação de senha
     * @param {string}
     */
    reset() {
      this.backTo('Main');
    },

    /**
     * Envia o código de segurança
     * @param {object} event
     * @param {object} payload
     */
    sendCode(event, payload = {
      ...this.params,
      code: this.securityCode,
      endpoint: this.endpoint,
      identification: this.identification,
      password: this.password,
      [this.identificationType]: this.identification,
    }) {
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
