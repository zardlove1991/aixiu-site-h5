const state = {
  isModelShow: false,
  shareData: null
}

const getters = {
  isModelShow: state => state.isModelShow,
  shareData: state => state.shareData
}

const mutations = {
  SET_IS_MODEL_SHOW (state, payload) {
    state.isModelShow = payload
  },
  SET_SHARE_DATA (state, payload) {
    state.shareData = payload
  }
}

const actions = {
  SET_IS_MODEL_SHOW ({ commit }, data) {
    commit('SET_IS_MODEL_SHOW', data)
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
