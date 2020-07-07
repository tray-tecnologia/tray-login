<template>
  <section class="tray-login-screens">
    <section v-if="screen === 'Main'">
      <div>
        <strong class="tray-title">
          {{ $lang['main-title'] }}
        </strong>
        <slot v-if="this.$slots['custom-texts']" name="custom-texts"></slot>
        <p v-else class="tray-action" v-html="$lang['main-action']"></p>
        <label class="tray-well">
          {{ identification }}
        </label>
      </div>

      <form method='POST'
        @submit.prevent="submit">
        <app-toggle-password id="input-password"
          v-model="password"
          :state="this.errors.length >= 1 ? 'invalid' : 'initial'"
          @keyup.native="$event.keyCode !== 13 ? clearErrors() : $event.preventDefault()">
        </app-toggle-password>
        <small class="tray-feedbacks" v-show="errors.length">
          <span class="tray-error-message" v-html="errors[errors.length - 1]"></span>
        </small>
        <a class="tray-link tray-password-forget"
          @click="sendCode"
          href="#">
          {{ $lang['password-forget'] }}
        </a>
        <button id="password-submit"
          @click="$emitEvent.click('tray-password-submit')"
          class="tray-btn-primary"
          type="submit">
          {{ $lang['proceed'] }}
        </button>
      </form>

      <div class="tray-general-separator">
        <span class="tray-general-separator-line">
          {{ $lang['main-separator'] }}
        </span>
      </div>
      <slot name="app-otp-login"></slot>
      <slot name="app-facebook-login"></slot>
      <slot name="app-back-step"></slot>
    </section>

    <app-recover-password v-if="screen === 'RecoverPassword'"
      :params="params"
      :callback="callback">
    </app-recover-password>

    <app-otp-login v-if="screen === 'Otp'"
      :callback="callback"
      :identification="identification"
      :identificationType="identificationType"
      :params="params">
    </app-otp-login>

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
import http from 'api-client';
import { mapActions, mapState, mapGetters } from 'vuex';
import AppRecoverPassword from './RecoverPassword/screens/Main.vue';
import AppOtpLogin from './Otp/screens/Login.vue';
import AppTogglePassword from '@/components/TogglePassword.vue';
import screenHandler from '@/mixins/screenHandler';
import utils from '@/mixins/utils';
import { error } from 'util'

export default {
  name: 'AppLogin',
  mixins: [screenHandler, utils],
  components: {
    AppTogglePassword,
    AppRecoverPassword,
    AppOtpLogin,
  },
  props: {
    callback: {
      type: String,
      default: '/',
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
  },
  data() {
    return {
      password: '',
      showPassword: false,
    };
  },
  mounted() {
    this.setLoading(true);
    this.$emitEvent.custom('main');

    const payload = {
      ...this.params,
      endpoint: 'check-status',
      identification: this.identification,
      [this.identificationType]: this.identification,
    };

    this.checkUserStatus(payload).then((response) => {
      if (response.data.data.blocked) {
        this.$parent.setScreen('Blocked');
      }

      this.setLoading(false);
    });
  },

  computed: {
    ...mapState([
      'identification',
    ]),

    ...mapState('Login', [
      'screen',
    ]),

    ...mapGetters(['identificationType']),
  },

  methods: {
    checkUserStatus: http.checkUserStatus,
    passwordLogin: http.passwordLogin,
    generateSecurityCode: http.generateSecurityCode,

    ...mapActions('Login', [
      'setScreen',
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
      this.passwordLogin(payload).then((response) => {
        this.clearErrors();
        this.$emitEvent.login({
          details: {
            response,
            method: 'password',
            type: 'success',
          },
        });

        if (this.callback) {
          this.redirect(this.callback, response.data.data.token);
          return response;
        }

        this.setLoading(false);
        return response;
      }).catch((error) => {
        this.$emitEvent.login({
          response: error,
          method: 'password',
          type: 'error',
        });

        const { message } = error.data;
        this.setError(message || this.$lang['invalid-code']);
        this.setLoading(false);
      });
    },

    /**
     * Envia o código de confirmação para o email do cliente
     * @return {undefined}
     */
    sendCode(event, payload = {
      ...this.params,
      endpoint: 'generate-security-code',
      identification: this.identification,
      [this.identificationType]: this.identification,
    }) {
      this.setLoading(true);
      this.generateSecurityCode(payload).then(() => {
        this.setLoading(false);
        this.setScreen('RecoverPassword');
      }).catch((error) => {
        this.setError(error);
        this.setLoading(false);
      });
    },

  },
};
</script>
