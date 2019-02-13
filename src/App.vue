<template>
  <div id="tray-login" class="tray-login">
    <app-identify></app-identify>
  </div>
</template>

<script>
import AppIdentify from './components/Identify.vue';

export default {
  name: 'app',
  components: {
    AppIdentify,
  },

  beforeCreate() {
    console.log('123');
  },
};
</script>

<style lang="scss">
  @import './assets/sass/app.scss';
</style>
