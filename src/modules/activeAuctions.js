import axios from 'axios';

const API_URL_HTTPS = "/api";
const API_AUCTIONS_ENDPOINT = `${API_URL_HTTPS}/auctions`;

const state = {
  activeAuctionsStatus: "",

  pageLimit: 5,
  totalAmount: 0,

  currentPage: 0,
  totalPages: 0,

  auctions: [],
}

const getters = {
  getPagedActiveAuctions: state => { return {
    auctions: state.auctions,
    limit: state.pageLimit,
    totalAmount: state.totalAmount,
    currentPage: state.currentPage,
    totalPages: state.totalPages
  }}
}

const actions = {
  fetchAuctions: async function({commit}, {page}){
    commit("fetching_auctions");
    let response = await axios.get(API_AUCTIONS_ENDPOINT, { params: { isActive: true, limit: 5, page }});
    commit("auctions_loaded", response.data);
  },
  applyAuctionStateChange: function({commit, getters}, auction){
    if(getters.getPagedActiveAuctions.auctions.some(auction => auction._id === auction._id)){
      commit("update_auctions", auction);
    }
  }
}

const mutations = {
  fetching_auctions(state){
    state.activeAuctionsStatus = "loading";
  },
  auctions_loaded(state, paged){
    state.activeAuctionsStatus = "loaded";
    state.auctions = paged.auctions;
    state.pageLimit = paged.limit;
    state.currentPage = paged.page;
    state.totalAmount = paged.totalAmount;
    state.totalPages = paged.totalPages
  },
  update_auctions(state, auction){
    for(let i = 0; i < state.auctions.length; i++){
      if(state.auctions[i]._id === auction._id){
        state.auctions.splice(i, 1, auction);
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
