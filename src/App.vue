<template>
  <div class="tray-content" @click.self="close">
    <div
      class="tray-container"
      ref="tray-login"
      v-show="showComponent"
    >
      <button class="tray-close" @click="close">
        <icon name="close" />
      </button>

      <app-identification
        v-if="screen === 'Identification'"
        id="identify"
        class="tray-login-screens"
        :callback="this.dataCallback"
        :params="params"
      >
        <app-custom-texts v-if="hasCustomTexts"
          :action="this.customTexts['main-action']"
          slot="custom-texts">
        </app-custom-texts>

        <template v-if="isNewLoginDesignToggleActive">
          <app-facebook-login
            v-if="facebookEnabled"
            :callback="this.dataCallback"
            :callbackPost="this.dataCallbackPost"
            :params="params"
            label="Fazer login com o Facebook"
            slot="app-facebook-login"
          />

          <app-google-login
            v-if="googleEnabled"
            :callback="this.dataCallback"
            :callbackPost="this.dataCallbackPost"
            :params="params"
            label="Fazer login com o Google"
            slot="app-google-login"
          />
        </template>

        <template v-else>
          <app-facebook-login-old
            v-if="facebookEnabled"
            :callback="this.dataCallback"
            :callbackPost="this.dataCallbackPost"
            :params="params"
            label="Fazer login com o Facebook"
            slot="app-facebook-login"
          />

          <app-google-login-old
            v-if="googleEnabled"
            :callback="this.dataCallback"
            :callbackPost="this.dataCallbackPost"
            :params="params"
            label="Fazer login com o Google"
            slot="app-google-login"
          />
        </template>
      </app-identification>

      <app-login
        v-if="screen === 'Main'"
        id="main"
        class="tray-login-screens"
        :callback="this.dataCallback"
        :callbackPost="this.dataCallbackPost"
        :params="params"
      >
        <app-custom-texts v-if="hasCustomTexts"
          :error="this.customTexts['general-error-alert']"
          :action="this.customTexts['main-action']"
          slot="custom-texts"
        />

        <template v-if="isNewLoginDesignToggleActive">
          <app-otp-button v-if="otpEnabled"
            :callback="this.dataCallback"
            :params="params"
            slot="app-otp-login"
          />

          <app-facebook-login
            v-if="facebookEnabled"
            :callback="this.dataCallback"
            :callbackPost="this.dataCallbackPost"
            :params="params"
            slot="app-facebook-login"
          />

          <app-google-login
            v-if="googleEnabled"
            :callback="this.dataCallback"
            :callbackPost="this.dataCallbackPost"
            :params="params"
            slot="app-google-login"
          />
        </template>

        <template v-else>
          <app-otp-button-old v-if="otpEnabled"
            :callback="this.dataCallback"
            :params="params"
            slot="app-otp-login"
          />

          <app-facebook-login-old
            v-if="facebookEnabled"
            :callback="this.dataCallback"
            :callbackPost="this.dataCallbackPost"
            :params="params"
            slot="app-facebook-login"
          />

          <app-google-login-old
            v-if="googleEnabled"
            :callback="this.dataCallback"
            :callbackPost="this.dataCallbackPost"
            :params="params"
            slot="app-google-login"
          />

          <button
            type="button"
            v-if="identificationEnabled"
            class="tray-btn-default tray-btn-other-option"
            slot="app-back-step"
            @click="reset"
          >
            {{ $lang['go-back'] }}
          </button>
        </template>
      </app-login>

      <section id="blocked" v-if="screen === 'Blocked'" class="tray-login-screens">
        <div>
          <strong class="tray-title tray-login__title">
            {{ $lang['main-title']}}
          </strong>

          <p class="tray-action tray-warning-message">
            {{ $lang['blocked-user'] }}
          </p>
        </div>

        <app-custom-texts v-if="hasCustomTexts"
          :error="this.customTexts['general-error-alert']"
          :action="this.customTexts['main-action']"
          slot="custom-texts"
        />

        <p class="tray-action" v-else v-html="$lang['main-action']"></p>

        <div class="tray-social-login">
          <template v-if="isNewLoginDesignToggleActive">
            <app-google-login
              v-if="googleEnabled"
              :callback="this.dataCallback"
              :callbackPost="this.dataCallbackPost"
              :params="params"
              slot="app-google-login"
            />

            <app-facebook-login
              v-if="facebookEnabled"
              :callback="this.dataCallback"
              :callbackPost="this.dataCallbackPost"
              :params="params"
              slot="app-facebook-login"
            />
          </template>

          <template v-else>
            <app-google-login-old
              v-if="googleEnabled"
              :callback="this.dataCallback"
              :callbackPost="this.dataCallbackPost"
              :params="params"
              slot="app-google-login"
            />

            <app-facebook-login-old
              v-if="facebookEnabled"
              :callback="this.dataCallback"
              :callbackPost="this.dataCallbackPost"
              :params="params"
              slot="app-facebook-login"
            />

            <button
              type="button"
              v-if="identificationEnabled"
              class="tray-btn-default tray-btn-other-option"
              slot="app-back-step"
              @click="reset"
            >
              {{ $lang['go-back'] }}
            </button>
          </template>
        </div>
      </section>

      <section id="tray-login-terms" v-if="hasTerm">
        <app-terms :termText="this.dataTerms"></app-terms>
      </section>

      <section
        v-show="loading"
        id="tray-login-loading"
        class="tray-loading"
        :class="{ 'tray-loading-hidden': !loading }"
      >
        <div class="tray-loading-mask">
          <div class="tray-loading-line"></div>
        </div>

        <icon name="locked-loading" />
      </section>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import http from 'api-client';
