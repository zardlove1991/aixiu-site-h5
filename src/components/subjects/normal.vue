<template lang="html">
  <div class="subject-noraml-wrap">
    <!--题目的标题-->
    <div class="subject-type-wrap" v-if="mode === 'analysis' && data.type === 'essay' && data.remark.score">
      <!--问答题批阅得分提醒-->
      <div
        v-show="mode === 'analysis' && data.type === 'essay' && data.remark.score"
        class="essay-audio-score">{{`得${data.remark.score}分`}}</div>
    </div>
    <p class="subject-title">
      <span>{{`${data.index}.`}}</span>
      <span v-html="_dealHtmlLine(data.title)"></span>
      <span class="all-score" v-show="data.score">{{`(${data.typeTip} ${parseFloat(data.score)}分)`}}</span>
    </p>
    <!--题干的媒体数据-->
    <div class="media-wrap" v-for="(media,mediaKey) in data.annex" :key="mediaKey">
      <img v-if="mediaKey=='image' && (media && media.length)" :src="annexMedia(media)"  @click.stop="_setPreviewState" v-preview="annexMedia(media)" preview-nav-enable="false" class="my-img"/>
      <!--音频播放 视频播放-->
      <!-- <my-audio
        v-if="mediaKey=='audio' && annexMedia(media)"
        class="my-audio"
        :limit-info="{ isLimit: false }"
        :src="annexMedia(media)">
      </my-audio>
      <my-video v-if="mediaKey=='video' && annexMedia(media)" class="my-video" :poster="annexMedia(media).cover" :src="annexMedia(media).src"></my-video> -->
      <my-video v-if="mediaKey=='video' && annexMedia(media)" class="my-video" :poster="annexMedia(media).cover" :src="annexMedia(media).src"></my-video>
    </div>
    <!--每个选择项-->
    <div
    class="subject-select-wrap"
    :class="checkAnswerStatus(optItem)"
    v-for="(optItem,optIndex) in data.options"
    :key='optIndex'
    ref="subjectSelectWrap">
      <!--每个选择项描述-->
      <div class="select-tip-wrap" @click.stop="selectTouchEnd(optIndex, data.index)">
        <div class="select-tip" v-if="data.type === 'radio' || data.type === 'pictureRadio'" :class="{active: optItem.active , error: optItem.error, videoActive: isShowVideo}"></div>
        <div class="select-tip-checkbox" v-if="data.type === 'checkbox' || data.type === 'pictureMulti'" :class="{active: optItem.active , error: optItem.error, videoActive: isShowVideo}"></div>
        <div class="select-desc">{{optItem.selectTip}}. {{optItem.name}}</div>
      </div>
      <div class="media-wrap" v-for="(media,mediaKey) in optItem.annex" :key="mediaKey">
        <img v-if="mediaKey=='image' && (media && media.length)" :src="annexMedia(media)"  v-preview="annexMedia(media)" @click.stop="_setPreviewState" preview-nav-enable="false" class="my-img"/>
        <!--音频播放 视频播放-->
        <!-- <my-audio
          v-if="mediaKey=='audio' && annexMedia(media)"
          class="my-audio"
          :limit-info="{ isLimit: false }"
          :src="annexMedia(media)">
        </my-audio>
        <my-video v-if="mediaKey=='video' && annexMedia(media)" class="my-video" :poster="annexMedia(media).cover" :src="annexMedia(media).src"></my-video> -->
      </div>
    </div>
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
          <span class="tip">知识点</span>
          <span class="type" v-for="item in data.point" :key="item.id">{{item.name}}</span>
        </div>
        <p class="percent">{{`正确率: ${data.correct_percent ? Math.round(data.correct_percent) : 0}%`}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import SubjectMixin from '@/mixins/subject'
import SubItemMixin from '@/mixins/subject-item'

export default {
  name: 'normal-subject',
  mixins: [ SubItemMixin, SubjectMixin ],
  props: {
    isShowVideo: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    checkAnswerStatus (data) {
      console.log('%c校验答案1: ', 'color: green;', data)
      let values = Object.values(this.analysisAnswer)
      console.log('%c校验答案2: ', 'color: green;', values)
      let _result = ''
      if (values && values.length > 0) {
        if (values.indexOf(data.id) > -1) {
          _result = 'correct_answer'
        } else {
          if (data.active) {
            console.log('被选中！！')
            _result = 'wrong_answer'
          }
        }
      } else {
        console.log('没有值：', _result)
      }
      console.log('%c校验结果: ', 'color: green;', _result)
      return _result
    }
  },
  watch: {
    data: {
      handler: function (v) {
        console.log('组件数据：', v)
      },
      deep: true,
      immediate: true
    }
  }
}
</script>

<style lang="scss">
</style>
