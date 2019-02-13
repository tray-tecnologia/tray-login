<template>
  <section id="tray-login-identify" class="tray-login__identify">
    <h1 class="tray-login__title">
      {{ texts.title }}
    </h1>
    <form action='POST' @submit.prevent="onSubmit">
      <input type="email" placeholder="Digite seu e-mail" class="tray-login__input" disabled/>
      <button
        class="tray-login__button tray-login__button--primary"
        type="submit"
        disabled>
        Continuar
      </button>
      <small class="tray-login__feedback">
      </small>
    </form>
  </section>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'AppIdentify',
  props: {
    identification: {
      type: [String, Number],
    },
    texts: {
      type: Object,
      default() {
        return {
          title: 'Identifique-se',
        };
      },
    },
  },
  methods: {
    ...mapActions(['setGeneralLoading']),

    /**
     * Envia os dados
     */
    onSubmit() {
      // eslint-disable-next-line
      console.info('Em construção');
    },
  },
};
</script>
