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
      callback: `${document.location.origin}/my-account`,
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

        window.location = response.data.data.url;

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
  },
};
</script>
