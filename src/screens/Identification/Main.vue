<template>
  <section class="tray-login__identify">
    <div>
      <strong class="tray-title tray-login__title">
        {{ $lang['identify-title'] }}
      </strong>
      <slot name="custom-texts"></slot>
    </div>
    <form id="form-identify" method='POST' @submit.prevent="submit">
      <fieldset class="tray-input-group">
        <label for="input-email">
          <email-icon v-if="earlyType === 'email'" identificationClasses="identificationClasses"/>
          <document-icon v-else identificationClasses="identificationClasses"/>
        </label>
        <input v-model="computedIdentification"
          v-autofocus
          type="text"
          id="input-email"
          @blur="validity()"
          @keyup="$event.keyCode !== 13 ? clearErrors() : $event.preventDefault()"
          class="tray-input"
          autocapitalize="off"
          :class="identificationClasses"
          :placeholder="$lang['identify-input']"/>
      </fieldset>
      <small class="tray-feedbacks" v-show="errors.length">
        <span class="tray-error-message"
          v-html="errors[errors.length - 1] || !isValidIdentification">
        </span>
      </small>
      <button
        id="tray-login-identify"
        class="tray-btn-primary"
        type="submit">
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
import EmailIcon from '@/assets/icons/Email.vue';
import DocumentIcon from '@/assets/icons/Document.vue'

export default {
  name: 'AppIdentify',
  mixins: [utils, screenHandler],
  components: {
    EmailIcon,
    DocumentIcon,
  },
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
  mounted() {
    this.$emitEvent.custom('identify');
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

    /**
     * Antecipa o tipo da identificação com base no input
     * do usuário
     * @return {string}
     */
    earlyType() {
      const onlyNumbers = /\d+$/g.test(this.computedIdentification);
      return onlyNumbers ? 'cpf' : 'email';
    },

    /**
     * Verifica a validade da identifação
     * @param {object} event
     * @return {boolean}
     */
    isValidIdentification() {
      const isValidDocument = this.identificationType !== 'email';
      // eslint-disable-next-line
      const isValidEmail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      return isValidDocument || isValidEmail.test(this.computedIdentification);
    },

    /**
     * Objeto de classes utilizadas na personalização do input
     * @return {object}
     */
    identificationClasses() {
      return {
        'tray-input-invalid': this.errors.length >= 1,
        'tray-input-initial': !this.computedIdentification,
        'tray-input-valid': this.isValidIdentification,
      };
    },
  },

  methods: {
    checkHasAccount: http.hasAccount,

    ...mapActions([
      'setIdentification',
    ]),

    /**
     * Define um erro de validação caso exista
     * @return {string}
    */
    validity() {
      const isEmpty = !this.computedIdentification;
      if (this.isValidIdentification || isEmpty) {
        return;
      }

      this.setError(this.$lang['identify-data-invalid']);
    },

    /**
     * Envia os dados
     */
    submit() {
      if (!this.isValidIdentification) {
        this.setError(this.$lang['identify-data-invalid']);
        return;
      }

      this.setLoading(true);
      // console.log(this.identification);
      this.clearErrors();
      this.setLoading(false);
 
      // TODO: criar fluxo de autenticação do CPF
      // this.$parent.setScreen('Main');
      this.$parent.setScreen('Authentication');
    },
  },
};
</script>
