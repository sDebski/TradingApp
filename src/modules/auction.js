import axios from 'axios'

const API_URL_HTTPS = '/api'
const API_AUCTIONS_ENDPOINT = `${API_URL_HTTPS}/auctions`

const state = {
  offerPlacingStatus: '',
  offersStatus: '',
  auctionStatus: '',
  auctionCreatingStatus: '',
  auction: { offers: [] }
}

const getters = {
  getAuctionStatus: state => state.auctionStatus,
  getAuction: state => state.auction,
  getOffers: state => state.auction.offers.reverse() ,
  getAuctionCreatingStatus: state => state.auctionCreatingStatus,
  isAvailable: state => {
    return state.auction.isBuyNow && !state.auction.expirationDate
      || Date.parse(state.auction.expirationDate) > Date.parse(new Date())
  }
}

const actions = {
  async fetchAuction ({ commit }, id) {
    commit('fetching_auction')
    const response = await axios.get(`${API_AUCTIONS_ENDPOINT}/${id}`)
    if (response.status === 200) {
      commit('auction_loaded', response.data)
    }
  },
  createAuction: function ({ commit }, { title, expirationDate, price, isBuyNow }) {
    commit('auction_create_request')
    console.log({ title, expirationDate, price, isBuyNow, isActive: false })
    return axios.post(
      API_AUCTIONS_ENDPOINT,
      { title, expirationDate, price, isBuyNow, isActive: false },
      { withCredentials: true })
      .catch(() => commit('auction_create_error'))
      .then(resp => {
        commit('auction_create_created')
        return resp.data
      })
  },
  applyAuctionStateChange: function({commit}, auction){
    commit("auction_state_change", auction)
  },
  updateAuction: function ({ commit }, { auctionId, expirationDate, title, isBuyNow, price }) {
    commit('auction_patch_request')
    return axios.patch(`${API_AUCTIONS_ENDPOINT}/${auctionId}`,
      { expirationDate, title, isBuyNow, price },
      { withCredentials: true })
      .then(() => commit('auction_patch_successful'))
  },
  startAuction: function ({ commit }, id) {
    commit('auction_patch_request')
    return axios.patch(
      `${API_AUCTIONS_ENDPOINT}/${id}`,
      { isActive: true },
      { withCredentials: true })
      .then(() => commit('auction_patch_successful'))
  }
}

const mutations = {

  auction_state_change(state, auction){
    state.auction = auction;
  },

  /// ===== AUCTION FETCHING ======= ///
  fetching_auction (state) {
    state.auctionStatus = 'loading'
  },
  auction_loaded (state, auction) {
    state.auctionStatus = 'successful'
    state.auction = auction
  },

  /// ===== AUCTION OFFERS FETCHING ======= ///
  fetching_offers (state) {
    state.offersStatus = 'loading'
  },
  offers_loaded (state, offers) {
    state.offersStatus = 'successful'
    state.offers = offers.reverse()
  },

  /// ===== AUCTION CREATING ======= ///
  auction_create_request (state) {
    state.auctionCreatingStatus = 'loading'
  },
  auction_create_created (state) {
    state.auctionCreatingStatus = 'successful'
  },
  auction_create_error (state) {
    state.auctionCreatingStatus = 'error'
  },

  /// ===== AUCTION PATCHING  ===== ///
  auction_patch_request (state) {
    state.auctionPatchStatus = 'loading'
  },
  auction_patch_successful (state) {
    state.auctionPatchStatus = 'successful'
  },

}

export default {
  state,
  getters,
  actions,
  mutations
}
