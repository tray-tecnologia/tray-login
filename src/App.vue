<template>
  <div id="tray-login" class="tray-login">
    <div class="tray-login__container">
      <h1 class="tray-login__title">{{ this.lang['identify-title'] }}</h1>
      <app-identify :title="this.lang['identify-title']" v-if="false"></app-identify>
      <button class="tray-login__button tray-login__button--facebook"
        @click="facebookLogin">
        Facebook
      </button>
      <div class="tray-login__feedbacks" v-show="feedback">
        <div class="tray-login__feedbacks__feedback tray-login__feedbacks__feedback--error">
          {{ feedback }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AppIdentify from './components/Identify.vue';

export default {
  name: 'app',
  components: {
    AppIdentify,
  },
  props: {
    lang: {
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
    callback: {
      type: String,
    },
    session: {
      type: String,
    },
    store: {
      type: String,
    },
    methods: {
      type: [String, Array],
    },
  },
  data() {
    return {
      feedback: '',
    };
  },
  methods: {
    /**
     * Realiza o login utilizando a API do facebook
     * @param
     */
    facebookLogin() {
      const params = {
        store_id: this.store,
        session_id: this.session,
        callback: this.callback,
      };

      console.log('po', this, this.$http);
      this.$http.get('facebook/url', { params }).then((response) => {
        window.location = response.data.url;
      }).catch(() => {
        this.feedback = 'Não foi possível verificar seu cadastro, tente novamente.';
      });
    },
  },
};
</script>

<style lang="scss">
  @import './assets/sass/app.scss';
</style>
