import API from '@/api/module/examination'
import STORAGE from '@/utils/storage'
import { Toast, Indicator } from 'mint-ui'
import { METHODS, DEPENCE } from '@/common/currency'
import { getEnglishChar, dealAnnexObject } from '@/utils/utils'

const state = {
  renderType: null, // 试卷渲染的类型 exam:考试 analysis: 解析
  examId: null, // 试卷Id
  examList: [], // 试卷列表
  redirectParams: null, // 小程序和H5中的传参
  examInfo: null, // 试卷信息
  subjectAnswerInfo: {}, // 当前已回答的题目信息
  currentSubjectIndex: 0, // 当前题目索引
  answerCardInfo: null, // 答题卡当前的信息
  isShowModelThumb: false, // 判断界面是否有弹窗展示
  isShowSubjectList: false, // 是否显示考试答题缩率展示
  essayAnswerInfo: {}, // 保存试题中的问答题表单信息
  answerList: [], // 全部答题信息
  oralAnswerInfo: {}, // 保存语音问答题中的信息
  sortAnswerInfo: {}, // 保存排序的题目的信息
  blankAnswerInfo: {}, // 保存所有类型的填空题信息
  curSubjectVideos: [], // 当前题目下的所有视频组件信息 用来统一控制视频状态
  luckDrawLink: null
}

