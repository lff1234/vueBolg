import axios from 'axios';
import store from '../store/index';
import router from '../../src/router/index';
// axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8';
export function request(config) {
    const instance = axios.create({
        baseURL: '',
        timeout: 10000
            // withCredentials: true // 允许携带cookie
    });
    instance.interceptors.request.use(
        config => {
            if (window.sessionStorage.getItem('token')) {
                config.headers['authorization'] =
                    'Bearer ' + window.sessionStorage.getItem('token');
            }
            // console.log(config);
            return config;
        },
        err => {
            console.log(err);
        }
    );
    instance.interceptors.response.use(
        res => {
            // console.log(res);
            return res.data;
        },

        error => {
            if (error.response) {
                switch (error.response.status) {
                    case 401:
                        store.dispatch('LogOut').then(
                            rs => {
                                alert('登陆时效已过，请重新登录');
                                router.push('/login');
                            }
                            // console.log(rs);
                        );
                        // alert('请重新登录');
                }
                //跳转登录
                // this.$store.dispatch(logout);
            }
        }
    );
    return instance(config);
}