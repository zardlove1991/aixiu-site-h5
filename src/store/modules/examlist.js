import API from '@/api/module/examination'
import { formatDate } from '@/utils/utils'

import {
  GET_EXAM_LIST, SET_EXAM_LIST,
  SET_CURRENTEXAM_PAGE, SET_EXAMLIST_STATUS,
  SET_EXAMLIST_TYPE
} from '../mutation-types'
import { Toast, Indicator } from 'mint-ui'

const state = {
  examListType: -1,
  examListStatus: -1,
  currentExamPage: 1,
  currentExamList: []
}

const getters = {
  examListType: state => state.examListType,
  examListStatus: state => state.examListStatus,
  currentExamPage: state => state.currentExamPage,
  examList (state) {
    let list = state.currentExamList
    list.forEach(item => {
      item.end_time = formatDate(item.end_time, 'YYYY/MM/DD hh:mm', true)
      item.submit_times = formatDate(item.submit_time, 'YYYY/MM/DD hh:mm', true)
      // 判断是否转换失败的
      if (item.end_time.includes('NaN')) item.end_time = ''
      if (item.submit_times.includes('NaN')) item.submit_times = ''
    })
    return list
  },
  unexamList (state) {
    let list = state.currentExamList

    list.forEach(item => {
      let statusMapping = {
        '0': {name: '未开始', key: 'unstart'},
        '1': {name: '进行中', key: 'progressing'},
        '2': {name: '已结束', key: 'colsed'}
      }
      item.end_time = formatDate(item.end_time, 'YYYY/MM/DD hh:mm', true)
      item.statusMapping = statusMapping[ item.status ]
      // 判断是否转换失败的
      if (item.end_time.includes('NaN')) item.end_time = ''
    })

    return list
  },
  examOnlineList (state) {
    let list = state.currentExamList
    // 处理数据 处理当前已做状态
    list.map(item => {
      // 判断是否全部答题完毕
      if (item.question_num === item.answer_question_num) item['isAllDone'] = true
      // 计算当前答题百分比
      item['progress'] = parseInt(Number(item.answer_question_num / item.question_num).toFixed(2) * 100)
    })
    // 返回数据
    return list
  }
}

const mutations = {
  [SET_EXAM_LIST] (state, list) {
    let currentExamPage = state.currentExamPage
    let originExamList = state.currentExamList
    // 这边判定当不是第一页的时候才进行拼接数据
    if (list.length && currentExamPage !== 1) state.currentExamList = originExamList.concat(list)
    else state.currentExamList = list
  },
  [SET_CURRENTEXAM_PAGE] (state, pageNum) {
    if (pageNum) state.currentExamPage = pageNum
    else state.currentExamPage++
  },
  [SET_EXAMLIST_TYPE] (state, type) {
    state.examListType = type
  },
  [SET_EXAMLIST_STATUS] (state, status) {
    state.examListStatus = status
  }
}

const actions = {
  [GET_EXAM_LIST] ({state, commit}, {status, type}) {
    return new Promise((resolve, reject) => {
      let params = Object.assign({}, {
        page: state.currentExamPage,
        count: 20,
        type
      })
      // 只有考试的时候才加上status参数
      if (type === 1 && status) params['status'] = status

      Indicator.open({ spinnerType: 'fading-circle' })
      API.getExamlist({ params }).then(res => {
        let list = res.data
        if (list && list.length) {
          commit(SET_EXAM_LIST, list)
          commit(SET_CURRENTEXAM_PAGE)
          commit(SET_EXAMLIST_TYPE, type)
          commit(SET_EXAMLIST_STATUS, status)
        }
        Indicator.close()
        resolve()
      }).catch(err => {
        Indicator.close()
        Toast(err.error_message)
        reject(err)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
