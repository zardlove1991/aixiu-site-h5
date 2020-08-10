<template>
  <div class="tips-dialog-wrap"
    ref="tipsDialogWrap"
    v-if="show"
    @touchmove.prevent=""
    >
    <img class="share-img" :src="shareUrl" />
    <div class="close-btn" @click.stop="close()"></div>
  </div>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    shareUrl: {
      type: String,
      default: ''
    }
  },
  methods: {
    close () {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss">
  @import "@/styles/index.scss";
   .tips-dialog-wrap {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100vh;
    padding: 20px 0;
    background: rgba(0,0,0,0.5);
    z-index: 99;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .share-img {
      width: px2rem(600px);
      height: auto;
    }
    .close-btn {
      margin-top: px2rem(60px);
      display: inline-block;
      width: px2rem(80px);
      height: px2rem(80px);
      background-size: px2rem(80px);
      @include img-retina("~@/assets/common/luck-draw-close@2x.png","~@/assets/common/luck-draw-close@3x.png", 100%, 100%);
    }
  }
</style>
