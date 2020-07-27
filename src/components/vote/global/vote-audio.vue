<template>
  <div class="commvote-base-audio-wrap" ref="audio-wrap">
    <p class="audio-name">{{data.name}}</p>
    <div class="audio-control-wrap">
      <span class="run-stime">{{duration}}</span>
      <div class="process-wrap">
        <div class="process"></div>
        <div class="bar" v-show="duration !== '00:00'"></div>
      </div>
      <span class="run-etime">{{totalDuration}}</span>
      <div class="audio-play-icon" :class="{ play: isPlay }" @click.stop="setPlay"></div>
    </div>
    <!--音频元素-->
    <audio ref="audio" preload='auto' @timeupdate="timeUpdate">该浏览器不支持audio属性</audio>
    <i class="file-delete-icon" v-if="isShowDelBtn" @click="deleteFile(data)"></i>
  </div>
</template>

<script>
import { formatTimeBySec } from '@/utils/utils'

export default {
  props: {
    data: {
      type: Object,
      default: () => {
        return {}
      }
    },
    isPreview: {
      type: Boolean,
      default: false
    },
    isShowDelBtn: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      isPlay: false,
      percent: 0,
      duration: '00:00',
      totalDuration: '00:00'
    }
  },
  watch: {
    data: function (newData) {
      console.log('xxxxx', newData)
      this.initAudioInfo()
    },
    isPlay: function (state) {
      let audio = this.audio
      // 通过状态判定播放
      state ? audio.play() : audio.pause()
    },
    percent: function (val) {
      console.log('当前播放的百分比', val)
      let processEl = this.audioWrapEl.find('.process')
      let barEl = this.audioWrapEl.find('.bar')
      processEl.animate({ width: val + '%' }, 'normal')
      barEl.animate({ left: val + '%' }, 'normal')
      // 关闭播放
      if (val === 100) this.isPlay = false
    }
  },
  mounted () {
    this.data.url && this.initAudioInfo()
  },
  methods: {
    initAudioInfo () {
      this.$nextTick(() => {
        this.isPlay = false // 重新将状态还原
        this.audio = this.$refs.audio
        // 赋值src
        this.audio.src = this.data.url
        this.totalDuration = formatTimeBySec(this.data.duration)
        // 获得当前音频包裹元素
        this.audioWrapEl = this.$refs['audio-wrap']
        // 监听客户端请求数据
        this.audio.load()
      })
    },
    setPlay (slug) {
      // 如果是预览不允许播放
      if (this.isPreview) return
      // 判读标识进行重置
      if (slug === 'hidden') {
        this.isPlay = false
        this.percent = 0
        this.audio.currentTime = 0
        this.duration = '00:00'
      } else {
        this.isPlay = !this.isPlay
      }
    },
    timeUpdate (e) {
      let time = e.target.currentTime
      this.duration = formatTimeBySec(time)
      this.percent = Math.round(time / this.data.duration * 100)
    },
    deleteFile (item) {
      let audio = this.audio
      if (audio) {
        this.setPlay('hidden')
      }
      this.$emit('deleteFile', item)
    }
  }
}
</script>

<style lang="scss">
  @import "@/styles/index.scss";
  .commvote-base-audio-wrap {
    position: relative;
    width: 100%;
    padding: px2rem(25px) px2rem(30px);
    background-color: rgba(255,255,255,0.1);
    box-sizing: border-box;
    border-radius: px2rem(4px);
    .audio-name {
      @include font-dpr(14px);
      color: rgba(255,255,255,0.7);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: 9rem;
      margin-bottom: 5px;
    }
    .audio-control-wrap {
      display: flex;
      align-items: center;
      .run-stime, .run-etime{
        @include font-dpr(12px);
        color: rgba(255,255,255,0.7);
      }
      .process-wrap {
        position: relative;
        flex: 1;
        height: 2px;
        border-radius: 2px;
        margin: 0 px2rem(20px);
        background-color: rgba(255,255,255,0.5);
        .process {
          width: 0;
          height: 100%;
          border-radius: 2px;
          background-color: #FC7465;
        }
        .bar {
          position: absolute;
          top:50%;
          left: 0;
          transform: translate3d(-50%, -50%, 0);
          width: 0.22rem;
          height: 0.22rem;
          border-radius: 50%;
          background-color: #FC7465;
          box-shadow: 0 0 5px #FC7465;
        }
      }
      .audio-play-icon {
        width: px2rem(56px);
        height: px2rem(56px);
        border-radius: 50%;
        background-color: rgba(255,255,255,0.3);
        background-repeat: no-repeat;
        background-position: center;
        background-size: px2rem(20px);
        background-image: url('http://xzh5.hoge.cn/new-vote/images/audio_bg_3@3x.png');
        margin-left: px2rem(30px);
        &.play {
          animation: audioPlay 1s linear infinite;
        }
      }
    }
    .file-delete-icon {
      display: inline-block;
      position: absolute;
      right: px2rem(-15px);
      top: px2rem(-15px);
      width: px2rem(30px);
      height: px2rem(30px);
      @include img-retina('~@/assets/vote/file-delete@2x.png','~@/assets/vote/file-delete@3x.png', 100%, 100%);
    }
  }
</style>
