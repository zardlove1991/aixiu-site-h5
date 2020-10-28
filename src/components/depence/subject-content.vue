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
  </div>
</template>

<script>
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
    }
  },
  components: {
    VoiceSubject,
    EssaySubject,
    NormalSubject,
    SortSubject,
    BlankSubject,
    SelectBlankSubject
  }
}
</script>

<style lang="scss">
@import "@/styles/components/subject-content.scss";
</style>
