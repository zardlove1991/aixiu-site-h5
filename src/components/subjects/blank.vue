<template lang="html">
  <div class="subject-single-blank-wrap">
    <!--题目的标题-->
    <div class="subject-type-wrap">
      <h3 class="subject-type">
        <span>{{data.typeTip}}</span>
        <span class="score" v-show="data.score">{{`(${data.score}分)`}}</span>
      </h3>
    </div>
    <p class="subject-title" v-if="newTitle" style="overflow:hidden;">
      <span>{{`${currentSubjectIndex+1}.`}}</span>
      <span ref="newTitleHtml" v-html="newTitle"></span>
    </p>
    <!--题干的媒体数据-->
    <!--题目解析选项-->
    <div class="answerinfo-wrap" v-if="mode === 'analysis'">
      <div class="correct-answer"
        :class="{'column-layout': !(data.type === 'singleblank' && analysisAnswer[0] && analysisAnswer[0].length === 1) }">
        <template v-if="!analysisAnswer.length">
          <span>答案:</span>
          <span>&nbsp;未指定</span>
        </template>
        <!--处理多个答案-->
        <template v-if="analysisAnswer.length"
          v-for="(group, index) in analysisAnswer">
          <div class="single-asnitem-wrap" :key="index"
            v-if="group.length && data.type === 'singleblank'">
            <span class="single-title-tip">答案:</span>
            <span class="single-answer-tip">{{group | joinSingleVal }}</span>
          </div>
          <!--特殊处理一个答案的情况-->
          <div class="mulite-asnitem-wrap" :key="index" v-else>
            <span class="mulite-title-tip" v-show="index === 0">答案:</span>
            <div class="mulite-asnitem" v-for="(child, childIdx) in group" :key="`${index}_${childIdx}`">
              <span v-show="childIdx === 0" class="blank-group-tip">{{`第${index + 1}空`}}</span>
              <span class="blank-child-tip">{{child.answer}}</span>
              <span v-show="childIdx === 0 && child.score" class="blank-child-score">{{`(${child.score}分)`}}</span>
            </div>
          </div>
        </template>
      </div>
      <div class="answer-analysis">
        <h4 class="title">解析</h4>
        <p class="content" v-if="data.analysis" v-html="data.analysis"></p>
        <p class="content" v-else>暂无解析内容~</p>
        <!--目前还没有类别和正确率 暂时隐藏-->
        <div class="exam-types" v-show="data.point && data.point.length">
          <span class="tip">知识点</span>
          <span class="type" v-for="item in data.point" :key="item.id">{{item.name}}</span>
        </div>
        <p class="percent">{{`正确率: ${data.correct_percent ? Math.round(data.correct_percent) : 0}%`}}</p>
      </div>
      <!--得分区域-->
      <div class="blank-score" v-if="data.blank_answer && data.blank_answer.score">{{`${data.blank_answer.score}分`}}</div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import { DEPENCE } from '@/common/currency'
import StyleConfig from '@/styles/theme/default.scss'
import SubjectMixin from '@/mixins/subject'
import SubItemMixin from '@/mixins/subject-item'

