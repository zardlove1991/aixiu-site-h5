<template>
  <div :class="['news-article3-wrap', themeName + '-bg']">
    <div class="article3-index">
      <img class="article3-img" v-if="indexData.is_open_link"  :src="indexData.src" object-fit="cover" />
      <img class="article3-img" v-else v-preview="indexData.src" :src="indexData.src" object-fit="cover" />
    </div>
    <div :class="['article3-content', themeName]"
      @click.stop="goPage(indexData)">
      <div class="line"></div>
      <div class="source">{{indexData.source}}<span v-if="showTime"> · </span>{{showTime}}</div>
      <div class="header">{{indexData.title}}</div>
      <div class="desc">{{indexData.describe}}</div>
      <div class="find-all" v-if="indexData.is_open_link === 1" @click="goPage(indexData)">查看更多</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    themeName: {
      type: String,
      default: 'white'
    },
    showTime: String,
    tmpList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      indexData: {}
    }
  },
  created () {
    this.initData()
  },
  methods: {
    initData () {
      console.log('initData article3', this.tmpList)
      let tmpList = this.tmpList
      if (tmpList && tmpList.length > 0) {
        let item = tmpList[0]
        let ratio = item.ratio
        let material = item.material
        if (ratio) {
          ratio = ratio.replace('.', '')
          let arr = ratio.split(':')
          let size = ''
          if (arr.length === 2) {
            size = 'size-' + arr[0] + '-' + arr[1]
          }
          item.size = size
        }
        if (material && material.length) {
          item.src = material[0]
        }
        this.indexData = item
      }
    },
    goPage (item) {
      this.$emit('goPage', item)
    }
  }
}
</script>

<style lang="scss">
  @import "@/styles/index.scss";
  .news-article3-wrap {
    position: relative;
    width: 100%;
    height: 100vh;
    overflow-y: auto;
    // background-color: #ffffff;
    @include bg-linear-color('bgColor');
    .article3-index {
      .article3-img {
        width: 100%;
        height: 75%;
      }
    }
    .article3-content {
      position: absolute;
      left: px2rem(60px);
      right: 0;
      top: 30%;
      bottom: px2rem(60px);
      padding: px2rem(25px) px2rem(57px);
      box-shadow: 0px -2px 12px 5px rgba(0, 0, 0, 0.04);
      border-radius: 16px 0px 0px 16px;
      background-color: #fff;
      .line {
        position: absolute;
        left: px2rem(30px);
        top: px2rem(40px);
        width: px2rem(4px);
        height: px2rem(50px);
        background: #FF6A45;
        border-radius: px2rem(2px);
      }
      .source {
        color: #999;
        @include font-dpr(12px);
      }
      .header {
        margin-top: px2rem(20px);
        margin-bottom: px2rem(30px);
        @include line-overflow(2);
        @include font-dpr(18px);
        color: #333;
        font-weight: bold;
      }
      .desc {
        @include font-dpr(15px);
        @include line-overflow(6);
        word-wrap: break-word;
        word-break: break-all;
        color: #666;
      }
      .find-all {
        margin-top: px2rem(30px);
        @include font-dpr(15px);
        color: #FF6A45;
      }
      &.newsblack  {
        background-color: #222222;
        .source {
          color: #fff;
          opacity: 0.5;
        }
        .header {
          color: #fff;
        }
        .desc {
          color: #fff;
          opacity: 0.5;
        }
      }
    }
  }
</style>
