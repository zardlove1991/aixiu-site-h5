import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger' // vuex中自带logger插件
import depence from './modules/depence'
import vote from './modules/vote'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  state: {
    showErrorDialog: false
  },
  mutations: {
    setDialogVisible (state, flag) {
      state.showErrorDialog = flag
    }
  },
  actions: {
    setDialogVisible (context, flag) {
      context.commit('setDialogVisible', flag)
    }
  },
  modules: {
    depence,
    vote
  },
  plugins: debug ? [ createLogger() ] : []
})
