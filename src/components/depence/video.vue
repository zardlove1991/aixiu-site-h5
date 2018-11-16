<template lang="html">
  <div class="video-wrap">
    <!--视频组件-->
    <video ref="video" class="video" :src="src"
      x5-video-player-type="h5" :controls="isShowControl"
      webkit-playsinline="true" playsinline="true"
    >该浏览器不支持video属性</video>
    <!--视频遮罩层-->
    <div class="thumb-wrap" v-show="!isShowControl">
      <div class="play-btn" @click.stop='playVideo'></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'myVideo',
  props: {
    src: String
  },
  data () {
    return {
      isShowControl: false
    }
  },
  methods: {
    playVideo () {
      let myVideo = this.$refs.video
      myVideo.play()
      this.isShowControl = true
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
      width: px2rem(70px);
      height: px2rem(70px);
      @include img-retina('~@/assets/common/video@2x.png', '~@/assets/common/video@3x.png', 100%, 100%);
      background-repeat: no-repeat;
      background-position: center;
    }
  }
}
</style>
