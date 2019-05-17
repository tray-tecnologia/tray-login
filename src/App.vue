<template>
  <div id="tray-login" class="tray-login" ref="tray-login" v-show="showComponent">
    <div class="tray-container">
      <button class="tray-close"
        @click="close">
        X
      </button>
      <app-identification id="identify" v-if="screen === 'Identification'"
        class="tray-login-screens"
        :callback="this.dataCallback"
        :params="params">
        <app-custom-texts v-if="hasCustomTexts"
          :action="this.customTexts['main-action']"
          slot="custom-texts">
        </app-custom-texts>
        <app-facebook-login v-if="facebookEnabled"
          :callback="this.dataCallback"
          :params="params"
          slot="app-facebook-login">
        </app-facebook-login>
      </app-identification>

      <app-login id="main" v-if="screen === 'Main'"
        class="tray-login-screens"
        :callback="this.dataCallback"
        :params="params">
        <app-custom-texts v-if="hasCustomTexts"
          :error="this.customTexts['general-error-alert']"
          :action="this.customTexts['main-action']"
          slot="custom-texts">
        </app-custom-texts>
        <app-otp-button v-if="otpEnabled"
          :callback="this.dataCallback"
          :params="params"
          slot="app-otp-login"
        >
        </app-otp-button>
        <app-facebook-login v-if="facebookEnabled"
          :callback="this.dataCallback"
          :params="params"
          slot="app-facebook-login">
        </app-facebook-login>
        <button type="button"
          v-if="identificationEnabled"
          class="tray-btn-default tray-btn-other-option"
          @click="reset"
          slot="app-back-step">
          {{ $lang['go-back'] }}
        </button>
      </app-login>

      <section id="blocked" v-if="screen === 'Blocked'"
        class="tray-login-screens">
        <div>
          <strong class="tray-title tray-login__title">
            {{ $lang['main-title']}}
          </strong>
          <p class="tray-action tray-error-message">
            {{ $lang['blocked-user'] }}
          </p>
        </div>
        <app-custom-texts v-if="hasCustomTexts"
          :error="this.customTexts['general-error-alert']"
          :action="this.customTexts['main-action']"
          slot="custom-texts">
        </app-custom-texts>
        <p class="tray-action" v-else v-html="$lang['main-action']"></p>
        <app-facebook-login v-if="facebookEnabled"
          :callback="callback"
          :params="params"
          slot="app-facebook-login">
        </app-facebook-login>
        <button v-if="identificationEnabled"
          class="tray-btn-default"
          @click="reset"
          slot="app-back-step">
          {{ $lang['go-back'] }}
        </button>
      </section>

      <section id="tray-login-loading" v-show="loading"
        :class="{
          'tray-loading-hidden': !loading
        }"
        class="tray-loading">
        <div class="tray-loading-mask">
          <div class="tray-loading-line"></div>
        </div>
        <svg class="tray-loading-icon tray-icon-locked" viewBox="0 0 1024 1024">
          <!-- eslint-disable-next-line -->
          <path class="path1" d="M796.467 417.109v-132.642c0-155.58-128.956-284.467-284.467-284.467s-284.467 128.887-284.467 284.467v132.642c-64.444 0-113.801 49.289-113.801 113.801v379.29c0.068 64.444 49.289 113.801 113.801 113.801h568.866c64.444 0 113.801-49.289 113.801-113.801v-379.29c0.068-60.689-49.289-113.801-113.732-113.801zM265.489 284.399c0-136.533 109.978-246.511 246.511-246.511s246.511 109.978 246.511 246.511v132.71h-37.956v-132.71c0-113.801-94.822-208.623-208.623-208.623s-208.555 94.822-208.555 208.623v132.71h-37.956l0.068-132.71zM682.667 284.399v132.71h-341.333v-132.71c0-94.822 75.844-170.667 170.667-170.667s170.667 75.844 170.667 170.667zM872.311 568.798v75.844h-341.333v37.956h341.333v75.844h-341.333v37.956h341.333v75.844h-341.333v37.956h341.333c0 41.711-34.133 75.844-75.844 75.844h-568.866c-41.711 0-75.844-34.133-75.844-75.844v-379.221c0-41.711 34.133-75.844 75.844-75.844h568.866c41.711 0 75.844 34.133 75.844 75.844h-341.333v37.956l341.333-0.137z"></path>
        </svg>
      </section>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import store from './store';

import http from 'api-client';
import AppFacebookLogin from './components/FacebookLogin.vue';
import AppIdentification from './screens/Identification/Main.vue';
import AppLogin from './screens/Login/screens/Main.vue';
import AppOtpButton from './screens/Login/screens/Otp/Button.vue';
import AppCustomTexts from './components/CustomTexts.vue';
import screenHandler from '@/mixins/screenHandler';

export default {
  store,
  name: 'TrayLogin',
  components: {
    AppCustomTexts,
    AppFacebookLogin,
    AppIdentification,
    AppOtpButton,
    AppLogin,
  },
  mixins: [screenHandler],
  data() {
    return {
      loading: false,
      screen: 'Identification',
      showComponent: true,
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
    dataIdentification: {
      type: String,
      default: '',
    },
    dataMethods: {
      type: [String, Array],
      default() {
        return ['facebook', 'identify'];
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
  },
  beforeMount() {
    this.setBaseUrl(this.dataBaseUrl);

    this.setResolution(window.innerWidth);
    window.addEventListener('resize', () => {
      this.setResolution(window.innerWidth);
    });
  },
  mounted() {
    this.initialize(this.dataIdentification);
    this.getLangs({
      store_id: this.dataStore,
      endpoint: 'langs/login_component',
    }).then((response) => {
      this.setLang(response.data);
    });
  },

  watch: {
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
  },

  methods: {
    getLangs: http.getLangs,
    ...mapActions([
      'setBaseUrl',
      'setIdentification',
      'setLang',
      'setResolution',
    ]),

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
  },
};
</script>

<style lang="scss">
  @import './assets/sass/app.scss';
</style>
