import { stat } from 'fs';

export default {
    auth_request(state) {
        state.status = 'loading';
    },
    auth_success(state, token, user) {
        state.status = 'success';
        state.token = token;
        state.currentUser = user;
    },
    auth_error(state) {
        state.status = 'error';
    },
    logout(state) {
        state.status = '';
        state.token = '';
    }
};