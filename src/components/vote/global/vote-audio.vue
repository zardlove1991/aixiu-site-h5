<template>
  <div :class="['commvote-base-audio-wrap', darkMark === '2' ? 'light' : '']">
    <div class="audio-light-bg" v-if="darkMark === '2'"></div>
    <p class="audio-name">{{data.filename}}</p>
    <div class="audio-control-wrap">
      <span class="run-stime">{{duration}}</span>
      <div class="process-wrap">
        <div class="process">
          <div class="audio-bar" v-show="duration !== '00:00'"></div>
          <div class="audio-bar-spot" v-show="duration !== '00:00'"></div>
        </div>
        <div class="process-opacity"></div>
      </div>
      <span class="run-etime">{{totalDuration}}</span>
      <div :class="['audio-play-icon', darkMark === '2' ? 'light' : '', isPlay ? 'play': '']" v-if="!isPreview" @click.stop="setPlay">
        <div class="audio-icon"></div>
      </div>
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
    darkMark: String,
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
      this.initAudioInfo()
    },
    isPlay: function (state) {
      let audio = this.audio
      // 通过状态判定播放
      state ? audio.play() : audio.pause()
    },
    percent: function (val) {
      // console.log('当前播放的百分比', val)
      let audioBar = document.getElementsByClassName('audio-bar')
      let audioBarSpot = document.getElementsByClassName('audio-bar-spot')
      if (audioBar && audioBarSpot && audioBar.length && audioBarSpot.length) {
        audioBar[0].style.width = val + '%'
        audioBarSpot[0].style.left = val + '%'
      }// 关闭播放
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
        // this.audioWrapEl = this.$refs['audio-wrap']
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
      if (this.data.duration !== 0) {
        this.percent = Math.round(time / this.data.duration * 100)
      }
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
    border-radius: px2rem(16px);
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
        margin: 0 px2rem(20px);
        .process, .process-opacity {
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          border-radius: px2rem(4px);
          .audio-bar {
            position: absolute;
            top: 0;
            left: 0;
            width: px2rem(16px);
            height: 2px;
            border-radius: px2rem(4px);
            opacity: 1 !important;
            @include bg-color('btnColor');
          }
          .audio-bar-spot {
            position: absolute;
            top: 50%;
            left: 0;
            transform: translateY(-50%);
            width: px2rem(16px);
            height: px2rem(16px);
            border-radius: 50%;
            @include bg-color('btnColor');
          }
        }
        .process-opacity {
          @include bg-color('descColor');
          opacity: 0.2;
        }
      }
      .audio-play-icon {
        margin-left: px2rem(30px);
      }
    }
    .file-delete-icon {
      display: inline-block;
      position: absolute;
      right: px2rem(-20px);
      top: px2rem(-20px);
      width: px2rem(40px);
      height: px2rem(40px);
      @include img-retina('~@/assets/vote/file-delete@2x.png','~@/assets/vote/file-delete@3x.png', 100%, 100%);
    }
    &.light {
      .audio-light-bg {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        top: 0;
        @include bg-color('btnColor');
        opacity: 0.15;
        border-radius: px2rem(16px);
      }
      .audio-name, .audio-control-wrap .run-stime, .audio-control-wrap .run-etime {
        @include font-color('descColor');
      }
    }
  }
</style>
