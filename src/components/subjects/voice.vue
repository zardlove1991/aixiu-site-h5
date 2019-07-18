<template lang="html">
  <div class="subject-voice-wrap">
    <!--题目的标题-->
    <div class="subject-type-wrap">
      <h3 class="subject-type">
        <span>{{data.typeTip}}</span>
        <span class="score" v-show="data.score">{{`(${data.score}分)`}}</span>
      </h3>
      <!--问答题批阅得分提醒-->
      <div
        v-show="mode === 'analysis' && data.type === 'essay'"
        class="essay-audio-score">{{`得${data.remark.score || 0}分`}}</div>
    </div>
    <p class="subject-title">
      <span>{{`${currentSubjectIndex+1}.`}}</span>
      <span v-html="_dealHtmlLine(data.title)"></span>
    </p>
    <!--题干的媒体数据-->
    <div class="media-wrap" v-for="(media,mediaKey) in data.annex" :key="mediaKey">
      <img v-if="mediaKey=='image' && media.length" :src="annexMedia(media)"  @click.stop="_setPreviewState" v-preview="annexMedia(media)" preview-nav-enable="false" class="my-img"/>
      <!--音频播放-->
      <my-audio
        v-if="mediaKey=='audio' && annexMedia(media)"
        class="my-audio"
        show-type="wave"
        :limit-info="{ isLimit: true, limitTime: 120, showSecond: false }"
        :src="annexMedia(media)">
      </my-audio>
      <!--视频播放-->
      <my-video v-if="mediaKey=='video' && annexMedia(media)" class="my-video" :poster="annexMedia(media).cover" :src="annexMedia(media).src"></my-video>
    </div>
    <!--题目的内容区域-->
    <div class="subject-voice-content-wrap" v-if="curOralInfo">
      <!--得分区域-->
      <div class="voice-score" v-if="curOralInfo.score">{{`${curOralInfo.score}分`}}</div>
      <!--跟读文本区域-->
      <template v-if="data.extra && data.extra.follow_text && mode === 'analysis'">
        <div class="voice-read-tip-wrap">
          <h4 class="voice-read-tip">跟读文本</h4>
          <!--文本颜色提醒-->
          <el-tooltip :value="showVoiceTip" placement="right" :manual="true">
            <div class="voice-score-tip-wrap" @click.stop="showVoiceTip = !showVoiceTip">?</div>
            <!--提醒的内容信息-->
            <div slot="content" class="score-tip-wrap">
              <div class="tip-row-wrap">
                <i class="tip-row-icon success"></i>
                <span class="tip-row-text">优秀</span>
              </div>
              <div class="tip-row-wrap">
                <i class="tip-row-icon error"></i>
                <span class="tip-row-text">待加强</span>
              </div>
            </div>
          </el-tooltip>
        </div>
        <!--跟读文本的正文内容-->
        <p class="voice-words-tip"
          v-if="curOralInfo.content.words.length"
          v-html="_dealFollowText()">
        </p>
        <!--没有解析的全部为空-->
        <p class="voice-words-tip error" v-else>{{data.extra.follow_text}}</p>
      </template>
      <!--语音问答的语音-->
      <div class="voice-audio-wrap" v-if="curOralInfo.value && curOralInfo.value.audio.length">
        <h4 class="voice-audio-tip">你的答题语音</h4>
        <my-audio
          show-type="bubble"
          :key="curOralInfo.value.audio[0]"
          :src="curOralInfo.value.audio[0]"
          :limit-info="{isLimit: true, limitTime: 60, showSecond: true }">
        </my-audio>
      </div>
      <!--图形统计区域-->
      <div id="voice-statistics"
        v-if="curOralInfo.content"
        style="width:98%;height:280px">
      </div>
    </div>
    <!--题目解析选项-->
    <div class="answerinfo-wrap" v-if="mode === 'analysis'">
      <div class="answer-analysis">
        <h4 class="title">解析</h4>
        <p class="content" v-if="data.analysis" v-html="data.analysis"></p>
        <p class="content" v-else>暂无解析内容~</p>
        <!--目前还没有类别和正确率 暂时隐藏-->
        <div class="exam-types" v-show="data.point && data.point.length">
          <span class="tip">知识点</span>
          <span class="type" v-for="item in data.point" :key="item.id">{{item.name}}</span>
        </div>
        <!-- <p class="percent">{{`正确率: ${data.correct_percent ? Math.round(data.correct_percent) : 0}%`}}</p> -->
      </div>
    </div>
  </div>
