import API from '@/api/module/examination'
import { Toast, Indicator } from 'mint-ui'
import { PARTY } from '@/common/currency'

export default {
  namespaced: true,
  state: {
    examinationId: null, //  存放考卷的ID
    examListType: '', // 当前渲染的试题类型 考试、测评
    examListOptionType: 'normal', // 当前进入是试题列表的操作标识
    examOnlineSubjects: [], // 当前试卷的所以题目的原始数据
    examOptionsSelectFlag: [], // 选项的标识
    examSubjectInfo: {}, // 当前试卷的每题的具体详情
    currentExamnationInfo: {}, // 当前试卷的详情
    currentExamnSubjectIndex: 0, // 正在答题的题目索引 PS:这边给滑动考试使用
    currentExamRenderType: '', // 当前答题的表现形式 滑动还是列表型
    isShowMoreTimeModal: false, // 是否显示答题超时的model弹层状态
    currentExamCountTime: -1, // 当前考试的倒计时数据 0:时间到 -1:不限制
    errorlistCollection: null // 当前的错题集合数据
  },
  getters: {
    getSubjectList (state) {
      let examOnlineSubjects = state.examOnlineSubjects
      if (!examOnlineSubjects.length) return []
      // 处理当前题目中的类型字段
      examOnlineSubjects.forEach(item => {
        item.typeTip = PARTY.getTypeTip(item.type)
      })
      return examOnlineSubjects
    },
    isFinishedExmanationState (state) {
      let examType = state.examListType
      let exmanationInfo = state.currentExamnationInfo
      let statue = exmanationInfo.examination_status || exmanationInfo.status // 考卷状态
      let personStatue = exmanationInfo.person_status // 用户考试状态
      // 试卷结束（时间过期，当前用户未开始考试），进来只能查看，选项置灰，交卷按钮隐藏
      return examType === 'examnation' && (statue === 2 || [1, 3].includes(personStatue))
    }
  },
  mutations: {
    SET_ERRORLIST_COLLECTION (state, data) {
      state.errorlistCollection = data
    },
    SET_CURRENT_EXAMNATION_COUNTTIMER (state, time) {
      state.currentExamCountTime = time
    },
    SET_CURRENT_EXAMNATION_INFO (state, data) {
      state.currentExamnationInfo = data
    },
    SET_CURRENT_LISTRENDER_TYPE (state, type) {
      state.currentExamRenderType = type
    },
    SET_EXAMLIST_OPTION_TYPE (state, type) {
      state.examListOptionType = type
    },
    SET_CURRENT_ANSWER_SUBJECT_INDEX (state, index) {
      state.currentExamnSubjectIndex = index
    },
    SET_EXAM_MORETIME_MODEL_STATE (state, statue) {
      state.isShowMoreTimeModal = statue
    },
    SET_EXAMNATION_ID (state, id) {
      // 设置数据
      state.examinationId = id
    },
    SET_EXAMLIST_TYPE (state, type) {
      // 设置数据
      state.examListType = type
    },
    SET_SUBJECTS_LIST (state, { data }) {
      // 设置数据
      state.examOnlineSubjects = data
    },
    INIT_SUBJECT_INFO (state) {
      let list = JSON.parse(JSON.stringify(state.examOnlineSubjects)) // 拿到初始化数据
      let examSubjectInfo = state.examSubjectInfo
      let examOptionsSelectFlag = state.examOptionsSelectFlag
      // 初始化每个题目信息
      list.forEach(item => {
        // 找到正确的选项的ID
        let correctIds = []
        let correctFlags = []
        item.options.forEach((item, index) => {
          if (item.is_true) {
            correctIds.push(item.id)
            correctFlags.push(index)
          }
        })
        // 存放当前正确选项的ID标识FLAG
        correctFlags = correctFlags.map(index => examOptionsSelectFlag[index])
        // 存放当前正确选项的ID
        if (correctIds.length === 1) correctIds = correctIds.join('')
        item['correctOptionIds'] = correctIds
        item['correctOptionFlags'] = correctFlags.join('、')
        examSubjectInfo[item.id] = item
      })
      // 存储数据
      state.examSubjectInfo = Object.assign({}, examSubjectInfo)
    },
    UPDATE_SUBJECT_INFO (state, data) {
      state.examSubjectInfo[data.id] = data
      state.examSubjectInfo = Object.assign({}, state.examSubjectInfo)
    },
    SET_OPTION_SELECT_FLAG (state) {
      let str = []
      for (let i = 65; i < 91; i++) {
        str.push(String.fromCharCode(i))
      }
      state.examOptionsSelectFlag = str
    }
  },
  actions: {
    // 获得的当前测评试卷的题目信息 PS:showType代表当前的渲染的列表类型 optionType:代表行为标识 默认normal
    GET_ONLINE_EXAM_SUBJECTS ({ commit, dispatch }, { id, showType, optionType }) {
      return new Promise((resolve, reject) => {
        // page: 1, count: 20 PS:分页参数 暂时先不处理
        let data = {}
        let methodName = 'getErrorList'
        // 判断是否是获取的错题列表还是正常的试题列表 PS:因为结构一样走同一个ACTION
        if (showType !== 'errorlist') {
          data['examination_id'] = id
          methodName = 'getExamDetailsList'
        } else if (showType === 'errorlist' && id !== 'all') {
          // 查询单个试卷的错题数据 PS:全部试题默认给了个ID errorlist 不需要加入请求
          data['examination_id'] = id
        }
        // 显示loading
        Indicator.open({ spinnerType: 'fading-circle' })
        API[methodName]({params: data}).then(res => {
          if (!res.data) throw Error('获取数据出错')
          let examList = res.data
          // 触发更新操作 PS:当前试卷ID、当前渲染类型、试题列表数据、当前题目信息、选项FLAGE数据
          commit('SET_EXAMNATION_ID', id)
          commit('SET_EXAMLIST_TYPE', showType)
          commit('SET_EXAMLIST_OPTION_TYPE', optionType)
          commit('SET_OPTION_SELECT_FLAG')
          commit('SET_SUBJECTS_LIST', { data: examList })
          commit('INIT_SUBJECT_INFO')
          // 返回回调
          Indicator.close()
          resolve()
        }).catch(err => {
          console.log(err)
          if (err) Toast(err.message || '获取当前试题列表出错')
          // 返回回调
          Indicator.close()
          reject(new Error('获取当前试题列表出错'))
        })
      })
    },
    // 选择答案后更改后端题目信息
    CHANGE_SELECT_ANSWERINFO ({ state, commit, dispatch }, { subjectId, ids }) {
      return new Promise((resolve, reject) => {
        let examinationId = state.examinationId
        let data = { question_id: subjectId, options_id: ids }
        console.log('当前触发了答题信息更新!!!!', data)
        // 发送保存答题记录接口
        API.saveSubjectRecord({ data, query: { id: examinationId } }).then(res => {
          console.log('保存答题记录的返回信息', res)
          // 返回回调
          resolve()
        }).catch(err => {
          // 判断是否试卷过期答题
          if (err && err.error_code === 'examination-end') commit('SET_EXAM_MORETIME_MODEL_STATE', true)
          // 返回回调
          reject(new Error(err.message || '保存答题信息失败'))
        })
      })
    },
    // 更改当前选项 PS:optFlag代表当前选中操作类型 select:选择操作 init:初始化选择操作
    CHANGE_CURSUBJECT_ANSWER ({ state, commit, dispatch }, { id, optionIndex, optFlag = 'select' }) {
      let examOptionsSelectFlag = state.examOptionsSelectFlag // 当前选项的标识 A、B、C
      let currentSubject = state.examSubjectInfo[id] // 获得当前处理的试题
      let type = currentSubject.type // 当前选中的类型
      let correctOptionIds = currentSubject.correctOptionIds // 当前正确选择的选项ID
      let options = currentSubject.options // 当前选项为了添加选中状态使用
      // 建立一个保存正确答案的选项和ID的对象 ex:{ ids:[],flags:[] }
      let selectOptionsObject = currentSubject.selectOptionsObject ? currentSubject.selectOptionsObject : {}
      let selectOptionIds = selectOptionsObject.ids ? selectOptionsObject.ids : []
      let selectOptionFlags = selectOptionsObject.flags ? selectOptionsObject.flags : []
      let isSelectError = true
      // 判断是什么类型的题
      if (['radio', 'judge'].includes(type)) {
        let correntAnswerIndex = null
        let selectOptionItem = null
        options.forEach((item, index) => {
          if (index === optionIndex) {
            item.active = true
            selectOptionItem = item
          } else {
            item.active = false
          }
          // 找到与正确答案对应的索引
          if (item.id === Number(correctOptionIds)) correntAnswerIndex = index
        })
        // 数组传入字符串
        selectOptionIds = selectOptionItem.id
        // 记录下当前选项正确的FLAG
        selectOptionFlags = examOptionsSelectFlag[correntAnswerIndex]
        // 添加当前选择是否正确的标识
        if (selectOptionItem.id === Number(correctOptionIds)) isSelectError = false
      } else if (type === 'checkbox') {
        let tempCorrectAnswerFlags = [] // 记录临时的保存的答案FLAG
        options.forEach((item, index) => {
          // 更改选择标识 PS:如果是初始化的话默认就是选中状态
          if (index === optionIndex) {
            if (optFlag === 'select') item.active = !item.active
            else if (optFlag === 'init') item.active = true
          }
          // 记录正确答案对应的索引 生成FLAG标识
          if (correctOptionIds.includes(item.id)) {
            tempCorrectAnswerFlags.push(examOptionsSelectFlag[index])
          }
        })
        // 记录下当前选项正确的FLAG
        selectOptionFlags = tempCorrectAnswerFlags.join('、')
        // 拿到当前多选选择的active的数据
        selectOptionIds = []
        options.forEach(item => item.active && selectOptionIds.push(item.id))
        // 添加当前选择是否正确的标识
        let newCorrectOptionsIdS = typeof correctOptionIds === 'string' ? [correctOptionIds] : correctOptionIds
        if (newCorrectOptionsIdS.length === selectOptionIds.length) { // 只有当选择的个数与正确的个数相同时
          let isAllMatch = newCorrectOptionsIdS.every(id => selectOptionIds.includes(Number(id)))
          if (isAllMatch) isSelectError = false
        }
      }
      // 赋值选项数组
      selectOptionsObject.ids = selectOptionIds
      selectOptionsObject.flags = selectOptionFlags
      currentSubject.selectOptionsObject = selectOptionsObject
      // 添加当前选择的错误状态
      currentSubject.isSelectError = isSelectError
      // 添加是否该题目已经选择过的标识 默认为未答
      currentSubject.isAnswered = false
      // 更新当前题目数据
      commit('UPDATE_SUBJECT_INFO', currentSubject)
    },
    // 是否显示答案面板
    SHOW_SUBJECT_ANSWERINFO ({ state, commit, dispatch }, { id, status }) {
      let currentSubject = state.examSubjectInfo[id] // 获得当前处理的试题
      // 设置显示属性
      currentSubject.isShowAnswer = status
      // 更新当前题目数据
      commit('UPDATE_SUBJECT_INFO', currentSubject)
    },
    // 检查是题目是否已经收藏
    CHECK_SUBJECT_FAVORINFO ({ state, commit, dispatch }, { id }) {
      let currentSubject = state.examSubjectInfo[id] // 获得当前处理的试题
      let params = { question_id: id }
      console.log('当前检查的题目收藏的ID', id)
      // 发送获取题目收藏信息接口
      API.getSubjectFavorInfo({ params }).then(res => {
        if (!res) throw Error('获取收藏返回信息失败')
        // 设置状态
        let status = res.is_collection
        currentSubject.is_collection = status === 1
        // 更新当前题目数据
        commit('UPDATE_SUBJECT_INFO', currentSubject)
      }).catch(err => {
        if (err) console.log('获取题目收藏信息失败')
      })
    },
    // 检查是题目是否已经收藏
    SET_SUBJECT_FAVORINFO ({ state, commit, dispatch }, { id, status }) {
      let currentSubject = state.examSubjectInfo[id] // 获得当前处理的试题
      let data = { question_id: id }
      console.log('收藏当前的题目ID:', id)
      return new Promise((resolve, reject) => {
        // 发送获取题目收藏信息接口
        API.setSubjectFavorInfo({ data }).then(res => {
          if (!res) throw Error('设置收藏返回信息失败')
          // 设置状态
          if (res.success === 1 && currentSubject) currentSubject.is_collection = status
          // 更新当前题目数据
          currentSubject && commit('UPDATE_SUBJECT_INFO', currentSubject)
          // 执行回调
          resolve()
        }).catch(err => {
          if (err) console.log('获取题目收藏信息失败')
          // 执行回调
          resolve()
        })
      })
    },
    // 请求当前错题集合数据 PS:默认为考试数据
    GET_ERRORLIST_COLLECTION ({ state, commit, dispatch }, type = 1) {
      let data = { type }
      // 显示loading
      Indicator.open({ spinnerType: 'fading-circle' })
      API.getErrorCollection({ params: data }).then(res => {
        // 设置当前错题集合数据
        commit('SET_ERRORLIST_COLLECTION', res)
        // 返回回调
        Indicator.close()
      }).catch(err => {
        if (err) Toast(err.message || '获取错题列表出错')
        // 返回回调
        Indicator.close()
      })
    },
    // 获取当前试卷详情信息
    GET_EXAMDETAIL_INFO ({state, commit}, examId) {
      return new Promise((resolve, reject) => {
        // 显示loading
        Indicator.open({ spinnerType: 'fading-circle' })
        API.getExamDetail({query: {id: examId}}).then(data => {
          // 请求试卷详情成功后更新下当前试卷的信息
          commit('SET_CURRENT_EXAMNATION_INFO', data)
          // 返回
          Indicator.close()
          resolve()
        }).catch(err => {
          Indicator.close()
          if (err) Toast(err.message || '获取试卷信息出错')
        })
      })
    },
    // 开始考试操作
    START_EXAMNATION ({ state, commit, dispatch }, { examId, flag = 'normal' }) {
      let requestParams = {
        params: {},
        query: { id: examId }
      }
      // 判断是否是重新答题
      if (flag === 'reanswer') requestParams.params.restart = 1
      API.startExam(requestParams)
    }
  }
}
