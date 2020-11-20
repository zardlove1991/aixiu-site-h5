<template>
  <div :class="['news-article2-wrap', themeName + '-bg']">
    <div :class="['article2-index', indexData.size]" v-if="indexData && indexData.title"
      @click.stop="goPage(indexData)">
      <img class="article2-img" v-if="indexData.is_open_link"  :src="indexData.src" object-fit="cover" />
      <img class="article2-img" v-else v-preview="indexData.src" :src="indexData.src" object-fit="cover" />
      <div :class="['article2-content', themeName]">
        <div class="header">{{indexData.title}}</div>
        <div class="line"></div>
        <div class="source">{{indexData.source}}<span v-if="indexData.date"> · </span>{{indexData.date}}</div>
      </div>
    </div>
    <div class="article2-item"
      v-for="(item, index) in tmpList"
      :key="index"
      v-show="index !== 0"
      @click.stop="goPage(item)">
      <img :class="['article2-item-img', item.size]" v-if="item.is_open_link"  :src="item.src" object-fit="cover" />
      <img :class="['article2-item-img', item.size]" v-else v-preview="item.src" :src="item.src" object-fit="cover" />
      <div :class="['article2-item-content', themeName]">
        <div class="header">{{item.title}}</div>
        <div class="source">{{item.source}}<span v-if="item.date"> · </span>{{item.date}}</div>
      </div>
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
      console.log('initData article2', this.tmpList)
      let tmpList = this.tmpList
      if (tmpList && tmpList.length > 0) {
        tmpList.map(item => {
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
          return item
        })
        this.indexData = tmpList[0]
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
  .news-article2-wrap {
    width: 100%;
    height: 100vh;
    overflow-y: auto;
    // background-color: #ffffff;
    padding: 0 px2rem(30px);
    @include bg-linear-color('bgColor');
    .article2-index {
      position: relative;
      margin-top: px2rem(30px);
      margin-bottom: px2rem(120px);
      width: 100%;
      height: 0px;
      border-radius: px2rem(8px);
      &.size-16-9 {
        padding-bottom: 56.25%;
      }
      &.size-4-3 {
        padding-bottom: 75%;
      }
      .article2-img {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
        border-radius: px2rem(8px);
      }
      .article2-content {
        position: absolute;
        background-color: #fff;
        left: 0;
        bottom: -20%;
        width: 86%;
        padding: px2rem(25px) px2rem(30px);
        box-shadow: 0px -2px 12px 5px rgba(0, 0, 0, 0.04);
        border-radius: 0px 8px 8px 8px;
        .header {
          margin-bottom: px2rem(5px);
          @include line-overflow(2);
          @include font-dpr(18px);
          color: #333;
          font-weight: bold;
        }
        .line {
          margin: px2rem(15px) 0;
          width: 20%;
          height: px2rem(4px);
          background: #FF6A45;
          border-radius: px2rem(2px);
        }
        .source {
          color: #818181;
          @include font-dpr(12px);
        }
        &.newsblack {
          background-color: #222222;
          .header {
            color: #fff;
          }
          .source {
            color: #fff;
            opacity: 0.5;
          }
        }
      }
    }
    .article2-item {
      display: flex;
      align-items: center;
      width: 100%;
      margin-bottom: px2rem(50px);
      &:last-child {
        margin-bottom: px2rem(30px);
      }
      .article2-item-img {
        flex: 0 0 6.25rem;
        width: 6.25rem;
        margin-right: px2rem(30px);
        &.size-16-9 {
          height: calc(6.25rem * 9 / 16);
        }
        &.size-4-3 {
          height: calc(6.25rem * 3 / 4);
        }
        border-radius: px2rem(8px);
      }
      .article2-item-content {
        flex: 1;
        .header {
          margin-bottom: px2rem(5px);
          @include line-overflow(2);
          @include font-dpr(18px);
          color: #333;
          font-weight: 500;
        }
        .source {
          color: #999999;
          @include font-dpr(12px);
        }
        &.newsblack {
          .header {
            color: #fff;
          }
          .source {
            color: #fff;
            opacity: 0.5;
          }
        }
      }
    }
  }
</style>
