<template>
  <section id="tray-login-identify" class="tray-login__identify">
    <header>
      <strong class="tray-title tray-login__title">
        {{ $lang['identify-title'] }}
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
          class="tray-input"
          @keyup="validate"
          @focus="clearErrors"
          v-model="computedIdentification"
          :placeholder="$lang['identify-input']"/>
      </fieldset>
      <small class="tray-feedbacks" v-show="errors.length">
        <span class="tray-error-message" v-html="errors[errors.length - 1]"></span>
      </small>
      <button
        class="tray-btn-primary"
        type="submit"
        @click="dispatch">
        {{ $lang['proceed'] }}
      </button>
    </form>
    <slot name="app-facebook-login"></slot>
    <section class="tray-loading" v-show="loading">
      <div class="tray-loading-mask">
        <div class="tray-loading-line"></div>
      </div>
      <svg class="tray-loading-icon tray-icon-locked" viewBox="0 0 1024 1024">
        <!-- eslint-disable-next-line -->
        <path class="path1" d="M796.467 417.109v-132.642c0-155.58-128.956-284.467-284.467-284.467s-284.467 128.887-284.467 284.467v132.642c-64.444 0-113.801 49.289-113.801 113.801v379.29c0.068 64.444 49.289 113.801 113.801 113.801h568.866c64.444 0 113.801-49.289 113.801-113.801v-379.29c0.068-60.689-49.289-113.801-113.732-113.801zM265.489 284.399c0-136.533 109.978-246.511 246.511-246.511s246.511 109.978 246.511 246.511v132.71h-37.956v-132.71c0-113.801-94.822-208.623-208.623-208.623s-208.555 94.822-208.555 208.623v132.71h-37.956l0.068-132.71zM682.667 284.399v132.71h-341.333v-132.71c0-94.822 75.844-170.667 170.667-170.667s170.667 75.844 170.667 170.667zM872.311 568.798v75.844h-341.333v37.956h341.333v75.844h-341.333v37.956h341.333v75.844h-341.333v37.956h341.333c0 41.711-34.133 75.844-75.844 75.844h-568.866c-41.711 0-75.844-34.133-75.844-75.844v-379.221c0-41.711 34.133-75.844 75.844-75.844h568.866c41.711 0 75.844 34.133 75.844 75.844h-341.333v37.956l341.333-0.137z"></path>
      </svg>
    </section>
  </section>
</template>

<script>
import http from 'api-client';
import { mapActions, mapState, mapGetters } from 'vuex';
import utils from '@/mixins/utils';
import screenHandler from '@/mixins/screenHandler';

export default {
  name: 'AppIdentify',
  mixins: [utils, screenHandler],
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
  },
  computed: {
    ...mapState([
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
    checkHasAccount: http.hasAccount,

    ...mapActions([
      'setIdentification',
    ]),

    /**
     * @to-do
     * Verifica a validade da identifação
     * @param {object} event
     * @return {boolean}
     */
    validate() {
      // eslint-disable-next-line
      return true
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
        .then(() => {
          this.clearErrors();
          this.$parent.setScreen('Main');
          this.setLoading(false);
        })
        .catch((error) => {
          const { message } = error.data;
          this.setError(message || this.$lang['invalid-code']);
          this.setLoading(false);
        });
    },
  },
};
</script>
