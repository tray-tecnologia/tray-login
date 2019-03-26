import actions from './actions';
import modules from './modules';
import mutations from './mutations';
import state from './state';

const module = {
  actions,
  modules,
  mutations,
  state,
  namespaced: true,
};

export default { module };
