import axios from 'axios'

const API_URL_HTTPS = '/api'
const API_LOGIN_ENDPOINT = `${API_URL_HTTPS}/login/`
const API_USERS_ENDPOINT = `${API_URL_HTTPS}/users/`
const API_USER_CHAT_HISTORY = `${API_URL_HTTPS}/messenger/`

const state = {
  registerStatus: '',
  registerError: '',
  authStatus: '',
  authError: '',
  allLoginsStatus: '',
  userChatStatus: '',
  user: JSON.parse(localStorage.getItem('user')),
  issuedAuctions: [],
  observedAuctions: [],
  usersArray: [],
  userChatHistoryArray: [],
  notSeenMassagesArray: [],
}

const getters = {
  isLoggedIn: state => !!state.user,
  getAuthStatus: state => state.authStatus,
  getAuthError: state => state.authError,
  getRegisterStatus: state => state.registerStatus,
  getRegisterError: state => state.registerError,
  getAllLoginsStatus: state => state.allLoginsStatus,
  usersArray: state => state.usersArray,
  user: state => state.user,
  getUserChatHistoryArray: state => state.userChatHistoryArray,
  getNotSeenMessagesArray: state => state.notSeenMassagesArray
}

const actions = {
  getAllUsersLogins ({ commit }, user){
    commit('allLogins_request')
    return axios.get(API_USERS_ENDPOINT)
      .catch(() => commit('allLogins_error'))
      .then((response) => {
        if(response.status !== 200) {
          commit('allLogins_error')
          return null;
        } else commit('allLogins_successful',
          response.data
            .map(u => u.username)
            .filter(username => username !== user.username
        ))
      })
  },
  getUserChatHistory ( {commit}, payload ) {
    commit('userChat_request')
    return axios.get(API_USER_CHAT_HISTORY + payload.recipient, { withCredentials: true})
      .catch(() => commit('userChat_error'))
      .then((response) => {
        if( response.status !== 200) {
          commit('userChat_error')
          return [];
        } else {
          commit('userChat_successful', response.data
            .map(msg => {
              return {
                id: msg._id,
                sender: msg.sender,
                message: msg.message
              }
            }))
        }
      })
  },
  clearNotSeenMessages({commit}){
    commit('clear_notSeenMessages')
  },
  addNotSeenMessage({commit}, payload){
    commit('add_notSeenMessage', payload)
  },
  login ({ commit }, user) {
    commit('auth_request')
    return axios.post(API_LOGIN_ENDPOINT, user, { withCredentials: true })
      .then((response) => {
        localStorage.setItem('user', JSON.stringify(response.data))
        commit('auth_successful', response.data)
        return response.data
      })
      .catch(() => {
        commit("auth_error", "Username or password invalid")
      })
  },
  logout ({ commit }) {
    return axios.delete(API_LOGIN_ENDPOINT)
      .then(() => {
        console.log('deletuje')
        localStorage.removeItem('user')
        commit('auth_logout')
      })
  },
  register ({ commit }, { username, password }) {
    commit('register_request')
    return axios.post(API_USERS_ENDPOINT, { username, password })
      .then(() => commit("register_successful"))
      .catch(error => commit("register_error", error.response.data.msg));
  }
}

const mutations = {
  clear_notSeenMessages(state) {
    state.notSeenMassagesArray = []
  },
  add_notSeenMessage(state, message) {
    state.notSeenMassagesArray.push({
      message: message.message,
      sender: message.sender,
      id: message.id
    })
  },

  /// ===== AUTH ======== ///
  auth_request (state) {
    state.authStatus = 'loading'
  },
  auth_error (state, msg) {
    state.authError = msg
    state.authStatus = 'error'
  },
  auth_successful (state, user) {
    state.user = user
    state.authStatus = 'successful'
  },
  auth_logout (state) {
    state.usersArray = []
    state.userChatHistoryArray = []
    state.notSeenMassagesArray = []
    state.user = null
    state.authStatus = 'loggedOut'
  },

  /// ===== REGISTER ======== ///
  register_request (state) {
    state.registerStatus = 'loading'
  },
  register_error (state, msg) {
    state.registerError = msg
    state.registerStatus = 'error'
  },
  register_successful (state) {
    state.registerStatus = 'successful'
  },

  allLogins_request (state) {
    state.allLoginsStatus = 'loading'
  },
  allLogins_error (state) {
    state.allLoginsStatus = 'error'
  },
  allLogins_successful (state, loginsArray) {
    state.usersArray = loginsArray
    state.allLoginsStatus = 'successful'
  },

  userChat_request (state) {
    state.userChatStatus = 'loading'
  },
  userChat_error (state) {
    state.userChatStatus = 'error'
  },
  userChat_successful (state, chatHistoryArray) {
    state.userChatHistoryArray = chatHistoryArray
    state.userChatStatus = 'successful'
  }

}

export default {
  state,
  getters,
  actions,
  mutations
}
