<template lang="html">
  <div class="audio-wrap">
    <!--自定义样式-->
    <div class="audio">
      <template v-if="!iosAudioInit">
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
      </template>
      <!--加载提示-->
      <div class="ios-audio-loading" v-if="iosAudioInit">
        <mt-spinner type="fading-circle" :size="15" color="#999"></mt-spinner>
        <span class="tip">加载中...</span>
      </div>
    </div>
    <!--audio组件-->
    <audio ref="audio"
      @loadedmetadata="_getAudioInfo" @ended="audioStop"
      @error="error" @timeupdate="timeUpdate" preload='auto'
    >该浏览器不支持audio属性</audio>
  </div>
</template>

<script>
import { formatTimeBySec, prefixStyle } from '@/utils/utils'
import { isIOSsystem } from '@/utils/app'

const TRANSFORM = prefixStyle('transform')
const PROGRESS_BTN_W = 1

export default {
  name: 'myAudio',
  data () {
    return {
      currentDuration: null,
      playing: false,
      currentTime: 0,
      iosAudioInit: false
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
      if (duration) {
        let lastCountTime = duration - currentTime
        // 兼容IOS录音的时长
        let curCountTime = (lastCountTime > 59 ? 60 : lastCountTime) || 0
        reuslt = formatTimeBySec(curCountTime)
      }
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
        audio.play()
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
    // 为IOS中提前加载音频信息
    if (isIOSsystem()) this.initPlay()
  },
  created () {
    this.touch = {}
  },
  methods: {
    initAudioInfo () {
      this.audio = this.$refs.audio
      // 赋值src
      this.audio.src = this.src
      // 监听客户端请求数据
      this.audio.load()
    },
    initPlay () {
      this.$nextTick(() => {
        let WeixinJSBridge = window.WeixinJSBridge
        if (typeof WeixinJSBridge === 'object' && typeof WeixinJSBridge.invoke === 'function') {
          // IOS下在微信不能自动载入音频信息问题
          WeixinJSBridge.invoke('getNetworkType', {}, (res) => {
            console.log('触发了微信内置事件 音频主动载入 ！！！')
            // 设置初始化loading
            this.iosAudioInit = true
            this.audio.play()
          })
        }
      })
    },
    audioStop () {
      this.togglePlay()
    },
    error () {
      this.$toast({ message: '音频加载失败', type: 'error' })
    },
    togglePlay () {
      this.playing = !this.playing
    },
    timeUpdate (e) {
      // 针对IOS播放延迟问题做处理 关闭初始化状态
      let time = e.target.currentTime
      if (this.iosAudioInit && time) {
        this.audio.pause()
        this.iosAudioInit = false
        console.log('IOS音频初始化状态完毕 ！！')
        return
      }
      this.currentTime = time
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
    },
    _getAudioInfo (e) {
      let myAudio = this.audio
      // 赋值总时长
      // this.currentDuration = parseInt(Math.round(myAudio.duration.toFixed(2)))
      this.currentDuration = myAudio.duration
      console.log('audio触发的metaload事件', this.currentDuration)
      // 发送当前音频总时长
      this.$emit('audoinfo', {duration: this.currentDuration})
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
    position: relative;
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
      margin: 0 px2rem(40px) 0 px2rem(20px);
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
    .ios-audio-loading{
      position: absolute;
      left:0;
      top:0;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      @include font-dpr(14px);
      @include font-color('descColor');
      .tip{
        margin-left: px2rem(10px);
      }
    }
  }
}

</style>
