<template>
  <form method="POST" class="tray-login__recover-password__login" @submit.prevent="submit">
    <header>
      <h1 class="tray-title tray-login__recover-password__login__title">
        Senha cadastrada com sucesso!
      </h1>
    </header>
    <button class="tray-btn-primary"
      type="submit">
      Continuar
    </button>
    <section class="tray-loading" v-show="loading">
      <div class="tray-loading-mask">
        <div class="tray-loading-line"></div>
      </div>
      <svg class="tray-loading-icon tray-icon-locked" viewBox="0 0 1024 1024">
        <!-- eslint-disable-next-line -->
        <path class="path1" d="M796.467 417.109v-132.642c0-155.58-128.956-284.467-284.467-284.467s-284.467 128.887-284.467 284.467v132.642c-64.444 0-113.801 49.289-113.801 113.801v379.29c0.068 64.444 49.289 113.801 113.801 113.801h568.866c64.444 0 113.801-49.289 113.801-113.801v-379.29c0.068-60.689-49.289-113.801-113.732-113.801zM265.489 284.399c0-136.533 109.978-246.511 246.511-246.511s246.511 109.978 246.511 246.511v132.71h-37.956v-132.71c0-113.801-94.822-208.623-208.623-208.623s-208.555 94.822-208.555 208.623v132.71h-37.956l0.068-132.71zM682.667 284.399v132.71h-341.333v-132.71c0-94.822 75.844-170.667 170.667-170.667s170.667 75.844 170.667 170.667zM872.311 568.798v75.844h-341.333v37.956h341.333v75.844h-341.333v37.956h341.333v75.844h-341.333v37.956h341.333c0 41.711-34.133 75.844-75.844 75.844h-568.866c-41.711 0-75.844-34.133-75.844-75.844v-379.221c0-41.711 34.133-75.844 75.844-75.844h568.866c41.711 0 75.844 34.133 75.844 75.844h-341.333v37.956l341.333-0.137z"></path>
      </svg>
    </section>
  </form>
</template>

<script>
import http from 'api-client';
import screenHandler from '@/mixins/screenHandler';
import utils from '@/mixins/utils';

export default {
  name: 'AppRecoverPasswordLogin',
  mixins: [utils, screenHandler],
  props: {
    endpoint: {
      type: String,
      default: 'password',
    },
    callback: {
      type: String,
      default: '',
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
          this.$emitEvent.login({
            response,
            method: 'password',
            type: 'success',
          });

          if (this.callback) {
            const { token } = response.data;
            this.redirect(this.callback, token);
            return;
          }

          this.setLoading(false);
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
