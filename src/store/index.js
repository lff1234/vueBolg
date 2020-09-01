import Vue from 'vue';
import Vuex from 'vuex';
import mutations from './mutations';
import actions from './actions';
import getters from './getters';
Vue.use(Vuex);

const state = {
    currentUser: null,
    status: '',
    logId: localStorage.getItem('logid') || '',
    token: localStorage.getItem('token') || '',
    commentList: localStorage.getItem('commentList') || []
};
export default new Vuex.Store({
    state,
    mutations,
    actions,
    getters,
    modules: {}
});