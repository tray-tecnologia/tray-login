<template>
  <form id="form-otp" class="tray-login__otp" method='POST' @submit.prevent="submit">
    <div class="tray-login__recover-password__confirm-code__header">
      <strong class="tray-title">
        {{ $lang['otp-title']}}
      </strong>
      <p class="tray-action">
        {{ $lang['new-password-code'] }}
        <b> {{ maskedEmail || identification }} </b>
      </p>
    </div>
    <fieldset class="tray-input-group">
      <label for="input-code">
        <figure class="tray-input-icon" :class="securityCodeClassses">
          <icon name="locked" />
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
      class="tray-btn-default tray-btn-other-option"
      type="reset"
      @click="backTo('Main')">
      {{ $lang['other-option'] }}
    </button>
    <section class="tray-loading" v-show="loading">
      <div class="tray-loading-mask">
        <div class="tray-loading-line"></div>
      </div>

      <icon name="locked-loading" />
    </section>
  </form>
</template>

<script>
import { mapActions } from 'vuex';
import http from 'api-client';
import screenHandler from '@/mixins/screenHandler';
import utils from '@/mixins/utils';
import Icon from '@/components/icons/index.vue';

export default {
  name: 'AppOtpConfirmCode',
  components: { Icon },
  mixins: [screenHandler, utils],
  props: {
    callback: {
      type: String,
      default: '',
    },
    callbackPost: {
      type: String,
      default: '/',
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
    /**
     * Valida quando o callback retornado é válido, sendo
     * diferente do valor inicial atribuido a ele ('/')
     * @return {bool}
     */
    hasCallbackPost() {
      return this.callbackPost !== '/';
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
        const { token = '' } = response.data.data;
        this.$emitEvent.login({
          response,
          method: 'otp',
          type: 'success',
        });
        if (this.hasCallbackPost) {
          this.mixinCallbackLogin(this.callbackPost, token);
          return response;
        }
        if (this.callback) {
          this.redirect(this.callback, token);
          return response;
        }
        this.setLoading(false);
        return response;
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
