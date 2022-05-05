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

  methods: {
    facebookLogin: client.facebookLogin,

    /**
     * Realiza o login com o facebook
     * @param {event} event
     */
    doFacebookLogin(event, payload = {
      ...this.params,
      callback: this.urlCallbackPost(),
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
     * Retorna a URL de callback com os
     * parametros do callbackPost
     * @return {string}
     */
    urlCallbackPost() {
      const objectParams = JSON.parse(this.callbackPost);
      objectParams.facebook = true;
      const urlParams = Object.entries(objectParams).map(([key, val]) => `${key}=${val}`).join('&');
      return `${document.location.origin}/my-account/login?${urlParams}`;
    },
  },
};
</script>
