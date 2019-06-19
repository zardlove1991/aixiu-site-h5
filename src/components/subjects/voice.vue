<template lang="html">
  <div class="subject-voice-wrap">
    <!--题目的标题-->
    <div class="subject-type-wrap">
      <h3 class="subject-type">
        <span>{{data.typeTip}}</span>
        <span class="score" v-show="data.score">{{`(${data.score}分)`}}</span>
      </h3>
      <!--当前题目进度提示-->
      <div v-show="mode === 'exam'" class="subject-tip-wrap" @click.stop="toggetSubjectList">
        <div class="tip-img"></div>
        <div class="tip-count">{{`${currentSubjectIndex+1}/${examList.length}`}}</div>
      </div>
      <!--问答题批阅得分提醒-->
      <div
        v-show="mode === 'analysis' && data.type === 'essay' && data.remark.score"
        class="essay-audio-score">{{`得${data.remark.score}分`}}</div>
    </div>
    <p class="subject-title">{{`${currentSubjectIndex+1}. ${data.title}`}}</p>
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
      <my-video v-if="mediaKey=='video' && media.length" class="my-video" :poster="annexMedia(media).cover" :src="annexMedia(media).src"></my-video>
    </div>
    <!--题目的内容区域-->
    <div class="subject-voice-content-wrap">
      <!--得分区域-->
      <div class="voice-score">3分</div>
      <!--跟读文本区域-->
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
      <p class="voice-words-tip">Are you sure that's a real spell ?</p>
      <!--语音问答的语音-->
      <div class="voice-audio-wrap">
        <h4 class="voice-audio-tip">你的答题语音</h4>
        <my-audio
          show-type="bubble"
          src="https://1400163958.vod2.myqcloud.com/fade8787vodcq1400163958/14314f895285890784101367631/Ul8fw5860aYA.mp3"
          :limit-info="{isLimit: true, limitTime: 60, showSecond: true }">
        </my-audio>
      </div>
      <!--图形统计区域-->
      <div id="voice-statistics" style="width:100%;height:280px"></div>
      <!--题目解析选项-->
      <div class="answerinfo-wrap" v-if="mode === 'analysis'">
        <div class="correct-answer">
          <span>正确答案:</span>
          <span v-show="!data.correntInfo.length">&nbsp;未指定</span>
          <span v-for="info in data.correntInfo" :key='info.id'>&nbsp;{{info.tip}}</span>
        </div>
        <div class="my-answer">
          <span>您的回答:</span>
          <span v-show="!data.answersInfo.length">&nbsp;未选择</span>
          <span v-for="info in data.answersInfo" :key='info.id'>&nbsp;{{info.tip}}</span>
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
      </div>
    </div>
  </div>
</template>

<script>
import EchartConfig from '@/config/echarts'
import SubItemMixin from '@/mixins/subject-item'
import SubjectMixin from '@/mixins/subject'

export default {
  name: 'essay-subject',
  mixins: [ SubItemMixin, SubjectMixin ],
  data  () {
    return {
      showVoiceTip: false
    }
  },
  created () {
    // 如果是语音问答题并且解析的时候调用绘制
    this.drawVoiceEchart()
  },
  methods: {
    drawVoiceEchart () {
      this.$nextTick(() => {
        let { VOICE_RANDAR } = EchartConfig
        let charEl = document.getElementById('voice-statistics')
        let options = JSON.parse(JSON.stringify(VOICE_RANDAR))
        let indicators = options.radar[0].indicator
        let vals = options.series[0].data[0].value
        for (let i = 0; i < 4; i++) {
          let val = Math.ceil(Math.random() * 100)
          indicators.push({
            text: `坐标${i + 1} ${val}`,
            max: 100
          })

          vals.push(val)
        }
        console.log('xxx options', options)
        // 初始化图
        let echartIns = this.$echarts.init(charEl)
        echartIns.setOption(options)
        window.addEventListener('resize', () => echartIns.resize())
      })
    }
  }
}
</script>

<style lang="scss">
@import "@/styles/components/subjects/voice.scss";
</style>
