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
        :is="currentStepName">
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
import { Loadmore } from 'mint-ui'
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
      console.log('xxxxx initData')
      this.loading = true
      let res = {
        id: 1234,
        title: '早安，南京',
        introduce: '早安，南京简介',
        first_color: '#fff',
        index_pic: { // 资讯海报
          cover_img: 'http://xzimg.hoge.cn/market/1603876623860/2.jpg', // 封面
          back_cover_img: 'http://pimg.v2.aihoge.com/test/xiuzan/1604049684908/20201030172103.jpg' // 封底
        },
        information_date: { // 资讯日期
          is_open: 1, // 1: 开启 0: 关闭
          activity_date: '11月11日', // 海报锁定的活动日期
          week_format: '星期三', // 星期格式
          lunar_date_format: '庚子年 九月二十六', // 农历日期格式
          color_matching: '#000' // 配色
        },
        information_weather: { // 资讯天气
          is_open: 1, // 1: 开启 0: 关闭
          city: '南京', // 展示城市
          color_matching: 'red' // 配色
        },
        is_open_page_number: 1,
        theme_name: 'white',
        information_content_data: [{ // B1
          id: '1',
          mark: 'article1',
          type: 'image', // 模版类型
          total_num: 3, // 模版总数据量
          limit: 3, // 图片数量
          title: '模板B1',
          data: [{
            title: '新闻1', // 内容
            ratio: '4:4.7', // 图片比例
            material: ['http://xzimg.hoge.cn/xiuzan/1604470463616/D7D8BCC5-11E3-4423-BC68-58B5B25C996C.png'], // 素材
            is_open_link: 1, // 链接跳转 1: 开启 0: 关闭
            link_url: 'http://www.baidu.com', // 链接
            video_url: '', // 视频地址
            source: '腾讯新闻', // 来源
            date: '11-11',
            describe: '' // 描述
          }, {
            id: '3333',
            ratio: '16:9',
            title: '各手机浏览器将设总编 辑负责制',
            source: '好奇心日报',
            is_open_link: 1, // 链接跳转 1: 开启 0: 关闭
            link_url: 'http://www.baidu.com', // 链接
            date: '11-02',
            material: ['http://xzimg.hoge.cn/xiuzan/1604054762387/20201030172103.jpg']
          }, {
            id: '5555',
            ratio: '16:9',
            title: '特斯拉季度利润创纪录 上海工厂越发关键',
            source: '腾讯新闻',
            is_open_link: 1, // 链接跳转 1: 开启 0: 关闭
            link_url: 'http://www.baidu.com', // 链接
            date: '11-02',
            material: ['http://xzimg.hoge.cn/xiuzan/1599470339737/最美的花.png']
          }]
        }, {
          id: '3',
          mark: 'article2',
          data: [{
            title: '新闻1', // 内容
            ratio: '16:9', // 图片比例
            material: ['http://xzimg.hoge.cn/xiuzan/1604470463616/D7D8BCC5-11E3-4423-BC68-58B5B25C996C.png'], // 素材
            is_open_link: 1, // 链接跳转 1: 开启 0: 关闭
            link_url: 'http://www.baidu.com', // 链接
            video_url: '', // 视频地址
            source: '腾讯新闻', // 来源
            date: '11-11',
            describe: '' // 描述
          }, {
            id: '3333',
            ratio: '16:9',
            title: '各手机浏览器将设总编 辑负责制',
            source: '好奇心日报',
            is_open_link: 1, // 链接跳转 1: 开启 0: 关闭
            link_url: 'http://www.baidu.com', // 链接
            date: '11-02',
            material: ['http://xzimg.hoge.cn/xiuzan/1604054762387/20201030172103.jpg']
          }, {
            id: '5555',
            ratio: '16:9',
            title: '特斯拉季度利润创纪录 上海工厂越发关键',
            source: '腾讯新闻',
            is_open_link: 1, // 链接跳转 1: 开启 0: 关闭
            link_url: 'http://www.baidu.com', // 链接
            date: '11-02',
            material: ['http://xzimg.hoge.cn/xiuzan/1599470339737/最美的花.png']
          }]
        }, {
          id: '4',
          mark: 'article3',
          data: [{
            title: '新闻1', // 内容
            ratio: '16:9', // 图片比例
            material: ['http://xzimg.hoge.cn/xiuzan/1604470463616/D7D8BCC5-11E3-4423-BC68-58B5B25C996C.png'], // 素材
            is_open_link: 1, // 链接跳转 1: 开启 0: 关闭
            link_url: 'http://www.baidu.com', // 链接
            video_url: '', // 视频地址
            source: '腾讯新闻', // 来源
            date: '11-11',
            describe: '苹果卡内基图书馆店已于5月11日开业。它位 于弗农山广场（Mount Vernon Square）， 所处的建筑，前身是卡内基图书馆（也被称 为中央公共图书馆），这是华盛顿第一座公 共图书馆，建于1903年，由美国建筑师艾伯 特·罗斯 （Albert Ross）设计。后来图书馆 被废弃，该建筑成了华盛顿哥伦比亚特区历 史学会所在地。' // 描述
          }]
        }, {
          id: '5',
          mark: 'video1',
          data: [{
            title: '工业利润降幅收窄，外资率先转正各手 机浏览器将设总编辑负责制',
            source: '腾讯新闻',
            date: '11-02',
            ratio: '16:9',
            is_open_link: 1,
            link_url: 'http://www.baidu.com',
            video_url: 'http://outin-a03b512cf3cc11e8acdb00163e1c35d5.oss-cn-shanghai.aliyuncs.com/customerTrans/203182cc86928effd06b285f5532153f/1340ca68-173a23d6646-0004-5cb9-006-28284.mp4',
            material: ['http://xzimg.hoge.cn/xiuzan/1604470463616/D7D8BCC5-11E3-4423-BC68-58B5B25C996C.png']
          }, {
            title: '工业利润降幅收窄，外资率先转正各手 机浏览器将设总编辑负责制',
            source: '腾讯新闻',
            date: '11-02',
            ratio: '4:3',
            is_open_link: 1,
            link_url: 'http://www.baidu.com',
            video_url: 'http://outin-a03b512cf3cc11e8acdb00163e1c35d5.oss-cn-shanghai.aliyuncs.com/customerTrans/203182cc86928effd06b285f5532153f/1340ca68-173a23d6646-0004-5cb9-006-28284.mp4',
            material: ['http://xzimg.hoge.cn/xiuzan/1604054762387/20201030172103.jpg']
          }, {
            title: '工业利润降幅收窄，外资率先转正各手 机浏览器将设总编辑负责制',
            source: '腾讯新闻',
            date: '11-02',
            ratio: '4:3',
            is_open_link: 1,
            link_url: 'http://www.baidu.com',
            video_url: 'http://outin-a03b512cf3cc11e8acdb00163e1c35d5.oss-cn-shanghai.aliyuncs.com/customerTrans/203182cc86928effd06b285f5532153f/1340ca68-173a23d6646-0004-5cb9-006-28284.mp4',
            material: ['http://xzimg.hoge.cn/xiuzan/1599470339737/最美的花.png']
          }]
        }, {
          id: '6',
          mark: 'video2',
          data: [{
            title: '工业利润降幅收窄，外资率先转正各手 机浏览器将设总编辑负责制',
            source: '腾讯新闻',
            date: '11-02',
            ratio: '16:9',
            is_open_link: 1,
            link_url: 'http://www.baidu.com',
            video_url: 'http://outin-a03b512cf3cc11e8acdb00163e1c35d5.oss-cn-shanghai.aliyuncs.com/customerTrans/203182cc86928effd06b285f5532153f/1340ca68-173a23d6646-0004-5cb9-006-28284.mp4',
            material: ['http://xzimg.hoge.cn/xiuzan/1604470463616/D7D8BCC5-11E3-4423-BC68-58B5B25C996C.png']
          }, {
            title: '工业利润降幅收窄，外资率先转正各手 机浏览器将设总编辑负责制',
            source: '腾讯新闻',
            date: '11-02',
            ratio: '4:3',
            is_open_link: 1,
            link_url: 'http://www.baidu.com',
            video_url: 'http://outin-a03b512cf3cc11e8acdb00163e1c35d5.oss-cn-shanghai.aliyuncs.com/customerTrans/203182cc86928effd06b285f5532153f/1340ca68-173a23d6646-0004-5cb9-006-28284.mp4',
            material: ['http://xzimg.hoge.cn/xiuzan/1604054762387/20201030172103.jpg']
          }, {
            title: '工业利润降幅收窄，外资率先转正各手 机浏览器将设总编辑负责制',
            source: '腾讯新闻',
            date: '11-02',
            ratio: '4:3',
            is_open_link: 1,
            link_url: 'http://www.baidu.com',
            video_url: 'http://outin-a03b512cf3cc11e8acdb00163e1c35d5.oss-cn-shanghai.aliyuncs.com/customerTrans/203182cc86928effd06b285f5532153f/1340ca68-173a23d6646-0004-5cb9-006-28284.mp4',
            material: ['http://xzimg.hoge.cn/xiuzan/1599470339737/最美的花.png']
          }]
        }, {
          id: '7',
          mark: 'gallery1',
          data: [{
            ratio: '4:3',
            title: '各手机浏览器将设总编',
            source: '腾讯新闻',
            date: '11-02',
            is_open_link: 1,
            link_url: 'http://www.baidu.com',
            material: [
              'http://xzimg.hoge.cn/xiuzan/1604470463616/D7D8BCC5-11E3-4423-BC68-58B5B25C996C.png',
              'http://xzimg.hoge.cn/xiuzan/1604054762387/20201030172103.jpg',
              'http://xzimg.hoge.cn/xiuzan/1599470339737/最美的花.png'
            ]
          }, {
            ratio: '4:3',
            title: '特斯拉季度利润创纪录',
            source: '腾讯新闻',
            date: '11-02',
            is_open_link: 1,
            link_url: 'http://www.baidu.com',
            material: [
              'http://xzimg.hoge.cn/xiuzan/1604054762387/20201030172103.jpg',
              'http://xzimg.hoge.cn/xiuzan/1599470339737/最美的花.png'
            ]
          }, {
            ratio: '4:3',
            title: '工业利润降幅收窄，外资率先转正各手 机浏览器将设总编辑负责制',
            source: '腾讯新闻',
            date: '11-02',
            is_open_link: 1,
            link_url: 'http://www.baidu.com',
            material: [
              'http://xzimg.hoge.cn/xiuzan/1599470339737/最美的花.png',
              'http://xzimg.hoge.cn/xiuzan/1604054762387/20201030172103.jpg'
            ]
          }]
        }],
        share_settings: {
          brief: '分享设置早新闻简介早新闻简介',
          indexpic: 'http://xzimg.hoge.cn/xiuzan/1599470131011/二维码2.png',
          title: '2020年早新闻',
          link: null
        }
      }
      this.loading = false
      this.themeName = res.theme_name
      this.newsInfo = res
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
    },
    initPages (res) {
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
        shareLink = local.origin + '/newstart/' + id
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
    }
  }
}
</script>

<style lang="scss">
  .news-start-wrap {
    &.normal-bg, .normal-bg {
      background-size: 100% 100%;
      background-image: url('~@/assets/news/normal-bg.png');
    }
    .mint-loadmore-text {
      color: #999;
    }
  }
</style>
