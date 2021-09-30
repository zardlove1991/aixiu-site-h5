<template>
 <div class="model" v-if="show">
    <div class="model-wrap">
        <div class="model-header">
            <div slot="left" class="close-wrap" @click.stop="close()">
              <div class="close"></div>
            </div>
        </div>
        <div class="left-point"></div>
        <div class="right-point"></div>
        <div class="model-bg"></div>
        <div class="header-bg"></div>
        <slot class="container"  name='container'></slot>
        <div class="model-footer"></div>
    </div>
</div>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  name: '',
  components: {},
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {}
  },
  computed: {},
  watch: {
    show (newState) {
      // 更改当前是否显示遮罩的状态
      this.setIsModelShow(newState)
    }
  },
  created () {},
  mounted () {},
  methods: {
    close () {
      this.$emit('close')
    },
    ...mapMutations('lottery', {
      setIsModelShow: 'SET_IS_MODEL_SHOW'
    })
  }
}
</script>

<style scoped lang="scss">
@import "@/styles/index.scss";
.model {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  z-index: 99;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-left: px2rem(40px);
  padding-right: px2rem(40px);
  overflow-y: hidden;
  .model-wrap{
    width: px2rem(600px);
    height: px2rem(1002px);
    opacity: 1;
    background: linear-gradient(181deg,#ff8f68 0%, #ff1a4a 80%, #ff093f 100%);
    border-radius: px2rem(16px);
    position: relative;
    .left-point{
        width: px2rem(44px);
        height: px2rem(44px);
        opacity: 1;
        // background-color: #ffeeab;
         @include img-retina("~@/assets/lottery/activityRule/point.png",
        "~@/assets/lottery/activityRule/point@2x.png",'~@/assets/lottery/activityRule/point@3x.png' 100%, 100%);
        background-repeat: no-repeat;
        position: absolute;
        top:px2rem(28px);
        left: px2rem(98px);
        // margin-top: px2rem(28px);
        // margin-left: px2rem(98px);
        color: #ffeeab;
    }
    .right-point{
        width: px2rem(74px);
        height: px2rem(34px);
        @include img-retina("~@/assets/lottery/activityRule/point.png",
        "~@/assets/lottery/activityRule/point@2x.png",'~@/assets/lottery/activityRule/point@3x.png' 100%, 100%);
        background-repeat: no-repeat;
        position: absolute;
        top:px2rem(8px);right: px2rem(120px);
        // opacity: 0.8;
        // background: #ffb1ab;
        // border-radius: 50%;
        // filter: blur(50px);
    }
}
  .model-header{
    width: px2rem(600px);
    height: px2rem(115px);
    background-color:linear-gradient(181deg,#ff8f68 0%, #ff1a4a 80%, #ff093f 100%);
    position: relative;
    opacity: 1;
    .close-wrap {
      float: right;
      width: px2rem(50px);
      height: px2rem(115px);
      position: relative;
      cursor: pointer;
      .close{
          width: px2rem(20px);
          height: px2rem(20px);
          // opacity: 0.4;
          @include img-retina("~@/assets/lottery/close_1.png",
          "~@/assets/lottery/close_1@2x.png", 100%, 100%);
          background-position: top;
          background-repeat: no-repeat;
          position: absolute;
          top:px2rem(30px);
          // right:px2rem(30px);
          cursor: pointer;
          &::after{
              color: #fff;
          }
          z-index: 10;
      }
    }
    // .left-point{
    //     width: px2rem(44px);
    //     height: px2rem(44px);
    //     opacity: 1;
    //     // background-color: #ffeeab;
    //      @include img-retina("~@/assets/lottery/activityRule/point.png",
    //     "~@/assets/lottery/activityRule/point@2x.png",'~@/assets/lottery/activityRule/point@3x.png' 100%, 100%);
    //     background-repeat: no-repeat;
    //     // position: absolute;
    //     // top:px2rem(28px);
    //     // left: px2rem(98px);
    //     // margin-top: px2rem(28px);
    //     // margin-left: px2rem(98px);
    //     color: #ffeeab;
    // }
    // .right-point{
    //     width: px2rem(74px);
    //     height: px2rem(34px);
    //     @include img-retina("~@/assets/lottery/activityRule/point.png",
    //     "~@/assets/lottery/activityRule/point@2x.png",'~@/assets/lottery/activityRule/point@3x.png' 100%, 100%);
    //     background-repeat: no-repeat;
    //     position: absolute;
    //     top:px2rem(8px);right: px2rem(120px);
    //     // opacity: 0.8;
    //     // background: #ffb1ab;
    //     // border-radius: 50%;
    //     // filter: blur(50px);
    // }
  }
  .model-bg{
    width: px2rem(426px);
    height: px2rem(225px);
    opacity: 1;
    position: absolute;
    left: px2rem(84px);top:-15%;
     @include img-retina("~@/assets/lottery/modelImg/model-bg.png",
    "~@/assets/lottery/modelImg/model-bg@2x.png", 100%, 100%);
    background-repeat: no-repeat;
    z-index: 10;
  }
  .header-bg{
    width: px2rem(600px);
    height: px2rem(202px);
    opacity: 1;
     @include img-retina("~@/assets/lottery/modelImg/model-header 4.png",
    "~@/assets/lottery/modelImg/model-header 4@2x.png", 100%, 100%);
    background-repeat: no-repeat;
    background-position-y: top;
    position: absolute; left:0;top:-11.5%;
    z-index: 5;
  }
  .container{
    width: px2rem(600px);
    background-color: initial;
  }
  .model-footer{
    width: px2rem(600px);
    height: px2rem(240px);
    position: absolute;
    right: -6%;
    bottom:-4%;
    @include img-retina("~@/assets/lottery/modelImg/model-footer 2.png",
    "~@/assets/lottery/modelImg/model-footer 2@2x.png", 100%, 100%);
    background-repeat: no-repeat;
    background-size: cover;
  }
}
</style>