import screenHandler from '@/mixins/screenHandler';
import utils from '@/mixins/utils';
import store from './store';
import AppFacebookLogin from './components/FacebookLogin.vue';
import AppFacebookLoginOld from './components/FacebookLogin_old.vue';
import AppGoogleLogin from './components/GoogleLogin.vue';
import AppGoogleLoginOld from './components/GoogleLogin_old.vue';
import AppIdentification from './screens/Identification/Main.vue';
import AppLogin from './screens/Login/screens/Main.vue';
import AppOtpButton from './screens/Login/screens/Otp/Button.vue';
import AppOtpButtonOld from './screens/Login/screens/Otp/Button_old.vue';
import AppCustomTexts from './components/CustomTexts.vue';
import AppTerms from './components/Terms.vue';
import Icon from './components/icons/index.vue';

export default {
  store,
  name: 'TrayLogin',
  components: {
    AppCustomTexts,
    AppFacebookLogin,
    AppFacebookLoginOld,
    AppGoogleLogin,
    AppGoogleLoginOld,
    AppIdentification,
    AppOtpButton,
    AppOtpButtonOld,
    AppLogin,
    AppTerms,
    Icon,
  },
  mixins: [screenHandler, utils],
  data() {
    return {
      loading: false,
      screen: 'Identification',
      showComponent: true,
      googleLoginToggleStatus: false,
      isNewLoginDesignToggleActive: false,
    };
  },
  props: {
    dataBaseUrl: {
      type: String,
      default: 'checkout',
    },
    dataCallback: {
      type: String,
      default: '/',
    },
    dataCallbackPost: {
      type: String,
      default: '/',
    },
    dataIdentification: {
      type: String,
      default: '',
    },
    dataMethods: {
      type: [String, Array],
      default() {
        return ['facebook', 'google', 'identify'];
      },
    },
    dataSession: {
      type: String,
      default: '',
    },
    dataStore: {
      type: [String, Number],
      default: '',
    },
    dataTexts: {
      type: [String, Object],
      default() {
        return '{"general-error-alert": "", "main-action": ""}';
      },
    },
    dataTerms: {
      type: String,
      default: '',
    },
  },
  beforeMount() {
    this.setBaseUrl(this.dataBaseUrl);

    this.setResolution(window.innerWidth);
    window.addEventListener('resize', () => {
      this.setResolution(window.innerWidth);
    });
  },
  mounted() {
    this.isNewLoginDesignToggleActive = localStorage.getItem('new-tray-login') === '1';
    this.initialize(this.dataIdentification);
    this.changeCssFile();

    this.getLangs({
      store_id: this.dataStore,
      endpoint: 'langs/login_component',
    }).then((response) => {
      this.setLang(response.data);
    });

    this.googleLoginEasyToggle({
      store_id: this.dataStore,
      endpoint: 'login/google/active',
    }).then((response) => {
      const { 'google-login': googleLoginToggle } = response;
      this.googleLoginToggleStatus = googleLoginToggle;
    });

    this.verifyFacebookOrGoogleLogin();
  },

  watch: {
    isNewLoginDesignToggleActive() {
      this.changeCssFile();
    },
    dataIdentification(identification) {
      this.initialize(identification);
    },
    blockedUser(blockedUser) {
      if (blockedUser) {
        this.setScreen('Blocked');
      }
    },
    dataBaseUrl(baseUrl) {
      this.setBaseUrl(baseUrl);
    },
  },

  computed: {
    ...mapState([
      'blockedUser',
    ]),

    /**
     * Verifica se o login com o otp será utilizado
     * @return {boolean}
     */
    otpEnabled() {
      return this.dataMethods.indexOf('otp') !== -1;
    },

    /**
     * Verifica se o login com o facebook será utilizado
     * @return {boolean}
     */
    facebookEnabled() {
      return this.dataMethods.indexOf('facebook') !== -1;
    },

    /**
     * Verifica se o login com o google será utilizado
     * @return {boolean}
     */
    googleEnabled() {
      return this.googleLoginToggleStatus && this.dataMethods.indexOf('google') !== -1;
    },

    /**
     * Verifica se o modulo de identificação será utilizado
     * @return {boolean}
     */
    identificationEnabled() {
      return this.dataMethods.indexOf('identify') !== -1;
    },

    /**
     * Verifica se existe algum texto personalizado definido
     * pelo usuário
     * @return {boolean}
     */
    hasCustomTexts() {
      return Object.values(this.customTexts).some(value => value);
    },

    /**
     * Verifica se tem textos de termos
     * @return {boolean}
     */
    hasTerm() {
      return this.dataTerms.trim().length > 0;
    },

    /**
     * Realiza o tratamento dos textos personalizados
     * definidos pelo usuário
     */
    customTexts() {
      try {
        return JSON.parse(this.dataTexts);
      } catch {
        return this.dataTexts;
      }
    },

    /**
     * Parametros que são utilizados em praticamente todas as requests
     * para uma api da plataforma
     * @return {object}
     */
    params() {
      return {
        session_id: this.dataSession,
        store_id: this.dataStore,
      };
    },

    /**
     * Retorna o token salvo no localStorage
     * @return {string}
     */
    localToken() {
      return localStorage.getItem('jwtToken');
    },

    /**
     * Verifica se há token no localStorage
     * @return {bool}
     */
    hasToken() {
      return this.localToken && this.localToken !== 'false';
    },

    /**
     * Valida se foi feito o login do facebook
     * @return {bool}
     */
    isFacebookLogin() {
      try {
        const params = JSON.parse(this.dataCallbackPost) || '';
        return params.social === '1';
      } catch {
        return false;
      }
    },

    /**
     * Valida se foi feito o login com o google
     * @return {bool}
     */
    isGoogleLogin() {
      try {
        const params = JSON.parse(this.dataCallbackPost) || '';
        return params.social === '1';
      } catch (error) {
        return false;
      }
    },
  },

  methods: {
    googleLoginEasyToggle: http.googleLoginEasyToggle,
    getLangs: http.getLangs,
    ...mapActions([
      'setBaseUrl',
      'setIdentification',
      'setLang',
      'setResolution',
    ]),

    changeCssFile() {
      const root = document.getElementsByTagName('body')[0];
      root.classList.add(this.isNewLoginDesignToggleActive ? 'new' : 'old');
    },

    /**
     * Define a tela a ser exibida de acordo com a identificação
     * definidas
     * @param {string} identification
     */
    initialize(identification) {
      this.setIdentification(identification);

      if (identification) {
        this.setScreen('Main');
        return;
      }

      this.setScreen('Identification');
    },

    /**
     * Fecha o componente
     * @param {event}
     */
    close(event) {
      this.$emitEvent.custom('close', {
        element: event.target,
        type: event.type,
      });

      const trayLogin = document.querySelector('tray-login');
      if (trayLogin) {
        trayLogin.style.display = 'none';
      }
    },

    /**
     * Reseta o componente para que um novo login
     * seja realizado
     * @param {event}
     */
    reset(event) {
      this.$emitEvent.custom('reset', {
        element: event.target,
        type: event.type,
      });

      this.setScreen('Identification');
      this.setIdentification('');
      this.clearErrors();
    },

    /**
     * Executa o mixinCallbackLogin caso tenha token de login com o facebook ou google
     * @return {undefined}
     */
    verifyFacebookOrGoogleLogin() {
      if (this.hasFacebookToken() || this.hasGoogleToken()) {
        this.mixinCallbackLogin(this.dataCallbackPost, this.localToken);
      }
    },

    /**
     * Verifica se o login foi feito pelo facebook e se há token de sessão
     * @return {bool}
     */
    hasFacebookToken() {
      return this.isFacebookLogin && this.hasToken;
    },

    /**
     * Verifica se o login foi feito pelo google e se há token de sessão
     * @return {bool}
     */
    hasGoogleToken() {
      return this.isGoogleLogin && this.hasToken;
    },
  },
};
</script>

<style lang="scss">
  @import './assets/sass/app.scss';
</style>
