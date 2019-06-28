<template lang="html">
  <div class="audio-wrap">
    <!--自定义样式 方形播放器 -->
    <div class="audio" v-if="showType === 'default'">
      <template v-if="!audioInit">
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
      <div class="ios-audio-loading" v-if="audioInit">
        <mt-spinner type="fading-circle" :size="15" color="#999"></mt-spinner>
        <span class="tip">加载中...</span>
      </div>
    </div>
    <!--自定义样式 波形播放器-->
    <div class="wave-audio" ref="waveAudio"
      v-else-if="showType === 'wave'"
      :style="dynamicStyle">
      <template v-if="!audioInit">
        <!--播放按钮-->
        <div class="wave-play-btn" @click.stop="togglePlay">
          <i class="examfont wave-play-icon" v-if="!playing">&#xe715;</i>
          <i class="examfont wave-stop-icon" v-else>&#xe716;</i>
        </div>
        <!--波形滚动-->
        <div class="wave-animation-wrap">
          <div class="wave-animation-blocks"
            v-for="(myStyle, index) in waveBlocksSytles"
            :class="{ 'start-move': playing }"
            :key="index"
            :style="myStyle">
          </div>
        </div>
        <!--显示时间-->
        <div class="wave-time" v-if="duration">{{duration + '"'}}</div>
      </template>
      <!--加载提示-->
      <div class="ios-audio-loading" v-if="audioInit">
        <mt-spinner type="fading-circle" :size="15" color="#fff"></mt-spinner>
        <span class="tip">加载中...</span>
      </div>
    </div>
    <!--气泡形播放器-->
    <div class="bubble-player-wrap" v-else-if="showType === 'bubble'">
      <div class="audio-horn-bg"></div>
      <!--主体展示区域-->
      <div class="audio-content" ref="audioContent"
        :style="dynamicStyle"
        :class="{'play': playing }"
        @click.stop="togglePlay">
        <i class="player-wave"></i>
        <span class="player-duration" v-if="duration || duration === 0">{{duration + '"'}}</span>
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
      waveBlocksSytles: [],
      currentDuration: null,
      playing: false,
      currentTime: 0,
      audioInit: false
    }
  },
  props: {
    src: String,
    showType: {
      type: String,
      default: 'default'
    },
    splitSign: { // 时间的分割符号
      type: String,
      default: ':'
    },
    limitInfo: { // 限制的信息
      type: Object,
      default: () => ({
        isLimit: true,
        limitTime: 60,
        showSecond: false
      })
    }
  },
  computed: {
    playClass () {
      return this.playing ? 'stop' : ''
    },
    dynamicStyle () {
      let showType = this.showType
      let maxW = null // 限制的最大宽度
      if (showType === 'wave') maxW = 225
      else if (showType === 'bubble') maxW = 175
      // 计算宽度
      let duration = this.currentDuration
      let { limitTime } = this.limitInfo
      let w = null
      if (duration && maxW) {
        w = duration > limitTime ? maxW : parseInt((duration / limitTime) * maxW)
      }
      // 给个最小宽度
      if (w && w < 100) w = 100
      let defaultW = w ? `${w}px` : (maxW || '100%')
      console.log('当前设置动态宽度', duration, defaultW, this.limitInfo)
      return { width: defaultW }
    },
    duration () {
      let sign = this.splitSign
      let currentTime = this.currentTime
      let duration = this.currentDuration
      let { isLimit, limitTime, showSecond } = this.limitInfo
      let reuslt = null
      if (duration) {
        let lastCountTime = duration - currentTime
        // 判断是否展示秒
        if (showSecond) {
          reuslt = Math.ceil(lastCountTime || 0)
        } else {
          // 兼容IOS录音的时长
          if (isLimit) {
            let curCountTime = (lastCountTime > (limitTime - 1) ? limitTime : lastCountTime) || 0
            reuslt = formatTimeBySec(curCountTime, false, sign)
          } else {
            reuslt = formatTimeBySec(lastCountTime, false, sign)
          }
        }
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
      let showType = this.showType
      // 调用进度条 目前默认播放器需要设置滑动块偏移
      if (newVal && showType === 'default') {
        let progressBarEl = this.$refs.progressBarWrap
        let maxProgressW = progressBarEl.clientWidth - PROGRESS_BTN_W
        let offsetWidth = maxProgressW * newVal
        this._offset(offsetWidth)
      }
    },
    audioInit (state) {
      // 如果初始化完成后
      if (!state) {
        // 计算波形样式的动态点数
        if (this.showType === 'wave') this.addWaveBlocks()
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
      this.audioInit = true
      this.audio = this.$refs.audio
      // 赋值src
      this.audio.src = this.src.replace('https', 'http')
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
            this.audio.play()
          })
        }
      })
    },
    addWaveBlocks () {
      this.$nextTick(() => {
        let maxH = Math.ceil(35 / 2)
        let auidoW = this.$refs['waveAudio']
        let offsetW = Math.round(auidoW.offsetWidth - 90)
        // 这边根据block的宽度计算个数
        let result = []
        let blocks = Math.floor(offsetW / (3 + 6))
        for (let i = 0; i < blocks; i++) {
          let randomH = Math.ceil(Math.random() * maxH) + 1
          let h = randomH > maxH ? maxH : randomH
          let direction = (i % 2 === 0) ? 'alternate' : 'normal'
          result.push({
            height: `${h}px`,
            animation: `wave 0.7s infinite ease ${direction}`,
            animationPlayState: 'paused',
            animationDelay: `0.${5 * i}s`
          })
        }
        // 赋值样式数据
        this.waveBlocksSytles = result
      })
    },
    audioStop () {
      // 修改播放重置状态
      this.playing = false
      this.$nextTick(() => {
        this.playing = true
        setTimeout(() => {
          this.playing = false
        }, 100)
      })
    },
    error () {
      this.$toast({ message: '音频加载失败', type: 'error' })
    },
    togglePlay () {
      this.playing = !this.playing
    },
    timeUpdate (e) {
      // 针对IOS播放延迟问题做处理 关闭初始化状态
      let time = this.audio.currentTime
      if (this.audioInit && time) {
        this.audio.pause()
        this._getAudioInfo() // 调用信息
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
      // 如果是IOS内部触发meteload事件直接返回 等播放后获得信息后手动触发
      if (e && isIOSsystem()) return
      let myAudio = this.audio
      // 赋值总时长
      this.currentDuration = myAudio.duration
      // 设置是否初始化
      this.audioInit = false
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
  .audio{
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    height: px2rem(80px);
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
  .wave-audio{
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: px2rem(450px);
    min-width: px2rem(300px);
    height: px2rem(70px);
    border-radius: px2rem(35px);
    padding: 0 px2rem(20px) 0 px2rem(7px);
    box-sizing: border-box;
    @include bg-color('audioBgOne');
    .wave-play-btn{
      display: flex;
      justify-content: center;
      align-items: center;
      width: px2rem(58px);
      height: px2rem(58px);
      border-radius: 50%;
      @include bg-color('bgColor');
      .wave-play-icon{
        position: relative;
        left: px2rem(2px);
        line-height: 1;
        @include font-dpr(12px);
        @include font-color('themeColor');
      }
      .wave-stop-icon{
        @extend .wave-play-icon;
        left: 0;
      }
    }
    .wave-time{
      @include font-dpr(12px);
      @include font-color('bgColor');
    }
    .wave-animation-wrap{
      display: flex;
      align-items: center;
      margin: 0 px2rem(20px) 0 px2rem(30px);
      .wave-animation-blocks{
        width: px2rem(6px);
        max-height: px2rem(35px);
        border-radius: px2rem(10px);
        margin-right: px2rem(10px);
        transform-origin: center;
        @include bg-color('bgColor');
        &.start-move{
          animation-play-state: running !important;
        }
      }
    }
    .ios-audio-loading{
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      .tip{
        margin-left: px2rem(10px);
        @include font-dpr(13px);
        @include font-color('bgColor');
      }
    }
  }
  .bubble-player-wrap{
    position: relative;
    width:auto;
    height: px2rem(70px);
    padding-left: px2rem(16px);
    .audio-horn-bg{
      position: absolute;
      left: 0;
      bottom: 0;
      width: px2rem(45px);
      height: px2rem(39px);
      background-position: center;
      background-repeat: no-repeat;
      z-index: -1;
      @include img-retina('~@/assets/audio/audio_bubble@2x.png','~@/assets/audio/audio_bubble@3x.png', 100%, 100%);
    }
    .audio-content{
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: px2rem(150px);
      height: 100%;
      padding: 0 px2rem(30px);
      box-sizing: border-box;
      border-radius: px2rem(35px);
      transition: width 0.3s ease;
      z-index: 1;
      @include bg-color('audioBgTwo');
      @include font-color('bgColor');
      @include font-dpr(14px);
      .player-wave{
        width: px2rem(24px);
        height: px2rem(24px);
        background-position: center;
        background-repeat: no-repeat;
        @include img-retina('~@/assets/audio/voice_end@2x.png', '~@/assets/audio/voice_end@3x.png', 100%, 100%);
      }
      &.play{
        .player-wave{
          animation: voiceWave 1.4s linear infinite;
        }
      }
    }
  }
}

@keyframes wave{
  0% { height:px2rem(8px) }
  30% { height: px2rem(35px) }
  50% { height: px2rem(20px) }
  70% { height: px2rem(32px) }
  100% { height: px2rem(4px) }
}

@keyframes voiceWave{
  0%{
    @include img-retina('~@/assets/audio/voice_start@2x.png', '~@/assets/audio/voice_start@3x.png', 100%, 100%);
  }
  50%{
    @include img-retina('~@/assets/audio/voice_middle@2x.png', '~@/assets/audio/voice_middle@3x.png', 100%, 100%);
  }
  100%{
    @include img-retina('~@/assets/audio/voice_end@2x.png', '~@/assets/audio/voice_end@3x.png', 100%, 100%);
  }
}

</style>
