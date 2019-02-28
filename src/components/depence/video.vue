<template lang="html">
  <div class="video-wrap">
    <!--视频组件-->
    <video ref="video" class="video"
      :src="src"
      :controls="isShowControl"
      :poster="poster"
      :webkit-playsinline="!isForIOS"
      :x5-playsinline="!isForIOS"
      :playsinline="!isForIOS"
      x5-video-player-fullscreen="true"
      x-webkit-airplay="true"
      preload="auto"
      @play="dealVideoPlayState('play')"
      @pause="dealVideoPlayState('pause')"
      @loadedmetadata="_getVideoTime"
    >
      <source :src="src" type="video/mp4">
      该浏览器不支持video属性
    </video>
    <!--占位视频图片 只针对Android-->
    <img class="video-img" ref="videoImg" v-show="!isShowControl && !isForIOS"/>
    <!--视频遮罩层-->
    <div class="thumb-wrap" v-show="!isShowControl">
      <div class="play-btn" @click.stop='playVideo'></div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { isIOSsystem } from '@/utils/app'

export default {
  name: 'myVideo',
  props: {
    src: String,
    poster: String
  },
  data () {
    return {
      isForIOS: isIOSsystem(),
      isShowControl: false
    }
  },
  computed: {
    ...mapGetters('depence', ['isShowModelThumb', 'curSubjectVideos'])
  },
  mounted () {
    this.video = this.$refs.video
    this.initVideoInfo()
  },
  watch: {
    isShowControl (isShow) {
      // 安卓平台需要控制显示
      if (!this.isForIOS) {
        this.video.style.display = isShow ? 'block' : 'none'
      }
    },
    isShowModelThumb (isShow) {
      let curSubjectVideos = this.curSubjectVideos
      // 针对安卓全局模态框展示了就隐藏当前题目中的原生播放器
      if (!this.isForIOS && curSubjectVideos.length && isShow) {
        curSubjectVideos.forEach(videoThis => {
          videoThis.dealVideoPlayState('pause')
        })
      }
    }
  },
  methods: {
    initVideoInfo () {
      // 如果是安卓平台就用图片占位
      if (!this.isForIOS) {
        this.videoImg = this.$refs.videoImg
        this.videoImg.src = this.poster || require('@/assets/common/empty_indepic_bg@3x.png')
        this.video.style.display = 'none'
      }
      // 发送当前video组件的信息
      this.addSubjectVideoInfo({ video: this })
    },
    playVideo () {
      this.video.play()
      this.isShowControl = true
    },
    dealVideoPlayState (flag) {
      // 只针对安卓平台做播放和暂停操作
      if (this.isForIOS) return
      // 判断是暂停还是开始播放
      if (flag === 'pause') {
        this.isShowControl = false
      } else {
        // 开始播放
      }
    },
    _getVideoTime (e) {
      // console.log('video触发的metaload事件', e.target.duration)
      this.$emit('videoinfo', {
        duration: e.target.duration
      })
    },
    ...mapActions('depence', {
      addSubjectVideoInfo: 'ADD_CURSUBJECT_VIDEOS_INFO'
    })
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/index.scss';

.video-wrap{
  position: relative;
  width: 100%;
  height: px2rem(360px);
  .video, .video-img{
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  .video-img{
    position: absolute;
    top:0;
    left: 0;
  }
  .thumb-wrap{
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top:0;
    left:0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.5);
    .play-btn{
      width: px2rem(80px);
      height: px2rem(80px);
      @include img-retina('~@/assets/common/video@2x.png', '~@/assets/common/video@3x.png', 100%, 100%);
      background-repeat: no-repeat;
      background-position: center;
    }
  }
}
</style>