export default {
  name: 'blank-subject',
  mixins: [ SubItemMixin, SubjectMixin ],
  data () {
    return {
      newTitle: '',
      analysisAnswer: []
    }
  },
  computed: {
    ...mapGetters('depence', ['blankAnswerInfo']),
    curAnswer () {
      let { id } = this.data
      return this.blankAnswerInfo[id] || []
    }
  },
  created () {
    this.inputTimer = null
    this.inputElArr = [] // 保存所有的input元素对象
    this.answerArr = [...this.curAnswer] // 回答保存的信息
    this.initInfo()
  },
  mounted () {
    this.addListener()
  },
  watch: {
    curAnswer (data) {
      // 当前答案更新的时候更新下保存的答案的数组
      this.answerArr = [...data]
    }
  },
  filters: {
    joinSingleVal (arr) {
      let newArr = arr.map(item => item.answer)
      return newArr.join('、')
    }
  },
  methods: {
    initInfo () {
      let data = this.data
      let mode = this.mode
      // 初始化答案解析
      if (mode === 'analysis') {
        let tempArr = [...data.extra.answer] // 模拟下分组
        if (data.type === 'singleblank') tempArr = [ [...data.extra.answer] ]
        // 赋值
        this.analysisAnswer = tempArr
      }
      // 处理富文本的title解析
      this.dealRichTitle()
    },
    dealRichTitle () {
      let data = this.data
      let originTitle = data.title
      let renderStyle = data.extra.style
      let underlineReg = /_{3,}/g
      let textboxReg = /<img\s?\w+[^>]+>/g
      let matchArr = []
      // 匹配解析的数组
      if (renderStyle === 'underline') matchArr = originTitle.match(underlineReg)
      else matchArr = originTitle.match(textboxReg)
      console.log('当前匹配的数组', matchArr)
      matchArr.forEach((val, index) => {
        let template = ''
        console.log(val)
        // 处理不同填空的形式的渲染
        if (renderStyle === 'underline') {
          template = this._getUnderlineTemplate({ index })
        } else if (renderStyle === 'textbox') {
          template = this._getTextboxTemplate({ index })
        }
        // 获得模板替换
        originTitle = originTitle.replace(val, template)
      })
      // 最终赋值
      this.newTitle = this._dealHtmlLine(originTitle)
    },
    addListener () {
      this.$nextTick(() => {
        let targets = document.getElementsByClassName('text-input')
        let dealKeyboard = (source) => {
          let { type } = source
          if (type === 'focus') {
            // setTimeout(() => {
            //   document.body.scrollTop = document.body.scrollHeight
            // }, 300)
          } else {
            document.body.scrollTop = 0
            window.scrollTo(0, 0)
          }
        }
        // 保存对象
        this.inputElArr = [...targets]
        // 遍历所有当前的变量
        this.inputElArr.forEach(target => {
          target.addEventListener('focus', dealKeyboard, false)
          target.addEventListener('blur', dealKeyboard, false)
          target.addEventListener('input', this.dealInput, false)
          // 使用销毁函数钩子催婚事件
          this.$on('hook:beforeDestroy', () => {
            target.removeEventListener('focus', dealKeyboard, false)
            target.removeEventListener('blur', dealKeyboard, false)
            target.removeEventListener('input', this.dealInput, false)
          })
        })
        // 改变下当前富文本容器的布局
        let newTitleEl = this.$refs['newTitleHtml']
        let richContentEl = newTitleEl.children[0]
        richContentEl.style.cssText = 'display:inline; line-height: 40px;'
      })
    },
    dealInput (e) {
      let { target } = e
      let dataset = target.dataset
      let data = this.data
      // 处理输入
      let renderStyle = data.extra.style
      let answerArr = this.answerArr
      // 选择下一个需要聚焦的元素
      let nextFoucs = (index) => {
        let value = target.value
        if (!value) return
        // 跳转
        let inputElArr = this.inputElArr
        let nextEl = inputElArr[Number(index) + 1]
        if (nextEl) nextEl.focus()
      }
      // 处理多次操作
      if (this.inputTimer) clearTimeout(this.inputTimer)
      let delayTime = renderStyle === 'underline' ? 100 : 800
      this.inputTimer = setTimeout(() => {
        let index = dataset.index
        let value = target.value
        if (renderStyle === 'underline') {
          answerArr[index] = value
        } else if (renderStyle === 'textbox') {
          let val = answerArr[0] // 暂时不支持多项填充
          if (!val) {
            answerArr[0] = value
            nextFoucs(index) // 自动跳转下一个文本框
          } else if (val[index]) {
            answerArr[0] = val.replace(val[index], value)
          } else {
            answerArr[0] = `${val}${value}`
            nextFoucs(index) // 自动跳转下一个文本框
          }
        }
        console.log('xxx 最终传送的值', this.answerArr)
        let blankAnswerInfo = this.blankAnswerInfo
        blankAnswerInfo[data.id] = answerArr
        this.setBlankAnswerInfo(blankAnswerInfo) // 更新保存的答题信息
        this.changeSubjectAnswerInfo({ subject: data }) // 更新答案数据
      }, delayTime)
    },
    _getUnderlineTemplate (params) {
      let data = this.data
      let mode = this.mode
      let { index } = params // 每个input索引
      let analysisAnswer = data.extra.answer[index]
      let value = this.curAnswer[index] || ''
      // 正常填空状态
      let length = 0
      if (Array.isArray(analysisAnswer)) length = analysisAnswer[0].length
      else length = analysisAnswer.length
      // 计算长度
      let offsetW = length < 3 ? 0 : Math.round((length - 3) * 4 / 2)
      let inputStyle = `width:${70 + offsetW}px;border:none; border-bottom: 1px solid #999;font-size:14px; color: ${StyleConfig.theme}; text-align:center; outline:none;border-radius:0;`
      let inputTemp = `<input type="text" class="text-input" placeholder='点击答题' data-index="${index}" style="${inputStyle}" maxlength="${length}" value="${value}"/>`
      if (mode === 'analysis') {
        let color = this._checkGroupState(index)
        inputStyle = `width:${70 + offsetW}px; border:none; border-bottom: 1px solid #999;font-size:14px; color:${color}; text-align:center; outline:none;border-radius:0;`
        inputTemp = `<input type="text" readonly class="text-input" placeholder='点击答题' data-index="${index}" style="${inputStyle}" maxlength="${length}" value="${value}"/>`
      }
      return inputTemp
    },
    _getTextboxTemplate (params) {
      let mode = this.mode
      let { index } = params
      // 拿到答案的值
      let curStr = this.curAnswer[0]
      let value = curStr ? (curStr[index] || '') : ''
      let inputStyle = `width:30px; height:30px; box-shadow:0px 0px 0px rgba(0,0,0,0); -webkit-appearance:none; border: 1px solid #999999; border-radius:0; outline: none; font-size:14px; line-height: 30px; text-align:center; margin-right:3px;color: ${StyleConfig.theme};`
      let inputTemp = `<input style="${inputStyle}" class="text-input" data-index="${index}" value="${value}" maxlength="1" />`
      if (mode === 'analysis') {
        let color = this._checkGroupState(0)
        inputStyle = `width:30px; height:30px;  box-shadow:0px 0px 0px rgba(0,0,0,0); -webkit-appearance:none; border: 1px solid #999999;  border-radius:0;outline: none; font-size:14px; line-height: 30px; text-align:center; margin-right:3px; color:${color};`
        inputTemp = `<input readonly style="${inputStyle}" class="text-input" data-index="${index}" value="${value}" maxlength="1" />`
      }
      return inputTemp
    },
    _checkGroupState (groupIndex) {
      let fontColor = '#333333'
      let params = DEPENCE.checkBlankSubject(this.data)
      console.log('当前解析状态的数据', params)
      let groupState = params.result[groupIndex]
      if (['success', 'warning'].includes(groupState)) fontColor = StyleConfig.theme
      else if (groupState === 'error') fontColor = StyleConfig.error
      return fontColor
    },
    ...mapMutations('depence', {
      setBlankAnswerInfo: 'SET_BLANK_ANSWER_INFO'
    })
  }
}
</script>

<style lang="scss">
@import "@/styles/components/subjects/blank.scss";
</style>
