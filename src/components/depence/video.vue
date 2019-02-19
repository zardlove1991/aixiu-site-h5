<template lang="html">
  <div class="video-wrap">
    <!--视频组件-->
    <video ref="video" class="video" :src="src"
      :controls="isShowControl"
      :poster="poster"
      :webkit-playsinline="!isForIOS"
      :x5-playsinline="!isForIOS"
      :playsinline="!isForIOS"
      x5-video-player-fullscreen="true"
      x-webkit-airplay="true"
      preload="auto"
      @loadedmetadata="_getVideoTime"
    >
      <source :src="src" type="video/mp4">
      该浏览器不支持video属性
    </video>
    <!--视频遮罩层-->
    <div class="thumb-wrap" v-show="!isShowControl">
      <div class="play-btn" @click.stop='playVideo'></div>
    </div>
  </div>
</template>

<script>
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
  methods: {
    playVideo () {
      let myVideo = this.$refs.video
      myVideo.play()
      this.isShowControl = true
    },
    _getVideoTime (e) {
      // console.log('video触发的metaload事件', e.target.duration)
      this.$emit('videoinfo', {
        duration: e.target.duration
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/index.scss';

.video-wrap{
  position: relative;
  width: 100%;
  height: px2rem(360px);
  .video{
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  .thumb-wrap{
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top:0;
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
