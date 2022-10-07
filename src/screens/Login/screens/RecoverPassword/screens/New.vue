<template>
  <form
    id="change-password"
    class="tray-login__new-password"
    method='POST'
    @submit.prevent="submit"
  >
    <div>
      <strong class="tray-title tray-login__title">
        {{ $lang['new-password-title']}}
      </strong>

      <p class="tray-action">
        {{ $lang['new-password-code'] }}

        <b>{{ maskedEmail || identification }}</b>

        {{ $lang['new-password-create'] }}
      </p>
    </div>

    <fieldset class="tray-input-group">
      <label for="security-code-input">
        <figure
          class="tray-input-icon"
          :class="securityCodeErrors ? 'tray-input-invalid' : 'tray-input-initial'"
        >
          <icon name="locked" />
        </figure>
      </label>

      <input
        id="security-code-input"
        class="tray-input"
        autocomplete="one-time-code"
        maxlength="6"
        v-autofocus
        v-model="securityCode"
        :placeholder="$lang['otp-title']"
        :class="securityCodeErrors ? 'tray-input-invalid' : 'tray-input-initial'"
        @keyup="$event.keyCode !== enterKeyCode ? clearErrors() : $event.preventDefault()"
        @input="filterInput()"
      />
    </fieldset>

    <app-toggle-password
      :autoComplete="'new-password'"
      :state="passwordErrors ? 'invalid' : 'valid'"
      v-model="passwordHandler"
      @keyup.native="$event.keyCode !== enterKeyCode ? clearErrors() : $event.preventDefault()"
      id="new-password"
    />

    <app-toggle-password
      :autoComplete="'new-password'"
      :state="passwordErrors ? 'invalid' : 'valid'"
      v-model="passwordConfirmation"
      @keyup.native="$event.keyCode !== enterKeyCode ? clearErrors() : $event.preventDefault()"
      id="confirm-new-password"
    />

    <small class="tray-feedbacks"
      v-show="errors.length">
      <span class="tray-error-message"
        v-html="errors[errors.length - 1]">
      </span>
    </small>

    <div class="col">
      <div class="app__customer-password-change__validation-rules">
        <span class="app__customer-password-change__validation-rules__contains">
          {{ $lang['must-contain'] }}
        </span>

        <span class="app__customer-password-change__validation-rules__list">
          <dl>
            <dt class="app__customer-password-change__validation-rules__list__item"
            :class="{'app__loading': loading}">
              <figure
                class="app__icon--rules"
                :class="{'app__loading': loading}"
              >
                <icon
                  v-if="$v.passwordHandler.isEmpty"
                  name="circle-bordered"
                />
                <icon
                  v-else
                  :name="getIconName($v.passwordHandler.isValidLength)"
                  :class="
                    getIconName($v.passwordHandler.isValidLength) === 'check'
                    ? 'success'
                    : 'error'"
                />
              </figure>
              {{ $lang['min-characters'] }}
            </dt>

            <dt class="app__customer-password-change__validation-rules__list__item"
            :class="{'app__loading': loading}">
              <figure
                class="app__icon--rules"
                :class="{'app__loading': loading}"
              >
                <icon
                  v-if="$v.passwordHandler.isEmpty"
                  name="circle-bordered"
                />
                <icon
                  v-else
                  :name="getIconName($v.passwordHandler.containsNumber)"
                  :class="
                    getIconName($v.passwordHandler.containsNumber) === 'check'
                    ? 'success'
                    : 'error'"
                />
              </figure>

              {{ $lang['min-number'] }}
            </dt>

            <dt class="app__customer-password-change__validation-rules__list__item"
            :class="{'app__loading': loading}">
              <figure
                class="app__icon--rules"
                :class="{'app__loading': loading}"
              >
                <icon
                  v-if="$v.passwordHandler.isEmpty"
                  name="circle-bordered"
                />
                <icon
                  v-else
                  :name="getIconName($v.passwordHandler.containsLetter)"
                  :class="
                    getIconName($v.passwordHandler.containsLetter) === 'check'
                    ? 'success'
                    : 'error'"
                />
              </figure>

              {{ $lang['min-letter'] }}
            </dt>
          </dl>
        </span>
      </div>
    </div>

    <button id="new-password-submit"
      class="tray-btn-primary"
      type="submit">
      {{ $lang['new-password-submit'] }}
    </button>

    <button class="tray-btn-default tray-btn-other-option"
      type="reset"
      @click="reset">
      {{ $lang['other-option'] }}
    </button>

    <section class="tray-loading" v-show="loading">
      <div class="tray-loading-mask">
        <div class="tray-loading-line"></div>
      </div>

      <icon name="locked-loading" />
    </section>
  </form>
</template>

<script>
import client from 'api-client';
import screenHandler from '@/mixins/screenHandler';
import utils from '@/mixins/utils';
import { mapState, mapActions } from 'vuex';
import { validationMixin } from 'vuelidate';
import { required, sameAs } from 'vuelidate/lib/validators';
import AppTogglePassword from '@/components/TogglePassword.vue';
import Icon from '@/components/icons/index.vue';
import {
  isEmpty,
  isValidLength,
  containsLetter,
  containsNumber,
} from '../validators/password';

