<template>
  <button class="tray-login__button tray-login__button--facebook" @click="doFacebookLogin">
      Facebook
  </button>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'AppFacebookLogin',
  props: {
    endpoint: {
      type: String,
      default: 'facebook/url',
    },
    callback: {
      type: String,
    },
    identification: {
      type: String,
    },
    session: {
      type: String,
    },
    store: {
      type: String,
    },
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

      this.facebookLogin(payload);
    },
  },
};
</script>
