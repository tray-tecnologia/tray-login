<template>
  <form method="POST" class="tray-login__recover-password__login" @submit.prevent="submit">
    <div>
      <h1 class="tray-title tray-title--center tray-login__recover-password__login__title">
        {{ $lang['new-password-success'] }}
      </h1>
    </div>
    <button class="tray-btn-primary"
      type="submit">
      {{ $lang['proceed'] }}
    </button>
    <section class="tray-loading" v-show="loading">
      <div class="tray-loading-mask">
        <div class="tray-loading-line"></div>
      </div>

      <icon name="locked-loading" />
    </section>
  </form>
</template>

<script>
import http from 'api-client';
import screenHandler from '@/mixins/screenHandler';
import utils from '@/mixins/utils';
import Icon from '@/components/icons/index.vue';

export default {
  name: 'AppRecoverPasswordLogin',
  mixins: [utils, screenHandler],
  components: { Icon },
  props: {
    endpoint: {
      type: String,
      default: 'password',
    },
    callback: {
      type: String,
      default: '',
    },
    callbackPost: {
      type: String,
      default: '/',
    },
    identification: {
      type: String,
      default: '',
    },
    identificationType: {
      type: String,
      default: '',
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
    password: {
      type: String,
      default: '',
    },
  },

  computed: {
    /**
     * Valida se o callbackPost é diferente de "/"
     * @return {bool}
     */
    hasCallbackPost() {
      return this.callbackPost !== '/';
    },
  },

  methods: {
    passwordLogin: http.passwordLogin,
    /**
     * Realiza o login
     */
    submit(event, payload = {
      ...this.params,
      endpoint: this.endpoint,
      identification: this.identification,
      [this.identificationType]: this.identification,
      password: this.password,
    }) {
      this.setLoading(true);
      this.passwordLogin(payload)
        .then((response) => {
          const { token: tokenPassword } = response.data.data;
          this.$emitEvent.login({
            response,
            method: 'password',
            type: 'success',
          });

          if (this.hasCallbackPost) {
            this.mixinCallbackLogin(this.callbackPost, tokenPassword, this.callback);
            return response;
          }

          if (this.callback) {
            const { token = '' } = response.data.data;
            this.redirect(this.callback, token);
            return response;
          }

          this.setLoading(false);
          return response;
        }).catch((error) => {
          this.$emitEvent.login({
            response: error,
            method: 'password',
            type: 'error',
          });

          this.setLoading(false);
        });
    },
  },
};
</script>
