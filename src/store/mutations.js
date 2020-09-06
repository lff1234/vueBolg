export default {
    auth_request(state) {
        state.status = 'loading';
    },
    auth_success(state, token, username, logid, avator) {
        state.status = 'success';
        state.token = token;
        state.currentUser = username;
        state.logId = logid;

        state.avator = avator;
    },
    auth_error(state) {
        state.status = 'error';
    },
    logout(state) {
        state.status = '';
        state.token = '';
    },
    UpdateCommentList(state, comment) {
        state.commentList = comment;
    }
};