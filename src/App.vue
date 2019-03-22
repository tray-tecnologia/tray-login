<template>
  <div id="tray-login" class="tray-login" ref="tray-login" v-show="showComponent">
    <div class="tray-container">
      <button class="tray-close"
        @click="close">
        X
      </button>
      <app-identification v-if="screen === 'Identification'"
        :callback="callback"
        :params="params"
        :texts="texts.identify">

        <app-facebook-login v-if="facebookEnabled"
          :callback="callback"
          :defaultActions="defaultActions"
          :params="params"
          slot="app-facebook-login">
        </app-facebook-login>
      </app-identification>

      <app-login v-if="screen === 'Main'"
        :callback="callback"
        :defaultActions="defaultActions"
        :params="params"
        :texts="texts.identify">

        <app-facebook-login v-if="facebookEnabled"
          :callback="callback"
          :defaultActions="defaultActions"
          :params="params"
          slot="app-facebook-login">
        </app-facebook-login>

        <button v-if="identificationEnabled"
          class="tray-btn-default"
          @click="reset"
          slot="back-step">
          Voltar
        </button>
      </app-login>

      <section v-if="screen === 'Blocked'">
        <header>
          <strong class="tray-title tray-login__title">
            {{ texts['main-title'] || 'Autenticação' }}
          </strong>
          <p class="tray-action tray-error-message">
            {{
              texts['blocked-user'] ||
              'Por motivos de segurança bloqueamos o acesso por e-mail e senha durante 60 minutos.'
            }}
          </p>
        </header>

        <p class="tray-action">
          {{ texts['main-action'] || 'Não foi possível verificar seu cadastro, tente novamente.' }}
        </p>
        <app-facebook-login v-if="facebookEnabled"
          :callback="callback"
          :defaultActions="defaultActions"
          :params="params"
          slot="app-facebook-login">
        </app-facebook-login>

        <button v-if="identificationEnabled"
          class="tray-btn-default"
          @click="reset"
          slot="back-step">
          Voltar
        </button>
      </section>

      <section class="tray-loading" v-show="loading">
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
import { mapActions } from 'vuex';
import store from './store';

import AppFacebookLogin from './components/FacebookLogin.vue';
import AppIdentification from './screens/Identification/Main.vue';
import AppLogin from './screens/Login/screens/Main.vue';
import screenHandler from '@/mixins/screenHandler';

export default {
  store,
  name: 'TrayLogin',
  components: {
    AppFacebookLogin,
    AppIdentification,
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
    callback: {
      type: String,
      default: '/',
    },
    configurations: {
      type: [String, Array],
      default() {
        return ['default_actions'];
      },
    },
    identification: {
      type: String,
      default: '',
    },
    methods: {
      type: [String, Array],
      default() {
        return ['facebook', 'identify'];
      },
    },
    session: {
      type: String,
      default: '',
    },
    store: {
      type: String,
      default: '',
    },
    texts: {
      type: [Object],
      default() {
        return {
          // identify screen
          'identify-title': 'Identifique-se',
          'identify-input': 'E-mail ou CPF/CNPJ (números)',
          'identify-error-not-found': 'Não foi possível verificar seu cadastro, tente novamente.',
          'identify-button': 'Continuar',
          // errors
          'identify-data-invalid': 'Dados inv&aacute;lidos, digite novamente!',
          'identify-error': 'N&atilde;o foi poss&iacute;vel verificar seu cadastro, tente novamente.',
          'identify-not-found': 'Usu&aacute;rio n&atilde;o encontrado, fa&ccedil;a seu cadastro.',
          'invalid-code': 'Autenticação incorreta.',
          // main screen
          'main-title': 'Autenticação',
          'main-action': 'Escolha uma das opções para se identificar:',
          'main-separator': 'ou utilize uma das opções abaixo',
          // password screen
          'password-title': 'E-mail e senha da loja',
          'password-button': 'E-mail e senha da loja',
          'password-button-cpf': 'CPF e senha da loja',
          'password-button-cnpj': 'CNPJ e senha da loja',
          'password-action': 'Informe sua senha.',
          'password-hide': 'Ocultar',
          'password-show': 'Mostrar',
          'password-input-label': 'Senha',
          'password-forget': 'Esqueci ou não tenho senha',
          // opt screen
          'otp-title': 'Código de Segurança',
          'otp-action': 'Informe o código de segurança que enviamos para seu e-mail.',
          'otp-receive': 'Receber código de segurança por e-mail',
          'otp-input-label': 'Código de segurança',
          // new password screen
          'new-password-label': 'Nova senha',
          'new-password-title': 'Cadastre uma nova senha',
          'new-password-action': 'Você receberá um código de segurança em seu e-mail para validar sua nova senha.',
          'new-password-submit': 'Salvar nova senha e continuar',
          'new-password-code-submit': 'Enviar codigo de segurança',
          // general texts
          'other-option': 'Escolher outra opção',
          'go-back': 'Voltar',
          proceed: 'Continuar',
          // Blocked Screen
          'blocked-user': 'Por motivos de segurança bloqueamos o acesso por e-mail e senha durante 60 minutos.',
          'invalid-password': 'A nova senha deve possuir no mínimo 6 caracteres',
        };
      },
    },
  },

  mounted() {
    this.initialize(this.identification);
  },

  watch: {
    identification(identification) {
      this.initialize(identification);
    },
  },

  computed: {
    /**
     * Verifica se as ações padrão da plataforma devem ser disparadas
     *
     * @return {boolean}
     */
    defaultActions() {
      return this.configurations.indexOf('default_actions') !== -1;
    },

    /**
     * Verifica se o login com o facebook será utilizado
     *
     * @return {boolean}
     */
    facebookEnabled() {
      return this.methods.indexOf('facebook') !== -1;
    },

    /**
     * Verifica se o modulo de identificação será utilizado
     *
     * @return {boolean}
     */
    identificationEnabled() {
      return this.methods.indexOf('identify') !== -1;
    },

    /**
     * Parametros que são utilizados em praticamente todas as requests
     * para uma api da plataforma
     * @return {object}
     */
    params() {
      return {
        session_id: this.session,
        store_id: this.store,
      };
    },
  },

  methods: {
    ...mapActions([
      'setIdentification',
    ]),

    /**
     * Define a tela a ser exibida de acordo com a identificação
     * definidas
     *
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
      this.$emitEvent.custom({
        name: 'close',
        details: {
          action: 'close',
          element: event.target,
          type: event.type,
        },
      });

      const trayLogin = document.querySelector('tray-login');
      if (trayLogin && this.defaultActions) {
        trayLogin.style.display = 'none';
      }
    },

    /**
     * Reseta o componente para que um novo login
     * seja realizado
     * @param {event}
     */
    reset(event) {
      this.$emitEvent.custom({
        name: 'reset',
        details: {
          action: 'reset',
          element: event.target,
          type: event.type,
        },
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
