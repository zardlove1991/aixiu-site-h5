<template lang="html">
  <div class="subject-select-blank-wrap">
    <!--题目的标题-->
    <div class="subject-type-wrap">
      <h3 class="subject-type">
        <span>{{data.typeTip}}</span>
        <span class="score" v-show="data.score">{{`(${data.score}分)`}}</span>
      </h3>
    </div>
    <p class="subject-title" v-if="newTitle">
      <span>{{`${currentSubjectIndex+1}.`}}</span>
      <span ref="newTitleHtml" v-html="newTitle"></span>
    </p>
    <!--当前的选项数据-->
    <div class="select-blank-options-wrap">
      <div class="blank-options-item-wrap"
        v-for="(optItem,optIndex) in selfOptions" :key='optIndex'
        :class="{ 'success': optItem.active, 'error': mode === 'analysis' && optItem.error}"
        @click.stop="dealOptionClick(optItem, optIndex)">
        <span class="options-item-name">{{optItem.name}}</span>
        <!--箭头提醒-->
        <div class="option-item-tip-wrap" v-if="mode === 'analysis'">
          <i v-if="optItem.active" class="examfont item-tip-icon tip-icon-success">&#xe720;</i>
          <i v-else class="examfont item-tip-icon">&#xe71d;</i>
        </div>
      </div>
    </div>
    <!--题干的媒体数据-->
    <div class="media-wrap" v-for="(media,mediaKey) in data.annex" :key="mediaKey">
      <img v-if="mediaKey=='image' && (media && media.length)" :src="annexMedia(media)"  @click.stop="_setPreviewState" v-preview="annexMedia(media)" preview-nav-enable="false" class="my-img"/>
      <!--音频播放-->
      <my-audio
        v-if="mediaKey=='audio' && annexMedia(media)"
        class="my-audio"
        :limit-info="{ isLimit: false }"
        :src="annexMedia(media)">
      </my-audio>
      <!--视频播放-->
      <my-video v-if="mediaKey=='video' && annexMedia(media)" class="my-video" :poster="annexMedia(media).cover" :src="annexMedia(media).src"></my-video>
    </div>
    <!--题目解析选项-->
    <div class="answerinfo-wrap" v-if="mode === 'analysis'">
      <div class="correct-answer">
        <span class="correct-tip-title">答案</span>
        <div class="correct-answer-item-wrap">
          <div class="correct-answer-item" v-for="(item, index) in analysisAnswer" :key="index">
            <span class="answer-item-index">{{index+1}}</span>
            <span class="answer-item-title">{{item.name}}</span>
            <span class="answer-item-score" v-show="item.score">{{`(${item.score})分`}}</span>
          </div>
        </div>
      </div>
      <div class="answer-analysis">
        <h4 class="title">解析</h4>
        <p class="content" v-if="data.analysis" v-html="data.analysis"></p>
        <p class="content" v-else>暂无解析内容~</p>
        <!--目前还没有类别和正确率 暂时隐藏-->
        <div class="exam-types" v-show="data.point && data.point.length">
          <span class="tip">考点</span>
          <span class="type" v-for="item in data.point" :key="item.id">{{item.name}}</span>
        </div>
        <p class="percent">{{`正确率: ${data.correct_percent ? Math.round(data.correct_percent) : 0}%`}}</p>
      </div>
      <!--得分区域-->
      <div class="blank-score" v-if="data.optionblank_answer && data.optionblank_answer.score">{{`${data.optionblank_answer.score}分`}}</div>
    </div>
  </div>
</template>

<script>
import { Toast } from 'mint-ui'
import { mapGetters, mapMutations } from 'vuex'
import { DEPENCE } from '@/common/currency'
import StyleConfig from '@/styles/theme/default.scss'
import SubjectMixin from '@/mixins/subject'
import SubItemMixin from '@/mixins/subject-item'

