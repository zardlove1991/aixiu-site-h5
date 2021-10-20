<template>
<div class='undraw-qualification-dialog' v-if="show">
    <div class="undraw-qualification">
        <!-- <div class="undraw-qualification-header-bg"></div> -->
        <!-- <div class="undraw-qualification-header">
            <div class="undraw-qualification-header-right" @click.stop="onClose">
            <i class="i-close"></i>
            </div>
        </div> -->
        <!-- <div class="container"> -->
            <div class="undraw-qualification-img"></div>
            <div class="undraw-qualification-title">很抱歉</div>
            <div class="undraw-qualification-tip">您不符合本次抽奖活动参与条件</div>
        <!-- </div> -->
        <!-- <div class="undraw-qualification-footer"></div> -->
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
    show: { type: Boolean, require: true }
  },
  data () {
    return {

    }
  },
  computed: {

  },
  watch: {
  },
  created () {
  },
  mounted () {

  },
  methods: {
    onClose () {
      this.$emit('close', false)
    },
    ...mapMutations('lottery', {
      setIsModelShow: 'SET_IS_MODEL_SHOW'
    })
  }
}
</script>

<style scoped lang="scss">
@import "@/styles/index.scss";
.undraw-qualification-dialog{
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
  .undraw-qualification{
    width: px2rem(600px);
    height: px2rem(440px);
    background: linear-gradient(360deg,#ffede8 0%, #ffffff 100%);
    border-radius: px2rem(16px);
    position: relative;
    box-sizing: border-box;
    padding-top: px2rem(70px);
    .undraw-qualification-img{
        width: px2rem(400px);
        height: px2rem(156px);
        margin-left: auto;
        margin-right: auto;
        margin-bottom: px2rem(40px);
        @include img-retina("~@/assets/lottery/undraw-qualification.png",
        "~@/assets/lottery/undraw-qualification@2x.png", 100%, 100%);
        background-repeat: no-repeat;
    }
    .undraw-qualification-title{
        width: px2rem(108px);
        height: px2rem(36px);
        font-size: px2rem(36px);
        font-family: SourceHanSansCN, SourceHanSansCN-Medium;
        font-weight: 500;
        text-align: center;
        color: #333333;
        margin-left: auto;
        margin-right: auto;
        margin-bottom: px2rem(30px);
        line-height: px2rem(54px);
    }
    .undraw-qualification-tip{
        width: px2rem(392px);
        height: px2rem(28px);
        font-size: px2rem(28px);
        font-family: SourceHanSansCN, SourceHanSansCN-Regular;
        font-weight: 400;
        text-align: center;
        color: #666666;
        margin-left: auto;
        margin-right: auto;
        line-height: px2rem(42px);
    }
  }
}
</style>
