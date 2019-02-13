<template>
  <div id="tray-login-identify" class="tray-login__identify">
    <h1>
      {{ title }}
    </h1>
    <form action='POST' @submit.prevent="onSubmit">
      <input type="email" placeholder="Digite seu e-mail" class="tray-login__input"/>
      <button type="submit" class="tray-login__buton">Continuar</button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'AppIdentify',
  data() {
    return {
      title: 'Identifique-se',
    };
  },
  methods: {
    onSubmit() {
      this.title = 'Ué ...';
    },
  },
};
</script>
