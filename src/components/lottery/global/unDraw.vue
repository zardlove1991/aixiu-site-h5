<template>
    <div class='dialog' v-if="show">
      <div class="unDraw">
        <div class="unDraw-header-bg"></div>
        <div class="unDraw-header">
          <div class="unDraw-header-right" @click.stop="onClose">
            <i class="i-close"></i>
          </div>
        </div>
        <div class="points"></div>
        <div class="img"></div>
        <div class="tips-error">没有抽中哦~</div>
        <div class="tips">好可惜，差点就抽中了</div>
        <van-button  block  native-type="submit" class="btn" @click="onDrawAgain" v-if="count > 0">再抽一次({{count}})</van-button>
        <div class="unDraw-footer"></div>
      </div>
    </div>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  name: '',
  components: {
  },
  props: {
    show: {type: Boolean, require: true},
    data: {
      type: [Object, Number, String],
      required: true
    }
  },
  data () {
    return {

    }
  },
  computed: {
    count: {
      get () {
        return this.data
      },
      set (val) {
        console.log('rule page数据改变')
        this.$emit('update:data', val)
      }
    }
  },
  watch: {
    show (newState) {
      // 更改当前是否显示遮罩的状态
      this.setIsModelShow(newState)
    }
  },
  created () {
  },
  mounted () {

  },
  methods: {
    onClose () {
      this.$emit('close')
    },
    ...mapMutations('lottery', {
      setIsModelShow: 'SET_IS_MODEL_SHOW'
    }),
    onDrawAgain () {
      this.$parent.onDraw()
      this.onClose()
    }
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
  .unDraw{
    width: px2rem(600px);
    height: px2rem(588px);
    background: linear-gradient(181deg,#ff8f68 0%, #ff1a4a 80%, #ff093f 100%);
    border-radius: px2rem(16px);
    position: relative;
    .unDraw-header-bg{
      width: px2rem(600px);
      height: px2rem(202px);
      @include img-retina("~@/assets/lottery/dial-header.png",
      "~@/assets/lottery/dial-header.png", 100%,100%);
      background-repeat: no-repeat;
      border-top-right-radius: px2rem(16px);
      border-top-left-radius: px2rem(16px);
      position: absolute;
      top: 0; left: 0;
    }
    .unDraw-header{
      width: 100%;
      height: px2rem(51px);
      position: absolute;
      top: 0; left: 0;
      z-index: 10;
      .unDraw-header-right{
        float: right;
        width: px2rem(50px);
        height: px2rem(51px);
        padding-right: px2rem(30px);
        padding-top: px2rem(31px);
        border-top-right-radius: px2rem(16px);
        border-top-left-radius: px2rem(16px);
        cursor: pointer;
          .i-close{
            display: inline-block;
            width: px2rem(20px);
            height: px2rem(20px);
            @include img-retina("~@/assets/lottery/close_1.png",
            "~@/assets/lottery/close_1@2x.png", 100%, 100%);
            background-repeat: no-repeat;
          }
      }
    }
    .img{
      width: px2rem(313px);
      height: px2rem(238px);
      opacity: 1;
      @include img-retina("~@/assets/lottery/unDraw/bg_4.png",
      "~@/assets/lottery/unDraw/bg_4@2x.png", 100%,100%);
      background-repeat: no-repeat;
      margin-left: px2rem(183px);
      margin-top: px2rem(31px);
    }
    .tips-error{
      width: px2rem(201px);
      height: px2rem(36px);
      font-size: px2rem(36px);
      font-family: SourceHanSansCN, SourceHanSansCN-Medium;
      font-weight: 500;
      text-align: left;
      color: #fff4e3;
      line-height: px2rem(54px);
      margin-top: px2rem(8px);
      margin-left: auto;
      margin-right: auto;
    }
    .tips{
      width: px2rem(280px);
      height: px2rem(28px);
      font-size: px2rem(28px);
      font-family: SourceHanSansCN, SourceHanSansCN-Regular;
      font-weight: 400;
      text-align: center;
      color: #fff4e3;
      line-height: px2rem(42px);
      margin-left: auto;
      margin-right: auto;
      margin-top: px2rem(30px);
      margin-bottom: px2rem(60px);
    }
    .btn{
      width: px2rem(300px);
      height: px2rem(80px);
      opacity: 1;
      border-radius: px2rem(16px);
      background: linear-gradient(0deg,#ffe2b7 1%, #fff5e2);
      box-shadow: 0 px2rem(8px) 0px 0px #e5b56b;
      margin: auto;
      position: absolute;
      bottom: px2rem(69px); left: px2rem(150px);
      z-index: 10;
      &.btn-notAllow {
        background: linear-gradient(0deg,#fff 1%, #b7b09b);
        box-shadow: 0 px2rem(8px) 0px 0px #b7b09b;
      }
    }
    .points{
      position: absolute;
      top: px2rem(237px);
      left: px2rem(6px);
      width: px2rem(54px);
      height: px2rem(114px);
      @include img-retina("~@/assets/lottery/recordDraw/point_1.png",
      "~@/assets/lottery/recordDraw/point_1@2x.png", 100%,100%);
      background-repeat: no-repeat;
    }
    .unDraw-footer{
      width: px2rem(600px);
      height: px2rem(240px);
      border-bottom-left-radius: px2rem(16px);
      border-bottom-right-radius: px2rem(16px);
      @include img-retina("~@/assets/lottery/modelImg/model-footer.png","~@/assets/lottery/modelImg/model-footer.png", 100%, 100%);
      background-repeat: no-repeat;
      position: absolute;
      bottom: 0;
      left: 0;
    }
  }
}
</style>
