<template>
  <div :class="['news-start-wrap', themeName + '-bg']" @scroll="handleScroll($event)">
    <!-- <mt-loadmore ref="news-start-loadmore"
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
        @goPage="goPage"
        @showImg="showImg">
      </component>
    </mt-loadmore> -->
    <component
      v-for="(page, index) in pages" :key="index"
      :themeName="themeName"
      :newsInfo="newsInfo"
      :tmpList="page.data"
      :showTime="showTime"
      :is="page.name"
      @goPage="goPage"
      @showImg="showImg">
    </component>
    <news-number :config="{
      isShow: newsInfo.is_open_page_number,
      themeName,
      currentStep: isFirst ? currentStep - 1 : currentStep,
      currentStepName: (currentStep === 1 && isFirst) ? 'news-first' : '',
      totalPage: newsInfo.information_content_data && newsInfo.information_content_data.length }" />
    <base-preview :show.sync="isPreview" :currentImg="currentImg" :previewList="previewList" />
  </div>
</template>

<script>
// import mixins from '@/mixins/index'
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
import BasePreview from '@/components/news/global/base-preview'

export default {
  // mixins: [mixins],
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
    Loadmore,
    BasePreview
  },
  data () {
    return {
      newsInfo: {},
      pages: [],
      currentStep: 1,
      currentStepName: '',
      themeName: '',
      config: {},
      showTime: '',
      isFirst: false,
      loading: false,
      isPreview: false,
      currentImg: 0,
      previewList: [],
      tmpHight: 0
    }
  },
  computed: {
    // lastPage () {
    //   // 当滚动到最后一页时
    //   let pages = this.pages
    //   if (pages && pages.length) {
    //     return this.currentStep >= pages.length
    //   }
    //   return true
    // },
    // topTxt () {
    //   return this.currentStep <= 1 ? '' : '上一页'
    // },
    // topLoadTxt () {
    //   return this.currentStep <= 1 ? '' : '加载中...'
    // },
    // bottomTxt () {
    //   return this.lastPage ? '' : '下一页'
    // },
    // bottomLoadTxt () {
    //   return this.lastPage ? '' : '加载中...'
    // },
    // currentData () {
    //   let step = this.currentStep
    //   let pages = this.pages
    //   if (step > 0 && step <= pages.length) {
    //     let tmp = step - 1
    //     let obj = this.pages[tmp]
    //     if (obj && obj.data) {
    //       return obj.data
    //     }
    //     return []
    //   }
    //   return []
    // }
  },
  created () {
    this.initData()
  },
  mounted () {
  },
  methods: {
    handleScroll (event) {
      let ele = event.srcElement ? event.srcElement : event.target
      let currentStep = this.currentStep
      let top = ele.scrollTop
      let baseHeight = ele.clientHeight
      let calcHeight = 200 // 滚动差x像素时进入下一页
      // console.log('handleScroll', baseHeight, top)
      let scroll = top - this.tmpHight
      // let nodes = document.getElementsByClassName('news-start-wrap')
      this.tmpHight = top
      if (scroll < 0) {
        // 向上滚动
        if (currentStep > 1) {
          let beforeHeight = baseHeight * (currentStep - 1)
          // if ((top - calcHeight) <= beforeHeight) {
          if (top <= (beforeHeight - calcHeight)) {
            // if (nodes && nodes.length) {
            //   nodes[0].scrollTop = baseHeight * (currentStep - 2)
            //   this.currentStep = currentStep - 1
            //   STORAGE.set('current_step', currentStep - 1)
            // }
            this.currentStep = currentStep - 1
            STORAGE.set('current_step', currentStep - 1)
          }
        }
      } else {
        // 向下滚动
        let newHeight = baseHeight * currentStep
        if ((top + calcHeight) >= newHeight) {
          // 置顶
          // if (nodes && nodes.length) {
          //   nodes[0].scrollTop = newHeight
          //   this.currentStep = currentStep + 1
          //   STORAGE.set('current_step', currentStep + 1)
          // }
          this.currentStep = currentStep + 1
          STORAGE.set('current_step', currentStep + 1)
        }
      }
    },
    initData () {
      // console.log('initData', this.id)
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
          this.currentStep = step
          this.toggleStep(step)
          // 分享
          // this.sharePage()
        })
      } catch (err) {
        this.loading = false
        console.log(err)
      }
    },
    toggleStep (step) {
      this.$nextTick(() => {
        let nodes = document.getElementsByClassName('news-start-wrap')
        if (nodes && nodes.length) {
          let baseHeight = nodes[0].clientHeight
          if (step > 1) {
            nodes[0].scrollTop = baseHeight * (step - 1)
          }
        }
      })
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
      let newsObj = [...pages]
      if (indexPic.cover_img) {
        this.isFirst = true
        newsObj.unshift({ mark: 'first' })
      }
      if (indexPic.back_cover_img) {
        newsObj.push({ mark: 'end' })
      }
      for (let item of newsObj) {
        if (item && item.mark) {
          item.name = 'news-' + item.mark
        }
      }
      this.pages = newsObj
    },
    sharePage () {
      let newsInfo = this.newsInfo
      if (!newsInfo) {
        return
      }
      let { id, title, mark, index_pic: indexpic, share_settings: share } = newsInfo
      let imgUrl = ''
      let shareLink = ''
      let shareBrief = ''
      let shareTitle = title
      if (share) {
        let sharePic = share.indexpic
        if (share.title) {
          shareTitle = share.title
        }
        if (share.brief) {
          shareBrief = share.brief
        }
        if (share.link) {
          shareLink = share.link
        }
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
        } else if (indexpic && indexpic.cover_img) {
          imgUrl = indexpic.cover_img
        }
      }
      if (!shareLink) {
        let local = window.location
        let pathname = local.pathname
        let index = pathname.indexOf('newslist')
        if (index !== -1) {
          pathname = pathname.replace(/newslist/, 'newstart')
        }
        shareLink = 'http://xzh5.hoge.cn/bridge/index.html?backUrl=' + local.origin + pathname
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
        mark: mark
      })
    },
    // nextStep () {
    //   let step = this.currentStep
    //   ++step
    //   this.$nextTick(() => {
    //     this.$refs['news-start-loadmore'].onBottomLoaded()
    //     this.toggleStep(step)
    //   })
    // },
    // preStep () {
    //   let step = this.currentStep
    //   if (step > 1) {
    //     --step
    //   }
    //   this.$nextTick(() => {
    //     this.$refs['news-start-loadmore'].onTopLoaded()
    //     this.toggleStep(step)
    //   })
    // },
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
    },
    showImg (item) {
      let { index, list } = item
      this.isPreview = true
      this.currentImg = index
      this.previewList = list
    }
  }
}
</script>

<style lang="scss">
  @import "@/styles/index.scss";
  .news-start-wrap {
    width: 100%;
    height: 100vh;
    overflow-y: auto;
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
  }
</style>
