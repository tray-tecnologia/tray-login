<template>
  <button
    ref="facebook-button"
    class="tray-btn-facebook"
    @click="$emitEvent.click('tray-login-facebook'), doFacebookLogin($event)"
    @mouseover="removeIconColors = true"
    @mouseleave="removeIconColors = false"
  >
    <figure class="tray-button-icon">
      <svg width="10" height="18" viewBox="0 0 10 18">
        <path
          d="M9.18812 10.1249L9.68819 6.86749H6.56238V4.75361C6.56238 3.86261 6.99887
          2.99355 8.39894 2.99355H9.81981V0.220426C9.81981 0.220426 8.53056 0.000488281
          7.29756 0.000488281C4.72356 0.000488281 3.04112 1.56086 3.04112
          4.38518V6.86805H0.179688V10.1255H3.04112V18.0005H6.56238V10.1255L9.18812 10.1249Z"
          :fill="removeIconColors ? '#FFFFFF' : '#1877F2'"
        />
      </svg>
    </figure>

    <p>Fazer login com o Facebook</p>
  </button>
</template>

<script>
import client from 'api-client';
import utils from '@/mixins/utils';

export default {
  name: 'AppFacebookLogin',
  mixins: [utils],
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
      default: 'facebook/url',
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
      removeIconColors: false,
    };
  },

  computed: {
    /**
     * Verifica se o tamanho da variavél de callback é maior que 0
     * @return {bool}
     */
    hasCallback() {
      return this.callback.length > 0;
    },

    /**
     * Formata os parametros recebidos pelo callbackPost
     * @return {string}
     */
    urlParams() {
      return Object.entries(this.formatedParams).map(([key, val]) => `${key}=${val}`).join('&');
    },

    /**
     * Adiciona aos parametros um index de facebook e remove o token antigo
     * @return {object}
     */
    formatedParams() {
      const objectParams = JSON.parse(this.callbackPost);
      objectParams.social = '1';

      if (this.hasTokenInParams(objectParams)) {
        delete objectParams.token;
      }

      return objectParams;
    },

  },

  methods: {
    facebookLogin: client.facebookLogin,

    /**
     * Valida se há token no objeto de parametros
     * @param {object} objectParams objeto com os parametros de post
     * @return {bool}
     */
    hasTokenInParams(objectParams) {
      return Object.prototype.hasOwnProperty.call(objectParams, 'token');
    },

    /**
     * Realiza o login com o facebook
     * @param {event} event
     */
    doFacebookLogin(event, payload = {
      ...this.params,
      callback: this.urlCallback(),
      endpoint: 'facebook/url',
      crossdm: encodeURIComponent(document.location.origin),
    }) {
      this.$parent.setLoading(true);
      this.facebookLogin(payload).then((response) => {
        this.$emitEvent.login({
          response,
          type: 'success',
          method: 'facebook',
        });

        const { url } = response.data.data;
        window.location = url;

        return response;
      }).catch((error) => {
        this.$emitEvent.login({
          response: error,
          type: 'error',
          method: 'facebook',
        });

        this.$parent.setLoading(false);

        return error;
      });
    },

    /**
     * Retorna a URL de callback
     * @return {string}
     */
    urlCallback() {
      return this.hasCallback ? this.callback : this.urlCallbackPost();
    },

    /**
     * Retorna a URL de callback com os parametros do callbackPost
     * @return {string}
     */
    urlCallbackPost() {
      localStorage.setItem('jwtToken', 'false');
      return `${document.location.origin}${this.homePath}/login?${this.urlParams}`;
    },
  },
};
</script>
