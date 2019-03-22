<template>
  <section id="tray-login-identify" class="tray-login__identify">
    <app-new-password v-if="screen == 'New'"
      :params="this.params">
    </app-new-password>
    <section v-if="screen == 'ConfirmCode'">
      <h1>EM CONSTRUÇÃO</h1>
    </section>
  </section>
</template>

<script>
import AppNewPassword from './New.vue';
import screenHandler from '@/mixins/screenHandler';

export default {
  name: 'AppRecoverPassword',
  components: {
    AppNewPassword,
  },
  mixins: [screenHandler],
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
    texts: {
      type: Object,
      default() {
        return {
          'main-action': '',
        };
      },
    },
  },
  data() {
    return {
      screen: 'New',
    };
  },
};
</script>
