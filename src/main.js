import Vue from 'vue';
import { httpPlugin, eventBus } from '@/plugins';

/**
 * Componente centralizador
 */
import App from './App.vue';

Vue.config.productionTip = false;
Vue.use(httpPlugin);
Vue.use(eventBus);

if (process.env.NODE_ENV === 'development') {
  new Vue({
    render: h => h(App),
  }).$mount('#app');
}

/**
 * Exporta a aplicação para utilização wrapper do web-componet
 * veja o comando de build no package.json
 */
export default App;
