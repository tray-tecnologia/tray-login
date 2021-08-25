<template>
  <section id="new-password-screen" class="tray-login__recover-password">
    <app-new-password v-if="screen == 'New'"
      :identification="identification"
      :identificationType="identificationType"
      :params="this.params"
      :callback="callback"
      :password="this.password">
    </app-new-password>
  </section>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import AppNewPassword from './New.vue';

export default {
  name: 'AppRecoverPassword',
  components: {
    AppNewPassword,
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
