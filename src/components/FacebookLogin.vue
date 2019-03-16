<template>
  <button
    ref="facebook-button"
    class="tray-btn-facebook"
    @click="doFacebookLogin">
      Facebook
  </button>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'AppFacebookLogin',
  props: {
    callback: {
      type: String,
      default: '',
    },
    defaultActions: {
      type: Boolean,
      default: true,
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
    ...mapActions([
      'facebookLogin',
      'setLoading',
      'setError',
    ]),

    /**
     * Realiza o login com o facebook
     * @param {event} event
     */
    doFacebookLogin(event, payload = {
      ...this.params,
      callback: this.callback,
      endpoint: 'facebook/url',
      crossdm: encodeURIComponent(document.location.origin),
    }) {
      this.setLoading(true);

      this.$emitEvent.action({
        action: 'facebook-login',
        element: event.target,
        type: event.type,
      });

      this.facebookLogin(payload).then((response) => {
        this.$emitEvent.login({
          response,
          type: 'success',
          method: 'facebook',
        });

        if (this.defaultActions) {
          window.location = response.data.data.url;
        }

        this.setLoading(false);

        return response;
      }).catch((error) => {
        this.$emitEvent.login({
          response: error,
          type: 'error',
          method: 'facebook',
        });

        this.setLoading(false);

        throw error;
      });
    },
  },
};
</script>
