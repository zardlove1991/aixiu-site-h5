<template lang="html">
  <!--题型的内容区域-->
  <div class="subject-content-wrap" v-if="data">
    <!--问答题的内容区域-->
    <template v-if="data.type==='essay'">
      <div class="subject-essay-wrap" v-if="essayTempAnswerInfo">
        <h4 class="title-tip">问答</h4>
        <!--表单编辑区域-->
        <div class="from-wrap">
          <div class="content-wrap" v-show="renderType === 'exam'">
            <textarea class="content" placeholder="请输入答案" maxlength="300"
              :value = "essayTempAnswerInfo.text"
              @input="uploadText"
              v-show="renderType === 'exam'">
            </textarea>
          </div>
          <!--回答的内容信息-->
          <p class="answer-content" v-show="renderType === 'analysis'">
            <span v-show="_checkMedaiObjIsEmpty(essayTempAnswerInfo)">当前没有回答信息哦~</span>
            <span v-show="essayTempAnswerInfo.text">{{essayTempAnswerInfo.text}}</span>
          </p>
          <!--上传的媒体展示区域-->
          <div class="upload-media-wrap">
            <div class="images-wrap" v-if="essayTempAnswerInfo.image.length">
              <div class="single-image-wrap" v-for="(item,index) in essayTempAnswerInfo.image" :key="index">
                <img :src="item" @click.stop="_setPreviewState" preview-nav-enable="false" class="eassy-image" v-preview="item"/>
                <!--删除图标-->
                <div class="delete-icon"
                  v-show="renderType === 'exam'"
                  @click.stop="deleteUploadData(index,'image')">
                </div>
              </div>
              <!--空白填充的个数-->
              <div class="single-image-wrap" v-for="item in _getEmptyDivNum(4, essayTempAnswerInfo.image)" :key="`empty_${item}`"></div>
            </div>
            <!--音频播放-->
            <div class="eassy-audio-wrap" v-if="essayTempAnswerInfo.audio.length">
              <my-audio class="eassy-audio" :src="essayTempAnswerInfo.audio[0]"></my-audio>
              <!--删除图标-->
              <div class="delete-icon"
                v-show="renderType === 'exam'"
                @click.stop="deleteUploadData(0, 'audio')">
              </div>
            </div>
            <!--视频播放-->
            <div class="eassy-video-wrap" v-if="essayTempAnswerInfo.video.length">
              <my-video class="eassy-video"
                :poster="essayTempAnswerInfo.video[0].cover"
                :src="essayTempAnswerInfo.video[0].src">
              </my-video>
              <!--删除图标-->
              <div class="delete-icon"
                v-show="mode === 'exam'"
                @click.stop="deleteUploadData(0, 'video')">
              </div>
            </div>
          </div>
          <!--上传区域-->
          <div class="upload-option-wrap" v-show="mode === 'exam'">
            <div class="upload-img"
              v-show="['unlimit','image'].includes(data.mode)"
              :class="{'disabled': essayTempAnswerInfo && (essayTempAnswerInfo.image.length > 8)}"
              @click.stop='uploadImg'>
              <i class="examfont icon-image"></i>
            </div>
            <div class="upload-audio"
              v-show="['unlimit','audio'].includes(data.mode)"
              :class="{'disabled': essayTempAnswerInfo && essayTempAnswerInfo.audio.length}"
              @click.stop="uploadAudio">
              <i class="examfont icon-audio"></i>
            </div>
            <div class="upload-video"
              v-show="['unlimit','video'].includes(data.mode)"
              :class="{'disabled': essayTempAnswerInfo && essayTempAnswerInfo.video.length}"
              @click.stop="uploadVideo"
              >
              <i class="examfont icon-video"></i>
            </div>
            <!--原生上传操作-->
            <input type="file"
              ref="uploadFileInput" name="filte" class="file-input"
              @change="fileUpload"/>
          </div>
        </div>
        <!--答案解析-->
        <div class="answerinfo-wrap" v-if="mode === 'analysis'">
          <div class="answer-analysis">
            <h4 class="title">解析</h4>
            <p class="content" v-if="data.analysis" v-html="data.analysis"></p>
            <p class="content" v-else>暂无解析内容~</p>
            <!--目前还没有类别和正确率 暂时隐藏-->
            <div class="exam-types" v-show="data.point && data.point.length">
              <span class="tip">考点</span>
              <span class="type" v-for="item in data.point" :key="item.id">{{item.name}}</span>
            </div>
          </div>
          <!--问答题的老师点评-->
          <div class="essay-markinfo-wrap" v-if="data.remark.score">
            <h4 class="title">点评</h4>
            <!--点评的老师信息先不展示-->
            <!-- <div class="teacher-info" v-show="data.remark.teacher.name">
              <img v-show="data.remark.teacher.avatar" :src="data.remark.teacher.avatar" class="icon" />
              <span class="name">{{data.remark.teacher.name}}</span>
            </div> -->
            <p class="markinfo" :class="{ 'empty-info': !data.remark.content.text }">
              <span v-show="_checkMedaiObjIsEmpty(data.remark.content)">此处无声胜有声~</span>
              <span v-show="data.remark.content.text">{{data.remark.content.text}}</span>
            </p>
            <!--图片展示-->
            <div class="mark-img-wrap" v-if="data.remark.content.image.length">
              <img :src="src" class="mark-img"
                @click.stop="_setPreviewState"
                v-preview="src" preview-nav-enable="false"
                v-for="(src, index) in data.remark.content.image" :key="index"/>
            </div>
            <!--音频播放-->
            <div class="mark-audio-wrap" v-if="data.remark.content.audio.length">
              <my-audio  class="mark-audio" :src="data.remark.content.audio[0]"></my-audio>
            </div>
            <!--视频播放-->
            <div class="mark-video-wrap" v-if="data.remark.content.video.length">
              <my-video class="mark-video"
                :poster="data.remark.content.video[0].cover"
                :src="data.remark.content.video[0].src">
              </my-video>
            </div>
          </div>
        </div>
      </div>
    </template>
    <!--语音问答题的区域-->
    <template>
      <div class="subject-voice-wrap">
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
      </div>
    </template>
    <!--通用答案解析-->
    <template v-if="data.type !== 'essay' && mode === 'analysis'">
      <div class="answerinfo-wrap">
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
    </template>
  </div>
</template>

<script>
import EchartConfig from '@/config/echarts'
import SubjectMixin from '@/mixins/subject'

export default {
  name: 'subject-content',
  mixins: [ SubjectMixin ],
  props: {
    data: {
      type: Object,
      required: true,
      default: null
    },
    mode: {
      type: String,
      required: true,
      default: ''
    }
  },
  data  () {
    return {
      showVoiceTip: false
    }
  },
  created () {
    // 赋值当前问答题临时对象 -> 调用mixin的方法
    this._setTempEssayAnswerInfo()
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
@import "@/styles/components/subject-content.scss";
</style>
