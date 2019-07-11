import wx from '@/config/weixin-js-sdk'

export const METHODS = {
  detectionRestart (item) {
    let passScore = item.pass_score
    let answerScore = item.answer_score
    let restart = item.restart // 0:没有开启重新考试 1:开启重新考试
    // 只有在开启的时候才行
    return restart === 1 && (passScore && (answerScore < passScore))
  },
  getSubjetType (type) {
    let typeTip = null
    // 判断当前的题目类型
    if (type === 'input') typeTip = '填空题'
    else if (type === 'radio') typeTip = '单选题'
    else if (type === 'checkbox') typeTip = '多选题'
    else if (type === 'judge') typeTip = '判断题'
    else if (type === 'essay') typeTip = '问答题'
    else if (type === 'mandarin') typeTip = '普通话'
    else if (type === 'englishspoken') typeTip = '英语口语能力'
    else if (type === 'sort') typeTip = '排序题'
    else if (type === 'singleblank') typeTip = '填空题'
    else if (type === 'mulitblank') typeTip = '多元填空'
    else if (type === 'optionblank') typeTip = '选词填空'
    return typeTip
  }
}

export const DEPENCE = {
  dealErrorType (params, err) {
    let examId = params.examId
    let redirectParams = params.redirectParams
    let _this = window.$vue
    // 如果开始考试出错就直接去答题卡页面
    if (err.status && err.status === 422) {
      _this.$router.replace({
        path: `/depencecard/${examId}`,
        query: redirectParams
      })
    }
  },
  dealLimitTimeTip (time) {
    let tip = time > 0 ? `${time}分钟` : '不限时'
    return tip
  },
  checkCurEssayEmpty (essayAnswerInfo, subjectId) {
    let curEssayObj = essayAnswerInfo[subjectId]
    let flag = true
    if (!curEssayObj) return flag
    // 排查当前对象里是否有数据填写
    for (let key in curEssayObj) {
      if (curEssayObj[key] && curEssayObj[key].length) {
        flag = false
        break
      }
    }
    return flag
  },
  checkRoralEmpty (oralAnswerInfo, subjectId) {
    let curOralObj = oralAnswerInfo[subjectId]
    let flag = true
    if (curOralObj && curOralObj.value) flag = false
    return flag
  },
  checkSortSubject (subject) {
    let mode = subject.extra.score_rules // 匹配的规则
    let flag = 'none'
    let allMatchLen = subject.options.filter(item => item.is_true).length // 匹配所有是否为true
    let optionLen = subject.options.length
    if (mode === 'exact' && allMatchLen === optionLen) {
      flag = 'success'
    } else if (mode === 'contain' && allMatchLen) {
      flag = 'warning'
      // 全匹配为正确
      if (allMatchLen === optionLen) flag = 'success'
    }
    return flag
  },
  checkBlankSubject (subject) {
    let myAnswer = subject.answer // 我自己的答案
    let answer = subject.extra.answer // 设置的答案
    let params = { result: [], state: 'error' }
    // 处理匹配
    let dealMatch = (arr, val) => {
      let flag = 'error'
      // 检查答案
      let isFind = false
      for (let i = 0; i < arr.length; i++) {
        let curAnswer = arr[i]
        if (curAnswer.rules === 'exact' && val === curAnswer.answer) {
          flag = 'success'
          isFind = true
        } else if (curAnswer.rules === 'contain' && curAnswer.answer.includes(val)) {
          flag = 'warning'
          isFind = true
        }
        // 是否中断循环
        if (isFind) break
      }
      return flag
    }
    let dealFullMach = (arr) => {
      let flag = 'error'
      // 对比自己数组中的第一个状态是否全部相同
      let isSuccss = arr.every(state => (state === arr[0] && state !== 'error'))
      let isWarning = arr.some(state => ['success', 'warning'].includes(state))
      if (isSuccss) flag = 'success'
      else if (isWarning) flag = 'warning'
      return flag
    }
    // 没有答案返回空
    if (!myAnswer.length) return params
    // 处理提醒
    if (subject.type === 'singleblank') {
      let val = myAnswer.join('')
      myAnswer.forEach(item => {
        params.result.push(dealMatch(answer, val))
      })
    } else if (subject.type === 'mulitblank') {
      myAnswer.forEach((val, index) => {
        let matchArr = answer[index] // 找到每个分组的数据
        params.result.push(dealMatch(matchArr, val))
      })
    }
    // 处理总共的状态
    params.state = dealFullMach(params.result)
    return params
  },
  checkOptBlankSubject (subject) {
    let params = { result: [], state: 'error' }
    let underlineReg = /_{3,}/g
    // 匹配解析的数组
    let matchMode = subject.extra.score_rules
    let blankArr = subject.title.match(underlineReg)
    let options = [...subject.options]
    // 处理匹配
    let dealMatch = (arr) => {
      let temp = []
      // 设置数组
      let correctOptions = options.sort(({extra: a}, {extra: b}) => (a.space - b.space)) // 排序为正确顺序
      arr.forEach((answerId, answerIdx) => {
        let flag = 'error'
        let curOption = correctOptions[answerIdx]
        if (answerId === curOption.id) flag = 'success'
        temp.push(flag)
      })
      return temp
    }
    params.result = dealMatch(subject.answer)
    // 区分总状态
    let successArr = params.result.filter(state => state === 'success')
    let isAllMach = successArr.length === blankArr.length
    if (matchMode === 'contain' && successArr.length) {
      params.state = 'warning'
      // 判断是否全队
      if (isAllMach) params.state = 'success'
    } else if (matchMode === 'exact' && isAllMach) {
      params.state = 'success'
    }
    console.log('当前处理的解析信息', params)
    return params
  },
  checkMedaiObjIsEmpty (mediaObj) {
    let flag = true
    for (let key in mediaObj) {
      if (mediaObj[key] && mediaObj[key].length) {
        flag = false
        break
      }
    }
    return flag
  },
  goWxAppPage: url => wx.navigateTo(url),
  backWxAppPage: num => wx.navigateBack(num)
}
