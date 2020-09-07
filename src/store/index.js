import Vue from 'vue'
import Vuex from 'vuex'

import user from '../modules/user'
import auction from '../modules/auction'
import userAuctions from '../modules/userAuctions'
import activeAuctions from '../modules/activeAuctions'
import socket from "../modules/socket";

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    user,
    auction,
    userAuctions,
    activeAuctions,
    socket
  }
})

export default store;
