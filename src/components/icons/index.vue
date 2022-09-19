<template>
  <component :is="name" v-bind="$props" />
</template>

<script>
import Close from './CloseIcon.vue';
import Google from './GoogleIcon.vue';
import Facebook from './FacebookIcon.vue';
import Key from './KeyIcon.vue';
import Email from './EmailIcon.vue';
import Document from './DocumentIcon.vue';
import Locked from './LockedIcon.vue';
import Visible from './VisibleIcon.vue';
import Hidden from './HiddenIcon.vue';
import Check from './CheckIcon.vue';

export default {
  name: 'IconFactory',

  components: {
    Close,
    Google,
    Facebook,
    Key,
    Email,
    Document,
    Locked,
    Visible,
    Hidden,
    Check,
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
