import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger' // vuex中自带logger插件
import depence from './modules/depence'
import vote from './modules/vote'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'
export default new Vuex.Store({
  state: {
    showErrorDialog: false,
    Cache: []
  },
  mutations: {
    setDialogVisible (state, flag) {
      state.showErrorDialog = flag
    },
    clearCache (state, flag) {
      const index = state.Cache.findIndex(item => item === flag)
      state.Cache.splice(index, 1)
    },
    addCache (state, flag) {
      !state.Cache.includes(flag) && state.Cache.push(flag)
    }
  },
  actions: {
    setDialogVisible (context, flag) {
      context.commit('setDialogVisible', flag)
    },
    clearCache (context, flag) {
      context.commit('clearCache', flag)
    },
    addCache (context, flag) {
      context.commit('addCache', flag)
    }
  },
  getters: {
    Cache: state => state.Cache
  },
  modules: {
    depence,
    vote
  },
  plugins: debug ? [ createLogger() ] : []
})
