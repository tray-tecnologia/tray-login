<template>
  <section class="tray-login-screens">
    <section v-if="screen === 'Main'">
      <div>
        <strong class="tray-title">
          {{ $lang['main-title'] }}
        </strong>
        <slot
          v-if="this.$slots['custom-texts']"
          name="custom-texts">
        </slot>
        <p v-else class="tray-action" v-html="$lang['main-action']"></p>
        <label class="tray-well">
          {{ identification }}
        </label>
      </div>

      <form
        method='POST'
        @submit.prevent="submit"
      >
        <app-toggle-password
          id="input-password"
          v-model="password"
          :autoFocus="true"
          :state="this.errors.length >= 1 ? 'invalid' : 'initial'"
          @keyup.native="$event.keyCode !== enterKeyCode ? clearErrors() : $event.preventDefault()"
        />

        <small class="tray-feedbacks" v-show="errors.length">
          <span class="tray-error-message" v-html="errors[errors.length - 1]"></span>
        </small>

        <button class="tray-link tray-password-forget" type="button" @click="sendCode">
          {{ $lang['password-forget'] }}
        </button>

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

      <div class="tray-social-login">
        <slot name="app-google-login"></slot>
        <slot name="app-facebook-login"></slot>
      </div>

      <slot name="app-otp-login"></slot>
    </section>

    <app-recover-password
      v-if="screen === 'RecoverPassword'"
      :params="params"
      :callback="callback"
      :callbackPost="this.callbackPost"
    />

    <app-otp-login
      v-if="screen === 'Otp'"
      :callback="callback"
      :identification="identification"
      :identificationType="identificationType"
      :params="params"
      :callbackPost="this.callbackPost"
    />

    <app-compulsory-password
      v-if="screen === 'CompulsoryPassword'"
      :callback="callback"
      :identification="identification"
      :identificationType="identificationType"
      :params="params"
    />

    <section class="tray-loading" v-show="loading">
      <div class="tray-loading-mask">
        <div class="tray-loading-line"></div>
      </div>

      <icon name="locked-loading" />
    </section>
  </section>
</template>

<script>
import http from 'api-client';
import utils from '@/mixins/utils';
import screenHandler from '@/mixins/screenHandler';
import { mapActions, mapState, mapGetters } from 'vuex';
import AppTogglePassword from '@/components/TogglePassword.vue';
import Icon from '@/components/icons/index.vue';
import AppRecoverPassword from './RecoverPassword/screens/Main.vue';
import AppOtpLogin from './Otp/screens/Login.vue';
import AppCompulsoryPassword from './CompulsoryPassword/Main.vue';
import {
  isValidLength,
  containsLetter,
  containsNumber,
} from './RecoverPassword/validators/password';

export default {
  name: 'AppLogin',
  mixins: [screenHandler, utils],
  components: {
    AppTogglePassword,
    AppRecoverPassword,
    AppCompulsoryPassword,
    AppOtpLogin,
    Icon,
  },
  props: {
    callback: {
      type: String,
      default: '/',
    },
    callbackPost: {
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
      numberOfAttempts: 5,
      password: '',
      showPassword: false,
    };
  },

  watch: {
    numberOfAttempts(value) {
      this.setBlockedUser(false);

      if (value < 1) {
        this.setBlockedUser(true);
      }
    },
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

    /**
     * Valida se a senha passa nos requisitos de segurança
     *
     * @return {boolean}
     */
    isStrongPassword() {
      return (
        isValidLength(this.password)
        && containsLetter(this.password)
        && containsNumber(this.password)
      );
    },

    /**
     * Retorna a lang de 'invalid-code' se for a primeira tentativa
     * ou concatena a informação da quantidade de tentativas restantes
     * na lang 'attempts-remaining'
     *
     * @return {string}
     */
    attemptsRemaningReplacedLang() {
      const message = this.$lang['invalid-code'];

      if (!message) {
        return '';
      }

      if (this.numberOfAttempts === 4) {
        return message;
      }

      const attemptMessage = this.$lang['attempts-remaining'];
      const pluralMessage = this.$lang['attempts-quantity'];

      const hasPropInMessage = pluralMessage.search(':number') !== -1;

      if (hasPropInMessage && this.numberOfAttempts > 1) {
        return [attemptMessage, pluralMessage.replace(':number', this.numberOfAttempts)].join(' ');
      }

      const singularMessage = this.$lang['last-attempt'];

      return [attemptMessage, singularMessage].join(' ');
    },

    /**
     * Valida se o callbackPost é diferente de "/"
     * @return {bool}
     */
    hasCallbackPost() {
      return this.callbackPost !== '/';
    },
  },

  methods: {
    checkUserStatus: http.checkUserStatus,
    passwordLogin: http.passwordLogin,
    generateSecurityCode: http.generateSecurityCode,
    callbackLoginLayout: http.callbackLoginLayout,

    ...mapActions([
      'setSecurityCode',
      'setBlockedUser',
    ]),

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
      this.numberOfAttempts -= 1;

      this.setLoading(true);
      this.passwordLogin(payload).then((response) => {
        const { token: tokenPassword, code } = response.data.data;

        this.$emitEvent.login({
          details: {
            response,
            method: 'password',
            type: 'success',
          },
        });

        if (!this.isStrongPassword && !this.isTestIdentifier(this.identification)) {
          this.setSecurityCode(code);
          this.setScreen('CompulsoryPassword');
          this.setLoading(false);
          return response;
        }

        if (this.hasCallbackPost) {
          this.mixinCallbackLogin(this.callbackPost, tokenPassword);
          return response;
        }

        if (this.callback) {
          this.redirect(this.callback, tokenPassword);
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
        this.setLoading(false);
        this.setError(message || this.attemptsRemaningReplacedLang);
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
        const { errors = [this.$lang['invalid-code']] } = { ...error };
        this.setError(errors.pop());
        this.setLoading(false);
      });
    },

  },
};
</script>
