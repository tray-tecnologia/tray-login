import Vue from 'vue';
import { httpPlugin, eventBus } from '@/plugins';

/**
 * Componente centralizador
 */
import App from './App.vue';
import store from './store';

Vue.config.productionTip = false;
Vue.use(eventBus);
httpPlugin({ store });

if (process.env.NODE_ENV === 'development') {
  new Vue({
    render: h => h(App),
  }).$mount('#app');
}

/**
 * Exporta a aplicação como um web-componet
 * veja o comando de build no package.json
 */
export default App;
