<template>
  <div class="submit-success-mask" v-if="show">
    <div class="luck-submit-success">
      <div class="luck-title">
        <span v-for="(item, index) in luckDrawTips" :key="index">{{item}}<br /></span>
      </div>
      <div :class="['luck-base-icon', isLuckDraw ? 'luck-icon' : 'noluck-icon']"></div>
      <div v-if="isLuckDraw" class="luck-base-btn luck-btn" @click.stop="confirm()"></div>
      <div v-else class="luck-base-btn noluck-btn" @click.stop="cancel()"></div>
      <div class="close-btn" @click.stop="cancel()"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    isLuckDraw: {
      type: Boolean,
      default: false
    },
    luckDrawTips: {
      type: Array,
      default: () => {
        return ['恭喜你，获得抽奖机会']
      }
    },
    doneText: {
      type: String,
      default: '知道了'
    }
  },
  methods: {
    confirm () {
      this.$emit('confirm')
    },
    cancel () {
      this.$emit('cancel')
    }
  }
}
</script>

<style lang="scss">
  @import "@/styles/index.scss";
  .submit-success-mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
    .luck-submit-success {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      box-sizing: border-box;
      .luck-title {
        color: #FFF0C3;
        font-size: px2rem(40px);
      }
      .luck-base-icon {
        display: inline-block;
        width: px2rem(695px);
        height: px2rem(612px);
        background-size: px2rem(695px) px2rem(612px);
        &.luck-icon {
          @include img-retina("~@/assets/common/luck-draw@2x.png","~@/assets/common/luck-draw@3x.png", 100%, 100%);
        }
        &.noluck-icon {
          @include img-retina("~@/assets/common/noluck-draw@2x.png","~@/assets/common/noluck-draw@3x.png", 100%, 100%);
        }
      }
      .luck-base-btn {
        margin-top: px2rem(20px);
        display: inline-block;
        width: px2rem(318px);
        height: px2rem(120px);
        background-size: px2rem(318px) px2rem(120px);
        color: #FFFFFF;
        line-height: px2rem(100px);
        font-size: px2rem(40px);
        &.luck-btn {
          @include img-retina("~@/assets/common/luck-draw-btn@2x.png","~@/assets/common/luck-draw-btn@3x.png", 100%, 100%);
        }
        &.noluck-btn {
          @include img-retina("~@/assets/common/noluck-draw-btn@2x.png","~@/assets/common/noluck-draw-btn@3x.png", 100%, 100%);
        }
      }
      .close-btn {
        margin-top: px2rem(20px);
        display: inline-block;
        width: px2rem(92px);
        height: px2rem(92px);
        background-size: px2rem(92px);
        @include img-retina("~@/assets/common/luck-draw-close@2x.png","~@/assets/common/luck-draw-close@3x.png", 100%, 100%);
      }
    }
  }
</style>
