<template>
  <section id="tray-login-identify" class="tray-login__identify">
    <header>
      <strong class="tray-title tray-login__title">
        {{ texts.title }}
      </strong>
      <p class="tray-action">{{ texts.action }}</p>
      <label class="tray-well">
        {{ identification }}
      </label>
    </header>
    <app-new-password
      :params="newPasswordParams">
    </app-new-password>
  </section>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex';
import AppNewPassword from './screens/New.vue';

export default {
  name: 'AppRecoverPassword',
  components: {
    AppNewPassword,
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
    texts: {
      type: Object,
      default() {
        return {
          title: 'Recuperação de senha',
          action: 'Você receberá um código de segurança em seu e-mail para validar sua nova senha.',
          errors: {
            'invalid-password': 'A nova senha deve possuir no mínimo 6 caracteres.',
          },
        };
      },
    },
  },
  computed: {
    ...mapState([
      'identification',
    ]),

    ...mapGetters(['identificationType']),

    /**
     * Retorna os parâmetros necessários para identificar
     * @return {object}
     */
    newPasswordParams() {
      const params = {
        ...this.params,
        identification: this.identification,
        [this.identificationType]: this.identification,
      };

      return params;
    },
  },
  mounted() {
    this.clearErrors();
  },
  methods: {
    ...mapActions([
      'clearErrors',
    ]),
  },
};
</script>
