<template>
  <fieldset class="tray-input-group">
    <label :for="id">
      <figure class="tray-input-icon" :class="inputClass">
        <svg class="tray-icon-locked" viewBox="0 0 1024 1024">
          <!-- eslint-disable-next-line -->
          <path class="path1" d="M796.467 417.109v-132.642c0-155.58-128.956-284.467-284.467-284.467s-284.467 128.887-284.467 284.467v132.642c-64.444 0-113.801 49.289-113.801 113.801v379.29c0.068 64.444 49.289 113.801 113.801 113.801h568.866c64.444 0 113.801-49.289 113.801-113.801v-379.29c0.068-60.689-49.289-113.801-113.732-113.801zM265.489 284.399c0-136.533 109.978-246.511 246.511-246.511s246.511 109.978 246.511 246.511v132.71h-37.956v-132.71c0-113.801-94.822-208.623-208.623-208.623s-208.555 94.822-208.555 208.623v132.71h-37.956l0.068-132.71zM682.667 284.399v132.71h-341.333v-132.71c0-94.822 75.844-170.667 170.667-170.667s170.667 75.844 170.667 170.667zM872.311 568.798v75.844h-341.333v37.956h341.333v75.844h-341.333v37.956h341.333v75.844h-341.333v37.956h341.333c0 41.711-34.133 75.844-75.844 75.844h-568.866c-41.711 0-75.844-34.133-75.844-75.844v-379.221c0-41.711 34.133-75.844 75.844-75.844h568.866c41.711 0 75.844 34.133 75.844 75.844h-341.333v37.956l341.333-0.137z"></path>
        </svg>
      </figure>
      <button v-show="value"
        class="tray-login-hide-password"
        :class="inputClass"
        type="button"
        @click="toggleVisibility">
        {{ showPassword ? $lang['password-hide'] : $lang['password-show'] }}
      </button>
    </label>
    <input v-autofocus
      autocomplete="off"
      v-bind:value="value"
      v-on:input="$emit('input', $event.target.value)"
      :type="showPassword ? 'text' : 'password'"
      :id="id"
      class="tray-input"
      :class="inputClass"
      :placeholder="$lang['confirmation-input-label']"/>
  </fieldset>
</template>

<script>
import screenHandler from '@/mixins/screenHandler';
import { mapGetters } from 'vuex';

export default {
  name: 'AppConfirmPassword',
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
        return 'confirmation';
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
  },
};
</script>
