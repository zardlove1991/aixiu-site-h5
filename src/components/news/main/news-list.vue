<template>
  <div :class="['news-start-wrap', themeName + '-bg']">
    <mt-loadmore ref="news-start-loadmore"
      :bottom-method="nextStep"
      :bottom-all-loaded="lastPage"
      :bottom-pull-text="bottomTxt"
      :bottom-drop-text="bottomTxt"
      :bottom-loading-text="bottomLoadTxt"
      :top-pull-text="topTxt"
      :top-drop-text="topTxt"
      :top-loading-text="topLoadTxt"
      :top-method="preStep"
      :auto-fill="false">
      <component
        :themeName="themeName"
        :newsInfo="newsInfo"
        :tmpList="currentData"
        :showTime="showTime"
        :is="currentStepName"
        @goPage="goPage">
      </component>
    </mt-loadmore>
    <news-number :config="{
      isShow: newsInfo.is_open_page_number,
      themeName,
      currentStep,
      currentStepName,
      totalPage: pages && pages.length }" />
  </div>
</template>

<script>
import mixins from '@/mixins/index'
import { Toast, Loadmore } from 'mint-ui'
// import { setBrowserTitle, delUrlParams } from '@/utils/utils'
import { setBrowserTitle } from '@/utils/utils'
import NewsFirst from '@/components/news/global/news-first'
import NewsArticle1 from '@/components/news/global/news-article1'
import NewsArticle2 from '@/components/news/global/news-article2'
import NewsArticle3 from '@/components/news/global/news-article3'
import NewsVideo1 from '@/components/news/global/news-video1'
import NewsVideo2 from '@/components/news/global/news-video2'
import NewsGallery1 from '@/components/news/global/news-gallery1'
import NewsEnd from '@/components/news/global/news-end'
import NewsNumber from '@/components/news/global/news-number'
import STORAGE from '@/utils/storage'
import API from '@/api/module/examination'

