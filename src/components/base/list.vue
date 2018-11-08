<template lang="html">
  <!--基本试题结构包裹-->
  <div class="base-subject-list-wrap">
    <!--题目结构包裹-->
    <div class="subject-item-wrap" :style="{height:isFillHeight?'100%':'auto'}" :ref="`subject-dom-${index}`" v-for="(item,index) in list" :key="item.id">
      <!--判断当前题目是否被删除-->
      <template v-if="!item.is_delete">
        <!--题干-->
        <div class="subject-title-wrap">
          <!--题目信息-->
          <div class="title-info-wrap">
            <span class="type">{{item.typeTip}}</span>
            <span class="tip">{{`${swiperIndex+1}.${item.title}`}}</span>
            <span v-if="!isLimitedRrefshFlag" class="score">{{item.score}}分</span>
          </div>
          <!--题目附加信息-->
          <div class="title-extra-item" v-for='(data,key) in item.annex' :key='key'>
            <img v-if="key=='image'&& data.length" :src="data[0]"  v-preview="data[0]" preview-nav-enable="false" class="extra-img"/>
            <!--添加视频组件-->
            <self-video v-if="key=='video'&& data.length" :src='data[0]' class="extra-video"></self-video>
            <!--添加音频组件-->
            <self-audio v-if="key=='audio'&& data.length" :src='data[0]' class="extra-audio"></self-audio>
          </div>
        </div>
        <!--题目选择-->
        <div class="subject-option-wrap" v-for="(option,index) in item.options" :key='index' @click.stop='dealselectOption(item, index)'>
          <!--表单选择界面-->
          <div class="form-select-wrap">
            <!--表单选择样式 正常状态下-->
            <div class="form-select" v-if="examSubjectInfo[item.id].options[index].active && isFromNormalDisabled" :class="[`${item.type}-active`]"></div>
            <!--答题卡进入试题列表的时候 默认灰色选中状态-->
            <div class="form-select" v-else-if="examSubjectInfo[item.id].options[index].active && isFinishedExmanationState" :class="[`${item.type}-disabled-active`]"></div>
            <div class="form-select" v-else :class="[`${item.type}-normal`]"></div>
          </div>
          <!--选项提醒界面-->
          <div class="option-item-wrap">
            <!--当前标题样式-->
            <div class="option-title" :class="{disabled:isOptionDisabled}">
              <span class="option">{{examOptionsSelectFlag[index]}}.</span>
              <span class="title">{{option.name}}</span>
            </div>
            <!--选项附加信息-->
            <div class="option-extra-item" v-for='(data,key) in option.annex' :key='key'>
              <img v-if="key=='image'&& data.length" :src="data[0]" v-preview="data[0]" preview-nav-enable="false" class="extra-img"/>
              <!--添加视频组件-->
              <self-video v-if="key=='video'&& data.length" :src='data[0]' class="extra-video"></self-video>
              <!--添加音频组件-->
              <self-audio v-if="key=='audio'&& data.length" :src='data[0]' class="extra-audio"></self-audio>
            </div>
          </div>
        </div>
        <!--题目附加包裹层-->
        <div class="subject-extra-wrap">
          <!--多选的确定按钮-->
          <button v-show="item.type==='checkbox' && isLimitedRrefshFlag" class="checkbox-select" @click.stop='dealCheckboxSubmit(item.id)'>确定</button>
        </div>
      </template>
      <!--题目删除占位-->
      <template v-else>
        <div class="subject-item-placeholder">
          <div class="place-img"></div>
          <span class="place-tip">该道试题已被管理员移除</span>
        </div>
      </template>
    </div>
    <!---->
    <!--题目信息作答包裹 PS:只有符合规则的渲染列表还有没有回答过的时候才会显示-->
    <div class="subject-item-anwerinfo" ref="answer-panel" v-if="isShowAnswerInfoPanel">
      <div class="correct-tip" v-show="!isShowAnswerPanel" :class="{success:!answerTipInfo.isSelectError}">{{answerTipInfo.isSelectError?'回答错误':'回答正确'}}</div>
      <div class="answer-content">
        <p class="content-tip" v-show="answerTipInfo.isSelectError || isShowAnswerPanel">正确答案<span class="tip">{{answerTipInfo.correctOptionFlags}}</span></p>
        <p class="analysis-tip">题目解析</p>
        <!--题目解析:富文本-->
        <p class="analysis-rich" v-if="answerTipInfo.analysis"  v-html="answerTipInfo.analysis"></p>
        <!--题目解析占位-->
        <div v-else class="analysis-rich-place">暂无解析</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
