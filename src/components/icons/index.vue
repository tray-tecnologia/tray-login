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
import LockedLoading from './LockedLoadingIcon.vue';
import Visible from './VisibleIcon.vue';
import Hidden from './HiddenIcon.vue';
import Check from './CheckIcon.vue';
import Times from './TimesIcon.vue';
import CircleBordered from './CircleBordered.vue';

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
    LockedLoading,
    Visible,
    Hidden,
    Check,
    Times,
    CircleBordered,
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