export default {
  mixins: [mixins],
  props: {
    id: String
  },
  components: {
    NewsFirst,
    NewsArticle1,
    NewsArticle2,
    NewsArticle3,
    NewsVideo1,
    NewsVideo2,
    NewsGallery1,
    NewsEnd,
    NewsNumber,
    Loadmore
  },
  data () {
    return {
      newsInfo: {},
      pages: [],
      currentStep: 0,
      currentStepName: '',
      themeName: '',
      config: {},
      showTime: '',
      loading: false
    }
  },
  computed: {
    lastPage () {
      // 当滚动到最后一页时
      let pages = this.pages
      if (pages && pages.length) {
        return this.currentStep >= pages.length
      }
      return true
    },
    topTxt () {
      return this.currentStep <= 1 ? '' : '上一页'
    },
    topLoadTxt () {
      return this.currentStep <= 1 ? '' : '加载中...'
    },
    bottomTxt () {
      return this.lastPage ? '' : '下一页'
    },
    bottomLoadTxt () {
      return this.lastPage ? '' : '加载中...'
    },
    currentData () {
      let step = this.currentStep
      let pages = this.pages
      if (step > 0 && step <= pages.length) {
        let tmp = step - 1
        let obj = this.pages[tmp]
        if (obj && obj.data) {
          return obj.data
        }
        return []
      }
      return []
    }
  },
  created () {
    this.initData()
  },
  methods: {
    initData () {
      console.log('initData', this.id)
      this.loading = true
      try {
        API.getNewsDetail({
          query: { id: this.id }
        }).then(res => {
          if (res.error_code) {
            Toast(res.error_message)
            return
          }
          this.loading = false
          this.newsInfo = res
          let time = res.updated_at
          if (time) {
            let date = new Date(time.replace(/-/g, '/'))
            let month = date.getMonth() + 1
            let day = date.getDate()
            if (month < 10) {
              month = '0' + month
            }
            if (day < 10) {
              day = '0' + day
            }
            this.showTime = month + '-' + day
          }
          // 设置主题
          this.setNewsTheme(res)
          // 设置标题
          setBrowserTitle(res.title)
          // 初始化页面
          this.initPages(res)
          // 页面跳转
          let step = STORAGE.get('current_step')
          if (!step) {
            step = 1
          }
          this.toggleStep(step)
          // 分享
          this.sharePage(res)
        })
      } catch (err) {
        this.loading = false
        console.log(err)
      }
    },
    setNewsTheme (res) {
      if (!res) {
        return false
      }
      let styObj = res.color_matching_style
      if (styObj) {
        let { content, name } = styObj
        if (name) {
          this.themeName = name
        }
        if (content && content.bg_color) {
          document.getElementsByTagName('body')[0].style.setProperty('--bgColor', content.bg_color)
        }
      }
    },
    initPages (res) {
      if (!res) {
        return false
      }
      let { information_content_data: pages, index_pic: indexPic } = res
      if (indexPic.cover_img) {
        pages.unshift({ mark: 'first' })
      }
      if (indexPic.back_cover_img) {
        pages.push({ mark: 'end' })
      }
      this.pages = pages
    },
    toggleStep (step) {
      let pages = this.pages
      if (pages && pages.length >= step) {
        STORAGE.set('current_step', step)
        let tmp = step - 1
        let page = pages[tmp]
        if (page && page.mark) {
          let mark = 'news-' + page.mark
          this.currentStep = step
          this.currentStepName = mark
        }
      }
    },
    sharePage (detailInfo) {
      if (!detailInfo) {
        return false
      }
      let { id, title, introduce, indexpic, share_settings: share } = detailInfo
      let imgUrl = ''
      let shareLink = ''
      let shareTitle = title
      let shareBrief = introduce
      if (share) {
        let sharePic = share.indexpic
        if (share.title) {
          shareTitle = share.title
        }
        if (share.brief) {
          shareBrief = share.brief
        }
        shareLink = share.link
        if (sharePic) {
          if (sharePic.constructor === Array && sharePic.length > 0) {
            let obj = sharePic[0]
            if (obj.constructor === Object) {
              imgUrl = 'http:' + obj.host + obj.filename
            } else if (obj.constructor === String) {
              imgUrl = obj
            }
          } else if (sharePic.constructor === Object && sharePic.host && sharePic.filename) {
            imgUrl = 'http:' + sharePic.host + sharePic.filename
          } else if (sharePic.constructor === String) {
            imgUrl = sharePic
          }
        } else if (indexpic) {
          if (indexpic.host && indexpic.filename) {
            imgUrl = 'http:' + indexpic.host + indexpic.filename
          } else if (indexpic.url) {
            imgUrl = indexpic.url
          }
        }
      }
      if (!shareLink) {
        let local = window.location
        let pathname = local.pathname
        let index = pathname.indexOf('newslist')
        if (index !== -1) {
          pathname = pathname.replace(/newslist/, 'newstart')
        }
        shareLink = local.origin + pathname
        // shareLink = delUrlParams(['code'])
      } else {
        shareLink = 'http://xzh5.hoge.cn/bridge/index.html?backUrl=' + shareLink
      }
      this.initPageShareInfo({
        id,
        title: shareTitle,
        desc: shareBrief,
        indexpic: imgUrl,
        link: shareLink,
        mark: detailInfo.mark
      })
    },
    nextStep () {
      let step = this.currentStep
      ++step
      this.$nextTick(() => {
        this.$refs['news-start-loadmore'].onBottomLoaded()
        this.toggleStep(step)
      })
    },
    preStep () {
      let step = this.currentStep
      if (step > 1) {
        --step
      }
      this.$nextTick(() => {
        this.$refs['news-start-loadmore'].onTopLoaded()
        this.toggleStep(step)
      })
    },
    goPage (item) {
      let isOpenLink = item.is_open_link
      let url = item.link_url
      if (!isOpenLink) {
        return false
      }
      if (!url) {
        return false
      }
      window.location.href = url
    }
  }
}
</script>

<style lang="scss">
  @import "@/styles/index.scss";
  .news-start-wrap {
    &.newsdiwen-bg, .newsdiwen-bg {
      background-size: 100% 100%;
      background-image: url('~@/assets/news/normal-bg.png');
    }
    &.newsblack-bg {
      @include bg-linear-color('bgColor');
    }
    .mint-loadmore-text {
      color: #999;
    }
    .el-image-viewer__wrapper {
      display: flex;
      align-items: center;
      .el-image-viewer__mask {
        opacity: 1;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
      }
      .el-image-viewer__close {
        right: 0;
        left: px2rem(42px);
        top: px2rem(56px);
      }
      .el-icon-circle-close {
        display: inline-block;
        width: px2rem(32px);
        height: px2rem(32px);
        background-size: px2rem(32px) px2rem(32px);
        background-image: url('~@/assets/news/close-icon.png');
        &::before {
          content: ''
        }
      }
      .el-image-viewer__actions {
        display: none;
      }
      // .el-image-viewer__canvas {
      // height: 80%;
      // }
      img {
        object-fit: contain;
      }
    }
  }
</style>
