<template>
  <form id="compulsory-password" method='POST' @submit.prevent="submit">
    <div>
      <strong class="tray-title tray-login__title">
        {{ $lang['compulsory-password-title']}}
      </strong>
      <div class="tray-login__recover-password__header">
        <figure class="tray-login__recover-password__figure">
          <svg class="tray-user-lock" viewBox="0 0 640 512">
            <!-- eslint-disable-next-line -->
            <path class="path1" d="M224 256A128 128 0 1 0 96 128a128 128 0 0 0 128 128zm96 64a63.08 63.08 0 0 1 8.1-30.5c-4.8-.5-9.5-1.5-14.5-1.5h-16.7a174.08 174.08 0 0 1-145.8 0h-16.7A134.43 134.43 0 0 0 0 422.4V464a48 48 0 0 0 48 48h280.9a63.54 63.54 0 0 1-8.9-32zm288-32h-32v-80a80 80 0 0 0-160 0v80h-32a32 32 0 0 0-32 32v160a32 32 0 0 0 32 32h224a32 32 0 0 0 32-32V320a32 32 0 0 0-32-32zM496 432a32 32 0 1 1 32-32 32 32 0 0 1-32 32zm32-144h-64v-80a32 32 0 0 1 64 0z"></path>
          </svg>
        </figure>
      </div>
      <p class="tray-action">
        {{ $lang['compulsory-password-description']}}
      </p>
    </div>

    <fieldset class="tray-input-group">
      <app-toggle-password
        :autoComplete="'compulsory-password'"
        :state="passwordErrors ? 'invalid' : 'valid'"
        v-model="passwordHandler"
        @keyup.native="isKeyupEnter($event)"
        id="new-password"
      />
      <app-toggle-password
        :autoComplete="'compulsory-password'"
        :state="passwordErrors ? 'invalid' : 'valid'"
        v-model="passwordConfirmation"
        @keyup.native="isKeyupEnter($event)"
        id="confirm-new-password"
      />
    </fieldset>

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
                v-html="getIconName($v.passwordHandler.isValidLength)"
                class="app__icon--rules"
                :class="{'app__loading': loading}">
              </figure>
              {{ $lang['min-characters'] }}
            </dt>
            <dt class="app__customer-password-change__validation-rules__list__item"
            :class="{'app__loading': loading}">
              <figure
                v-html="getIconName($v.passwordHandler.containsNumber)"
                class="app__icon--rules"
                :class="{'app__loading': loading}">
              </figure>
              {{ $lang['min-number'] }}
            </dt>
            <dt class="app__customer-password-change__validation-rules__list__item"
            :class="{'app__loading': loading}">
              <figure
                class="app__icon--rules"
                :class="{'app__loading': loading}"
                v-html="getIconName($v.passwordHandler.containsLetter)">
              </figure>
              {{ $lang['min-letter'] }}
            </dt>
          </dl>
        </span>
      </div>
    </div>

    <button id="compulsory-password-submit"
      class="tray-btn-primary"
      type="submit">
      {{ $lang['compulsory-password-submit'] }}
    </button>
  </form>
</template>

<script>
import client from 'api-client';
import { mapState, mapActions } from 'vuex';
import screenHandler from '@/mixins/screenHandler';
import utils from '@/mixins/utils';
import AppTogglePassword from '@/components/TogglePassword.vue';
import { validationMixin } from 'vuelidate';
import { required } from 'vuelidate/lib/validators';
import {
  isValidLength,
  containsLetter,
  containsNumber,
} from '../RecoverPassword/validators/password';

export default {
  name: 'AppCompulsoryPassword',
  mixins: [screenHandler, utils, validationMixin],
  components: {
    AppTogglePassword,
  },
  data() {
    return {
      passwordConfirmation: '',
      maskedEmail: '',
    };
  },
  props: {
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
  computed: {
    ...mapState([
      'securityCode',
    ]),

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
  },
  methods: {
    updatePassword: client.updatePassword,
    ...mapActions('Login/RecoverPassword', {
      setPassword: 'setPassword',
      setScreenRecover: 'setScreen',
    }),

    ...mapActions('Login', {
      setScreenLogin: 'setScreen',
    }),
    /**
     * Valida os campos
     */
    submit() {
      if (this.passwordHandler !== this.passwordConfirmation) {
        this.setError(this.$lang['non-equal-password']);
        return;
      }

      if (!isValidLength(this.password)) {
        this.setError(this.$lang['invalid-password']);
        return;
      }

      if (!containsNumber || !containsLetter) {
        this.setError(this.$lang.errors.requirements);
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
        this.setLoading(true);
        this.setScreenLogin('RecoverPassword');
        this.setScreenRecover('Login');
      }).catch((error) => {
        const { message = this.$lang['invalid-code'] } = error.data.data;
        this.setError(message);
        this.setLoading(false);
      });
    },

    /**
     * Verifica se a tecla clicada é o enter
     * caso sim, envia o formulário
     *
     * @param {object} event evento de click
     * @return {function}
     */
    isKeyupEnter(event) {
      return event.keyCode !== this.enterKeyCode ? this.clearErrors() : event.preventDefault();
    },
  },

  validations() {
    const validations = {
      passwordHandler: {
        required,
        isValidLength,
        containsLetter,
        containsNumber,
      },
    };

    return validations;
  },
};
</script>