export default {
  name: 'select-blank-subject',
  mixins: [ SubItemMixin, SubjectMixin ],
  data () {
    return {
      newTitle: '',
      analysisAnswer: [],
      selfOptions: []
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
    this.fillIndex = -1 // 初始化选择填充的索引
    this.inputElInfoArr = [] // 保存所有的input元素对象
    this.answerArr = [...this.curAnswer] // 回答保存的信息
    this.selfOptions = [...this.data.options] // 自定以保存opitons的内容
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
  methods: {
    initInfo () {
      let data = this.data
      let mode = this.mode
      // 初始化答案解析 根据空格位置排序
      if (mode === 'analysis') {
        let sortOptions = [...data.options].sort(({ extra: a }, { extra: b }) => a.space - b.space)
        this.analysisAnswer = sortOptions.filter(({ extra }) => extra.space >= 0) // 有选项的答案
      }
      // 处理富文本的title解析
      this.dealRichTitle()
    },
    dealRichTitle () {
      let data = this.data
      let originTitle = data.title
      let underlineReg = /_{3,}/g
      // 匹配解析的数组
      let matchArr = originTitle.match(underlineReg)
      console.log('当前匹配的数组', matchArr)
      matchArr.forEach((val, index) => {
        let template = this._getUnderlineTemplate({ index })
        // 获得模板替换
        originTitle = originTitle.replace(val, template)
      })
      // 最终赋值
      this.newTitle = this._dealHtmlLine(originTitle)
      // 初始化初始化数组长度
      this.blankFillArr = new Array(matchArr.length)
    },
    addListener () {
      this.$nextTick(() => {
        let answerArr = this.answerArr
        let targets = document.getElementsByClassName('option-blank-select-wrap')
        // 保存对象 -> 同步回答的答案
        this.inputElInfoArr = [...targets].map((el, index) => {
          let isHasAnswer = Boolean(answerArr[index])
          return { el, inner: el.innerHTML, fill: isHasAnswer }
        })
        console.log('初始化的元素信息', this.inputElInfoArr)
        // 遍历所有当前的变量
        this.inputElInfoArr.forEach(({ el }) => {
          el.addEventListener('click', this.dealSelectClick, false)
          // 使用销毁函数钩子催婚事件
          this.$on('hook:beforeDestroy', () => {
            el.removeEventListener('click', this.dealSelectClick, false)
          })
        })
        // 改变下当前富文本容器的布局
        let newTitleEl = this.$refs['newTitleHtml']
        let richContentEl = newTitleEl.children[0]
        richContentEl.style.cssText = 'display:inline; line-height: 40px;'
        // 执行解析模板
        this.dealTemplteAnalysis()
      })
    },
    dealSelectClick (e) {
      let { target } = e
      let { option, index, id } = target.dataset
      let inputElInfoArr = this.inputElInfoArr
      let isAllFill = this.data.options.every(item => item.active)
      console.log('当前点击的数据集', target.dataset, '是否都填充了', isAllFill)
      // 如果这边点击的元素不是模拟的input就不操作
      if (!option || isAllFill || this.mode === 'analysis') return
      this.fillIndex = index
      // 设置填充样式
      let { el } = inputElInfoArr[index]
      this._setInputStyle(el, {
        html: this._getReplaceTemplate(index),
        color: '',
        id: id || ''
      })
      // 这边更改下当前填充的状态
      inputElInfoArr[index].fill = false
    },
    dealOptionClick (optItem, optIndex) {
      if (this.mode === 'analysis') return // 解析模式不能点击
      let data = this.data
      let blankAnswerInfo = this.blankAnswerInfo
      // 这边判断初始化使用长度
      let curData = blankAnswerInfo[data.id].length ? [...blankAnswerInfo[data.id]] : this.blankFillArr
      // 设置点击元素样式
      let isActive = optItem.active
      let inputElInfoArr = this.inputElInfoArr // 当前的元素
      let { inputEl, fillIndex } = this._findFillInfo(optItem)
      let isPass = this.checkIsCanBlank(fillIndex, isActive)
      if (!isPass) return
      // 判断是否有选择操作的索引
      this.checkFillIndex()
      // 处理正常流程
      if (!isActive) {
        this._setInputStyle(inputEl, {
          html: `${optItem.name}`,
          color: `${StyleConfig.theme}`,
          id: optItem.id // 添加一个比对标识
        })
        inputElInfoArr[fillIndex].fill = true // 更改数组填充状态
        // 保存数据
        curData.splice(fillIndex, 1, optItem.id)
      } else {
        // 这边的html使用原先的占位
        this._setInputStyle(inputEl, { html: inputElInfoArr[fillIndex].inner, color: '', id: '' })
        // 更新数据
        let includeIdx = curData.indexOf(optItem.id)
        if (includeIdx > -1) curData.splice(includeIdx, 1, '')
        // 更改数组填充状态
        inputElInfoArr[fillIndex].fill = false
      }
      console.log('当前传输的选项', curData.map(id => {
        let option = data.options
        let curItem = option.find(item => item.id === id)
        return curItem ? curItem.name : ''
      }))
      // 更改sotre的状态
      blankAnswerInfo[data.id] = curData
      this.setBlankAnswerInfo(blankAnswerInfo)
      this.changeOptionState(optIndex)
    },
    checkIsCanBlank (fillIndex, isActive) {
      let isPass = true
      let selectIndex = this.fillIndex
      // 判断是否已经全部填空了给予提醒
      if (fillIndex < 0) {
        Toast('已经全部填充了哦,点击选项替换答案~')
        isPass = false
      } else if (selectIndex > -1 && isActive) {
        Toast('当前选项不可填充~')
        isPass = false
      }
      return isPass
    },
    checkFillIndex () {
      let fillIndex = this.fillIndex
      if (fillIndex < 0) return
      let inputInfo = this.inputElInfoArr[fillIndex]
      let { el } = inputInfo
      let { id } = el.dataset // 当点击空的时候是没有ID的 有值的时候才有ID
      // 这边要去重置之前赋值的选项状态
      if (id) {
        console.log('---> 执行了上次状态重置 !!!', id)
        let optIndex = this.data.options.findIndex(item => item.id === id)
        this.changeOptionState(optIndex)
      }
      // 重置下索引
      this.fillIndex = -1
    },
    dealTemplteAnalysis () {
      let answerArr = this.answerArr
      console.log('#### 执行解析渲染  ！！！！', answerArr)
      if (!answerArr.length) return
      // 执行操作
      let inputElInfoArr = this.inputElInfoArr
      let { options } = this.data
      // 当前选项的检查信息
      let checkInfo = {}
      if (this.mode === 'analysis') {
        checkInfo = DEPENCE.checkOptBlankSubject(this.data)
      }
      // 处理元素
      inputElInfoArr.forEach((inputItem, inputIndex) => {
        let { el } = inputItem
        let curOptionId = answerArr[inputIndex]
        let curOption = options.find(item => item.id === curOptionId)
        // 更改元素显示
        let color = `${StyleConfig.theme}`
        let chekcResult = checkInfo.result
        if (chekcResult && chekcResult[inputIndex] === 'error') {
          color = `${StyleConfig.error}`
        }
        // 设置样式
        this._setInputStyle(el, {
          html: `${curOption.name}`,
          color,
          id: curOptionId
        })
      })
    },
    changeOptionState (selectIndex) {
      let selfOptions = [...this.selfOptions]
      let subject = this.data
      selfOptions.forEach((item, index) => {
        if (index === selectIndex) item.active = !item.active
      })
      // 这边去触发下题目答题变更
      this.selfOptions = selfOptions
      this.changeSubjectAnswerInfo({ subject })
    },
    _getUnderlineTemplate (params) {
      let { index } = params // 每个input索引
      let placeTemplate = this._getReplaceTemplate(index)
      let parentStyle = `display:inline-block;padding: 2px 10px;border-bottom: 1px solid #333333; min-width: 40px; font-size:14px; color: #333333;text-align:center;`
      let inputTemp = `<div class="option-blank-select-wrap" data-option="input"  data-index="${index}" style="${parentStyle}">${placeTemplate}</div>`
      return inputTemp
    },
    _getReplaceTemplate (index) {
      let clickMethod = this.dealSelectClick
      let borderStyle = `margin:0 auto;border:1px solid #999; width:15px;height:15px;border-radius:50%;line-height:16px;text-align:center;font-size:12px;color:#999;`
      return `<div data-option="input-empty"  data-index="${index}" onclick='${clickMethod}' style="${borderStyle}">${Number(index) + 1}</div>`
    },
    _findFillInfo (optItem) {
      let inputElInfoArr = this.inputElInfoArr // 当前的元素
      let fillIndex = 0
      let selectIndex = this.fillIndex
      let { active, id } = optItem
      console.log('---> 当前点击的索引选择', selectIndex)
      // 判断是否有选择的索引
      if (selectIndex > 0) {
        fillIndex = selectIndex
      } else if (!active) { // 判断是选中还是未选中
        // 判断是否需要重置选择
        let isAllFill = inputElInfoArr.every(item => item.fill)
        if (isAllFill) {
          fillIndex = -1
          console.log('---> 重置状态数组', inputElInfoArr)
        } else {
          fillIndex = inputElInfoArr.findIndex(item => !item.fill)
        }
      } else {
        fillIndex = inputElInfoArr.findIndex(item => {
          let dataset = item.el.dataset
          return id === dataset.id
        })
      }
      console.log('更新状态', active, '当前更改选项的索引', fillIndex, 'ID', id)
      // 返回数据
      return {
        inputEl: fillIndex >= 0 ? inputElInfoArr[fillIndex].el : null,
        fillIndex: fillIndex
      }
    },
    _setInputStyle (inputEl, { html, color, id }) {
      inputEl.innerHTML = html
      inputEl.style.color = color
      inputEl.dataset.id = id
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
@import "@/styles/components/subjects/select-blank.scss";
</style>
