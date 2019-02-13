import Vue from 'vue';
import httpPlugin from '@/plugins/http';

/**
 * Componente centralizador
 */
import App from './App.vue';

Vue.config.productionTip = false;
Vue.use(httpPlugin);

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
