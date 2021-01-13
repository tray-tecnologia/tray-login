<template>
  <form id="form-otp" class="tray-login__otp" method='POST' @submit.prevent="submit">
    <div class="tray-login__recover-password__confirm-code__header">
      <strong class="tray-title">
        {{ $lang['otp-title']}}
      </strong>
      <p class="tray-action">
        {{ $lang['otp-action'] }}
      </p>
      <label class="tray-well">
        {{ maskedEmail || identification }}
      </label>
    </div>
    <fieldset class="tray-input-group">
      <label for="input-code">
        <figure class="tray-input-icon" :class="securityCodeClassses">
          <svg class="tray-icon-locked" viewBox="0 0 1024 1024">
            <!-- eslint-disable-next-line -->
            <path class="path1" d="M796.467 417.109v-132.642c0-155.58-128.956-284.467-284.467-284.467s-284.467 128.887-284.467 284.467v132.642c-64.444 0-113.801 49.289-113.801 113.801v379.29c0.068 64.444 49.289 113.801 113.801 113.801h568.866c64.444 0 113.801-49.289 113.801-113.801v-379.29c0.068-60.689-49.289-113.801-113.732-113.801zM265.489 284.399c0-136.533 109.978-246.511 246.511-246.511s246.511 109.978 246.511 246.511v132.71h-37.956v-132.71c0-113.801-94.822-208.623-208.623-208.623s-208.555 94.822-208.555 208.623v132.71h-37.956l0.068-132.71zM682.667 284.399v132.71h-341.333v-132.71c0-94.822 75.844-170.667 170.667-170.667s170.667 75.844 170.667 170.667zM872.311 568.798v75.844h-341.333v37.956h341.333v75.844h-341.333v37.956h341.333v75.844h-341.333v37.956h341.333c0 41.711-34.133 75.844-75.844 75.844h-568.866c-41.711 0-75.844-34.133-75.844-75.844v-379.221c0-41.711 34.133-75.844 75.844-75.844h568.866c41.711 0 75.844 34.133 75.844 75.844h-341.333v37.956l341.333-0.137z"></path>
          </svg>
        </figure>
      </label>
      <input
        type="tel"
        v-autofocus
        id="input-code"
        class="tray-input"
        v-model="securityCode"
        maxlength="6"
        autocomplete="new-password"
        :class="securityCodeClassses"
        :placeholder="$lang['otp-title']"/>
    </fieldset>
    <small class="tray-feedbacks" v-show="errors.length">
      <span class="tray-error-message" v-html="errors[errors.length - 1]">
      </span>
    </small>
    <button id="otp-submit"
      class="tray-btn-primary"
      type="submit">
      {{ $lang['proceed' ]}}
    </button>
    <button
      class="tray-btn-default"
      type="reset"
      @click="backTo('Main')">
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
import { mapActions } from 'vuex';
import http from 'api-client';
import screenHandler from '@/mixins/screenHandler';
import utils from '@/mixins/utils';

export default {
  name: 'AppOtpConfirmCode',
  mixins: [screenHandler, utils],
  props: {
    callback: {
      type: String,
      default: '',
    },
    endpoint: {
      type: String,
      default: 'otp',
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
      securityCode: '',
      maskedEmail: '',
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
        'tray-input-initial': !this.securityCode,
      };
    },
  },
  mounted() {
    const isValidDocument = this.identificationType !== 'email';
    if (isValidDocument) {
      this.getUserMaskedMail();
    }
    this.$emitEvent.custom('otp');
  },
  methods: {
    ...mapActions('Login', {
      backTo: 'setScreen',
    }),
    otpLogin: http.otpLogin,
    getMaskedEmail: http.getMaskedEmail,

    /**
     * Realiza o login com o código de segurança
     * @param {object} event
     * @param {object} payload
     */
    submit(event, payload = {
      ...this.params,
      code: this.securityCode,
      endpoint: this.endpoint,
      identification: this.identification,
      [this.identificationType]: this.identification,
    }) {
      this.setLoading(true);
      this.otpLogin(payload).then((response) => {
        this.$emitEvent.login({
          response,
          method: 'otp',
          type: 'success',
        });

        if (this.callback) {
          const { token = '' } = response.data.data;
          this.redirect(this.callback, token);
          return;
        }

        this.setLoading(false);
      }).catch((error) => {
        this.$emitEvent.login({
          response: error,
          method: 'otp',
          type: 'error',
        });

        const { message = this.$lang['invalid-code'] } = error.data;
        this.setError(message);
        this.setLoading(false);
      });
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
  },
};
</script>
