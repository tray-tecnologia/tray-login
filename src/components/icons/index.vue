<template>
  <component :is="name" v-bind="$props" />
</template>

<script>
import Google from './GoogleIcon.vue';
import Facebook from './FacebookIcon.vue';
import Key from './KeyIcon.vue';

export default {
  name: 'IconFactory',

  components: {
    Google,
    Facebook,
    Key,
  },

  props: {
    name: {
      default: '',
      required: true,
      type: String,
    },

    removeColors: {
      default: false,
      require: false,
      type: Boolean,
    },
  },
};
</script>
