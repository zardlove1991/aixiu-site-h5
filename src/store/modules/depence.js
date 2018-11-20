import API from '@/api/module/examination'
import { Toast, Indicator } from 'mint-ui'
import { DEPENCE } from '@/common/currency'
import { getEnglishChar } from '@/utils/utils'

const state = {
  renderType: null, // 试卷渲染的类型 exam:考试 analysis: 解析
  examId: null, // 试卷Id
  examList: [], // 试卷列表
  examListRoute: null, // 当前初始化试卷列表的路由信息
  examInfo: null, // 试卷信息
  currentSubjectIndex: 0, // 当前题目索引
  token: null // 当前授权的token有参数传递
}

const getters = {
  examList (state) {
    let list = state.examList

    list.map((item, index) => {
      item.typeTip = DEPENCE.getSubjetType(item.type)
      // 添加一个正确信息选项的对象
      item.correntInfo = []
      // 处理下选项数据
      item.options.map((optItem, optIndex) => {
        optItem.selectTip = getEnglishChar(optIndex)
        // 判断是否是正确的选项
        if (optItem.is_true) {
          let correctObj = {}
          correctObj.tip = optItem.selectTip
          correctObj.id = optItem.id
          item.correntInfo.push(correctObj)
        }
      })
    })

    return list
  },
  currentSubjectInfo (state) {
    let list = state.examList
    let index = state.currentSubjectIndex
    return list[index]
  },
  examInfo: state => state.examInfo,
  examId: state => state.examId,
  token: state => state.token,
  examListRoute: state => state.examListRoute,
  renderType: state => state.renderType,
  currentSubjectIndex: state => state.currentSubjectIndex
}

const mutations = {
  SET_RENDER_TYPE (state, payload = 'exam') {
    state.renderType = payload
  },
  SET_EXAMID (state, payload) {
    state.examId = payload
  },
  SET_TOKEN (state, payload) {
    state.token = payload
  },
  SET_EXAMLIST (state, payload) {
    state.examList = payload
  },
  SET_EXAMLIST_ROUTERINFO (state, payload) {
    state.examListRoute = payload
  },
  SET_EXAM_DETAIL (state, payload) {
    state.examInfo = payload
  },
  SET_CURRENT_SUBJECT_INDEX (state, payload) {
    state.currentSubjectIndex = payload
  }
}

const actions = {
  GET_EXAMLIST ({state, commit}, payload) {
    return new Promise((resolve, reject) => {
      let { id, pageNum, renderType } = payload

      if (!id) {
        Toast('没有试题ID,请求出错')
        return
      }

      let params = {
        examination_id: id,
        page: pageNum || 1,
        count: 100
      }
      // 开始请求数据
      Indicator.open({ spinnerType: 'fading-circle' })
      API.getExamDetailsList({ params }).then(res => {
        let list = res.data
        commit('SET_EXAMID', id)
        commit('SET_RENDER_TYPE', renderType)
        commit('SET_EXAMLIST', list)
        // 结束
        Indicator.close()
        resolve()
      }).catch(err => {
        Toast(err.error_message || '获取题目列表出错')
        // 结束
        Indicator.close()
        reject(err)
      })
    })
  },
  GET_EXAM_DETAIL ({state, commit}, payload) {
    return new Promise((resolve, reject) => {
      let { id } = payload
      // 开始请求数据
      Indicator.open({ spinnerType: 'fading-circle' })
      API.getExamDetail({ query: { id } }).then(res => {
        let info = res
        commit('SET_EXAM_DETAIL', info)
        // 结束
        Indicator.close()
        resolve()
      }).catch(err => {
        Toast(err.error_message || '获取试卷详情出错')
        // 结束
        Indicator.close()
        reject(err)
      })
    })
  },
  START_EXAM ({state, commit}, payload) {
    return new Promise((resolve, reject) => {
      let id = state.examId
      let params = {}
      // 添加重新开始考试的接口
      if (payload) params.restart = 1
      // 开始请求数据
      Indicator.open({ spinnerType: 'fading-circle' })
      API.startExam({
        query: { id },
        params
      }).then(res => {
        // 结束
        Indicator.close()
        if (res.success === 1) {
          resolve()
        } else {
          throw new Error({error_message: '开始考试出错'})
        }
      }).catch(err => {
        Toast(err.error_message || '获取试卷详情出错')
        // 结束
        Indicator.close()
        reject(err)
      })
    })
  },
  SAVE_ANSWER_RECORDS ({state, commit}, payload) {
    return new Promise((resolve, reject) => {
      let id = state.examId
      let examList = state.examList
      let data = {
        params: []
      }
      // 开始遍历当前答题的数据
      examList.forEach(subject => {
        let tempObj = {
          question_id: subject.id,
          options_id: []
        }
        subject.options.forEach(item => {
          if (item.active) tempObj.options_id.push(item.id)
        })
        let optionsLength = tempObj.options_id.length
        // 判断是否只有一个选项
        if (optionsLength === 1) tempObj.options_id = Number(tempObj.options_id.join(''))
        if (optionsLength) data.params.push(tempObj)
      })
      // 开始请求数据
      Indicator.open({ spinnerType: 'fading-circle' })
      Promise.all([
        API.saveSubjectRecords({ query: { id }, data }),
        API.submitExam({ query: { id } })
      ]).then(([saveInfo, submitInfo]) => {
        // 结束
        Indicator.close()
        if (saveInfo.success === 1 && submitInfo.success === 1) {
          Toast('提交试卷成功')
          resolve()
        } else {
          throw new Error('error')
        }
      }).catch(err => {
        Toast(err.error_message || '提交试卷信息出错，请重试')
        // 结束
        Indicator.close()
        reject(err)
      })
    })
  },
  CHANGE_CURRENT_SUBJECT_INDEX ({state, commit}, payload) {
    let index = state.currentSubjectIndex
    let list = state.examList
    // 判断什么操作 加减 还是 直接赋值
    if (typeof payload === 'string') {
      if (payload === 'add') index++
      else if (payload === 'sub') index--
      // 判断界限
      if (index < 0 || index > list.length - 1) {
        Toast('已经没有题目了~')
        return
      }
    } else if (typeof payload === 'number') {
      index = payload
    }
    commit('SET_CURRENT_SUBJECT_INDEX', index)
  },
  ADD_SELECT_ACTIVE_FLAG ({state, commit}, payload) {
    let index = state.currentSubjectIndex
    let selectIndex = payload
    let examList = state.examList
    let subjectInfo = examList[index]
    let renderType = state.renderType
    // 如果是解析的话直接不可以添加选项状态
    if (renderType === 'analysis') return
    // 处理当前选中的类型
    if (['judge', 'radio'].includes(subjectInfo.type)) {
      subjectInfo.options.map((item, index) => {
        if (index === selectIndex) item.active = true
        else item.active = false
        return item
      })
    } else if (subjectInfo.type === 'checkbox') {
      subjectInfo.options.map((item, index) => {
        if (index === selectIndex) item.active = !item.active
        return item
      })
    }
    examList.splice(index, 1, subjectInfo)
    // 更新试题列表
    commit('SET_EXAMLIST', examList)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
