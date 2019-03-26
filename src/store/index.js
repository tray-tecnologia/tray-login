import Vue from 'vue';
import Vuex from 'vuex';

import actions from './actions';
import mutations from './mutations';
import modules from './modules';
import state from './state';
import * as getters from './getters';

Vue.use(Vuex);

export default new Vuex.Store({
  state,
  mutations,
  actions,
  modules,
  getters,
  strict: process.env.NODE_ENV !== 'production',
});
