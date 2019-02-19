import Vue from 'vue';
import httpPlugin from '@/plugins/http';
import App from './App.vue';

Vue.config.productionTip = false;
Vue.use(httpPlugin);

if (process.env.NODE_ENV === 'development') {
  new Vue({
    render: h => h(App),
  }).$mount('#app');
}

export default App;
