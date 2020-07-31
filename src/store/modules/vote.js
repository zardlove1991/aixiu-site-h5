const state = {
  voteStatus: null,
  shareData: null
}

const getters = {
  voteStatus: state => state.voteStatus,
  shareData: state => state.shareData
}

const mutations = {
  SET_VOTE_STATUS (state, payload) {
    state.voteStatus = payload
  },
  SET_SHARE_DATA (state, payload) {
    state.shareData = payload
  }
}

const actions = {
  SET_VOTE_STATUS ({ commit }, data) {
    commit('SET_VOTE_STATUS', data)
  },
  SET_SHARE_DATA ({ commit }, data) {
    commit('SET_SHARE_DATA', data)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
