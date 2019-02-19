<template>
  <div id="tray-login-identify" class="tray-login__identify">
    <h1>
      {{ title }}
    </h1>
    <form action='POST' @submit.prevent="onSubmit">
      <input type="email" placeholder="Digite seu e-mail" class="tray-login__input"/>
      <button type="submit" class="tray-login__buton">Continuar</button>
      <br/><br/>
      {{ feedback }}
    </form>
  </div>
</template>

<script>
export default {
  name: 'AppIdentify',
  props: {
    title: {
      default: 'Identifique-se',
      type: String,
    },
  },
  data() {
    return {
      feedback: '',
    };
  },
  methods: {
    onSubmit() {
      this.feedback = 'Enviando ...';
      setTimeout(() => {
        this.feedback = '';
      }, 600);
    },
  },
};
</script>
