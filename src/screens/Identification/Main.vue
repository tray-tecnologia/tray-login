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
          <figure class="tray-input-icon" :class="identificationClasses">
            <icon name="email" v-if="earlyType === 'email'" />
            <icon name="document" v-else />
          </figure>
        </label>
        <input v-model="computedIdentification"
          v-autofocus
          type="text"
          id="input-email"
          @blur="validity()"
          @keyup="$event.keyCode !== enterKeyCode ? clearErrors() : $event.preventDefault()"
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
    <slot name="app-google-login"></slot>
    <section class="tray-loading" v-show="loading">
      <div class="tray-loading-mask">
        <div class="tray-loading-line"></div>
      </div>
      <icon name="locked" />
    </section>
  </section>
</template>

<script>
import http from 'api-client';
import { mapActions, mapState, mapGetters } from 'vuex';
import utils from '@/mixins/utils';
import screenHandler from '@/mixins/screenHandler';
import Icon from '@/components/icons/index.vue';

export default {
  name: 'AppIdentify',
  components: { Icon },
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
      this.clearErrors();
      this.$parent.setScreen('Main');
      this.setLoading(false);
    },
  },
};
</script>
