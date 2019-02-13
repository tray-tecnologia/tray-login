<template>
  <div id="tray-login" class="tray-login" v-show="showComponent">
    <div class="tray-container">
      <button
        ref="close-button"
        class="tray-close"
        @click="this.close">
        X
      </button>

      <h1
        class="tray-title tray-login__title">
          Identifique - se
      </h1>

      <div class="tray-feedbacks" v-show="hasFeedback">
        <div class="tray-error-message">
          {{ errors[0] }}
        </div>
      </div>

      <app-identification
        v-if="false"
        :identification="email"
        :texts="texts.identify">
      </app-identification>

      <app-facebook-login
        v-if="facebookEnabled"
        :defaultActions="defaultActions"
        :identification="identification"
        :store="store"
        :session="session"
        :callback="callback">
      </app-facebook-login>

      <section class="tray-loading" v-show="isLoading">
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
import { mapState, mapActions } from 'vuex';
import store from './store';

import AppIdentification from './components/screens/Identification.vue';
import AppFacebookLogin from './components/FacebookLogin.vue';

export default {
  store,
  name: 'TrayLogin',
  components: {
    AppIdentification,
    AppFacebookLogin,
  },
  data() {
    return {
      showComponent: true,
    };
  },
  props: {
    callback: {
      type: String,
    },
    configurations: {
      type: [String, Array],
      default: '["defaultActions"]',
    },
    email: {
      type: String,
    },
    identification: {
      type: String,
    },
    methods: {
      type: [String, Array],
      default: '["facebook"]',
    },
    session: {
      type: String,
    },
    store: {
      type: String,
    },
    texts: {
      type: Object,
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
  computed: {
    ...mapState({
      errors: state => state.errors,
      isLoading: state => state.loading,
    }),

    /**
     * Verifica se existem feedbacks a serem exibidos;
     * @return {boolean}
     */
    hasFeedback() {
      return Boolean(this.errors.length);
    },

    /**
     * Verifica se o facebook o modulo de login com o facebook
     * deve ser exibido
     *
     * @return {boolean}
     */
    facebookEnabled() {
      return this.loginMethods.indexOf('facebook') !== -1;
    },

    /**
     * Retorna os métodos disponíveis para o login
     * @return {array}
     */
    loginMethods() {
      return this.parseArrayProperty('methods');
    },

    /**
     * Verifica se o componente deverá disparar as ações default
     * @return {boolean}
     */
    defaultActions() {
      return this.parseArrayProperty('configurations').indexOf('defaultActions') !== -1;
    },
  },
  methods: {
    ...mapActions(['setConfigurations']),

    /**
     * Fecha o componente
     */
    close() {
      this.showComponent = false;
      this.$emitEvent.custom({
        name: 'close',
        details: {
          type: 'click',
          action: 'close',
          element: this.$refs['close-button'],
        },
      });
    },

    /**
     * Realiza o parse das propriedades
     * @param {string} componentProperty
     * @returns {array}
     */
    parseArrayProperty(componentProperty) {
      if (!this[componentProperty] || typeof componentProperty !== 'string') {
        return [];
      }

      const properties = this[componentProperty].replace(/\s/g, '');

      try {
        return JSON.parse(properties);
      } catch (error) {
        return [];
      }
    },
  },
};
</script>

<style lang="scss">
  @import './assets/sass/app.scss';
</style>
