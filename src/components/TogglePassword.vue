<template>
  <fieldset class="tray-input-group">
    <label :for="id">
      <figure class="tray-input-icon" :class="inputClass">
        <icon name="locked" />
      </figure>
      <button v-show="value"
        class="tray-login-hide-password"
        :class="inputClass"
        type="button"
        @click="toggleVisibility"
      >
        <icon :name="showPassword ? 'hidden' : 'visible'" />
      </button>
    </label>
    <input v-if="autoFocus"
      v-autofocus
      :autocomplete="autoComplete"
      v-bind:value="value"
      v-on:input="$emit('input', $event.target.value)"
      :type="showPassword ? 'text' : 'password'"
      :id="id"
      class="tray-input"
      :class="inputClass"
      :placeholder="$lang[this.passwordLabel]"/>

    <input v-else
      :autocomplete="autoComplete"
      v-bind:value="value"
      v-on:input="$emit('input', $event.target.value)"
      :type="showPassword ? 'text' : 'password'"
      :id="id"
      class="tray-input"
      :class="inputClass"
      :placeholder="$lang[this.passwordLabel]"/>
  </fieldset>
</template>

<script>
import screenHandler from '@/mixins/screenHandler';
import { mapGetters } from 'vuex';
import Icon from '@/components/icons/index.vue';

export default {
  name: 'AppTogglePassword',
  components: { Icon },
  mixins: [screenHandler],
  props: {
    value: String,
    state: {
      type: [String, Boolean],
      default: 'initial',
    },
    id: {
      type: String,
      default() {
        return '';
      },
    },
    /**
     * Saiba mais sobre os tipos e casos de uso aqui
     * https://www.chromium.org/developers/design-documents/create-amazing-password-forms#TOC-Use-autocomplete-attributes
     */
    autoComplete: {
      type: String,
      default() {
        return 'off';
      },
    },
    /**
     * Renderiza o campo ja com foco
     */
    autoFocus: {
      type: Boolean,
      default() {
        return false;
      },
    },
  },
  data() {
    return {
      showPassword: true,
    };
  },

  beforeMount() {
    this.showPassword = this.isMobile;
  },

  methods: {
    /**
     * Altera a visibilidade da senha no input
     */
    toggleVisibility() {
      this.showPassword = !this.showPassword;
    },
  },

  computed: {
    ...mapGetters(['isMobile']),

    inputClass() {
      const { state } = this;

      if (state === '') {
        return 'tray-input-initial';
      }

      if (state === true || state === 'valid') {
        return 'tray-input-valid';
      }

      if (state === false || state === 'invalid') {
        return 'tray-input-invalid';
      }

      return 'tray-input-initial';
    },

    /**
     * Define qual a label deve ser exibida dependendo do tipo de campo de senha
     * @return {string}
     */
    passwordLabel() {
      if (this.id === 'new-password') {
        return ['new-password-label'];
      }

      if (this.id === 'confirm-new-password') {
        return ['confirmation-input-label'];
      }

      return ['password-input-label'];
    },
  },
};
</script>
