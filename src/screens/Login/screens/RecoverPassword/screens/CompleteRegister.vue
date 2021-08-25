<template>
  <app-register
    :identification="identification"
    :identificationType="identificationType"
    :params="this.params"
    :title="this.$store.state.lang['registration-title']"
    :paragraph="this.$store.state.lang['registration-action']"
    :icon="'documentUser'"
    :button1="this.$store.state.lang['registration-button']"
    :hasEmail="true"
  />
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import AppRegister from '@/components/Register.vue';

export default {
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
    callback: {
      type: String,
      default: '/',
    },
  },
  computed: {
    ...mapGetters(['identificationType']),
    ...mapState([
      'identification',
    ]),
  },
};
</script>
