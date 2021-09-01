<template>
  <div class="dialog" v-if="show">
      <div class="dialog-wrap">
        <div class="dialog-header">
            <div class="right-top-wrap"></div>
            <div class="left-top-wrap"></div>
            <div class="left-point"></div>
            <div class="right-point"></div>
            <slot name="title"></slot>
            <div  class="close" @click.stop="onClose"></div>
        </div>
        <div class="dialog-pre">
            <slot name="content"> </slot>
        </div>
        <div class="divider">
            <div class="line"></div>
        </div>
        <div class="dialog-next">
            <slot name="content-next"> </slot>
              <div class="left-bottom-wrap"></div>
            <div class="center-bottom-wrap"></div>
        </div>
      </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  name: '',
  components: {},
  props: {
    show: {type: Boolean, require: true}
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
    ...mapMutations('dial', {
      setIsModelShow: 'SET_IS_MODEL_SHOW'
    })
  }
}
</script>

<style scoped lang="scss">
@import "@/styles/index.scss";
.dialog {
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
  .dialog-wrap{
    width: px2rem(600px);
    height: px2rem(802px);
    opacity: 1;
    // background-color: #fff9ec;
    border-radius: px2rem(8px);
    position: relative;
    .left-top-wrap{
        width: px2rem(321px);
        height: px2rem(28px);
        opacity: 0.8;
        background: #ffc27d;
        border-radius: 50%;
        filter: blur(px2rem(50px));
        position: absolute;
        left: px2rem(30px);
        z-index: 1;
    }
    .right-top-wrap{
        width: px2rem(320px);
        height: px2rem(42px);
        opacity: 0.8;
        background: #ff97ab;
        border-radius: 50%;
        filter: blur(px2rem(50px));
        float: right;
        z-index: 1;
    }
    .left-point{
        position: absolute;
        top: px2rem(21px);
        left: px2rem(98px);
        @include img-retina("~@/assets/dial/recordDraw/point_1.png",
        "~@/assets/dial/recordDraw/point_1@2x.png", 100%, 100%);
        // background-color: #ffc27d;
        background-repeat: no-repeat;
        width: px2rem(44px);
        height: px2rem(44px);
        opacity: 0.5;
        z-index: 2;
    }
    .right-point{
        position: absolute;
        top: px2rem(8px); right: px2rem(88px);
        width: px2rem(74px);
        height: px2rem(34px);
        @include img-retina("~@/assets/dial/recordDraw/point_1.png",
        "~@/assets/dial/recordDraw/point_1@2x.png", 100%, 100%);
        background-repeat: no-repeat;
        opacity: 0.37;
        z-index: 2;
    }
    // 弹框头部
    .dialog-header{
        width: 100%;
        height: px2rem(68px);
        position: absolute;
        top: 0;
        z-index: 10;
        background-color: #fff9ec;
        border-top-right-radius: px2rem(8px);
        border-top-left-radius: px2rem(8px);
        .close{
            width: px2rem(20px);
            height: px2rem(20px);
            // opacity: 0.4;
            @include img-retina("~@/assets/dial/activityRule/close.png",
            "~@/assets/dial/activityRule/close@2x.png", 100%, 100%);
            background-position: top;
            background-repeat: no-repeat;
            position: absolute;
            top:px2rem(30px); right:px2rem(30px);
            cursor: pointer;
        }
        // margin-bottom: px2rem(50px);
    }
  }
  .dialog-pre{
      width: 100%;
      height: px2rem(460px);
      background-color: #fff9ec;
      position: absolute;
      padding-top:px2rem(50px);
      top:px2rem(68px)
  }
  .divider{
    width: px2rem(600px);
    height: px2rem(40px);
    opacity: 1;
    @include img-retina("~@/assets/dial/prizeRecord/split.png",
    "~@/assets/dial/prizeRecord/split@2x.png", 100%, 100%);
    background-repeat: no-repeat;
    position: absolute;
    top: px2rem(528px);
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
    .line{
        width: px2rem(500px);
        height: px2rem(1px);
        opacity: 0.2;
        border-bottom: px2rem(1px) dashed #4f0f0f;
    }
    // background: #fff9ec;
  }
  .dialog-next{
    width: px2rem(600px);
    height: px2rem(234px);
    background-color: #fff9ec;
    position: absolute;
    bottom:0;
    border-bottom-right-radius: px2rem(8px);
    border-bottom-left-radius: px2rem(8px);
  }
    .left-bottom-wrap{
        position: absolute;
        left: 0;bottom: 0;
        width: px2rem(360px);
        height: px2rem(20px);
        opacity: 0.8;
        background: #ff97b4;
        border-radius: 50%;
        filter: blur(px2rem(40px));
        z-index: 1;
    }
    .center-bottom-wrap{
        position: absolute;
        left: px2rem(180px);bottom: 0;
        width: px2rem(357px);
        height: px2rem(20px);
        opacity: 0.9;
        background: #ffc27d;
        border-radius: 50%;
        filter: blur(px2rem(40px));
        z-index: 1;
    }
}
</style>
