<template>
  <section id="tray-login-identify" class="tray-login__identify">
    <header>
      <strong class="tray-title tray-login__title">
        {{ texts.title }}
      </strong>
    </header>
    <form method='POST' @submit.prevent="submit">
      <fieldset class="tray-input-group">
        <label for="input-email">
          <figure class="tray-input-icon">
            <!-- eslint-disable-next-line -->
            <svg class="tray-icon-mail" viewBox="0 0 1024 1024" display="block"><path class="path1" d="M989.252 147.388h-954.573c-19.183 0-34.748 15.565-34.748 34.748v675.021c0 19.183 15.565 34.748 34.748 34.748h954.573c19.183 0 34.748-15.565 34.748-34.748v-675.021c-0.068-19.183-15.565-34.748-34.748-34.748zM954.505 822.409h-885.077v-605.525h885.077v605.525z"></path><path class="path2" d="M160.427 380.45l333.346 205.414c5.598 3.413 11.878 5.188 18.227 5.188s12.629-1.707 18.227-5.188l333.346-205.414c16.316-10.035 21.436-31.471 11.332-47.787-10.035-16.316-31.471-21.436-47.787-11.332l-315.119 194.15-315.119-194.15c-16.316-10.035-37.683-4.983-47.787 11.332s-5.052 37.683 11.332 47.787z"></path></svg>
          </figure>
        </label>
        <input
          type="text"
          id="input-email"
          v-model="computedIdentification"
          @keyup="validate"
          @focus="clearErrors"
          placeholder="E-mail ou CPF/CNPJ"
          class="tray-input"/>
      </fieldset>
      <small class="tray-feedbacks" v-show="errors.length">
        <span class="tray-error-message">
          {{ errors[0] }}
        </span>
      </small>
      <button
        class="tray-btn-primary"
        type="submit"
        @click="dispatch">
        Continuar
      </button>
    </form>
    <slot name="app-facebook-login"></slot>
  </section>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex';

export default {
  name: 'AppIdentify',
  props: {
    endpoint: {
      type: String,
      default: 'has-account',
    },
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
          title: 'Identifique-se',
          errors: {
            'data-invalid': 'Dados inválidos, digite novamente!',
            'not-found': 'Não foi possível verificar seu cadastro, tente novamente.',
          },
        };
      },
    },
  },
  computed: {
    ...mapState([
      'errors',
      'identification',
    ]),

    ...mapGetters(['identificationType']),

    /**
     * Esta propriedade é utilizada para manipular
     * a identificação no estado da aplicação (vuex)
     * https://vuex.vuejs.org/guide/forms.html#two-way-computed-property
     */
    computedIdentification: {
      get() {
        return this.identification;
      },
      set(identification) {
        this.setIdentification(identification);
      },
    },
  },

  methods: {
    ...mapActions([
      'clearErrors',
      'checkHasAccount',
      'setIdentification',
      'setLoading',
      'setScreen',
      'setError',
    ]),

    /**
     * Verifica a validade da identifação
     * @param {object} event
     * @return {boolean}
     */
    validate(event) {
      let isValid;
      const { keyCode } = event;

      return isValid || keyCode;
    },

    /**
     * Dispara o evento para identificar que
     * o usuario verificou se existe uma conta registrada
     * @param {object} event
     */
    dispatch(event) {
      this.$emitEvent.action({
        action: 'check-has-acount',
        type: event.type,
        element: event.target,
      });
    },

    /**
     * Envia os dados
     */
    submit(event, payload = {
      ...this.params,
      endpoint: this.endpoint,
      identification: this.identification,
      [this.identificationType]: this.identification,
    }) {
      this.setLoading(true);
      this.checkHasAccount(payload)
        .then((response) => {
          this.clearErrors();
          this.setScreen('Main');
          this.setLoading(false);

          return response;
        })
        .catch((error) => {
          this.setError(this.texts.errors['not-found']);
          this.setLoading(false);

          return error;
        });
    },
  },
};
</script>
