<template lang="html">
  <!--题型的内容区域-->
  <div class="subject-content-wrap" v-if="data">
    <!--普通提醒 单选、多选、判断-->
    <normal-subject
       v-if="['judge', 'radio', 'checkbox'].includes(data.type)"
       :data="data"
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
  </div>
</template>

<script>
import VoiceSubject from '@/components/subjects/voice'
import EssaySubject from '@/components/subjects/essay'
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
    }
  },
  components: {
    VoiceSubject,
    EssaySubject,
    NormalSubject
  }
}
</script>

<style lang="scss">
@import "@/styles/components/subject-content.scss";
</style>
