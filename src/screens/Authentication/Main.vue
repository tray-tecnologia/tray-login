<template>
  <section>
    <div>
      <strong class="tray-title">
        {{ $lang["authentication-title"] }}
      </strong>
    </div>

    <div>
      <p class="tray-action">
        {{ $lang["authentication-action-1"] }} <strong>{{ storeName }}</strong
        >.
      </p>
      <p class="tray-action">{{ $lang["authentication-action-2"] }}</p>
      <label class="tray-well">{{ question }}</label>
    </div>

    <div>
      <button class="tray-btn-default" v-for="n in answers" :key="n" @click="submit(n)">
        {{ n }}
      </button>
    </div>

    <button class="tray-btn-link" @click="reset">
      {{ $lang["authentication-go-back"] }}
    </button>
  </section>
</template>

<script>
import screenHandler from '@/mixins/screenHandler';
import utils from '@/mixins/utils';
import http from 'api-client';

export default {
  name: 'AppAuthentication',
  mixins: [screenHandler, utils],
  props: ['reset'],
  data() {
    return {
      storeName: 'Marketplace XYZ',
      question: '',
      answers: [],
    };
  },
  methods: {
    authenticationQuestion: http.authenticationQuestion,
    chosenQuestion: http.chosenQuestion,
    doAuthenticationQuestion() {
      this.authenticationQuestion({
        identification: this.identification,
      }).then((response) => {
        this.question = response.data.message.question;
        this.answers = response.data.message.answers;
      });
    },
    submit(chosen) {
      this.setLoading(true);
      this.chosenQuestion({
        identification: this.identification,
        chosen,
        store_id: this.dataStore,
        endpoint: 'question/answer',
      }).then((response) => {
        this.setLoading(false);
        if (response.data.message) {
          this.$parent.setScreen('Registration');
        } else {
          this.doAuthenticationQuestion();
        }
      });
    },
  },
  mounted() {
    this.doAuthenticationQuestion();
  },
};
</script>
