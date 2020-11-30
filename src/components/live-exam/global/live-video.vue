<template>
  <div class="live-video-header-wrap" v-if="videoObj && videoObj.videoUrl">
    <video-player class="video-player vjs-custom-skin"
      ref="videoPlayer"
      :playsinline="true"
      style="object-fit:fill"
      :options="playerOptions"
      :webkit-playsinline="true"
      x5-playsinline
      x-webkit-airplay="allow"
      :x5-video-player-fullscreen="false"
      @pause="onPlayerPause($event)"
      @play="onPlayerPlay($event)"
      @click="fullScreen">
    </video-player>
    <div class="refresh-wrap" @click="refreshVideo()">
      <i class="refresh-icon"></i>
    </div>
  </div>
</template>

<script>
import { videoPlayer } from 'vue-video-player'
import STORAGE from '@/utils/storage'
import API from '@/api/module/examination'

export default {
  props: {
    id: String,
    videoObj: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  components: {
    videoPlayer
  },
  data () {
    return {
      defaultPoster: require('@/assets/common/main-header@2x.png'),
      playerOptions: {
        // playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
        autoplay: false, // 如果true,浏览器准备好时开始回放
        muted: false, // 默认情况下将会消除任何音频
        loop: false, // 导致视频一结束就重新开始。
        preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: 'zh-CN',
        aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [{
          type: '',
          src: ''
        }],
        poster: '',
        width: document.documentElement.clientWidth,
        notSupportedMessage: '此视频暂无法播放，请稍后再试', // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          // timeDivider: true,
          // durationDisplay: true,
          // remainingTimeDisplay: false,
          fullscreenToggle: true // 全屏按钮
        }
      }
    }
  },
  computed: {
    player () {
      return this.$refs.videoPlayer.player
    }
  },
  watch: {
    videoObj: {
      handler (val) {
        console.log('watch videoObj', val)
        this.initVideo()
      },
      deep: true
    }
  },
  methods: {
    initVideo () {
      let videoObj = this.videoObj
      if (!videoObj || !videoObj.videoUrl) {
        return
      }
      let { videoUrl, posterUrl } = videoObj
      let poster = this.defaultPoster
      let type = 'video/mp4'
      if (posterUrl) {
        poster = posterUrl
      }
      if (/m3u8/.test(videoUrl)) {
        type = 'application/x-mpegURL'
      } else {
        if (/mp4/.test(videoUrl)) {
          type = 'video/mp4'
        } else if (/ogg/.test(videoUrl)) {
          type = 'video/ogg'
        } else if (/webm/.test(videoUrl)) {
          type = 'video/webm'
        }
      }
      this.playerOptions.poster = poster
      this.playerOptions.sources[0].type = type
      this.playerOptions.sources[0].src = videoUrl
    },
    fullScreen () {
      console.log('fullScreen')
      const player = this.$refs.videoPlayer.player
      player.requestFullscreen() // 调用全屏api方法
      player.isFullscreen(true)
      player.play()
    },
    onPlayerPlay (player) {
      player.play()
      let startTime = parseInt((new Date().getTime()) / 1000)
      STORAGE.set('video-start-time', startTime)
    },
    onPlayerPause (player) {
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
          STORAGE.remove('video-start-time')
        })
      }
    },
    refreshVideo () {
      // console.log('refreshVideo')
      let videoObj = this.videoObj
      if (!videoObj || !videoObj.videoUrl) {
        return
      }
      let videoUrl = videoObj.videoUrl
      this.playerOptions.sources[0].src = videoUrl
      // console.log(videoUrl, this.$refs.videoPlayer)
    }
  }
}
</script>

<style lang="scss">
  @import "@/styles/index.scss";
  .live-video-header-wrap {
    position: fixed;
    left: 0;
    top: 0;
    width: 100vw;
    height: px2rem(414px);
    overflow: hidden;
    box-sizing: border-box;
    z-index: 101;
    .video-js .vjs-big-play-button {
      width: 72px;
      height: 72px;
      border-radius: 100%;
      z-index: 100;
    }
    // .video-js .vjs-fullscreen-control {
    //   display: none;
    // }
    .bg {
      width: 100%;
      height: 100%;
      object-fit: cover;
      background-color: #fff;
      // filter: blur(4px);
      &.bg-default {
        object-fit: contain;
      }
    }
    .indexpic-bg{
      width: 100%;
      height: 100%;
      background-position: center;
      background-repeat: no-repeat;
      @include img-retina('~@/assets/common/empty_indepic_bg@2x.png','~@/assets/common/empty_indepic_bg@3x.png', 100%, 100%);
    }
    .refresh-wrap {
      position: absolute;
      top: px2rem(171px);
      right: 0;
      height: px2rem(72px);
      width: px2rem(72px);
      z-index: 102;
      background-color: rgba(0, 0, 0, 0.6);
      border-radius: px2rem(100px) 0px 0px px2rem(100px);
      display: flex;
      align-items: center;
      justify-content: center;
      .refresh-icon {
        display: inline-block;
        width: px2rem(40px);
        height: px2rem(40px);
        background-size: px2rem(40px) px2rem(40px);
        background-image: url('~@/assets/live-exam/refresh-icon.png');
      }
    }
  }
</style>
