import axios from 'axios';
import store from '../../store/index';

// import { Message } from 'element-ui';
// axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8';
function getToken() {
    let tokenObj = {};
    try {
        tokenObj = window.sessionStorage.getItem('token');
        tokenObj = tokenObj ? JSON.parse(tokenObj) : {};
    } catch {
        console.error('get token from localStorage error');
    }
    return tokenObj;
}

function refreshToken() {
    // instance是当前request.js中已创建的axios实例
    return instance
        .post('/api/refreshToken', {
            name: window.sessionStorage.getItem('username') || store.state.currentUser,
            _id: window.sessionStorage.getItem('logid') || store.state.logId
        })
        .then(res => res.data);
}
// 是否正在刷新的标记
let isRefreshing = false;
// 重试队列，每一项将是一个待执行的函数形式
let requests = [];
export function request(config) {
    const instance = axios.create({
        baseURL: '',
        timeout: 10000
            // withCredentials: true // 允许携带cookie
    });
    instance.setToken = obj => {
        instance.defaults.headers['authorization'] = 'Bearer ' + obj.token;
        window.sessionStorage.setItem('token', JSON.stringify(obj)); // 注意这里需要变成字符串后才能放到localStorage中
        // console.log('hi');
    };
    instance.interceptors.request.use(
        config => {
            const tokenObj = getToken();
            if (tokenObj) {
                config.headers['authorization'] = 'Bearer ' + tokenObj.token;
            }
            // if (
            //     config.url.indexOf('/api/refreshToken') >= 0 ||
            //     config.url.indexOf('/api/login') >= 0
            // ) {
            //     return config;
            // }
            // if (tokenObj.token && tokenObj.tokenExpireTime) {
            //     const now = Date.now();
            //     if (now >= tokenObj.tokenExpireTime) {
            //         // 立即刷新token
            //         if (!isRefreshing) {
            //             // console.log('刷新token ing');
            //             isRefreshing = true;
            //             refreshToken()
            //                 .then(res => {
            //                     // console.log(res);
            //                     const { token, tokenExprieIn } = res;
            //                     const tokenExpireTime = now + tokenExprieIn * 1000;
            //                     instance.setToken({ token, tokenExpireTime });
            //                     isRefreshing = false;
            //                     return token;
            //                 })
            //                 .then(token => {
            //                     // console.log('刷新token成功，执行队列');
            //                     requests.forEach(cb => cb(token));
            //                     // 执行完成后，清空队列
            //                     requests = [];
            //                 })
            //                 .catch(res => {
            //                     console.error('refresh token error: ', res);
            //                 });
            //         }
            //         const retryOriginalRequest = new Promise(resolve => {
            //             requests.push(token => {
            //                 // 因为config中的token是旧的，所以刷新token后要将新token传进来
            //                 config.headers['authorization'] = 'Bearer ' + token;
            //                 resolve(config);
            //             });
            //         });
            //         return retryOriginalRequest;
            //     }
            // }

            // if (config.ContentType) {
            //     config.headers[('Content-Type', config.ContentType)];
            // }
            // console.log(config);
            return config;
        },
        err => {
            // console.log(err);
            return Promise.reject(err);
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
                        const tokenObj = getToken();
                        const config = error.response.config;
                        // console.log(config);
                        if (!tokenObj.tokenExpireIn) {
                            if (!isRefreshing) {
                                isRefreshing = true;
                                return refreshToken()
                                    .then(res => {
                                        // console.log(res);
                                        // const { token } = res.data;
                                        // instance.setToken({ token });
                                        const { token, tokenExpireIn } = res;
                                        const tokenExpireTime = Date.now() + tokenExpireIn * 1000;
                                        instance.setToken({
                                            token,
                                            tokenExpireTime,
                                            tokenExpireIn
                                        });
                                        // console.log('if');
                                        config.headers['authorization'] = token;
                                        config.baseURL = '';
                                        // 已经刷新了token，将所有队列中的请求进行重试
                                        requests.forEach(cb => cb(token));
                                        requests = [];
                                        return instance(config);
                                    })
                                    .catch(res => {
                                        console.error('refreshtoken error =>', res);
                                        // window.location.href = '/';
                                    })
                                    .finally(() => {
                                        isRefreshing = false;
                                    });
                            } else {
                                // 正在刷新token，将返回一个未执行resolve的promise
                                return new Promise(resolve => {
                                    // 将resolve放进队列，用一个函数形式来保存，等token刷新后直接执行
                                    requests.push(token => {
                                        config.baseURL = '';
                                        config.headers['authorization'] = token;
                                        resolve(instance(config));
                                    });
                                });
                            }
                        } else {
                            // console.log('else');
                            store.dispatch('LogOut').then(
                                rs => {
                                    ELEMENT.Message.error('请重新登录');

                                    store.commit('statusChange', true);
                                }
                                // console.log(rs);
                            );
                        }

                        // alert('请重新登录');
                }
                //跳转登录
                // this.$store.dispatch(logout);
            }
        }
    );

    console.log(count);
    return instance(config);
}