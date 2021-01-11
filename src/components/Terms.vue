<template>
  <div v-html="termText" class="tray-login__terms-container"></div>
</template>
<script>

export default {
  name: 'AppTerms',
  props: {
    termText: {
      type: String,
      default: '',
    },
  },
};
</script>
