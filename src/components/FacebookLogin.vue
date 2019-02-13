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
    callback: String,
    defaultActions: Boolean,
    endpoint: {
      type: String,
      default: 'facebook/url',
    },
    identification: String,
    session: String,
    store: String,
  },
  methods: {
    ...mapActions([
      'facebookLogin',
    ]),

    /**
     * Realiza o login com o facebook
     */
    doFacebookLogin() {
      const payload = {
        callback: this.callback,
        crossdm: encodeURIComponent(document.location.origin),
        endpoint: this.endpoint,
        identification: this.identification,
        store_id: this.store,
        session_id: this.session,
      };

      this.$emitEvent.action({
        type: 'click',
        action: 'facebook-login',
        element: this.$refs['facebook-button'],
      });

      this.facebookLogin(payload).then((response) => {
        this.$emitEvent.login({
          response,
          type: 'success',
          method: 'facebook',
        });

        if (this.defaultActions) {
          console.log(response);
          window.location = response.data.url;
        }
      }).catch((error) => {
        this.$emitEvent.login({
          response: error,
          type: 'error',
          method: 'facebook',
        });
      });
    },
  },
};
</script>
