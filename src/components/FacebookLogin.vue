<template>
  <button
    ref="facebook-button"
    class="tray-btn-facebook"
    @click="$emitEvent.click('tray-login-facebook'), doFacebookLogin($event)">
      Facebook
  </button>
</template>

<script>
import client from 'api-client';

export default {
  name: 'AppFacebookLogin',
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

  computed: {
    /**
     * Verifica se há tem callback tem tamanho
     * @return {bool}
     */
    hasCallback() {
      return this.callback.length > 0;
    },

    /**
     * Formata os parametros recebidos pelo callbackPost
     */
    urlParams() {
      let objectParams = JSON.parse(this.callbackPost);
      objectParams.facebook = '1';
      objectParams = Object.keys(objectParams).filter(item => item !== 'token');

      return Object.entries(objectParams).map(([key, val]) => `${key}=${val}`).join('&');
    },
  },

  methods: {
    facebookLogin: client.facebookLogin,

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

        const url = response.data.data.url.replace('\/', '/');
        window.location = url;

        this.$parent.setLoading(false);

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
      return `${document.location.origin}/stg1-my-account/login?${this.urlParams}`;
    },
  },
};
</script>
