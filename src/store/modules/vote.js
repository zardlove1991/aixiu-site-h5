const state = {
  isModelShow: false,
  shareData: null,
  myVote: null,
  recruitScrollY: 0,
  isBtnAuth: null
}

const getters = {
  isModelShow: state => state.isModelShow,
  shareData: state => state.shareData,
  myVote: state => state.myVote,
  recruitScrollY: state => state.recruitScrollY,
  isBtnAuth: state => state.isBtnAuth
}

const mutations = {
  SET_IS_MODEL_SHOW (state, payload) {
    state.isModelShow = payload
  },
  SET_SHARE_DATA (state, payload) {
    state.shareData = payload
  },
  SET_MY_VOTE (state, payload) {
    state.myVote = payload
  },
  SET_IS_BTN_AUTH (state, payload) {
    state.isBtnAuth = payload
  },
  SET_SCROllY (state, payload) {
    state.recruitScrollY = payload
  }
}

const actions = {
  SET_IS_MODEL_SHOW ({ commit }, data) {
    commit('SET_IS_MODEL_SHOW', data)
  },
  SET_SHARE_DATA ({ commit }, data) {
    commit('SET_SHARE_DATA', data)
  },
  SET_MY_VOTE ({ commit }, data) {
    commit('SET_MY_VOTE', data)
  },
  SET_IS_BTN_AUTH ({ commit }, data) {
    commit('SET_IS_BTN_AUTH', data)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
