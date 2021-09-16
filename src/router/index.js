import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import store from '../store/index';
if (!window.VueRouter) Vue.use(VueRouter);
/**
 * 重写路由的push方法防止点击同一个路由报错
 */
const routerPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
    return routerPush.call(this, location).catch(error => error);
};
const routes = [{
        path: '',
        redirect: '/home'
    },
    {
        path: '/home',
        name: 'Home',
        component: Home,
        meta: { keepAlive: true },
        props: { searchString: '', newArticle: {} }
    },
    {
        path: '/home/:id',
        name: 'singleblog',
        meta: { keepAlive: false },
        component: () =>
            import ( /* webpackChunkName: "singleblog" */ '../views/SingleBlog.vue')
    },
    {
        path: '/users/:id',
        name: 'info',
        meta: { keepAlive: false },
        component: () =>
            import ( /* webpackChunkName: "info" */ '../views/Info.vue')
    },
    {
        path: '/markdown',
        name: 'markdown',
        props: { article: {} },
        component: () =>
            import ( /* webpackChunkName: "markdown" */ '../views/Markdown.vue')
    },
    {
        path: '/register',
        name: 'register',
        component: () =>
            import ( /* webpackChunkName: "register" */ '../views/Register.vue')
    },
    {
        path: '/profile',
        name: 'profile',
        meta: {
            requiresAuth: true
        },
        component: () =>
            import ( /* webpackChunkName: "profile" */ '../views/Profile.vue')
    },
    {
        path: '/about',
        name: 'About',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
            import ( /* webpackChunkName: "about" */ '../views/About.vue')
    },
    {
        path: '/tag',
        name: 'Tag',
        component: () =>
            import ('../views/Tag.vue')
    },
    {
        path: '/msg',
        name: 'Message',
        component: () =>
            import ('../views/Message.vue'),
        children: [{
                path: 'reply',
                name: 'reply',
                component: () =>
                    import ('../views/Reply.vue')
            },
            {
                path: 'at',
                name: 'at',
                component: () =>
                    import ('../views/At.vue')
            },
            {
                path: 'like',
                name: 'like',
                component: () =>
                    import ('../views/Like.vue')
            }
        ]
    },
    {
        path: '/msgboard',
        name: 'MsgBoard',
        meta: {
            requiresAuth: true
        },
        component: () =>
            import ('../views/MsgBoard.vue')
    }
];

const router = new VueRouter({
    mode: 'history',
    linkActiveClass: 'active',
    base: process.env.BASE_URL,
    routes
});
router.beforeEach((to, from, next) => {
    // 检测路由配置中是否有requiresAuth这个meta属性
    if (to.matched.some(record => record.meta.requiresAuth)) {
        // 判断是否已登录
        if (store.getters.isLoggedIn) {
            next();
            return;
        }
        // 未登录则跳转到登录界面
        next('/login');
    } else {
        next();
    }
});
export default router;