<template>
  <div :class="['news-start-wrap', themeName + '-bg']">
    <swiper :options="swiperOption2">
      <swiper-slide v-for="(page, index) in pages" :key="index">
        <component
          :themeName="themeName"
          :newsInfo="newsInfo"
          :tmpList="page.data"
          :showTime="showTime"
          :config="{
            isShow: newsInfo.is_open_page_number,
            themeName,
            currentStep: isFirst ? index : index + 1,
            totalPage: newsInfo.information_content_data && newsInfo.information_content_data.length }"
          :is="page.name"
          @goPage="goPage"
          @showImg="showImg">
        </component>
        <span>{{index}}</span>
        <!-- <news-number :config="{
          isShow: newsInfo.is_open_page_number,
          themeName,
          currentStep: isFirst ? index : index + 1,
          currentStepName: (index === 0 && isFirst) ? 'news-first' : '',
          totalPage: newsInfo.information_content_data && newsInfo.information_content_data.length }" /> -->
      </swiper-slide>
    </swiper>
    <base-preview :show.sync="isPreview" :currentImg="currentImg" :previewList="previewList" />
  </div>
</template>

<script>
import mixins from '@/mixins/index'
import { Toast } from 'mint-ui'
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
// import STORAGE from '@/utils/storage'
import API from '@/api/module/examination'
import BasePreview from '@/components/news/global/base-preview'
import { Swiper, SwiperSlide } from 'vue-awesome-swiper'

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
    BasePreview,
    Swiper,
    SwiperSlide
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
      swiperOption2: {
        // initialSlide: 3,
        direction: 'vertical',
        speed: 800
      }
    }
  },
  created () {
    this.initData()
  },
  mounted () {
  },
  methods: {
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
          // let step = STORAGE.get('current_step')
          // if (!step) {
          //   step = 1
          // }
          // this.currentStep = step
          // this.toggleStep(step)
          // 分享
          this.sharePage()
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
              if (/http/.test(obj.host)) {
                imgUrl = obj.host + obj.filename
              } else {
                imgUrl = location.protocol + obj.host + obj.filename
              }
            } else if (obj.constructor === String) {
              imgUrl = obj
            }
          } else if (sharePic.constructor === Object && sharePic.host && sharePic.filename) {
            if (/http/.test(sharePic.host)) {
              imgUrl = sharePic.host + sharePic.filename
            } else {
              imgUrl = location.protocol + sharePic.host + sharePic.filename
            }
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
        shareLink = this.getShareUrl(local.origin, pathname)
        // shareLink = delUrlParams(['code'])
      } else {
        shareLink = this.getShareUrl(shareLink)
      }
      if (/\?/.test(shareLink)) {
        shareLink += '&userShareCode=' + new Date().getTime()
      } else {
        shareLink += '?userShareCode=' + new Date().getTime()
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
    // overflow-y: auto;
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
    .swiper-container {
      width: 100%;
      height: 100%;
      margin-left: auto;
      margin-right: auto;
    }
  }
</style>
