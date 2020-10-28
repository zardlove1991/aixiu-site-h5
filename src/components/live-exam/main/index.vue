<template>
  <div class="livemain-index-wrap">
    <live-video :videoObj="videoObj" />
    <router-view />
  </div>
</template>

<script>
import LiveVideo from '@/components/live-exam/global/live-video'
import { mapActions, mapGetters } from 'vuex'
// import API from '@/api/module/examination'

export default {
  props: {
    id: String
  },
  data () {
    return {
      videoObj: {
        posterUrl: '',
        videoUrl: ''
      }
    }
  },
  created () {
    this.initData()
  },
  components: { LiveVideo },
  computed: {
    ...mapGetters('depence', ['examInfo'])
  },
  methods: {
    async initData () {
      let examId = this.id
      try {
        await this.getExamDetail({id: examId})
        let examInfo = this.examInfo
        if (examInfo) {
          let videoUrl = ''
          let posterUrl = ''
          if (examInfo.live_stream_url) {
            videoUrl = examInfo.live_stream_url
          }
          if (examInfo.indexpic && examInfo.indexpic.url) {
            posterUrl = examInfo.indexpic.url
          }
          // http://playertest.longtailvideo.com/adaptive/bipbop/gear4/prog_index.m3u8
          this.videoObj = {
            posterUrl,
            videoUrl
          }
          console.log('posterUrl', posterUrl)
        }
      } catch (err) {
        console.log(err)
      }
    },
    ...mapActions('depence', {
      getExamDetail: 'GET_EXAM_DETAIL'
    })
  }
}
</script>

<style lang="scss">
  .livemain-index-wrap {
    position: relative;
  }
</style>
