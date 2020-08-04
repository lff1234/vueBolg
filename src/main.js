import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

import { Container, Header, Aside, Main, Footer } from 'element-ui';

Vue.use(Container);
Vue.use(Header);
Vue.use(Aside);
Vue.use(Main);
Vue.use(Footer);

Vue.prototype.$store = store;

Vue.config.productionTip = false;

new Vue({
    router,
    store,
    render: (h) => h(App),
}).$mount('#app');