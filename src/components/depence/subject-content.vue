<template lang="html">
  <!--题型的内容区域-->
  <div class="subject-content-wrap" v-if="data">
    <!--普通提醒 单选、多选、判断-->
    <normal-subject
       v-if="['judge', 'radio', 'checkbox', 'pictureMulti', 'pictureRadio'].includes(data.type)"
       :data="data"
       :isShowVideo="isShowVideo"
       :mode="mode">
    </normal-subject>
    <!--问答题的内容区域-->
    <essay-subject
       v-else-if="data.type==='essay'"
       :data="data"
       :mode="mode">
    </essay-subject>
    <!--语音问答题的区域-->
    <voice-subject
      v-else-if="['englishspoken', 'mandarin'].includes(data.type)"
      :data="data"
      :mode="mode">
    </voice-subject>
    <!--排序题的区域-->
    <sort-subject
      v-else-if="data.type === 'sort'"
      :data="data"
      :mode="mode">
    </sort-subject>
    <!--单项/多项填空-->
    <blank-subject
      v-else-if="['singleblank', 'mulitblank'].includes(data.type)"
      :data="data"
      :mode="mode">
    </blank-subject>
    <!--排序题的区域-->
    <select-blank-subject
      v-else-if="data.type === 'optionblank'"
      :data="data"
      :mode="mode">
    </select-blank-subject>
    <div class="saveIntoCloud" v-if="showCloudBtn && type === 'all'">
      <div class="confirm-btn" @click="confirmSave()">保存答题信息</div>
      <div class="cancel-btn" @click="cancelSave()">取消</div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import VoiceSubject from '@/components/subjects/voice'
import EssaySubject from '@/components/subjects/essay'
import SortSubject from '@/components/subjects/sort'
import BlankSubject from '@/components/subjects/blank'
import SelectBlankSubject from '@/components/subjects/select-blank'
import NormalSubject from '@/components/subjects/normal'
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
    },
    isShowVideo: {
      type: Boolean,
      default: false
    },
    itemIndex: {
      type: Number,
      default: 0
    },
    type: {
      type: String,
      default: ''
    }
  },
  components: {
    VoiceSubject,
    EssaySubject,
    NormalSubject,
    SortSubject,
    BlankSubject,
    SelectBlankSubject
  },
  data () {
    return {
      showCloudBtn: false,
      oldValue: '', // 保存上次的提交记录
      singleblankOldValue: ''
    }
  },
  watch: {
    data: {
      handler: function (newV) {
        if (!this.oldValue) {
          this.oldValue = JSON.parse(JSON.stringify(newV))
        } else {
          if (newV && this.data.type !== 'singleblank') {
            let newStr = JSON.stringify(newV)
            let oldStr = JSON.stringify(this.oldValue)
            if (newStr !== oldStr) {
              this.showCloudBtn = true
            }
          }
        }
        if (this.data.type === 'singleblank') {
          if (newV.value) {
            this.singleblankOldValue = newV.value
          }
        }
      },
      deep: true,
      immediate: true
    },
    blankAnswerInfo: {
      handler: function (val) {
        if (this.data.type === 'singleblank') {
          if (val && val[this.data.id]) {
            let newStr = val[this.data.id]
            if (newStr instanceof Array) {
              newStr = newStr.join(',')
            }
            let oldStr = this.singleblankOldValue
            if (oldStr instanceof Array) {
              oldStr = oldStr.join(',')
            }
            if (newStr !== oldStr) {
              this.showCloudBtn = true
            }
          }
        }
      }
    }
  },
  methods: {
    cancelSave () {
      let _examList = JSON.parse(JSON.stringify(this.examList))
      let _data = JSON.parse(JSON.stringify(this.oldValue))
      _examList[this.itemIndex] = _data
      if (this.data.type === 'singleblank') {
        this.setSingle()
      } else {
        this.setExamList(_examList)
      }
      this.showCloudBtn = false
    },
    confirmSave () {
      this.setAllCurrentIndex(this.itemIndex).then(res => {
        this.changeSubjectIndex(this.itemIndex)
        if (this.data.type === 'singleblank') {
          this.singleblankOldValue = this.blankAnswerInfo[this.data.id]
          this.setSingle()
        } else {
          this.oldValue = JSON.stringify(this.data)
        }
        this.showCloudBtn = false
      })
    },
    setSingle () {
      let _examList = JSON.parse(JSON.stringify(this.examList))
      let _data = JSON.parse(JSON.stringify(this.oldValue))
      _examList[this.itemIndex] = _data
      let _blankAnswerInfo = JSON.parse(JSON.stringify(this.blankAnswerInfo))
      let listValue = ''
      if (this.singleblankOldValue instanceof Array) {
        _blankAnswerInfo[this.data.id] = this.singleblankOldValue
        listValue = this.singleblankOldValue.join(',')
      } else {
        _blankAnswerInfo[this.data.id] = this.singleblankOldValue.split(',')
        listValue = this.singleblankOldValue
      }
      _examList[this.itemIndex] = {..._examList[this.itemIndex], value: listValue}
      this.setBlankAnswerInfo(_blankAnswerInfo)
      this.setExamList(_examList)
    },
    ...mapMutations('depence', {
      setBlankAnswerInfo: 'SET_BLANK_ANSWER_INFO'
    })
  }
}
</script>

<style lang="scss">
@import "@/styles/components/subject-content.scss";
.subject-content-wrap {
  padding-bottom: 50px;
  position: relative;
  .saveIntoCloud{
    position: absolute;
    bottom: 5px;
    width: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
    div{
      padding: 5px 10px;
      border-radius: 5px;
      margin-right: .9375rem;
    }
    .confirm-btn{
      background: #FFA800;
      color: #fff;
    }
    .cancel-btn{
      background: rgba(255, 168, 0, 0.12);
      color: #FFA800;
    }
  }
}
</style>
