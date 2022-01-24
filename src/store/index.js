import Vue from 'vue';
import Vuex from 'vuex';
import mutations from './mutations';
import actions from './actions';
import getters from './getters';
Vue.use(Vuex);

const state = {
    content: '',
    currentUser: sessionStorage.getItem('username') || '',
    status: false,
    logId: sessionStorage.getItem('logid') || '',
    token: sessionStorage.getItem('token') || '',
    commentList: sessionStorage.getItem('commentList') || [],
    // lists: sessionStorage.getItem('articleList') || [],
    avator: '/api/' + sessionStorage.getItem('avator') || '',
    originalAvator: sessionStorage.getItem('originalAvator') || '',
    timer: null,
    usrCard: {}
};
export default new Vuex.Store({
    state,
    mutations,
    actions,
    getters,
    modules: {}
});