import selfVideo from './video'
import selfAudio from './audio'

export default {
  name: 'baseSubjectListDom',
  props: {
    list: {
      type: Array,
      default: () => ([])
    },
    swiperIndex: {
      type: Number,
      default: -1
    }
  },
  data () {
    return {}
  },
  computed: {
    ...mapState('examonline', [
      'examListType', 'examOptionsSelectFlag', 'examSubjectInfo',
      'examOnlineSubjects', 'examListOptionType'
    ]),
    ...mapGetters('examonline', ['isFinishedExmanationState']),
    // 判断是否需要显示答案的列表类型
    isLimitedRrefshFlag () {
      return ['testing', 'errorlist'].includes(this.examListType)
    },
    // 判断是否是长列表数据
    isShowLongList () {
      return this.list.length > 1
    },
    answerTipInfo () {
      let allSubjects = this.examOnlineSubjects
      let swiperIndex = this.swiperIndex
      // 从试题列表中获取题目ID
      let subjectId = allSubjects[swiperIndex].id
      return this.examSubjectInfo[subjectId]
    },
    isShowAnswerTip () {
      let answerTipInfo = this.answerTipInfo
      let isFinishedExam = this.isFinishedExmanationState // 是否结束考试
      // 这边考虑到考试结束后进入也要现实答案解析 多添加一个状态
      return (this.isLimitedRrefshFlag || isFinishedExam) && answerTipInfo && answerTipInfo && answerTipInfo.isAnswered
    },
    isShowAnswerPanel () {
      let answerTipInfo = this.answerTipInfo
      return this.isLimitedRrefshFlag && answerTipInfo && answerTipInfo.isShowAnswer
    },
    isShowAnswerInfoPanel () {
      let isShowAnswerTip = this.isShowAnswerTip
      let isShowAnswerPanel = this.isShowAnswerPanel
      let isDeleteSubject = this.answerTipInfo.is_delete
      // 如果试题删除了就直接不显示答案解析了  其它根据选择答案操作进行判断
      return isDeleteSubject ? !isDeleteSubject : (isShowAnswerTip || isShowAnswerPanel)
    },
    isFillHeight () {
      let answerTipInfo = this.answerTipInfo
      let isLimitedRrefshFlag = this.isLimitedRrefshFlag
      let isFinishedExam = this.isFinishedExmanationState // 是否结束考试
      // 如果是考试的时候、试题被删除时候默认全部填充 否则的话根据是否已经选择了答案进行填充
      let isExamState = (!isLimitedRrefshFlag && !isFinishedExam)
      let isAnswerOption = (answerTipInfo && !answerTipInfo.isAnswered && !answerTipInfo.isShowAnswer)
      let isDeleteSubject = this.answerTipInfo.is_delete
      return isDeleteSubject || isExamState || isAnswerOption
    },
    isFromNormalDisabled () {
      let answerTipInfo = this.answerTipInfo
      let isFinishedExmanationState = this.isFinishedExmanationState
      return !isFinishedExmanationState && !answerTipInfo.isShowAnswer
    },
    isOptionDisabled () {
      let answerTipInfo = this.answerTipInfo
      let isFinishedExmanationState = this.isFinishedExmanationState
      return isFinishedExmanationState || answerTipInfo.isShowAnswer
    }
  },
  watch: {
    isShowAnswerTip (newVal, oldVal) {
      // 如果显示了答案面板就去触发位移操作
      this.sendAnserPanelDomInfo()
    },
    isShowAnswerPanel (newVal, oldVal) {
      // 如果显示了答案面板就去触发位移操作
      this.sendAnserPanelDomInfo()
    }
  },
  components: {
    selfVideo,
    selfAudio
  },
  created () {
    this.wacthcSwiperIndexChange()
  },
  methods: {
    wacthcSwiperIndexChange () {
      let newIndex = this.swiperIndex
      let oldIndex = newIndex === 0 ? 0 : newIndex - 1
      console.log('当前试题的索引值', newIndex, oldIndex)
      if (newIndex < 0) return false
      // 判断是否是长列表显示
      let isShowLongList = this.isShowLongList
      // 判断当前渲染列表的大小
      if (isShowLongList) {
        // 当传入选中的索引的时候 这时候去发送下当前的选中的题目DOM信息
        this.sendSelectOverviewItemInfo()
      } else {
        // 如果当前为考试类型 并且处于滑动列表下 多选的提交方式采用选中滑动后提交
        this.swiperSubmitCheckboxData(oldIndex)
        // 判断测试答题卡进入列表是否直接显示当前题目答案解析
        this.initAnswerPanelShow()
      }
    },
    swiperSubmitCheckboxData (index) {
      let isFinishedExam = this.isFinishedExmanationState
      let isLimitedRrefshFlag = this.isLimitedRrefshFlag
      let allSubjects = this.examOnlineSubjects // 所有的试题数据
      let subject = allSubjects[index]
      // 判断是否已经结束考试了
      if (isFinishedExam) return
      // 调用保存接口
      if (subject.type === 'checkbox' && !isLimitedRrefshFlag) this.dealCheckboxSubmit(subject.id)
    },
    initAnswerPanelShow () {
      let isFinishedExam = this.isFinishedExmanationState // 是否结束考试
      let isLimitedRrefshFlag = this.isLimitedRrefshFlag // 是否是在类型的限制范围类
      let examListOptionType = this.examListOptionType // 当前列表的操作标识
      let subject = this.answerTipInfo // 拿到当前的题目信息
      let subjectId = subject.id // 试题ID
      let answers = subject.answer.map(id => Number(id)) // 判断是否有选项数据
      /* 这边用这么多if是因为每个是大类判断不能合并 */
      // 如果是重新答题 不处理
      if (examListOptionType === 'reanswer') return
      // 没有选项数据 不处理
      if (answers.length) {
        // 初始化选中数据 添加选中状态
        let optionIndexs = []
        subject.options.forEach((item, index) => answers.includes(item.id) && optionIndexs.push(index))
        console.log('当前获得初始化索引数组', optionIndexs)
        optionIndexs.forEach(selectIndex => {
          // 发送答案更新请求  PS:optflag是为了区分是初始化选中还是click选中
          this.changeCurSubjectAnswer({ id: subjectId, optionIndex: selectIndex, optFlag: 'init' })
        })
      }
      // 停止考试和测评的时候显示答案窗口 PS:测评显示答案的时候需要有有选择项才会显示
      if (isFinishedExam || (isLimitedRrefshFlag && answers.length)) {
        subject.isAnswered = true
        this.updateSubjectInfo(subject)
      }
    },
    dealselectOption (subject, optionIndex) {
      let subjectId = subject.id
      let isFinishedExam = this.isFinishedExmanationState
      console.log('当前点击的 试题id:%s 选项:%s 题目类型:%s 是否禁用选项:', subjectId, this.examOptionsSelectFlag[ optionIndex ], subject.type, isFinishedExam)
      // 如果当前点击了查看答案就不能操作选项
      if (isFinishedExam) return
      // 发送答案更新请求
      this.changeCurSubjectAnswer({ id: subjectId, optionIndex })
      // 判断是否需要显示答案窗口
      this.isShowPanelForAnswer(subjectId)
      // 提交答案数据
      this.submitAnswerInfo(subjectId)
    },
    dealCheckboxSubmit (subjectId) {
      let subject = this.examSubjectInfo[subjectId]
      let isSelected = subject.options.some(item => item.active)// 判断是否有选中
      // 如果当前点击了查看答案就不能操作选项 没有选中答案就不允许提交答案
      if (subject.isShowAnswer || !isSelected) return false
      // 判断是否需要显示答案窗口
      this.isShowPanelForAnswer(subjectId, 'checkbox_done')
      // 提交答案数据
      this.submitAnswerInfo(subjectId, 'checkbox_done')
    },
    submitAnswerInfo (subjectId, flagType = 'normal') {
      let subject = this.examSubjectInfo[subjectId]
      let selectOptionsObject = subject.selectOptionsObject
      let selectOptionIds = selectOptionsObject ? selectOptionsObject.ids : []// 拿到当前选择的ID数组
      let isShowLongList = this.isShowLongList // 是否是长列表渲染
      // 这边排除长列表选中答案提交数据 PS:长列表数据提交采用统一提交方式 在交卷按钮上做(目前先不做)
      if (isShowLongList) return
      // 点击触发更新先排除多选的答案更新 只有手动更新后才能触发
      if (subject.type === 'checkbox' && flagType === 'normal') return
      // 发送题目数据更新操作 PS:没有选择项就不提交答题数据 这边会有数组和数字类型
      let isHasSelectOptions = Array.isArray(selectOptionIds) ? selectOptionIds.length : selectOptionIds
      console.log('当前是执行了提交', isHasSelectOptions, typeof selectOptionIds)
      if (isHasSelectOptions) this.changeSelectAnswerInfo({ subjectId, ids: selectOptionIds })
    },
    isShowPanelForAnswer (subjectId, flagType = 'normal') {
      let subject = this.examSubjectInfo[subjectId]
      let subjectType = subject.type
      let isLimitedRrefshFlag = this.isLimitedRrefshFlag // 是否是在类型的限制范围类
      // 更新下是否已经回答过的属性 PS:只有测评才会去展示答案窗口 其它类型不需要
      if (!isLimitedRrefshFlag) return
      // 类型为单选/判断的时候直接显示 如果是多选的话要点击确认才会显示
      if (['radio', 'judge'].includes(subjectType) || flagType === 'checkbox_done') {
        console.log('触发了题目答案面板显示 ID:', subjectId)
        subject.isAnswered = true
        // 触发更新数据操作
        this.updateSubjectInfo(subject)
      }
    },
    sendSelectOverviewItemInfo () {
      let swiperIndex = this.swiperIndex
      let subjectDomID = `subject-dom-${swiperIndex}`
      let curDomInfo = this.$refs[subjectDomID][0]
      this.$emit('setoffset-top', curDomInfo)
    },
    sendAnserPanelDomInfo () {
      let examListOptionType = this.examListOptionType // 当前列表的操作标识
      let isShowAnswerPanel = this.isShowAnswerPanel
      let isShowAnswerTip = this.isShowAnswerTip
      // 没有显示面板的状态和正常列表进入的时候不做偏移
      if (examListOptionType === 'normal' || (!isShowAnswerPanel && !isShowAnswerTip)) return
      // 执行下次刷新前拿到DOM信息
      this.$nextTick(() => {
        // 拿到DOM信息
        let answerPanelId = 'answer-panel'
        let curDomInfo = this.$refs[answerPanelId]
        this.$emit('setoffset-top', curDomInfo)
        // 触发完毕后更改列表操作标识为normal状态
        this.setExamListOptionType('normal')
      })
    },
    ...mapActions('examonline', {
      changeCurSubjectAnswer: 'CHANGE_CURSUBJECT_ANSWER',
      changeSelectAnswerInfo: 'CHANGE_SELECT_ANSWERINFO'
    }),
    ...mapMutations('examonline', {
      updateSubjectInfo: 'UPDATE_SUBJECT_INFO',
      setExamListOptionType: 'SET_EXAMLIST_OPTION_TYPE'
    })
  }
}
</script>

<style lang="scss">
@import '@/styles/components/baseSubjectList.scss';
</style>
