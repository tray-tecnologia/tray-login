import Vue from 'vue';
import { httpPlugin, eventBus } from '@/plugins';
import vueCustomElement from 'vue-custom-element';

/**
 * Componente centralizador
 */
import App from './App.vue';
import store from './store';

Vue.config.productionTip = false;
Vue.use(eventBus);
Vue.use(vueCustomElement);
httpPlugin(store);

console.log(process.env.VUE_APP_API_CLIENT);

Vue.customElement('tray-login', App);
