<template>
  <section class="tray-login__identify">
    <div>
      <strong class="tray-title tray-login__title">
        {{ $lang['identify-title'] }} versão teste
      </strong>
      <slot name="custom-texts"></slot>
    </div>
    <form id="form-identify" method='POST' @submit.prevent="submit">
      <fieldset class="tray-input-group">
        <label for="input-email">
          <figure class="tray-input-icon" :class="identificationClasses">
            <svg class="tray-icon-mail" viewBox="0 0 1024 1024" v-if="earlyType === 'email'">
              <!-- eslint-disable-next-line -->
              <path class="path1" d="M989.252 147.388h-954.573c-19.183 0-34.748 15.565-34.748 34.748v675.021c0 19.183 15.565 34.748 34.748 34.748h954.573c19.183 0 34.748-15.565 34.748-34.748v-675.021c-0.068-19.183-15.565-34.748-34.748-34.748zM954.505 822.409h-885.077v-605.525h885.077v605.525z"></path>
              <!-- eslint-disable-next-line -->
              <path class="path2" d="M160.427 380.45l333.346 205.414c5.598 3.413 11.878 5.188 18.227 5.188s12.629-1.707 18.227-5.188l333.346-205.414c16.316-10.035 21.436-31.471 11.332-47.787-10.035-16.316-31.471-21.436-47.787-11.332l-315.119 194.15-315.119-194.15c-16.316-10.035-37.683-4.983-47.787 11.332s-5.052 37.683 11.332 47.787z"></path>
            </svg>
            <svg class="tray-icon-document" viewBox="0 0 1024 1024" v-else>
              <!-- eslint-disable-next-line -->
              <path class="path1" d="M989.321 139.742h-954.641c-19.183 0-34.679 15.565-34.679 34.748v675.021c0 19.183 15.565 34.748 34.748 34.748h954.573c19.183 0 34.748-15.565 34.748-34.748v-675.021c-0.068-19.251-15.565-34.748-34.748-34.748zM954.641 814.694h-885.146v-605.525h885.077v605.525z"></path><path class="path2" d="M989.321 139.742v-2.526h-954.641c-20.617 0-37.274 16.725-37.274 37.274v675.021c0 20.548 16.725 37.274 37.274 37.274h954.573c20.548 0 37.274-16.725 37.274-37.274v-675.021c-0.068-20.617-16.725-37.274-37.274-37.274v5.052c17.818 0 32.222 14.336 32.222 32.222v675.021c0 17.749-14.404 32.154-32.222 32.222h-954.573c-17.818 0-32.154-14.404-32.222-32.222v-675.021c0-17.749 14.404-32.154 32.222-32.222h954.573v-2.526zM954.641 814.694v-2.526h-882.551v-600.474h880.026v602.999h5.052v-608.051h-890.197v610.577h890.129v-2.526h-2.458z"></path><path class="path3" d="M666.692 348.638l-7.1 9.83h-527.497l-7.1-9.83v-18.5l7.1-9.83h527.497l7.1 9.83z"></path><path class="path4" d="M666.692 348.638l-2.048-1.502-6.281 8.806h-524.971l-5.803-8.124v-16.862l5.803-8.124h524.971l5.803 8.124v17.681h5.12v-19.319l-7.578-10.513-0.819-1.024h-530.022l-7.919 10.854-0.478 0.683v20.139l7.578 10.513 0.819 1.024h530.022l7.919-10.854 0.478-0.683v-0.819z"></path><path class="path5" d="M604.297 688.469c0 7.578-4.437 13.79-9.83 13.79h-459.503c-5.461 0-9.83-6.144-9.83-13.79v-21.026c0-7.578 4.437-13.79 9.83-13.79h459.503c5.461 0 9.83 6.144 9.83 13.79v21.026z"></path><path class="path6" d="M604.297 688.469h-2.594c0 6.758-4.028 11.264-7.305 11.264h-459.435c-3.345 0-7.305-4.437-7.305-11.264v-21.026c0-6.758 4.028-11.264 7.305-11.264h459.503c3.345 0 7.305 4.437 7.305 11.264v21.026h5.052v-21.026c0-8.465-4.779-16.111-12.356-16.316h-459.503c-7.509 0.205-12.356 7.919-12.356 16.316v21.026c0 8.465 4.779 16.111 12.356 16.316h459.503c7.509-0.205 12.356-7.919 12.356-16.316h-2.526z"></path><path class="path7" d="M882.074 688.469c0 7.578-5.052 13.79-11.332 13.79h-216.951c-6.281 0-11.332-6.144-11.332-13.79v-21.026c0-7.578 5.052-13.79 11.332-13.79h216.951c6.281 0 11.332 6.144 11.332 13.79v21.026z"></path><path class="path8" d="M882.074 688.469h-2.526c0 6.554-4.369 11.264-8.806 11.264h-216.951c-4.506 0-8.806-4.642-8.806-11.264v-21.026c0-6.554 4.369-11.264 8.806-11.264h216.951c4.506 0 8.806 4.642 8.806 11.264v21.026h5.052v-21.026c0-8.67-5.803-16.247-13.858-16.316h-216.951c-8.124 0.068-13.858 7.714-13.926 16.316v21.026c0 8.67 5.803 16.247 13.858 16.316h216.951c8.124-0.068 13.858-7.714 13.858-16.316h-2.458z"></path><path class="path9" d="M527.838 452.813l-5.325 9.83h-392.192l-5.325-9.83v-18.5l5.325-9.83h392.192l5.188 9.83z"></path><path class="path10" d="M527.838 452.813l-2.253-1.161-4.574 8.465h-389.188l-4.301-7.919v-17.271l4.301-7.919h389.12l4.233 7.919 0.068 17.886h5.12l-0.068-18.5-0.068-0.614-5.53-10.377-0.683-1.365h-395.264l-5.939 11.196-0.341 0.546v19.729l5.598 10.377 0.683 1.365h395.332l5.939-11.196 0.341-0.546v-0.614z"></path>
            </svg>
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
