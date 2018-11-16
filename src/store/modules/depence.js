import API from '@/api/module/examination'
import { Toast, Indicator } from 'mint-ui'
import { DEPENCE } from '@/common/currency'
import { getEnglishChar } from '@/utils/utils'

import MOCK_DATA from '@/common/mock'

const state = {
  renderType: 'exam', // 试卷渲染的类型 exam:考试 analysis: 解析
  examId: null, // 试卷Id
  examList: [], // 试卷列表
  currentSubjectIndex: 0 // 当前题目索引
}

const getters = {
  examList (state) {
    let list = state.examList

    list.map((item, index) => {
      item.typeTip = DEPENCE.getSubjetType(item.type)
      // 处理下选项数据
      item.options.map((optItem, optIndex) => {
        optItem.selectTip = getEnglishChar(optIndex)
        optItem.selectIndex = -1
      })
    })

    return list
  },
  examId (state) {
    return state.examId
  },
  renderType (state) {
    return state.renderType
  },
  currentSubjectIndex (state) {
    return state.currentSubjectIndex
  },
  currentSubjectInfo (state) {
    let list = state.examList
    let index = state.currentSubjectIndex
    return list[index]
  }
}

const mutations = {
  SET_RENDER_TYPE (state, payload) {
    state.renderType = payload
  },
  SET_EXAMID (state, payload) {
    state.examId = payload
  },
  SET_EXAMLIST (state, payload) {
    state.examList = payload
  },
  SET_CURRENT_SUBJECT_INDEX (state, payload) {
    state.currentSubjectIndex = payload
  }
}

const actions = {
  GET_EXAMLIST ({state, commit}, payload) {
    return new Promise((resolve, reject) => {
      let { id, pageNum } = payload

      if (!id) {
        Toast('没有试题ID,请求出错')
        return
      }

      let params = {
        examination_id: id,
        page: pageNum || 1,
        count: 100
      }


      // MOCK
      let list = MOCK_DATA.data
      commit('SET_EXAMID', id)
      commit('SET_EXAMLIST', list)
      resolve()
      // REAL
      // Indicator.open({ spinnerType: 'fading-circle' })
      // API.getExamDetailsList({ params }).then(res => {
      //   let list = res.data
      //   commit('SET_EXAMID', id)
      //   commit('SET_EXAMLIST', list)
      //   // 结束
      //   Indicator.close()
      //   resolve()
      // }).catch(err => {
      //   Toast(err.error_message || '获取题目列表出错')
      //   // 结束
      //   Indicator.close()
      //   reject(err)
      // })
    })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
