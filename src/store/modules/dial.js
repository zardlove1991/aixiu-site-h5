const state = { isModelShow: false }

const getters = { isModelShow: state => state.isModelShow }

const mutations = { SET_IS_MODEL_SHOW (state, payload) { state.isModelShow = payload }
}

const actions = { SET_IS_MODEL_SHOW ({ commit }, data) { commit('SET_IS_MODEL_SHOW', data) } }

export default { namespaced: true, state, getters, actions, mutations }