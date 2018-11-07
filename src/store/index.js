import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger' // vuex中自带logger插件
import examlist from './modules/examlist'
import examonline from './modules/examonline'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    examlist,
    examonline
  },
  plugins: debug ? [ createLogger() ] : []
})
