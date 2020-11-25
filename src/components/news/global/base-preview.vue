<template>
  <div class="base-preview-wrap" v-if="show">
    <div class="img-close" @click.stop="close()"><i class="close-icon"></i></div>
    <mt-swipe
      :auto="0"
      :defaultIndex="currentNum"
      @change="handleChange"
      :showIndicators="false">
      <mt-swipe-item v-for="(item, index) in previewList" :key="index">
        <img class="show-img" :src="item" />
      </mt-swipe-item>
    </mt-swipe>
    <div class="number-wrap" v-show="totalNum > 1">
      <span class="current">{{currentNum + 1}}</span>
      <span class="total line">/</span>
      <span class="total">{{totalNum}}</span>
    </div>
  </div>
</template>

<script>
import { Swipe, SwipeItem } from 'mint-ui'

export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    currentImg: {
      type: Number,
      default: 0
    },
    previewList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  components: {
    Swipe, SwipeItem
  },
  data () {
    return {
      totalNum: 1,
      currentNum: 0
    }
  },
  watch: {
    show: {
      handler (val) {
        if (val) {
          this.initData()
        } else {
          this.totalNum = 1
          this.currentNum = 0
        }
      }
    }
  },
  methods: {
    initData () {
      let previewList = this.previewList
      let len = previewList.length
      // let num = 0
      // for (let i = 0; i < len; i++) {
      //   let item = previewList[i]
      //   if (item === currentImg) {
      //     num = i
      //     break
      //   }
      // }
      this.totalNum = len
      this.currentNum = this.currentImg
    },
    close () {
      this.$emit('update:show', false)
    },
    handleChange (index) {
      this.currentNum = index
    }
  }
}
</script>

<style lang="scss">
  @import "@/styles/index.scss";
  .base-preview-wrap {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    background-color: #000000;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 20;
    .img-close {
      position: absolute;
      left: px2rem(42px);
      top: px2rem(56px);
      width: px2rem(32px);
      height: px2rem(32px);
      padding: px2rem(20px);
      z-index: 21;
      .close-icon {
        display: inline-block;
        width: px2rem(32px);
        height: px2rem(32px);
        background-size: px2rem(32px) px2rem(32px);
        background-image: url('~@/assets/news/close-icon.png');
      }
    }
    .number-wrap {
      position: absolute;
      z-index: 21;
      left: px2rem(70px);
      bottom: px2rem(75px);
      height: px2rem(60px);
      line-height: px2rem(60px);
      padding: 0 px2rem(30px);
      background-color: rgba(255, 255, 255, 0.15);
      border-radius: px2rem(30px);
      font-size: 0;
      .current {
        color: #FFFFFF;
        @include font-dpr(18px);
      }
      .total {
        color: #FFFFFF;
        opacity: 0.8;
        @include font-dpr(13px);
      }
      .line {
        display: inline-block;
        margin: 0 px2rem(10px);
      }
    }
    .mint-swipe {
      width: 100%;
      .show-img {
        width: 100%;
        object-fit: contain;
      }
    }
  }
</style>
