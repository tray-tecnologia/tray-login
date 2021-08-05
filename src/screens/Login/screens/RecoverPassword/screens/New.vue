<template>
  <app-register
    :identification="this.identification"
    :identificationType="this.identificationType"
    :params="this.params"
    :title="this.$store.state.lang['new-password-title']"
    :paragraph="this.$store.state.lang['new-password-code'] +
    (maskedEmail || this.identification) + this.$store.state.lang['new-password-create']"
    :icon="'userPassword'"
    :button1="this.$store.state.lang['new-password-submit']"
    :button2 ="this.$store.state.lang['other-option']"
    :hasEmail="false"
  />
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import client from 'api-client';
import AppRegister from '../../../../../components/Register.vue';

export default {
  mounted() {
    const isValidDocument = this.identificationType !== 'email';
    if (isValidDocument) {
      this.getUserMaskedMail();
    }
  },
  data() {
    return {
      maskedEmail: '',
    };
  },
  components: {
    AppRegister,
  },
  props: {
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
    ...mapGetters(['identificationType']),
    ...mapState([
      'identification',
    ]),
  },
  methods: {
    getMaskedEmail: client.getMaskedEmail,
    updatePassword: client.updatePassword,
    ...mapActions('Login/RecoverPassword', {
      setPassword: 'setPassword',
      nextStep: 'setScreen',
    }),

    /**
     * Recupera o email mascarado do cliente a partir do CPF
     * @param {object} payload os parâmetros enviados para o endpoint
     * @return {undefined}
     */
    getUserMaskedMail(payload = {
      ...this.params,
      endpoint: 'retrieve-masked-email',
      identification: this.identification,
      [this.identificationType]: this.identification,
    }) {
      this.getMaskedEmail(payload).then((response) => {
        this.maskedEmail = response.data.data.responseData.maskedEmail;
      }).catch((error) => {
        throw error;
      });
    },
  },
};
</script>
