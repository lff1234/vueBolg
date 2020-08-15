import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import {
    Container,
    Header,
    Main,
    Footer,
    Input,
    Checkbox,
    Card,
    Form,
    FormItem,
    Avatar,
    Button
} from 'element-ui';

Vue.use(Container);
Vue.use(Button);
Vue.use(Header);
Vue.use(Checkbox);
Vue.use(Main);
Vue.use(Footer);
Vue.use(Input);
Vue.use(Card);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Avatar);
Vue.prototype.$store = store;

Vue.config.productionTip = false;

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');