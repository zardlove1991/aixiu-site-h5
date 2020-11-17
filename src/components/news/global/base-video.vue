<template>
  <div class="news-video-common-wrap" v-if="videoObj && videoObj.videoUrl">
    <video-player class="video-player vjs-custom-skin"
      ref="videoPlayer"
      :playsinline="true"
      style="object-fit:fill"
      :options="playerOptions"
      x5-video-player-type="h5"
      :x5-video-player-fullscreen="true"
      :x-webkit-airplay="true"
      webkit-playsinline
      x5-playsinline
      @pause="onPlayerPause($event)"
      @play="onPlayerPlay($event)"
      @click="fullScreen">
    </video-player>
  </div>
</template>

<script>
import { videoPlayer } from 'vue-video-player'

export default {
  props: {
    videoObj: {
      type: Object,
      default: () => {
        return {}
      }
    },
    isFull: {
      type: Boolean,
      default: false
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
  created () {
    this.initVideo()
  },
  methods: {
    initVideo () {
      let videoObj = this.videoObj
      if (!videoObj || !videoObj.videoUrl) {
        return
      }
      let { videoUrl, posterUrl, ratio } = videoObj
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
      if (ratio) {
        this.playerOptions.aspectRatio = ratio
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
      console.log('onPlayerPlay')
      player.play()
      if (this.isFull) {
        this.fullScreen()
      }
    },
    onPlayerPause (player) {
      console.log('onPlayerPause')
    }
  }
}
</script>

<style lang="scss">
  @import "@/styles/index.scss";
  .news-video-common-wrap {
    width: 100%;
    border-radius: px2rem(8px);
    overflow: hidden;
    box-sizing: border-box;
    .video-js {
      .vjs-poster {
        background-size: cover;
      }
      .vjs-big-play-button {
        width: px2rem(80px) !important;
        font-size: px2rem(50px) !important;
        border-radius: 100%;
        z-index: 100;
        transform: translate(-50%, -50%) !important;
        margin-left: 0 !important;
      }
    }
    .vjs-custom-skin > .video-js .vjs-big-play-button {
      height: px2rem(80px) !important;
      line-height: px2rem(80px) !important;
      margin-top: 0 !important;
    }
  }
  .small-video {
    .vjs-current-time, .vjs-volume-panel, .vjs-time-control.vjs-time-divider, .vjs-duration, .vjs-progress-control {
      display: none !important;
    }
  }
</style>
