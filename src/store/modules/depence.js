import API from '@/api/module/examination'
import STORAGE from '@/utils/storage'
import { Toast, Indicator } from 'mint-ui'
import { METHODS } from '@/common/currency'
import { getEnglishChar, dealAnnexObject } from '@/utils/utils'

const state = {
  renderType: null, // 试卷渲染的类型 exam:考试 analysis: 解析
  examId: null, // 试卷Id
  examList: [], // 试卷列表
  redirectParams: null, // 小程序和H5中的传参
  examInfo: null, // 试卷信息
  currentSubjectIndex: 0, // 当前题目索引
  answerCardInfo: null, // 答题卡当前的信息
  isShowModelThumb: false, // 判断界面是否有弹窗展示
  essayAnswerInfo: {} // 保存试题中的问答题表单信息
}

const getters = {
  examList (state) {
    let list = state.examList
    list.map((item, index) => {
      item.typeTip = METHODS.getSubjetType(item.type)
      // 添加一个正确信息选项的对象
      item.correntInfo = []
      item.answersInfo = []
      // 处理下annex对象数据的兼容性
      item.annex = dealAnnexObject(item.annex)
      // 处理点评字段
      if (item.remark) {
        item.remark = {
          ...item.remark,
          content: dealAnnexObject(item.remark.content)
        }
      }
      // 处理下选项数据
      item.options.map((optItem, optIndex) => {
        optItem.selectTip = getEnglishChar(optIndex)
        // 处理下annex对象数据的兼容性
        optItem.annex = dealAnnexObject(optItem.annex)
        // 声明一个临时对象
        let correctObj = {}
        correctObj.tip = optItem.selectTip
        correctObj.id = optItem.id
        // 判断是否是正确的选项
        if (optItem.is_true) {
          item.correntInfo.push(correctObj)
        }
        // 判断是否有答题信息
        let answers = item.answer
        if (answers && answers.includes(optItem.id)) {
          // 添加回答的参数
          item.answersInfo.push(correctObj)
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
  redirectParams: state => state.redirectParams,
  renderType: state => state.renderType,
  currentSubjectIndex: state => state.currentSubjectIndex,
  answerCardInfo: state => state.answerCardInfo,
  isShowModelThumb: state => state.isShowModelThumb,
  essayAnswerInfo: state => state.essayAnswerInfo
}

const mutations = {
  SET_RENDER_TYPE (state, payload = 'exam') {
    state.renderType = payload
  },
  SET_ANSWERCARD_INFO (state, payload) {
    state.answerCardInfo = payload
  },
  SET_MODEL_THUMB_STATE (state, payload) {
    state.isShowModelThumb = payload
  },
  SET_EXAMID (state, payload) {
    state.examId = payload
  },
  SET_EXAMLIST (state, payload) {
    state.examList = payload
  },
  SET_REDIRECT_PARAMS (state, payload) {
    state.redirectParams = payload
  },
  SET_EXAM_DETAIL (state, payload) {
    state.examInfo = payload
  },
  SET_CURRENT_SUBJECT_INDEX (state, payload) {
    state.currentSubjectIndex = payload
  },
  SET_ESSAY_ANSWER_INFO (state, payload) {
    state.essayAnswerInfo = Object.assign({}, payload)
  }
}

const actions = {
  GET_EXAMLIST ({state, commit}, payload) {
    return new Promise((resolve, reject) => {
      let { id, pageNum, renderType, listType } = payload

      if (!id) {
        Toast('没有试题ID,请求出错')
        return
      }

      let params = {
        examination_id: id,
        page: pageNum || 1,
        count: 100
      }
      // 开始请求数据 更具listType决定请求的方法
      let reqMethodName = (listType === 'errorlist' ? 'getLatestErrorList' : 'getExamDetailsList')
      Indicator.open({ spinnerType: 'fading-circle' })
      API[reqMethodName]({ params }).then(res => {
        let list = res.data
        let essayAnswerInfo = state.essayAnswerInfo
        if (list && list.length) {
          commit('SET_EXAMID', id)
          commit('SET_RENDER_TYPE', renderType)
          // 添加初始化active的状态
          list.forEach((subject, index) => {
            subject.options.forEach((item, itemIdx) => {
              // 做答题数据兼容 选项数据全部转换成字符串
              let answers = subject.answer && subject.answer.map(id => String(id))
              item.id = String(item.id)

              if (answers && answers.includes(item.id)) {
                // 判断是否是解析状态展示
                if (renderType === 'analysis') {
                  if (item.is_true) item.active = true
                  else item.error = true
                } else {
                  item.active = true
                }
              }
            })
            // 初始化为问答题的基础提交数据对象
            if (subject.type === 'essay') {
              let essayData = subject.essay_answer || { text: '', image: [], audio: [], video: [] }
              // 赋值数据
              essayAnswerInfo[subject.id] = essayData
            }
          })
          // 设置列表和问答题的出事对象
          commit('SET_EXAMLIST', list)
          commit('SET_ESSAY_ANSWER_INFO', essayAnswerInfo)
        } else {
          throw new Error('初始化试题列表失败')
        }
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
        Indicator.close() // 结束
        let info = res
        commit('SET_EXAM_DETAIL', info)
        resolve()
      }).catch(err => {
        Indicator.close() // 结束
        reject(err)
      })
    })
  },
  GET_ANSWERCARD_INFO ({state, commit}, payload) {
    return new Promise((resolve, reject) => {
      let { id } = payload
      // 开始请求数据
      Indicator.open({ spinnerType: 'fading-circle' })
      API.getRecord({ query: { id } }).then(res => {
        // 结束
        Indicator.close()
        let info = res
        // 判断是否有错误
        if (!info.error_code) {
          commit('SET_ANSWERCARD_INFO', info)
          resolve()
        } else {
          throw new Error(info.error_message)
        }
      }).catch(err => {
        Toast(err.error_message || '获取答题卡信息出错')
        // 结束
        Indicator.close()
        reject(err)
      })
    })
  },
  START_EXAM ({state, commit}, payload) {
    return new Promise((resolve, reject) => {
      let id = state.examId || payload.id
      let params = {}
      // 添加重新开始考试的接口
      if (payload.restart) params.restart = 1
      // 开始请求数据
      API.startExam({
        query: { id },
        params
      }).then(res => {
        if (res.success === 1) {
          resolve()
        } else {
          throw new Error({error_message: '开始考试出错'})
        }
      }).catch(err => {
        reject(err)
      })
    })
  },
  END_EXAM ({state, commit}, payload) {
    return new Promise((resolve, reject) => {
      let id = state.examId || payload.id
      // 开始请求数据
      Indicator.open({ spinnerType: 'fading-circle' })
      API.submitExam({ query: { id } }).then(res => {
        // 结束
        Indicator.close()
        if (res.success === 1) {
          resolve()
        } else {
          throw new Error({error_message: '结束考试出错'})
        }
      }).catch(err => {
        Toast(err.error_message || '结束考试出错')
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
        let answers = subject.answer // 是否存放已有的选项ID
        if (answers && answers.length) tempObj.options_id = answers

        subject.options.forEach(item => {
          let optionArr = tempObj.options_id
          if (item.active && !optionArr.includes(item.id)) {
            optionArr.push(item.id)
          }
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
  SAVE_ANSWER_RECORD ({state, commit}, payload) {
    return new Promise((resolve, reject) => {
      let id = state.examId
      let renderType = state.renderType
      let essayAnswerInfo = state.essayAnswerInfo
      let subject = payload
      if (renderType === 'analysis') {
        reject(new Error('当前为解析不需要保存答题记录'))
        return
      }
      // 提交的参数
      let data = {
        question_id: subject.id
      }
      // 问答题保存参数和普通题目不同这边需要区分
      if (subject.type !== 'essay') {
        // 添加data参数
        data.options_id = null
        // 筛选当前选中的数据
        let optionsArr = []
        subject.options.forEach(item => {
          if (item.active) optionsArr.push(item.id)
        })
        if (optionsArr.length === 1 && subject.type !== 'checkbox') optionsArr = optionsArr.join('')
        data.options_id = optionsArr
        // 判断是否有选项 没有直接return
        if (!data.options_id || !data.options_id.length) {
          resolve()
          return
        }
      } else {
        let value = essayAnswerInfo[subject.id]
        data.value = value
      }
      // 发送保存答题信息
      API.saveSubjectRecord({
        query: { id },
        data
      }).then(res => {
        if (res.success === 1) {
          resolve()
        } else {
          throw new Error('保存答题记录出错')
        }
      }).catch(err => {
        Toast(err.error_message || err)
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
  },
  SEND_SAVE_RECORD_OPTION ({state, commit, dispatch}, payload) {
    let subject = payload
    let renderType = state.renderType
    let subjectType = subject.type
    // 只有考试的采取记录多选的提交
    let submitTypeArr = ['checkbox', 'essay']
    if (submitTypeArr.includes(subjectType) && renderType === 'exam') {
      // 触发保存答题记录操作
      return dispatch('SAVE_ANSWER_RECORD', subject)
    }
  },
  GET_TENCENT_TOKEN ({commit, state}, payload) {
    return new Promise((resolve, reject) => {
      // 获得任务详情
      API.getTencentToken().then(data => {
        // 判断是否有问题
        if (data.error) throw new Error(data.message)
        // 结束
        resolve(data)
      }).catch(err => {
        // 提醒
        let tip = err.message || err.error_message || '获取腾讯云签名失败'
        Toast(tip)
        reject(err)
      })
    })
  },
  GET_TENCENT_VIDEO_TOKEN ({commit, state}, payload) {
    return new Promise((resolve, reject) => {
      let { type } = payload
      // 获得任务详情
      API.getTencentVideoToken({
        params: { transcode: type }
      }).then(data => {
        // 判断是否有问题
        if (data.error) throw new Error(data.message)
        // 结束
        resolve(data)
      }).catch(err => {
        // 提醒
        let tip = err.message || err.error_message || '获取腾讯云签名失败'
        Toast(tip)
        reject(err)
      })
    })
  },
  GET_MATERIAL_INFO ({commit, state}, payload) {
    return new Promise((resolve, reject) => {
      let { serverIds, type } = payload
      let data = { server_id: serverIds, type }
      Indicator.open({ spinnerType: 'fading-circle' })
      // 获得任务详情
      API.getMaterialInfo({ data }).then(data => {
        // 判断是否有问题
        if (data.error) throw new Error(data.message)
        // 结束
        Indicator.close()
        resolve(data)
      }).catch(err => {
        Indicator.close()
        // 提醒
        let tip = err.message || err.error_message || '获取素材信息出错'
        Toast(tip)
        reject(err)
      })
    })
  },
  GET_WEIXIN_INFO ({commit, state}, payload) {
    return new Promise((resolve, reject) => {
      let { url } = payload
      // 获得微信信息
      API.getWeixinInfo({
        data: { url }
      }).then(data => {
        // 设置数据
        STORAGE.set('weixin-auth-info', data, Number(data.expire_time))
        // 结束
        resolve(data)
      }).catch(err => {
        STORAGE.remove('weixin-auth-info')
        // 提醒
        let tip = err.message || err.error_message || '获取微信认证信息出错'
        Toast(tip)
        reject(err)
      })
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
