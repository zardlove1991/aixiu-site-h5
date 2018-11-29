<template lang="html">
  <div class="audio-wrap">
    <!--自定义样式-->
    <div class="audio">
      <div class="play" :class="playClass" @click.stop="togglePlay"></div>
      <!--进度条-->
      <div class="progress-bar-wrap" ref="progressBarWrap">
        <div class="progress" ref="progress"></div>
        <div class="progress-btn-wrap" ref="progressBtn"
             @touchstart.prevent="changeProgressStart"
             @touchmove.prevent="changeProgressMove"
             @touchend="changeProgressEnd"
        >
          <div class="progress-btn"></div>
        </div>
      </div>
      <!--显示时间-->
      <div class="time" v-if="duration">{{duration + '"'}}</div>
    </div>
    <!--audio组件-->
    <audio :src="src" ref="audio" preload="metadata" @canplay="audioCanPlay" @ended="audioStop" @error="error" @timeupdate="timeUpdate">该浏览器不支持audio属性</audio>
  </div>
</template>

<script>
import { formatTimeBySec, prefixStyle } from '@/utils/utils'

const TRANSFORM = prefixStyle('transform')
const PROGRESS_BTN_W = 2

export default {
  name: 'myAudio',
  data () {
    return {
      currentDuration: null,
      playing: false,
      currentTime: 0
    }
  },
  props: {
    src: String
  },
  computed: {
    playClass () {
      return this.playing ? 'stop' : ''
    },
    duration () {
      let currentTime = this.currentTime
      let duration = this.currentDuration
      let reuslt = null
      if (duration) reuslt = formatTimeBySec(duration - currentTime)
      return reuslt
    },
    percent () {
      return this.currentTime / this.currentDuration
    }
  },
  watch: {
    playing (state) {
      let audio = this.audio
      // 通过状态判定播放
      if (state) {
        // 解决在小程序中的兼容性
        let WeixinJSBridge = window.WeixinJSBridge
        if (typeof WeixinJSBridge === 'object' && typeof WeixinJSBridge.invoke === 'function') {
          // IOS
          WeixinJSBridge.invoke('getNetworkType', {}, (res) => audio.play())
        } else {
          // Android
          audio.play()
        }
      } else {
        audio.pause()
      }
    },
    percent (newVal) {
      // 调用进度条
      if (newVal) {
        let maxProgressW = this.$refs.progressBarWrap.clientWidth - PROGRESS_BTN_W
        let offsetWidth = maxProgressW * newVal
        this._offset(offsetWidth)
      }
    }
  },
  mounted () {
    // 初始化
    this.initAudioInfo()
  },
  created () {
    this.touch = {}
  },
  methods: {
    initAudioInfo () {
      this.$nextTick(() => {
        this.audio = this.$refs.audio
        // 监听客户端请求数据
        this.audio.load()
      })
    },
    audioCanPlay () {
      let myAudio = this.audio
      // 赋值总时长
      this.currentDuration = parseInt(Math.round(myAudio.duration.toFixed(2)))
    },
    audioStop () {
      this.togglePlay()
    },
    error () {
      this.$toast('音频加载失败')
    },
    togglePlay () {
      this.playing = !this.playing
    },
    timeUpdate (e) {
      this.currentTime = e.target.currentTime
    },
    changeProgressStart (e) {
      let touchObj = this.touch
      touchObj.initTouch = true
      touchObj.startX = e.touches[0].pageX
      touchObj.left = this.$refs.progress.clientWidth
    },
    changeProgressMove (e) {
      let touchObj = this.touch
      // 没有初始化就return
      if (!touchObj.initTouch) return
      let deltaX = e.touches[0].pageX - touchObj.startX
      let maxProgressW = this.$refs.progressBarWrap.clientWidth - PROGRESS_BTN_W
      // 设置最大的偏移量
      let offsetWidth = Math.min(maxProgressW, Math.max(0, touchObj.left + deltaX))
      this._offset(offsetWidth)
    },
    changeProgressEnd () {
      this.touch.initTouch = false
      this._triggerPercent()
    },
    _offset (offsetWidth) {
      let progressEl = this.$refs.progress
      let progressBtnEl = this.$refs.progressBtn
      progressEl.style.width = `${offsetWidth}px`
      progressBtnEl.style[TRANSFORM] = `translate3d(${offsetWidth}px,0,0)`
    },
    _triggerPercent () {
      let progressBarEl = this.$refs.progressBarWrap
      let progressEl = this.$refs.progress
      let percent = progressEl.clientWidth / progressBarEl.clientWidth
      this.currentTime = this.currentDuration * percent
      this.audio.currentTime = this.currentTime
      if (!this.playing) this.togglePlay()
    }
  }
}
</script>

<style lang="scss">
@import '@/styles/index.scss';

.audio-wrap{
  width: 100%;
  height: px2rem(80px);
  .audio{
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
    @include bg-color('audioBg');
    .play{
      flex: 0 0 px2rem(55px);
      width: px2rem(55px);
      height: 100%;
      @include img-retina("~@/assets/common/stop@2x.png","~@/assets/common/stop@3x.png",px2rem(24px),px2rem(28px));
      background-repeat: no-repeat;
      background-position: right center;
      &.stop{
        @include img-retina("~@/assets/common/start@2x.png","~@/assets/common/start@3x.png",px2rem(24px),px2rem(28px));
      }
    }
    .progress-bar-wrap{
      flex:1;
      position: relative;
      height: px2rem(2px);
      margin: 0 px2rem(40px) 0 px2rem(17px);
      @include bg-color('audioProgressBar');
      .progress{
        position: absolute;
        left:0;
        top: 0;
        width: 0;
        height: 100%;
        @include bg-color('descColor');
      }
      .progress-btn-wrap{
        position: absolute;
        top: px2rem(-10px);
        left: px2rem(-10px);;
        display: flex;
        justify-content: center;
        align-items: center;
        width: px2rem(20px);
        height: px2rem(20px);
        .progress-btn{
          width: px2rem(4px);
          height: 100%;
          @include bg-color('descColor');
        }
      }
    }
    .time{
      margin-right: px2rem(40px);
      @include font-dpr(13px);
      @include font-color('audioProgressBar');
    }
  }
}

</style>
