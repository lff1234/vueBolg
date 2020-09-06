import Vue from 'vue';
import Vuex from 'vuex';
import mutations from './mutations';
import actions from './actions';
import getters from './getters';
Vue.use(Vuex);

const state = {
    currentUser: null,
    status: '',
    logId: sessionStorage.getItem('logid') || '',
    token: sessionStorage.getItem('token') || '',
    commentList: sessionStorage.getItem('commentList') || [],
    avator: sessionStorage.getItem('avator') || ''
};
export default new Vuex.Store({
    state,
    mutations,
    actions,
    getters,
    modules: {}
});