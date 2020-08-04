import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';

Vue.use(VueRouter);

const routes = [{
        path: '',
        redirect: '/home',
    },
    {
        path: '/home',
        name: 'Home',
        component: Home,
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
        path: '/tag',
        name: 'Tag',
        component: () =>
            import ('../views/Tag.vue'),
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