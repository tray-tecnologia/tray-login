<template>
  <section id="tray-login__recover-password" class="tray-login__recover-password">
    <app-new-password v-if="screen == 'New'"
      :identification="identification"
      :identificationType="identificationType"
      :params="this.params">
    </app-new-password>
    <app-confirm-code v-if="screen == 'ConfirmCode'"
      :identification="identification"
      :identificationType="identificationType"
      :params="this.params"
      :password="this.password">
    </app-confirm-code>
    <app-recover-password-login v-if="screen === 'Login'"
      :callback="callback"
      :identification="identification"
      :identificationType="identificationType"
      :params="this.params"
      :password="this.password">
    </app-recover-password-login>
  </section>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import AppNewPassword from './New.vue';
import AppConfirmCode from './ConfirmCode.vue';
import AppRecoverPasswordLogin from './Login.vue';

export default {
  name: 'AppRecoverPassword',
  components: {
    AppNewPassword,
    AppConfirmCode,
    AppRecoverPasswordLogin,
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
    callback: {
      type: String,
      default: '/',
    },
  },
  mounted() {
    this.$emitEvent.custom('recovery-password');
  },
  computed: {
    ...mapState([
      'identification',
    ]),

    ...mapGetters(['identificationType']),
    ...mapState('Login/RecoverPassword', [
      'screen',
      'password',
    ]),
  },
};
</script>
