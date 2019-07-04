<template lang="html">
  <div class="subject-sort-wrap">
    <!--题目的标题-->
    <div class="subject-type-wrap">
      <h3 class="subject-type">
        <span>{{data.typeTip}}</span>
        <span class="score" v-show="data.score">{{`(${data.score}分)`}}</span>
      </h3>
      <!--问答题批阅得分提醒-->
      <div
        v-show="mode === 'analysis' && data.type === 'essay' && data.remark.score"
        class="essay-audio-score">{{`得${data.remark.score}分`}}</div>
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
        :limit-info="{ isLimit: false }"
        :src="annexMedia(media)">
      </my-audio>
      <!--视频播放-->
      <my-video v-if="mediaKey=='video' && annexMedia(media)" class="my-video" :poster="annexMedia(media).cover" :src="annexMedia(media).src"></my-video>
    </div>
    <!--每个选择项-->
    <vue-draggable class="subjec-drag-wrap"
      v-model="sortOptions"
      :options="sortConfig"
      @end="dealSortEnd"
      @start="dealSortStart">
      <transition-group>
        <div class="subject-select-wrap" v-for="optItem in sortOptions" :key='optItem.id' ref="subjectSelectWrap">
          <!--每个选择项描述-->
          <div class="select-tip-wrap">
            <div class="select-tip" :class="{error: optItem.error}">{{optItem.selectTip}}</div>
            <div class="select-desc">{{optItem.name}}</div>
            <!--拖动的图标-->
            <div class="sort-icon-wrap" v-show="mode === 'exam'">
              <i class="examfont sort-icon">&#xe71a;</i>
            </div>
          </div>
        </div>
      </transition-group>
    </vue-draggable>
    <!--题目解析选项-->
    <div class="answerinfo-wrap" v-if="mode === 'analysis'">
      <div class="correct-answer">
        <span>正确答案:</span>
        <span v-show="!data.correntInfo.length">&nbsp;未指定</span>
        <span
          v-for="info in _sortByOrder({ arr: data.correntInfo, flag: 'byOrder' })"
          :key='info.id'>&nbsp;{{info.tip}}
        </span>
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
      <div class="sort-score" v-if="data.sort_answer.score">{{`${data.sort_answer.score}分`}}</div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import SubjectMixin from '@/mixins/subject'
import SubItemMixin from '@/mixins/subject-item'
import vueDraggable from 'vuedraggable'

export default {
  name: 'essay-subject',
  mixins: [ SubItemMixin, SubjectMixin ],
  data () {
    return {
      sortOptions: [],
      sortConfig: {
        handle: '.sort-icon-wrap',
        chosenClass: 'sort-select-shadow',
        disabled: false
      }
    }
  },
  computed: {
    ...mapGetters('depence', ['sortAnswerInfo'])
  },
  components: {
    vueDraggable
  },
  created () {
    // 判断是否需要禁止拖放
    this.sortConfig = Object.assign({}, this.sortConfig, { disabeld: this.mode === 'analysis' })
    // 赋值默认排序数组
    this.initSortOptions()
  },
  methods: {
    initSortOptions () {
      let data = this.data
      let sortAnswerInfo = this.sortAnswerInfo
      let sortIds = sortAnswerInfo[data.id]
      if (!sortIds || this.mode === 'analysis') {
        let result = null
        let answers = data.answer // 回答的顺序
        // 如果是解析根据自己排序的回答展示
        if (answers.length) {
          result = this._sortByOrder({ arr: answers, flag: 'byIdForAns' })
        } else {
          result = [...data.options]
        }
        this.sortOptions = result
        return
      }
      // 调用排序
      this.sortOptions = this._sortByOrder({ arr: sortIds, flag: 'byIdForInit' })
      // 这边去触发下题目答题变更
      this.updateAnswer()
    },
    dealSortStart (e) {
      this.setModelThumbState(true) // 将视图静止滚动
    },
    dealSortEnd (e) {
      this.updateAnswer() // 更新数据
      this.setModelThumbState(false) // 恢复视图
    },
    updateAnswer () {
      let subject = this.data
      let sortAnswerInfo = this.sortAnswerInfo
      let sortIds = this.sortOptions.map(item => item.id)
      // 更新数据
      sortAnswerInfo[subject.id] = sortIds
      // 这边去触发下题目答题变更
      this.setSortAnswerInfo(sortAnswerInfo)
      this.changeSubjectAnswerInfo({ subject })
    },
    _sortByOrder ({ arr, flag }) {
      let result = []
      let data = this.data
      // 赋值已经更改过的数组的值
      if (flag !== 'byOrder') {
        arr.forEach(id => {
          let item = data.options.find(item => item.id === id) // 找到原数据赋值
          result.push(item)
        })
      } else {
        result = arr.sort((item1, item2) => {
          return item1.extra.ordering - item2.extra.ordering
        })
      }
      return result
    },
    ...mapMutations('depence', {
      setSortAnswerInfo: 'SET_SORT_ANSWER_INFO'
    })
  }
}
</script>

<style lang="scss">
@import "@/styles/components/subjects/sort.scss";
</style>
