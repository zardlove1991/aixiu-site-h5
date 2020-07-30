const state = {
  voteStatus: null
}

const getters = {
  voteStatus: state => state.voteStatus
}

const mutations = {
  SET_VOTE_STATUS (state, payload) {
    state.voteStatus = payload
  }
}

const actions = {
  SET_VOTE_STATUS ({ commit }, data) {
    commit('SET_VOTE_STATUS', data)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
