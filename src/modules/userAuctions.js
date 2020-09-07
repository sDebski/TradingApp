import axios from "axios";

const API_USER_ENDPOINT = "/api/users";

const state = {
  userActiveIssuedAuctions: [],
  userObservedAuctions: [],
  userWonAuctionsHistory: [],
  userIssuedAuctionsHistory: [],
}

const getters = {
  getActiveAuctionsIssuedByUser: state => state.userActiveIssuedAuctions,
  getUserWonAuctions: state => state.userWonAuctionsHistory,
  getUserIssuedAuctionsHistory: state => state.userIssuedAuctionsHistory,
  getAuctionsObservedByUser: state => state.userObservedAuctions,
}

const actions = {
  fetchUserWonAuctions: function({commit}, userId){
    return axios.get(`${API_USER_ENDPOINT}/${userId}/observed/won`, {withCredentials: true})
      .then(resp => commit("user_wonAuctions_loaded", resp.data));
  },
  fetchUserIssuedAuctionsHistory: function({commit}, userId){
    return axios.get(`${API_USER_ENDPOINT}/${userId}/history`, {withCredentials: true})
      .then(resp => commit("user_issuedAuctionsHistory_loaded", resp.data));
  },
  fetchUserObservedAuctions: function({commit}, userId){
    return axios.get(`${API_USER_ENDPOINT}/${userId}/observed`, {withCredentials: true})
      .then(resp => commit("user_observedAuctions_loaded", resp.data));
  },
  fetchUserActiveIssuedAuctions: function({commit}, userId){
    return axios.get(`${API_USER_ENDPOINT}/${userId}/auctions`, {withCredentials: true})
      .then(resp => commit("user_activeIssuedAuctions_loaded", resp.data));
  },
  applyObservedAuctionStateChange: function({commit, getters}, auction){
    if(getters.getAuctionsObservedByUser.some(auction => auction._id === auction._id)){
      commit("update_observed_auctions", auction);
    }
  }
}

const mutations = {
  user_observedAuctions_loaded(state, observedAuctions){
    state.userObservedAuctions = observedAuctions;
  },
  user_issuedAuctionsHistory_loaded(state, history){
    state.userIssuedAuctionsHistory = history;
  },
  user_wonAuctions_loaded(state, wonAuctions){
    state.userWonAuctionsHistory = wonAuctions;
  },
  user_activeIssuedAuctions_loaded(state, auctions){
    state.userActiveIssuedAuctions = auctions;
  },
  update_observed_auctions(state, auction){
    for(let i = 0; i < state.userObservedAuctions.length; i++){
      if(state.userObservedAuctions[i]._id === auction._id){
        state.userObservedAuctions.splice(i, 1, auction);
        return;
      }
    }
  }
}

export default {
  state,
  actions,
  getters,
  mutations
}
