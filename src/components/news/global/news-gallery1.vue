<template>
  <div :class="['news-gallery1-wrap', themeName + '-bg']">
    <div class="gallery1-index" v-if="indexData && indexData.title"
      @click="goPage(indexData)">
      <!-- 单张图片 4:3 -->
      <div class="gallery1-index-flex" v-if="indexData.material.length === 1">
        <div class="base imgs-1">
          <el-image
            class="imgs-item imgs-all"
            v-if="indexData.is_open_link"
            :src="indexData.material[0]"
            fit="cover">
          </el-image>
          <el-image
            class="imgs-item imgs-all"
            v-else
            :src="indexData.material[0]"
            :preview-src-list="indexData.material"
            fit="cover">
          </el-image>
          <!-- <img class="imgs-item imgs-all"
            v-if="indexData.is_open_link"
            :src="indexData.material[0]"
            object-fit="cover" />
          <img class="imgs-item imgs-all"
            v-else
            v-preview="item.material[0]"
            :src="indexData.material[0]"
            object-fit="cover" /> -->
          <div class="gallery1-number">
            <span class="gallery-icon"></span>{{indexData.material.length}}
          </div>
        </div>
      </div>
      <!-- 两张图片 -->
      <div class="gallery1-index-flex" v-if="indexData.material.length === 2">
        <div class="base imgs-2">
          <el-image
            class="imgs-item imgs-left"
            v-if="indexData.is_open_link"
            :src="indexData.material[0]"
            fit="cover">
          </el-image>
          <el-image
            class="imgs-item imgs-left"
            v-else
            :src="indexData.material[0]"
            :preview-src-list="indexData.material"
            fit="cover">
          </el-image>
          <!-- <img class="imgs-item imgs-left"
            v-if="indexData.is_open_link"
            :src="indexData.material[0]"
            object-fit="cover" />
          <img class="imgs-item imgs-left"
            v-else
            v-preview="item.material[0]"
            :src="indexData.material[0]"
            object-fit="cover" /> -->
        </div>
        <div class="base imgs-2">
          <el-image
            class="imgs-item imgs-right"
            v-if="indexData.is_open_link"
            :src="indexData.material[1]"
            fit="cover">
          </el-image>
          <el-image
            class="imgs-item imgs-right"
            v-else
            :src="indexData.material[1]"
            :preview-src-list="indexData.material"
            fit="cover">
          </el-image>
          <!-- <img class="imgs-item imgs-right"
            v-if="indexData.is_open_link"
            :src="indexData.material[1]"
            object-fit="cover" />
          <img class="imgs-item imgs-right"
            v-else
            v-preview="item.material[1]"
            :src="indexData.material[1]"
            object-fit="cover" /> -->
          <div class="gallery1-number">
            <span class="gallery-icon"></span>{{indexData.material.length}}
          </div>
        </div>
      </div>
      <!-- 三张及多张图片 -->
      <div class="gallery1-index-flex" v-if="indexData.material.length >= 3">
        <div class="base imgs-2">
          <el-image
            class="imgs-item imgs-left"
            v-if="indexData.is_open_link"
            :src="indexData.material[0]"
            fit="cover">
          </el-image>
          <el-image
            class="imgs-item imgs-left"
            v-else
            :src="indexData.material[0]"
            @click.stop="showImg(0, indexData.material)"
            fit="cover">
          </el-image>
          <!-- <img class="imgs-item imgs-left"
            v-if="indexData.is_open_link"
            :src="indexData.material[0]"
            object-fit="cover" />
          <img class="imgs-item imgs-left"
            v-else
            v-preview="indexData.material[0]"
            :src="indexData.material[0]"
            object-fit="cover" /> -->
        </div>
        <div class="base imgs-3">
          <div class="imgs-3-top">
            <el-image
              class="imgs-item imgs-right-top"
              v-if="indexData.is_open_link"
              :src="indexData.material[1]"
              fit="cover">
            </el-image>
            <el-image
              class="imgs-item imgs-right-top"
              v-else
              :src="indexData.material[1]"
              @click.stop="showImg(1, indexData.material)"
              fit="cover">
            </el-image>
            <!-- <img class="imgs-item imgs-right-top"
              v-if="indexData.is_open_link"
              :src="indexData.material[1]"
              object-fit="cover" />
            <img class="imgs-item imgs-right-top"
              v-else
              v-preview="indexData.material[1]"
              :src="indexData.material[1]"
              object-fit="cover" /> -->
          </div>
          <div class="imgs-3-bottom">
            <el-image
              class="imgs-item imgs-right-top"
              v-if="indexData.is_open_link"
              :src="indexData.material[2]"
              fit="cover">
            </el-image>
            <el-image
              class="imgs-item imgs-right-top"
              v-else
              :src="indexData.material[2]"
              @click.stop="showImg(2, indexData.material)"
              fit="cover">
            </el-image>
            <!-- <img class="imgs-item imgs-right-bottom"
              v-if="indexData.is_open_link"
              :src="indexData.material[2]"
              object-fit="cover" />
            <img class="imgs-item imgs-right-bottom"
              v-else
              v-preview="indexData.material[2]"
              :src="indexData.material[2]"
              object-fit="cover" /> -->
            <div class="gallery1-number">
              <span class="gallery-icon"></span>{{indexData.material.length}}
            </div>
          </div>
        </div>
      </div>
      <div :class="['gallery1-content', themeName]">
        <div class="header">{{indexData.title}}</div>
        <div class="source">{{indexData.source}}<span v-if="showTime"> · </span>{{showTime}}</div>
      </div>
    </div>
    <div class="gallery1-item"
      v-for="(item, index) in tmpList"
      :key="index"
      v-show="index !== 0"
      @click.stop="goPage(item)">
      <div class="gallery1-img-wrap" v-if="item.material && item.material.length">
        <el-image
          :class="['gallery1-item-img', item.size ? item.size : 'size-4-3']"
          v-if="item.is_open_link"
          :src="item.material[0]"
          fit="cover">
        </el-image>
        <el-image
          :class="['gallery1-item-img', item.size ? item.size : 'size-4-3']"
          v-else
          :src="item.material[0]"
          @click.stop="showImg(0, item.material)"
          fit="cover">
        </el-image>
        <!--
        <img :class="['gallery1-item-img', item.size]" v-if="item.is_open_link" :src="item.material[0]" object-fit="cover" />
        <img :class="['gallery1-item-img', item.size]" v-else v-preview="item.material[0]" :src="item.material[0]" object-fit="cover" />
        -->
        <div class="gallery1-number">
          <span class="gallery-icon"></span>{{item.material.length}}
        </div>
      </div>
      <div :class="['gallery1-item-content', themeName]">
        <div class="header">{{item.title}}</div>
        <div class="source">{{item.source}}<span v-if="showTime"> · </span>{{showTime}}</div>
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
      // console.log('initData gallery1', this.tmpList)
      let tmpList = this.tmpList
      if (tmpList && tmpList.length > 0) {
        tmpList.map(item => {
          let ratio = item.ratio
          if (ratio) {
            ratio = ratio.replace('.', '')
            let arr = ratio.split(':')
            let size = ''
            if (arr.length === 2) {
              size = 'size-' + arr[0] + '-' + arr[1]
            }
            item.size = size
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
  .news-gallery1-wrap {
    position: relative;
    width: 100%;
    height: 100vh;
    overflow-y: auto;
    // background-color: #ffffff;
    padding: 0 px2rem(30px);
    @include bg-color('bgColor');
    .gallery1-index {
      margin-top: px2rem(30px);
      margin-bottom: px2rem(40px);
      border-radius: px2rem(8px);
      .gallery1-index-flex {
        display: flex;
        .base {
          position: relative;
          height: 0;
          &.imgs-1 {
            flex: 1;
            margin-right: 0;
            width: 100%;
            padding-bottom: 56.25%; // 75%;
          }
          &.imgs-2 {
            flex: 1;
            width: calc((100% - 0.32rem) / 2);
            padding-bottom: calc((100% - 0.32rem) / 2);
            &:first-child {
              margin-right: 0.32rem;
            }
          }
          &.imgs-3 {
            flex: 1;
            width: calc(50% - 0.32rem);
            padding-bottom: calc(50% - 0.32rem);
            .imgs-3-top, .imgs-3-bottom {
              position: relative;
              width: 100%;
              height: 0;
              padding-bottom: calc((100% - 0.32rem) / 2);
            }
            .imgs-3-top {
              margin-bottom: 0.32rem;
            }
          }
          .imgs-item {
            position: absolute;
            left: 0;
            top: 0;
            right: 0;
            bottom: 0;
            width: 100%;
            height: 100%;
            &.imgs-all {
              border-radius: px2rem(8px);
            }
            &.imgs-left {
              border-radius: px2rem(8px) 0 0 px2rem(8px);
            }
            &.imgs-right {
              border-radius: 0 px2rem(8px) px2rem(8px) 0;
            }
            &.imgs-right-top {
              border-radius: 0 px2rem(8px) 0 0;
            }
            &.imgs-right-bottom {
              border-radius: 0 0 px2rem(8px) 0;
            }
          }
        }
      }
      .gallery1-content {
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
    .gallery1-item {
      display: flex;
      align-items: center;
      width: 100%;
      margin-bottom: px2rem(50px);
      &:last-child {
        margin-bottom: px2rem(30px);
      }
      .gallery1-img-wrap {
        position: relative;
        flex: 0 0 6.25rem;
        width: 6.25rem;
        margin-right: px2rem(30px);
        .gallery1-item-img {
          width: 100%;
          border-radius: px2rem(8px);
          &.size-16-9 {
            height: calc(6.25rem * 9 / 16);
          }
          &.size-4-3 {
            height: calc(6.25rem * 3 / 4);
          }
        }
      }
      .gallery1-item-content {
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
            opacity: 0.9;
          }
          .source {
            color: #fff;
            opacity: 0.5;
          }
        }
      }
    }
    .gallery1-number {
      position: absolute;
      bottom: px2rem(10px);
      right: px2rem(10px);
      height: px2rem(30px);
      line-height: px2rem(30px);
      padding: 0 px2rem(10px) 0 px2rem(8px);
      border-radius: px2rem(15px);
      background-color: rgba(0, 0, 0, 0.5);
      @include font-dpr(10px);
      color: #fff;
      .gallery-icon {
        display: inline-block;
        width: px2rem(19px);
        height: px2rem(14px);
        background-size: px2rem(19px) px2rem(14px);
        background-repeat: no-repeat;
        background-image: url('~@/assets/news/gallery-icon.png');
        margin-right: px2rem(8px);
      }
    }
  }
</style>
