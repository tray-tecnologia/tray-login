<template>
  <div id="tray-login" class="tray-login">
    <div class="tray-login__container">
      <h1
        class="tray-login__title">
          Identifique - se
      </h1>

      <div class="tray-login__feedbacks" v-show="hasFeedback">
        <div class="tray-login__feedbacks__feedback tray-login__feedbacks__feedback--error">
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
        :identification="identification"
        :store="store"
        :session="session"
        :callback="callback">
      </app-facebook-login>

      <section v-show="isLoading">
        CARREGANDO ...
      </section>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
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
  props: {
    callback: {
      type: String,
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
      const { methods } = this;

      if (typeof methods === 'string') {
        try {
          return JSON.parse(methods);
        } catch (error) {
          return [];
        }
      }

      return methods;
    },
  },
};
</script>

<style lang="scss">
  @import './assets/sass/app.scss';
</style>
