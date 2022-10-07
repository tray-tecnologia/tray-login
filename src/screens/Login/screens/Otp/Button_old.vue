<template>
  <form method='POST' @submit.prevent="submit" id="form-otp">
    <button
      id="tray-login-otp"
      type="submit"
      slot="app-otp-login"
      class="tray-btn-otp"
      @click="$emitEvent.custom('generate-security-code')">
      {{ $lang['otp-receive'] }}
    </button>
  </form>
</template>

<script>
import http from 'api-client';
import screenHandler from '@/mixins/screenHandler';
import { mapState, mapGetters } from 'vuex';

export default {
  mixins: [screenHandler],

  props: {
    callback: {
      type: String,
      default: '',
    },
    endpoint: {
      type: String,
      default: 'generate-security-code',
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
    ...mapState(['identification']),
    ...mapGetters(['identificationType']),
  },

  methods: {
    generateSecurityCode: http.generateSecurityCode,

    /**
       * Gera um token de segurança
       * @param {object} event
       * @param {object} payload
       */
    submit(event, payload = {
      ...this.params,
      endpoint: this.endpoint,
      identification: this.identification,
      [this.identificationType]: this.identification,
    }) {
      this.$parent.setLoading(true);
      this.generateSecurityCode(payload).then((response) => {
        this.$emitEvent.custom('generate-security-code', { response });
        this.$parent.setLoading(false);
        this.$parent.setScreen('Otp');
      }).catch((error) => {
        this.$emitEvent.custom('generate-security-code', { error });
        const { message = this.$lang['invalid-code'] } = error.data;
        this.$parent.setError(message);
        this.$parent.setLoading(false);
      });
    },
  },
};
</script>
