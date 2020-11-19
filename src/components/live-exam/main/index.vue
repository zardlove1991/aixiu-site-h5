<template>
  <div>
    <live-video :videoObj="videoObj" :id="id" />
    <router-view />
  </div>
</template>

<script>
import LiveVideo from '@/components/live-exam/global/live-video'
import { mapActions, mapGetters } from 'vuex'
import STORAGE from '@/utils/storage'
import API from '@/api/module/examination'

export default {
  props: {
    id: String
  },
  data () {
    return {
      videoObj: {
        posterUrl: '',
        videoUrl: ''
      },
      interval: null
    }
  },
  created () {
    this.initData()
  },
  components: { LiveVideo },
  computed: {
    ...mapGetters('depence', ['examInfo'])
  },
  beforeDestroy () {
    // 清除定时器
    console.log('beforeDestroy interval')
    this.clearSetInterval()
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
        this.beginInterval()
      } catch (err) {
        console.log(err)
      }
    },
    clearSetInterval () {
      if (this.interval) {
        clearInterval(this.interval)
        this.interval = null
        this.setLiveVideoTime()
      }
    },
    beginInterval (endTime, dealCb, doneCb) {
      let timer = this.interval
      this.clearSetInterval()
      // 每隔10min执行1次
      let time = 1000 * 60 * 10
      timer = setInterval(() => {
        this.setLiveVideoTime()
      }, time)
      this.interval = timer
    },
    setLiveVideoTime () {
      let id = this.id
      let endTime = parseInt((new Date().getTime()) / 1000)
      let startTime = STORAGE.get('video-start-time')
      if (startTime && id) {
        API.setLiveVideoTime({
          data: {
            play_begin: startTime,
            play_end: endTime,
            examination_id: id
          }
        }).then(() => {
          STORAGE.set('video-start-time', endTime)
        })
      }
    },
    ...mapActions('depence', {
      getExamDetail: 'GET_EXAM_DETAIL'
    })
  }
}
</script>

<style lang="scss">
</style>
