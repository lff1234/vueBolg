import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import { Container, Header, Main, Footer, Input, Checkbox } from 'element-ui';
import './plugins/element.js';

Vue.use(Container);
Vue.use(Header);
Vue.use(Checkbox);
Vue.use(Main);
Vue.use(Footer);
Vue.use(Input);
Vue.prototype.$store = store;

Vue.config.productionTip = false;

new Vue({
    router,
    store,
    render: (h) => h(App),
}).$mount('#app');