const getters = {
  examList (state) {
    let list = state.examList
    list.map((item, index) => {
      item.index = index + 1
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
        // 判断是否是正确的选项 PS: 排序题比较特殊每个选项都要保存下
        if (optItem.is_true && item.type !== 'sort') {
          item.correntInfo.push(correctObj)
        } else if (item.type === 'sort') {
          correctObj.extra = optItem.extra // 把排序的额外信息存入 在题目中处理
          item.correntInfo.push(correctObj)
        }
        // 判断是否有答题信息
        let answers = item.answer
        let isHasAns = answers && answers.includes(optItem.id)
        if (isHasAns && item.type !== 'sort') { // 排序题的answer答案在自己题目内部处理
          item.answersInfo.push(correctObj) // 添加回答的参数
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
  subjectAnswerInfo: state => state.subjectAnswerInfo,
  currentSubjectIndex: state => state.currentSubjectIndex,
  answerCardInfo: state => state.answerCardInfo,
  isShowModelThumb: state => state.isShowModelThumb,
  isShowSubjectList: state => state.isShowSubjectList,
  essayAnswerInfo: state => state.essayAnswerInfo,
  answerList: state => state.answerList,
  oralAnswerInfo: state => state.oralAnswerInfo,
  sortAnswerInfo: state => state.sortAnswerInfo,
  blankAnswerInfo: state => state.blankAnswerInfo,
  curSubjectVideos: state => state.curSubjectVideos,
  luckDrawLink: state => state.luckDrawLink
}

const mutations = {
  SET_ANSWER_LIST (state, payload) {
    let list = state.answerList
    let show = false
    // console.log(list, payload, 'bedore_SET_ANSWER_LIST')
    for (let i = 0; i < list.length; i++) {
      let item = list[i]
      if (item.question_id === payload.question_id) {
        item.options_id = payload.options_id
        show = true
        break
      }
    }
    if (!show && payload.question_id) {
      list.push(payload)
    }
    // console.log(state.answerList, 'SET_ANSWER_LIST')
  },
  SET_LUCK_DRAW_LINK (state, payload) {
    state.luckDrawLink = payload
  },
  SET_RENDER_TYPE (state, payload = 'exam') {
    state.renderType = payload
  },
  SET_ANSWERCARD_INFO (state, payload) {
    state.answerCardInfo = payload
  },
  SET_MODEL_THUMB_STATE (state, payload) {
    state.isShowModelThumb = payload
  },
  SET_SUBJECT_LIST_SHOW (state, payload) {
    state.isShowSubjectList = payload
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
    payload.time = payload.start_time
    payload.times = payload.end_time
    if (payload.time && new Date(payload.time.replace(/-/g, '/')).getTime() > new Date().getTime()) {
      payload.timeStatus = 1 // 开始时间大于当前时间 考试未开始
    } else if (payload.times && new Date(payload.times.replace(/-/g, '/')).getTime() < new Date().getTime()) {
      payload.timeStatus = 2 // 结束时间小于于当前时间 考试已结束
    } else {
      payload.timeStatus = 0
    }
    if (payload.indexpic) {
      let url = payload.indexpic
      if (url.constructor === Object) {
        payload.indexpic.url = payload.indexpic.host + payload.indexpic.filename
      } else if (url.constructor === String) {
        payload.indexpic = { url }
      }
    }
    if (payload.limit.background && payload.limit.background.indexpic) {
      payload.limit.background.indexpic.url = payload.limit.background.indexpic.host + payload.limit.background.indexpic.filename
      window.document.getElementById('app').style.backgroundImage = 'url(' + payload.limit.background.indexpic.url + ')'
      if (payload.limit.background.mode && payload.limit.background.mode === 1) {
        // 固定
        window.document.getElementById('app').style.backgroundSize = '100%'
        window.document.getElementById('app').style.backgroundRepeat = 'no-repeat'
      } else {
        // 平铺
        window.document.getElementById('app').style.backgroundSize = '100%'
      }
    }
    payload.start_time = payload.start_time.substring(5, payload.start_time.length)
    payload.end_time = payload.end_time.substring(5, payload.end_time.length)
    state.examInfo = payload
  },
  SET_SUBJECT_ANSWER_INFO (state, payload) {
    state.subjectAnswerInfo = Object.assign({}, payload)
  },
  SET_CURRENT_SUBJECT_INDEX (state, payload) {
    state.currentSubjectIndex = payload
  },
  SET_ESSAY_ANSWER_INFO (state, payload) {
    let list = state.answerList
    for (let key in payload) {
      // console.log(key)
      if (list && list[0]) {
        for (let i = 0; i < list.length; i++) {
          if (list[i].question_id === key) {
            list[i].value = payload[key]
          }
          // console.log(list[i])
        }
      } else {
        let params = {
          'question_id': key,
          'value': payload[key]
        }
        list.push(params)
      }
      // console.log(list, 'SET_ESSAY_ANSWER_INFO')
      state.subjectAnswerInfo[key] = true
    }
    state.essayAnswerInfo = Object.assign({}, payload)
  },
  SET_ORAL_ANSWER_INFO (state, payload) {
    state.oralAnswerInfo = Object.assign({}, payload)
  },
  SET_BLANK_ANSWER_INFO (state, payload) {
    state.blankAnswerInfo = Object.assign({}, payload)
  },
  SET_SORT_ANSWER_INFO (state, payload) {
    state.sortAnswerInfo = Object.assign({}, payload)
  },
  SET_CURSUBJECT_VIDEOS (state, payload) {
    state.curSubjectVideos = payload
  }
}

// 定义一些列表处理方法
function dealInitExamList ({ list, renderType, id }) {
  let tempEassyAnswerInfo = {} // 临时保存当前问答题信息
  let tempOralAnswerInfo = {} // 临时保存语音问答题的数据
  let tempBlankAnswerInfo = {} // 临时保存的填空提数据
  // 处理之前填写数据
  let answerRecord = STORAGE.get('answer_record_' + id)
  if (answerRecord && answerRecord.length) {
    for (let subject of list) {
      for (let item of answerRecord) {
        if (subject.id === item.question_id) {
          if (item.options_id.constructor === String) {
            subject.answer = [item.options_id]
          } else {
            subject.answer = [...item.options_id]
          }
          break
        }
      }
    }
  }
  // 处理列表
  list.forEach((subject, index) => {
    let curType = subject.type
    subject.options.forEach((item, itemIdx) => {
      // 做答题数据兼容 选项数据全部转换成字符串
      let answers = subject.answer && subject.answer.map(id => String(id))
      item.id = String(item.id)
      // 处理答案匹配
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
    if (curType === 'essay') {
      let essayData = subject.essay_answer || { text: '', image: [], audio: [], video: [] }
      // 赋值数据
      tempEassyAnswerInfo[subject.id] = essayData
    } else if (['mandarin', 'englishspoken'].includes(curType)) {
      let oralData = subject.oral_answer || { score: '', value: null, content: null }
      // 赋值数据
      tempOralAnswerInfo[subject.id] = oralData
    } else if (['singleblank', 'mulitblank', 'optionblank'].includes(curType)) {
      let answer = subject.answer
      // 赋值数据
      tempBlankAnswerInfo[subject.id] = [...answer]
    }
  })
  // 返回数据
  return {
    examList: list,
    eassyInfo: tempEassyAnswerInfo,
    oralInfo: tempOralAnswerInfo,
    blankInfo: tempBlankAnswerInfo
  }
}

// 处理提交字段
function dealSaveRecord ({
  subject,
  essayAnswerInfo,
  oralAnswerInfo,
  sortAnswerInfo,
  blankAnswerInfo
}, optionFlag) {
  let dataIsEmpty = false
  if (!subject) {
    subject = {}
  }
  let params = { question_id: subject.id }
  // 问答题保存参数和普通题目不同这边需要区分
  // console.log('dealSaveRecord', params, subject.type)
  if (subject.type === 'essay') {
    // 这边判断提交的问答题数据是否为空 为空就不发送请求
    if (DEPENCE.checkCurEssayEmpty(essayAnswerInfo, subject.id)) {
      dataIsEmpty = true
    } else {
      params.value = essayAnswerInfo[subject.id]
    }
  } else if (subject.type === 'sort') { // 排序题
    let curSortInfo = sortAnswerInfo[subject.id]
    if (curSortInfo && curSortInfo.length) {
      params.value = curSortInfo
    } else {
      dataIsEmpty = true
    }
  } else if (['englishspoken', 'mandarin'].includes(subject.type)) {
    let curOralInfo = oralAnswerInfo[subject.id]
    if (curOralInfo.value && curOralInfo.value.audio.length) {
      params.value = curOralInfo.value
    } else {
      dataIsEmpty = true
    }
  } else if (['singleblank', 'mulitblank', 'optionblank'].includes(subject.type)) {
    let curBlankInfo = blankAnswerInfo[subject.id]
    if (curBlankInfo && curBlankInfo.length > 0) {
      let tmpCount = 0
      for (let val of curBlankInfo) {
        if (val === '') {
          ++tmpCount
        }
      }
      if (tmpCount === curBlankInfo.length) {
        dataIsEmpty = true
      }
    } else {
      dataIsEmpty = true
    }
    if (['singleblank', 'mulitblank'].includes(subject.type)) params.options_id = curBlankInfo
    else if (subject.type === 'optionblank') params.value = curBlankInfo
  } else {
    // 这边针对判断题、单选题、多选题做处理
    let storageSingleSelcectInfo = STORAGE.get('examlist-single-selcectid')
    // 添加data参数
    params.options_id = null
    // 筛选当前选中的数据
    let optionsArr = []
    if (subject.options) {
      subject.options.forEach(item => {
        if (item.active) optionsArr.push(item.id)
      })
    }
    // 针对单选和判断做处理
    if (optionsArr.length === 1 && subject.type !== 'checkbox') {
      optionsArr = optionsArr.join('')
      // 这边保存下当前单选和判断选择的题目ID为了做防止多次请求操作
      if (!storageSingleSelcectInfo || storageSingleSelcectInfo !== optionsArr) {
        STORAGE.set('examlist-single-selcectid', optionsArr)
      } else {
        // 当选择的ID相同时当做为空处理 不发请求 PS: 当为检查是否答案选项的时候可以不用置空
        if (optionFlag !== 'check-answer') optionsArr = []
      }
    }
    params.options_id = optionsArr
    // 判断是否有选项 没有直接return
    let noOptionID = !params.options_id || !params.options_id.length
    if (noOptionID) dataIsEmpty = true
  }
  return { isEmpty: dataIsEmpty, params }
}

const actions = {
  GET_EXAMLIST ({state, commit, dispatch}, payload) {
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
        if (list && list.length) {
          commit('SET_EXAMID', id)
          commit('SET_RENDER_TYPE', renderType)
          // 处理列表的初始化操作
          let { examList, eassyInfo, oralInfo, blankInfo } = dealInitExamList({ list, renderType, id })
          // 设置列表和问答题的出事对象
          commit('SET_EXAMLIST', examList)
          commit('SET_ESSAY_ANSWER_INFO', eassyInfo)
          commit('SET_ORAL_ANSWER_INFO', oralInfo)
          commit('SET_BLANK_ANSWER_INFO', blankInfo)
          // 这边初始化调用判断当前题目是否已做
          list.forEach(subject => dispatch('CHANGE_SUBJECT_ANSWER_INFO', { subject }))
        } else {
          throw new Error('初始化试题列表失败')
        }
        // 结束
        Indicator.close()
        resolve()
      }).catch(err => {
        // Toast(err.error_message || '获取题目列表出错')
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
        // Toast(err.error_message || '获取答题卡信息出错')
        // 结束
        Indicator.close()
        reject(err)
      })
    })
  },
  START_EXAM ({state, commit}, payload) {
    return new Promise((resolve, reject) => {
      let id = state.examId || payload.id
      let params = {
        guid: STORAGE.get('guid')
      }
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
      let storageSingleSelcectInfo = STORAGE.get('examlist-single-selcectid')
      // 开始请求数据
      let mark = 'examination'
      let title = ''
      if (state.examInfo) {
        mark = state.examInfo.mark
        title = state.examInfo.title
      }
      let params = {
        data: [{
          id,
          mark,
          title,
          create_time: parseInt((new Date().getTime()) / 1000)
        }],
        member: STORAGE.get('userinfo')
      }
      // console.log('sumbitUV', params)
      API.sumbitUV({ data: params }).then(res => {
        console.log(res)
      })
      Indicator.open({ spinnerType: 'fading-circle' })
      API.submitExam({ query: { id } }).then(res => {
        // 删除本地缓存的单选的ID信息
        if (storageSingleSelcectInfo) STORAGE.remove('examlist-single-selcectid')
        STORAGE.remove('answer_record_' + id)
        commit('SET_BLANK_ANSWER_INFO', {})
        commit('SET_CURRENT_SUBJECT_INDEX', 0)
        // 结束
        Indicator.close()
        if (res.success === 1) {
          let raffle = res.raffle
          if (raffle && raffle.raffle_url) {
            commit('SET_LUCK_DRAW_LINK', raffle.raffle_url)
          }
          resolve()
        } else {
          throw new Error({error_message: '结束考试出错'})
        }
      }).catch(err => {
        // Toast(err.error_message || '结束考试出错')
        // 结束
        Indicator.close()
        reject(err)
      })
    })
  },
  SAVE_ANSWER_RECORDS ({state, commit}, payload) {
    return new Promise((resolve, reject) => {
      let id = state.examId
      let examList = state.answerList
      if (!id) {
        id = payload.examId
        examList = payload.answerList
      }
      let data = {
        params: []
      }
      data.params = examList
      // console.log(state, 'SAVE_ANSWER_RECORDS')
      // 开始请求数据
      Indicator.open({ spinnerType: 'fading-circle' })
      Promise.all([
        API.saveSubjectRecords({ query: { id }, data })
      ]).then((saveInfo) => {
        // 结束
        Indicator.close()
        if (saveInfo[0].success === 1) {
          STORAGE.remove('answer_record_' + id)
          resolve()
        } else {
          throw new Error('error')
        }
      }).catch(err => {
        // if (err.error_code !== 'invalid-options_id') {
        //   Toast(err.error_message || '提交试卷信息出错，请重试')
        // }
        // 结束
        Indicator.close()
        reject(err)
      })
    })
  },
  SAVE_ANSWER_RECORD ({state, commit, dispatch}, payload) {
    return new Promise((resolve, reject) => {
      let id = state.examId
      let renderType = state.renderType
      let subject = payload
      if (renderType === 'analysis') {
        reject(new Error('当前为解析不需要保存答题记录'))
        return
      }
      // 更新当前的回答题目的信息
      dispatch('CHANGE_SUBJECT_ANSWER_INFO', { subject, optionFlag: 'save-record' }).then(result => {
        let { isEmpty, params } = result
        // 提交的参数
        let data = Object.assign({}, params)
        // 为空的时候全部return
        if (isEmpty) {
          resolve()
          return
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
          // Toast(err.error_message || err)
          reject(err)
        })
      })
    })
  },
  CHANGE_SUBJECT_ANSWER_INFO ({state, commit}, { subject, optionFlag = 'check-answer' }) {
    return new Promise((resolve, reject) => {
      let subjectAnswerInfo = state.subjectAnswerInfo
      let essayAnswerInfo = state.essayAnswerInfo
      let oralAnswerInfo = state.oralAnswerInfo
      let sortAnswerInfo = state.sortAnswerInfo
      let blankAnswerInfo = state.blankAnswerInfo
      // 通过整理参数的方法判断盖提是否为空
      let result = dealSaveRecord({
        subject,
        essayAnswerInfo,
        oralAnswerInfo,
        sortAnswerInfo,
        blankAnswerInfo
      }, optionFlag)
      // 更改状态
      // console.log('xxxx', result, optionFlag)
      // commit('SET_ANSWER_LIST', result.params)
      commit('SET_ANSWER_LIST', result.params)
      let { isEmpty, params } = result
      if (!subject) {
        subject = {}
      }
      if (isEmpty) {
        subjectAnswerInfo[subject.id] = false
      } else {
        subjectAnswerInfo[subject.id] = true
      }
      // 将每次改动的答案存入
      let key = 'answer_record_' + state.examId
      let arr = STORAGE.get(key)
      if (arr && arr.length) {
        let isExit = false
        for (let item of arr) {
          if (item.question_id === params.question_id) {
            item.options_id = params.options_id
            isExit = true
            break
          }
        }
        if (!isExit) {
          arr = [...arr, params]
        }
      } else {
        if (params.question_id) {
          arr = [params]
        }
      }
      STORAGE.set(key, arr)
      // 这边针对检查答案和保存信息做下区分 (检查的时候不需要频繁提交)
      if (optionFlag === 'check-answer') {
        // 处理当多个更新时候的多次请求
        if (this.changeAnswerTimer) clearTimeout(this.changeAnswerTimer)
        this.changeAnswerTimer = setTimeout(() => {
          // 更新当前的回答题目的信息
          commit('SET_SUBJECT_ANSWER_INFO', subjectAnswerInfo)
          // commit('SET_ANSWER_LIST', result.params)
          // 返回数据
          resolve(result)
        }, 300)
      } else {
        // 返回数据
        resolve(result)
      }
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
    let selectIndex = payload.selectIndex
    let examList = [...state.examList]
    let subjectInfo = examList[payload.index - 1]
    let renderType = state.renderType
    // 如果是解析的话直接不可以添加选项状态
    if (renderType === 'analysis') return
    // 处理当前选中的类型
    if (['judge', 'radio', 'pictureRadio'].includes(subjectInfo.type)) {
      subjectInfo.options.map((item, index) => {
        if (index === selectIndex) item.active = true
        else item.active = false
        return item
      })
    } else if (['checkbox', 'pictureMulti'].includes(subjectInfo.type)) {
      subjectInfo.options.map((item, index) => {
        if (index === selectIndex) item.active = !item.active
        return item
      })
    }
    examList.splice(payload.index - 1, 1, subjectInfo)
    // 更新试题列表
    commit('SET_EXAMLIST', examList)
  },
  SEND_SAVE_RECORD_OPTION ({state, commit, dispatch}, payload) {
    let subject = payload
    let renderType = state.renderType
    let subjectType = subject.type
    // 只有考试的采取记录多选的提交
    let submitTypeArr = [
      'checkbox', 'essay', 'englishspoken', 'mandarin',
      'sort', 'singleblank', 'mulitblank', 'optionblank'
    ]
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
      let { url, sign, appid } = payload
      // 获得微信信息
      API.getWeixinInfo({
        params: {
          url,
          sign,
          appid
        }
      }).then(data => {
        // 设置数据
        // STORAGE.set('weixin-auth-info', data, Number(data.expire_time))
        // 结束
        resolve(data)
      }).catch(err => {
        // STORAGE.remove('weixin-auth-info')
        // 提醒
        let tip = err.message || err.error_message || '获取微信认证信息出错'
        Toast(tip)
        reject(err)
      })
    })
  },
  GET_QCLOUD_VIDEO_INFO ({state, commit}, payload) {
    return new Promise((resolve, reject) => {
      let { fileid } = payload
      // 添加参数
      let params = { fileid }

      API.getQcloudVideoInfo({ params }).then(data => {
        // 判断是否有问题
        if (data.error) throw new Error(data.message)
        // 结束
        resolve(data)
      }).catch(err => {
        // 提醒
        let tip = err.message || err.error_message || '获取视频信息失败'
        Toast(tip)
        reject(err)
      })
    })
  },
  ADD_CURSUBJECT_VIDEOS_INFO ({state, commit}, payload) {
    let { video } = payload
    let curSubjectVideos = state.curSubjectVideos
    // 排除相同video的信息
    if (curSubjectVideos.length) {
      let isInludeVideo = curSubjectVideos.some(item => item.src === video.src)
      if (isInludeVideo) curSubjectVideos.push(video)
    } else {
      curSubjectVideos.push(video)
    }
    commit('SET_CURSUBJECT_VIDEOS', curSubjectVideos)
  },
  UNLOCK_COURSE ({state, commit}, payload) {
    return new Promise((resolve, reject) => {
      let params = { id: state.examId }
      // 开始请求数据
      API.unlockCourse({ params }).then(res => resolve()).catch(err => reject(err))
    })
  },
  SET_SHARE ({state, commit}, payload) {
    return new Promise((resolve, reject) => {
      let { id, title, from = '', mark = '' } = payload
      // 开始请求数据
      Indicator.open({ spinnerType: 'fading-circle' })
      let data = [{
        id: id,
        mark: mark,
        type: 'wechat',
        title: title,
        member_id: STORAGE.get('userinfo').id,
        create_time: parseInt((new Date().getTime()) / 1000),
        from: from
      }]
      API.setShare({ data: { data } }).then(res => {
        Indicator.close() // 结束
        resolve(res)
      }).catch(err => {
        Indicator.close() // 结束
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
