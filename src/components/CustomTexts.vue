<template>
  <p class="tray-action">
    <span class="tray-custom-text tray-input-invalid"
      v-html="error">
    </span>
    <span class="tray-custom-text"
      v-html="action">
    </span>
  </p>
</template>
<script>

export default {
  name: 'AppCustomTexts',
  props: {
    action: {
      type: String,
      default: '',
    },
    error: {
      type: String,
      default: '',
    },
  },
};
</script>
