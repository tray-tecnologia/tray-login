<template>
  <form method='POST' @submit.prevent="submit" id="form-otp">
    <button
      id="tray-login-otp"
      type="submit"
      slot="app-otp-login"
      class="tray-btn-otp"
      @click="$emitEvent.custom('generate-security-code')"
    >
      <figure class="tray-button-icon">
        <svg class="tray-icon-key" height="12" width="18" viewBox="0 0 20 12">
          <path
            d="M10.5909 4.16667C9.84545 2.03083 7.82727 0.5 5.45455 0.5C2.44545 0.5 0 2.96583
            0 6C0 9.03417 2.44545 11.5 5.45455 11.5C7.82727 11.5 9.84545 9.96917 10.5909
            7.83333H14.5455V11.5H18.1818V7.83333H20V4.16667H10.5909ZM5.45455 7.83333C4.45455 7.83333
            3.63636 7.00833 3.63636 6C3.63636 4.99167 4.45455 4.16667 5.45455 4.16667C6.45455
            4.16667 7.27273 4.99167 7.27273 6C7.27273 7.00833 6.45455 7.83333 5.45455 7.83333Z"
          />
        </svg>
      </figure>

      <p>{{ $lang['otp-receive'] }}</p>
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