export default {
  name: 'AppNewPassword',
  mixins: [screenHandler, validationMixin, utils],
  components: {
    AppTogglePassword,
    Icon,
  },
  props: {
    endpoint: {
      type: String,
      default: 'generate-security-code',
    },
    identification: {
      type: String,
      default: '',
    },
    identificationType: {
      type: String,
      default: '',
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

  data() {
    return {
      passwordConfirmation: '',
      securityCode: '',
      maskedEmail: '',
    };
  },

  mounted() {
    const isValidDocument = this.identificationType !== 'email';
    if (isValidDocument) {
      this.getUserMaskedMail();
    }
  },

  computed: {
    ...mapState('Login/RecoverPassword', [
      'password',
    ]),

    /**
     * Estado mapeado da vuex,
     * https://vuex.vuejs.org/guide/forms.html#two-way-computed-property
     */
    passwordHandler: {
      get() {
        return this.password;
      },
      set(password) {
        return this.setPassword(password);
      },
    },

    /**
     * Verifica se o codigo de segurança preenchido é valido
     * @return {boolean}
     */
    isValidSecurityCode() {
      if (this.securityCode.length < 6) {
        return false;
      }

      const onlyNumbersPattern = /^\d+$/;
      return onlyNumbersPattern.test(this.securityCode);
    },

    /**
     * Verifica se existem erros relacionados ao codigo de segurança
     * @return {boolean}
     */
    securityCodeErrors() {
      if (this.errors.length <= 0) {
        return false;
      }

      return this.errors[0].indexOf('segurança') !== -1 || this.errors[0].indexOf('Autenticação') !== -1;
    },
  },
  methods: {
    updatePassword: client.updatePassword,
    getMaskedEmail: client.getMaskedEmail,
    ...mapActions('Login/RecoverPassword', {
      setPassword: 'setPassword',
      nextStep: 'setScreen',
    }),

    ...mapActions('Login', {
      backTo: 'setScreen',
    }),

    /**
     * Verifica se a senha é valida
     * @param {string}
     * @return {boolean}
     */
    checkValidity(password = this.password) {
      return password.length >= 8;
    },

    /**
     * Verifica os requisitos foram cumpridos
     * @return {boolean}
     */
    checkRequirements() {
      return containsNumber && containsLetter;
    },

    /**
     * Verifica se as senhas são iguais
     * @param {string} password a senha digitada
     * @param {string} confirmation a confirmação da senha
     * @return {boolean}
     */
    checkEquality(password = this.password, confirmation = this.passwordConfirmation) {
      return password === confirmation;
    },

    /**
     * Recupera o email mascarado do cliente a partir do CPF
     * @param {object} payload os parâmetros enviados para o endpoint
     * @return {undefined}
     */
    getUserMaskedMail(payload = {
      ...this.params,
      endpoint: 'retrieve-masked-email',
      identification: this.identification,
      [this.identificationType]: this.identification,
    }) {
      this.getMaskedEmail(payload).then((response) => {
        this.maskedEmail = response.data.data.responseData.maskedEmail;
      }).catch((error) => {
        throw error;
      });
    },

    /**
     * Valida se o input possui apenas números
     * @return {undefined}
     */
    filterInput() {
      this.securityCode = this.securityCode.replace(/[^0-9]+/g, '');
    },

    /**
     * Reseta o módulo de recuperação de senha
     * @param {string}
     */
    reset() {
      this.setPassword('');
      this.backTo('Main');
    },

    /**
     * Valida os campos
     */
    submit() {
      if (!this.checkEquality(this.password, this.confirmation)) {
        this.setError(this.$lang['non-equal-password']);
        return;
      }

      if (!this.checkValidity(this.password)) {
        this.setError(this.$lang['invalid-password']);
        return;
      }

      if (!this.checkRequirements()) {
        this.setError(this.$lang.errors.requirements);
        return;
      }

      if (!this.isValidSecurityCode) {
        this.setError(this.$lang['invalid-code']);
        return;
      }

      this.update();
    },

    /**
     * Atualiza a senha
     */
    update(event, payload = {
      ...this.params,
      code: this.securityCode,
      endpoint: 'password-update',
      identification: this.identification,
      password: this.password,
      [this.identificationType]: this.identification,
    }) {
      this.updatePassword(payload).then(() => {
        this.params.code = this.securityCode;
        this.setLoading(true);
        this.nextStep('Login');
      }).catch((error) => {
        const { message = this.$lang['invalid-code'] } = error.data.data;
        this.setError(message);
        this.setLoading(false);
      });
    },
  },

  validations() {
    const validations = {
      passwordHandler: {
        required,
        isEmpty,
        isValidLength,
        containsLetter,
        containsNumber,
      },

      confirmation: {
        sameAsPassword: sameAs('password'),
      },
    };

    return validations;
  },
};
</script>
