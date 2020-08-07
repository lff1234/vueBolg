import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';

Vue.use(VueRouter);
/**
 * 重写路由的push方法防止点击同一个路由报错
 */
const routerPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
    return routerPush.call(this, location).catch((error) => error);
};
const routes = [{
        path: '',
        redirect: '/home',
    },
    {
        path: '/home',
        name: 'Home',
        component: Home,
        props: { searchString: '' },
    },
    {
        path: '/singleblog/:id',
        name: 'singleblog',
        component: () =>
            import ( /* webpackChunkName: "about" */ '../views/SingleBlog.vue'),
    },
    {
        path: '/login',
        name: 'login',
        component: () =>
            import ( /* webpackChunkName: "about" */ '../views/Login.vue'),
    },
    {
        path: '/register',
        name: 'register',
        component: () =>
            import ( /* webpackChunkName: "about" */ '../views/Register.vue'),
    },
    {
        path: '/about',
        name: 'About',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
            import ( /* webpackChunkName: "about" */ '../views/About.vue'),
    },
    {
        path: '/profile',
        name: 'Profile',
        component: () =>
            import ('../views/Profile.vue'),
    },
    {
        path: '/msgboard',
        name: 'MsgBoard',
        component: () =>
            import ('../views/MsgBoard.vue'),
    },
];

const router = new VueRouter({
    mode: 'history',
    linkActiveClass: 'active',
    base: process.env.BASE_URL,
    routes,
});

export default router;