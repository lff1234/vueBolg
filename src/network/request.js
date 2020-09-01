import axios from 'axios';
import store from '../store/index';
// axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8';
export function request(config) {
    const instance = axios.create({
        baseURL: 'http://localhost:8700',
        timeout: 10000
    });
    instance.interceptors.request.use(
        config => {
            if (window.localStorage.getItem('token')) {
                config.headers['authorization'] =
                    'Bearer ' + window.localStorage.getItem('token');
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
                        store.dispatch('LogOut');
                        // alert('请重新登录');
                        // this.$router.push('/login');
                }
                //跳转登录
                // this.$store.dispatch(logout);
            }
        }
    );
    return instance(config);
}