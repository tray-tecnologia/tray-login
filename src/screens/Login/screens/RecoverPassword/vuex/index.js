import actions from './actions';
import mutations from './mutations';
import state from './state';

const module = {
  actions,
  mutations,
  state,
  namespaced: true,
};

export default { module };