</template>

<script>
import { DEPENCE } from '@/common/currency'
import EchartConfig from '@/config/echarts'
import SubItemMixin from '@/mixins/subject-item'
import SubjectMixin from '@/mixins/subject'

export default {
  name: 'voice-subject',
  mixins: [ SubItemMixin, SubjectMixin ],
  data () {
    return {
      curOralInfo: null,
      showVoiceTip: false
    }
  },
  watch: {
    oralAnswerInfo () {
      this.initOralInfo() // 如果更新一次就重新获取一次值
    }
  },
  created () {
    this.initOralInfo()
  },
  methods: {
    initOralInfo () {
      let oralAnswerInfo = this.oralAnswerInfo
      let curSubject = this.currentSubjectInfo
      let curOralInfo = oralAnswerInfo[curSubject.id] // 拿到当前跟读信息
      let isEmpty = DEPENCE.checkRoralEmpty(oralAnswerInfo, curSubject.id)
      // 这边为空返回的是数组(尴尬)
      this.curOralInfo = !isEmpty ? curOralInfo : null
      // 如果是语音问答题并且解析的时候调用绘制
      this.drawVoiceEchart()
    },
    drawVoiceEchart () {
      let curOralInfo = this.curOralInfo
      if (!curOralInfo || !curOralInfo.content) return
      this.$nextTick(() => {
        let { VOICE_RANDAR } = EchartConfig
        let chartInfo = curOralInfo.content
        let charEl = document.getElementById('voice-statistics')
        let options = JSON.parse(JSON.stringify(VOICE_RANDAR))
        let indicators = options.radar[0].indicator
        let vals = options.series[0].data[0].value
        let maping = {
          pron_accuracy: '准确度',
          pron_fluency: '流利度',
          pron_completion: '完整度'
        }
        for (let key in chartInfo) {
          let chartVal = chartInfo[key]
          let mapKey = maping[key]
          if (mapKey) {
            let curText = mapKey
            if (chartVal > 0) {
              curText = `${mapKey}\n ${chartVal}%`
            }
            // 索引点
            indicators.push({ text: curText, max: 100 })
            // 存放值
            if (chartVal > 0) vals.push(chartVal)
          }
        }
        // 初始化图
        let echartIns = this.$echarts.init(charEl)
        echartIns.setOption(options)
        window.addEventListener('resize', () => echartIns.resize())
      })
    },
    _dealFollowText () {
      let subjectType = this.data.type
      let curOralInfo = this.curOralInfo
      let followText = this.data.extra.follow_text
      let words = this._dealWords(curOralInfo.content.words)
      // 这边跟原文字进行比对
      let template = val => `<span class="error">${val}</span>`
      let mandarinInfo = { index: 0, str: followText }
      let englishArr = followText.split(' ')
      words.forEach((wItem, index) => {
        // 处理判定条件
        if (wItem.pron_accuracy < 80) {
          // 进行替换针对错误的
          if (subjectType === 'mandarin') {
            let errorIndex = mandarinInfo.str.indexOf(wItem.word)
            if (errorIndex !== -1) {
              let realIndex = errorIndex + mandarinInfo.index
              // 处理数据
              let preText = followText.substring(0, realIndex)
              let afterText = followText.substr(realIndex + 1)
              followText = `${preText}${template(wItem.word)}${afterText}`
              // 更新中文比对信息
              mandarinInfo.index = realIndex
              mandarinInfo.str = followText.substr(realIndex)
            }
          } else {
            let realWord = englishArr[index]
            if (realWord) englishArr[index] = template(realWord)
          }
        }
        // 进行拼接
        let engIsMatch = (index === words.length - 1) && subjectType === 'englishspoken'
        if (engIsMatch) followText = englishArr.join(' ')
      })
      // 进行中文跟读的标点符号转换
      let signs = ['，', '。', '！', '!', '?', '？']
      let getSign = index => `<span class="sign">${signs[index]}</span>`
      signs.forEach((sign, index) => {
        let regStr = '\\' + sign
        let reg = new RegExp(regStr, 'g')
        followText = followText.replace(reg, getSign(index))
      })
      // 进行整体转换
      return this._dealHtmlLine(followText)
    },
    _dealWords (words) {
      return words.filter(item => {
        return (item.word && item.word !== '*')
      })
    }
  }
}
</script>

<style lang="scss">
@import "@/styles/components/subjects/voice.scss";
</style>
