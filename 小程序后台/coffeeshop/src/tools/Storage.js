import { createStore } from 'vuex'

const Store = createStore({
    state() {
        return {
            userName: 'admin',
            userPassword: '123456',
        }
    },
    getters: {
        isLogin(state) {
            return state.userName.length > 0
        }
    },
    mutations: {
        cleraUserInfo(state) {
            state.userName = '';
            state.userPassword = '';
        },
        registUserInfo(state, { name, password }) {
            state.userName = name;
            state.userPassword = password;
        }
    }
})
export default Store