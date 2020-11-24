<template>
  <div :class="['news-video2-wrap', themeName + '-bg']">
    <div class="video2-index" v-if="indexData && indexData.title">
      <news-video-common :videoObj="indexData.videoObj" />
      <div :class="['video2-content', themeName]" @click.stop="goPage(indexData)">
        <div class="header">{{indexData.title}}</div>
        <div class="source">{{indexData.source}}<span v-if="showTime"> · </span>{{showTime}}</div>
      </div>
    </div>
    <div class="video2-item"
      v-for="(item, index) in tmpList"
      :key="index"
      v-show="index !== 0">
      <div class="video2-item-wrap small-video">
        <news-video-common :isFull="true" :videoObj="item.videoObj" />
      </div>
      <div :class="['video2-item-content', themeName]" @click.stop="goPage(item)">
        <div class="header">{{item.title}}</div>
        <div class="source">{{item.source}}<span v-if="showTime"> · </span>{{showTime}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import NewsVideoCommon from '@/components/news/global/base-video'

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
  components: {
    NewsVideoCommon
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
      // console.log('initData video2', this.tmpList)
      let tmpList = this.tmpList
      if (tmpList && tmpList.length > 0) {
        tmpList.map(item => {
          let posterUrl = ''
          let ratio = item.ratio
          let material = item.material
          if (material && material.length) {
            posterUrl = material[0]
          }
          item.videoObj = {
            ratio,
            posterUrl,
            videoUrl: item.video_url
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
  .news-video2-wrap {
    width: 100%;
    height: 100vh;
    overflow-y: auto;
    // background-color: #ffffff;
    padding: 0 px2rem(30px);
    @include bg-linear-color('bgColor');
    .video2-index {
      margin-top: px2rem(30px);
      margin-bottom: px2rem(40px);
      border-radius: px2rem(8px);
      .video2-content {
        margin-top: px2rem(20px);
        width: 100%;
        .header {
          color: #333;
          margin-bottom: px2rem(5px);
          @include line-overflow(2);
          @include font-dpr(18px);
          font-weight: bold;
        }
        .source {
          color: #999;
          @include line-overflow(1);
          @include font-dpr(12px);
        }
        &.newsblack {
          .header {
            color: #fff;
            opacity: 0.9;
          }
          .source {
            opacity: 0.5;
            color: #fff;
          }
        }
      }
    }
    .video2-item {
      display: flex;
      align-items: center;
      width: 100%;
      margin-bottom: px2rem(50px);
      &:last-child {
        margin-bottom: px2rem(30px);
      }
      .video2-item-wrap {
        width: 6.25rem;
        flex: 0 0 6.25rem;
        margin-right: px2rem(30px);
      }
      .video2-item-content {
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
          @include line-overflow(1);
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
    .video2-number {
      position: absolute;
      bottom: px2rem(10px);
      right: px2rem(10px);
      height: px2rem(40px);
      line-height: px2rem(40px);
      padding: 0 px2rem(10px);
      border-radius: px2rem(18px);
      background-color: rgba(0, 0, 0, 0.5);
      @include font-dpr(10px);
      color: #fff;
      .gallery-icon {
        display: inline-block;
        margin-right: px2rem(8px);
      }
    }
  }
</style>
