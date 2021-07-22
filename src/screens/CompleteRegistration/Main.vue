<template>
  <section v-if="!isComplete">
    <div>
      <strong class="tray-title">
        {{ $lang["registration-title"] }}
      </strong>
    </div>

    <div>
      <div class="tray-login__recover-password__header">
        <document-user-icon />
      </div>
      <p class="tray-action">{{ $lang["registration-action"] }}</p>
    </div>

    <form method="POST" @submit.prevent="submit">
      <!-- TODO: rever campos de todos os parametros dos inputs até o final do formulario -->
      <fieldset class="tray-input-group">
        <label for="security-code-input">
          <email-icon />
        </label>
        <input v-autofocus class="tray-input" :placeholder="$lang['registration-input']" />
      </fieldset>
      <app-toggle-password
        :autoComplete="'new-password'"
        :state="passwordErrors ? 'invalid' : 'valid'"
        v-model="passwordHandler"
        @keyup.native="$event.keyCode !== 13 ? clearErrors() : $event.preventDefault()"
        id="registration-new-password"
      />
      <app-toggle-password
        :autoComplete="'new-password'"
        :state="passwordErrors ? 'invalid' : 'valid'"
        v-model="passwordConfirmation"
        @keyup.native="$event.keyCode !== 13 ? clearErrors() : $event.preventDefault()"
        id="registration-confirm-new-password"
      />
      <button id="tray-login-identify" class="tray-btn-primary" type="submit">
        {{ $lang["registration-button"] }}
      </button>
    </form>
  </section>
  <app-complete-screen v-else />
</template>

<script>
import screenHandler from '@/mixins/screenHandler';
import utils from '@/mixins/utils';
import AppTogglePassword from '@/components/TogglePassword.vue';
import EmailIcon from '@/assets/icons/Email.vue';
import DocumentUserIcon from '@/assets/icons/DocumentUser.vue';
import AppCompleteScreen from './Complete.vue';

export default {
  name: 'AppCompleteRegistration',
  mixins: [screenHandler, utils],
  data() {
    return {
      isComplete: false,
    };
  },
  components: {
    AppTogglePassword,
    EmailIcon,
    DocumentUserIcon,
    AppCompleteScreen,
  },
  methods: {
    submit() {
      this.isComplete = true;
    },
  },
};
</script>
