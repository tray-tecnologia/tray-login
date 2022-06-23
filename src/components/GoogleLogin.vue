<template>
  <button
    ref="google-button"
    class="tray-btn-google"
    @click="$emitEvent.click('tray-login-google'), doGoogleLogin($event)">
      Google
  </button>
</template>

<script>
import client from 'api-client';
import utils from '@/mixins/utils';

export default {
  name: 'AppGoogleLogin',
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
      default: 'login/google/url',
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
     * Adiciona aos parametros um index de google
     * @return {object}
     */
    formatedParams() {
      const objectParams = JSON.parse(this.callbackPost);
      objectParams.google = '1';
      return objectParams;
    },

  },

  methods: {
    googleLogin: client.googleLogin,

    /**
     * Realiza o login com o google
     * @param {event} event
     * @returns {Promise}
     */
    doGoogleLogin(event, payload = {
      ...this.params,
      callback: this.urlCallback(),
      endpoint: 'login/google/url',
    }) {
      this.$parent.setLoading(true);
      this.googleLogin(payload).then((response) => {
        this.$emitEvent.login({
          response,
          type: 'success',
          method: 'google',
        });

        const { url } = response.data.data;
        window.location = url;

        return response;
      }).catch((error) => {
        this.$emitEvent.login({
          response: error,
          type: 'error',
          method: 'google',
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
      return `${document.location.origin}${this.homePath}/login?${this.urlParams}`;
    },
  },
};
</script>
