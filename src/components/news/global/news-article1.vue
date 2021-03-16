<template>
  <div :class="['news-article1-wrap', themeName + '-bg']">
    <div :class="['article1-index', indexData.size ? indexData.size : 'size-4-47']" v-if="indexData && indexData.title"
      @click.stop="goPage(indexData)">
      <el-image
        class="article1-img"
        v-if="indexData.is_open_link"
        :src="indexData.src"
        fit="cover">
      </el-image>
      <el-image
        class="article1-img"
        v-else
        :src="indexData.src"
        @click.stop="showImg(0, [indexData.src])"
        fit="cover">
      </el-image>
      <!-- <img class="article1-img" v-if="indexData.is_open_link"  :src="indexData.src" object-fit="cover" />
      <img class="article1-img" v-else v-preview="indexData.src" :src="indexData.src" object-fit="cover" /> -->
      <div class="article1-content">
        <div class="header">{{indexData.title}}</div>
        <div class="source">{{indexData.source}}<span v-if="showTime"> · </span>{{showTime}}</div>
      </div>
    </div>
    <div class="article1-next">
      <div
        v-for="(item, index) in tmpList"
        :class="['article1-item', item.size ? item.size : 'size-4-43']"
        :key="index"
        v-show="index !== 0"
        @click.stop="goPage(item)">
        <el-image
          class="article1-img"
          v-if="item.is_open_link"
          :src="item.src"
          fit="cover">
        </el-image>
        <el-image
          class="article1-img"
          v-else
          :src="item.src"
          @click.stop="showImg(0, [item.src])"
          fit="cover">
        </el-image>
        <!-- <img class="article1-img" v-if="item.is_open_link"  :src="item.src" object-fit="cover" />
        <img class="article1-img" v-else v-preview="item.src" :src="item.src" object-fit="cover" /> -->
        <div class="article1-content small">
          <div class="header">{{item.title}}</div>
          <div class="source">{{item.source}}<span v-if="showTime"> · </span>{{showTime}}</div>
        </div>
      </div>
    </div>
    <news-number :config="config" />
  </div>
</template>

<script>
import NewsNumber from '@/components/news/global/news-number'

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
    },
    config: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      indexData: {}
    }
  },
  components: {
    NewsNumber
  },
  created () {
    this.initData()
  },
  watch: {
    tmpList: {
      handler (val) {
        this.initData()
      },
      deep: true
    }
  },
  methods: {
    initData () {
      // console.log('initData article1', this.tmpList)
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
    },
    showImg (index, list = []) {
      this.$emit('showImg', {
        index,
        list
      })
    }
  }
}
</script>

<style lang="scss">
  @import "@/styles/index.scss";
  .news-article1-wrap {
    position: relative;
    width: 100%;
    height: 100vh;
    overflow-y: auto;
    // background-color: #ffffff;
    padding: 0 px2rem(30px);
    @include bg-color('bgColor');
    .article1-index {
      position: relative;
      margin-top: px2rem(30px);
      margin-bottom: 0.3125rem;
      width: 100%;
      height: 0px;
      border-radius: px2rem(8px);
      &.size-4-47 {
        padding-bottom: 117.5%;
      }
      &.size-16-9 {
        padding-bottom: 56.25%;
      }
      &.size-4-3 {
        padding-bottom: 75%;
      }
    }
    .article1-next {
      width: 100%;
      display: flex;
      margin-bottom: px2rem(30px);
      .article1-item {
        position: relative;
        margin-right: 0.3125rem;
        width: calc((100% - 0.3125rem) / 2);
        height: 0px;
        &:last-child {
          margin-right: 0;
        }
        &.size-4-43 {
          padding-bottom: calc((100% - 0.3125rem) / 2 * 4.3 / 4);
        }
        &.size-16-9 {
          padding-bottom: calc((100% - 0.3125rem) / 2 * 9 / 16);
        }
        &.size-4-3 {
          padding-bottom: calc((100% - 0.3125rem) / 2 * 3 / 4);
        }
      }
    }
    .article1-img {
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      height: 100%;
      border-radius: px2rem(8px);
    }
    .article1-content {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      padding: 0 px2rem(30px) px2rem(40px) px2rem(30px);
      background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.5) 100%);
      color: #fff;
      border-radius: px2rem(8px);
      .header {
        margin-bottom: px2rem(5px);
        @include line-overflow(2);
        @include font-dpr(18px);
        font-weight: bold;
      }
      .source {
        @include font-dpr(12px);
      }
      &.small {
        padding: 0 px2rem(30px) px2rem(27px) px2rem(30px);
        .header {
          @include font-dpr(14px);
        }
        .source {
          @include font-dpr(11px);
        }
      }
    }
  }
</style>
