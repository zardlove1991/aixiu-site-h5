import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger' // vuex中自带logger插件
import examlist from './modules/examlist'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    examlist
  },
  plugins: debug ? [ createLogger() ] : []
})
