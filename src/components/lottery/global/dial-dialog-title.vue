<template>
  <div class="dialog" v-if="show">
    <div class="dialog-header-bg"></div>
    <div class="dialog-header">
      <div class="title">
        <slot name='tille-name' class="tille-name"></slot>
      </div>
      <i class="left-point"></i>
      <i class="right-point"></i>
      <div slot="left" class="close" @click.stop="close"></div>
    </div>
    <slot class="container"  name='container'></slot>
    <div class="dialog-footer">
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
    ...mapMutations('lottery', {
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
  padding-left: px2rem(40px);
  padding-right: px2rem(40px);
  // overflow-y: auto;
  // position: relative;
  .dialog-header{
    width: px2rem(600px);
    height: px2rem(76px);
    @include img-retina("~@/assets/lottery/activityRule/propup2.png",
    "~@/assets/lottery/activityRule/propup2@2x.png", 100%, 100%);
    background-position: top;
    background-repeat: no-repeat;
    background-color:#fff9ec;
    border-top-left-radius: px2rem(16px);
    border-top-right-radius: px2rem(16px);
    position: relative;
    opacity: 1;
    .title{
        // position: absolute;
        margin-top: px2rem(-8px);
        min-width: px2rem(297px);
        max-width: px2rem(360px);
        // width: auto;
        height:px2rem(76px);
        margin-left: auto;
        margin-right: auto;
        @include img-retina("~@/assets/lottery/activityRule/title.png",
        "~@/assets/lottery/activityRule/title@2x.png", 100%, 100%);
        background-repeat: no-repeat;
        display: flex;
        // align-items: center;
        justify-content: center;
        z-index: 10px;
        .tille-name{
            // width: px2rem(144px);
            height: px2rem(36px);
            opacity: 1;
            font-size: px2rem(36px);
            font-family: SourceHanSansCN, SourceHanSansCN-Medium;
            font-weight: 500;
            text-align: center;
            color: #fff4e3 !important;
            line-height: px2rem(76px);
        }
    }
    .left-point{
        position: absolute;
        top: px2rem(21px);
        left: px2rem(98px);
        @include img-retina("~@/assets/lottery/activityRule/point.png",
        "~@/assets/lottery/activityRule/point@2x.png", 100%, 100%);
        background-repeat: no-repeat;
        width: px2rem(44px);
        height: px2rem(44px);
        opacity: 0.5;
        display: inline-block;
        // background: url("~@/assets/dial/activityRule/point.png") no-repeat center  cover;
        // background-image: url("~@/assets/dial/activityRule/point.png"), linear-gradient(#ffc27d, #ffc27d);
        // background-blend-mode: darken;
        // background-size: 100%;;
        z-index: 2;
    }
    .right-point{
        position: absolute;
        top: px2rem(8px); right: px2rem(88px);
        width: px2rem(74px);
        height: px2rem(34px);
        opacity: 0.37;
        // background-image: url("~@/assets/dial/activityRule/point.png"), linear-gradient(#ff97b4, #ff97b4);
        // background-blend-mode: darken;
        // background-size: 100%;
        z-index: 2;
    }
    .close{
        width: px2rem(20px);
        height: px2rem(20px);
        opacity: 0.4;
        @include img-retina("~@/assets/lottery/activityRule/close.png",
        "~@/assets/lottery/activityRule/close@2x.png", 100%, 100%);
        background-position: top;
        background-repeat: no-repeat;
        position: absolute;
        top:px2rem(30px); right:px2rem(30px);
        cursor: pointer;
    }
  }
  .dialog-header-bg{
    width: 100%;
    height: px2rem(192px);
    @include img-retina("~@/assets/lottery/activityRule/propup3.png",
      "~@/assets/lottery/activityRule/propup3@2x.png", 100%, 100%);
    // @include img-retina("~@/assets/wheel/dialog-header.png",
    // "~@/assets/wheel/dialog-header@2x.png", 100%, 100%);
    background-repeat: no-repeat;
    // background-position: top;
    position: absolute;
    top: 0;
    left: 0;
  }
  .container{
    padding-top: px2rem(50px);
    padding-bottom: px2rem(42px);
    width: px2rem(600px);
    padding-left: px2rem(40px);
    padding-right: px2rem(40px);
    background-color: #fff9ec;
  }
  .dialog-footer{
    width: px2rem(600px);
    height: px2rem(140px);
    border-bottom-left-radius: px2rem(16px);
    border-bottom-right-radius: px2rem(16px);
    opacity: 1;
    // position: absolute;
    // bottom: 0;
    @include img-retina("~@/assets/lottery/activityRule/propup2.png",
    "~@/assets/lottery/activityRule/propup2@2x.png", 100%, 100%);
    background-position: bottom;
    background-repeat: no-repeat;
    background-color:#fff9ec;
  }
}
</style>
