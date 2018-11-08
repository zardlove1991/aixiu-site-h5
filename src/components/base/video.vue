<template lang="html">
  <div class="video-wrap">
    <video :id="`myVideo_${src}`" class="video" :src="src"
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
      let videoID = `myVideo_${this.src}`
      let myVideo = document.getElementById(videoID)
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
  height: px2rem(340px);
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
      width: px2rem(90px);
      height: px2rem(90px);
      @include img-retina('~@/assets/party/video2x.png', '~@/assets/party/video3x.png', 100%, 100%);
      background-repeat: no-repeat;
      background-position: center;
    }
  }
}
</style>
