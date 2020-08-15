import { request } from '../network/request';
import axios from 'axios';
export default {
    Login({ commit }, user) {
        return new Promise((resolve, reject) => {
            commit('auth_request');
            // 向后端发送请求，验证用户名密码是否正确，请求成功接收后端返回的token值，利用commit修改store的state属性，并将token存放在localStorage中
            request({
                    method: 'post',
                    url: '/api/login',
                    data: user
                })
                .then(res => {
                    console.log(res);
                    const token = res.data.token;
                    const user = res.data.userInfo;
                    localStorage.setItem('token', token);
                    localStorage.setItem('username', user);
                    // 每次请求接口时，需要在headers添加对应的Token验证
                    axios.defaults.headers.common['authorization'] = 'Bearer ' + token;
                    // 更新token
                    commit('auth_success', token, user);
                    resolve(res);
                })
                .catch(err => {
                    commit('auth_error');
                    localStorage.removeItem('token');
                    reject(err);
                });
        });
    },
    LogOut({ commit, state }) {
        return new Promise((resolve, reject) => {
            request({
                    url: '/api/logout'
                })
                .then(response => {
                    commit('logout');
                    localStorage.setItem('username', null);
                    localStorage.setItem('token', '');
                    // 移除之前在axios头部设置的token,现在将无法执行需要token的事务
                    delete axios.defaults.headers.common['authorization'];
                    resolve(response);
                })
                .catch(error => {
                    reject(error);
                });
        });
    }
};