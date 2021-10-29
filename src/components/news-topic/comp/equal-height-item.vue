<template>
  <div class='equal-height-wrap'>
    <div class='img-font-wrap'>
      <div class='img-font-header'>
        <div>
          <span></span>
          <span class='header-title'>{{title}}</span>
        </div>
        <img v-if='isMobileHeaderIconType && arrIcon !== ""' :src="arrIcon" alt="" class='arr-img-wrap'>
      </div>
      <div class='imgfont-list-wrap'>
        <div v-for='(item, index) in worksList' :key='index'
          @click='jumpLinkFun(item)'
          class='imgfont-info-list'>
          <div>
            <img @click.stop='showVideDialog(item)'
              :src="imgRender(item)" alt="">
          </div>
          <div>{{item.title}}</div>
          <div>
            <span>{{item.source}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class='return-home-page'>
      <ReturnBtn></ReturnBtn>
    </div>

    <!-- 视频弹层 -->
    <van-popup v-model="videoShowType">
      <div class='video-popup-wrap'>
        <myVideo :poster="curVideoPoster" :src="curVideoUrl"></myVideo>
      </div>
    </van-popup>
  </div>
</template>

<script>
import myVideo from '@/components/depence/video.vue'
import ReturnBtn from './return-btn.vue'
import { Toast } from 'mint-ui'
import { ImagePreview } from 'vant'
import { getPlat, setBrowserTitle } from '@/utils/utils'
export default {
  data () {
    return {
      mgURL: require('@/assets/news-topic/null-img.png'),
      title: '',
      arrIcon: '',
      worksList: [],
      videoShowType: false,
      curVideoPoster: '',
      curVideoUrl: '',
      columnPoster: ''
    }
  },
  components: {
    ReturnBtn,
    myVideo
  },
  props: {
    itemObj: {
      type: Object,
      default: () => {}
    },
    isMobileHeaderIconType: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    itemObj: {
      handler (newData, oldData) {
        this.curItemObj = newData
        this.initData(this.curItemObj)
      },
      deep: true,
      immediate: true
    }
  },
  mounted () {
    console.log('this.isMobileHeaderIconType', this.isMobileHeaderIconType)
  },
  methods: {
    showVideDialog (data) {
      if (data.type === 'video') {
        if (data.videoLink !== undefined && data.videoLink !== '') {
          this.videoShowType = true
          this.curVideoUrl = data.videoLink
          // 默认获取第一张
          if (data.imgList.length > 0) {
            this.curVideoPoster = data.imgList[0].host + data.imgList[0].filename
          } else {
            this.curVideoPoster = ''
          }
          return false
        } else {
          // 视频类型没有视频可以查看图片
          this.preImg(data)
        }
      } else {
        this.preImg(data)
      }
    },
    preImg (data) {
      let _images = []
      for (let i of data.imgList) {
        _images.push(i.host + i.filename)
      }
      ImagePreview({
        images: _images,
        closeable: true
      })
    },
    jumpLinkFun (data) {
      try {
        if (data.link === '') {
          if (data.imgList.length > 0) {
            this.preImg(data)
          }
          return false
        }
        if (data.dataOrigin === 'local' || data.dataOrigin === 'custom') {
          // 基础元数据
          window.open(data.link, '_self')
        } else if (data.dataOrigin === 'ctxLib') {
          // 来自内容库
          let plat = getPlat()
          if (plat === 'smartcity') {
            window.SmartCity.linkTo(data.link)
          } else {
            window.open(data.link, '_self')
          }
        }
      } catch (e) {
        Toast('地址无效，调转失败')
        console.log('e', e)
      }
    },
    initData (data) {
      this.title = data.title
      this.arrIcon = data.poster
      this.worksList = []
      this.worksList = data.data

      // 设置title
      setBrowserTitle(data.title)
    },
    imgRender (data) {
      if (data.imgList !== undefined && data.imgList.length > 0) {
        if (data.imgList[0].filename === '') {
          return data.imgList[0].host
        } else {
          return data.imgList[0].host + data.imgList[0].filename
        }
      } else {
        return this.mgURL
      }
    }
  }
}
</script>

<style lang='scss' scoped>
  @import "@/styles/index.scss";
  .video-popup-wrap{
    width: 80vw;
    height: px2rem(400px);
  }
  .equal-height-wrap{
    .img-font-wrap{
      background: #fbfbfb;
      .imgfont-list-wrap{
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;

        &>div:nth-child(2n) {
          margin-left: px2rem(10px);
        }
      }

      .imgfont-info-list{
        width: px2rem(355px);
        background: #ffffff;
        padding: 0 px2rem(20px);

        &>div:nth-child(1) {
          width: px2rem(350px);
          height: px2rem(208px);
        }

        &>div:nth-child(2) {
          color: #333333;
          font-size: px2rem(32px);
          padding: px2rem(20px);
        }

        &>div:nth-child(3) {
          color: #999999;
          font-size: px2rem(24px);
          padding: 0 px2rem(20px) px2rem(20px);
        }
      }
    }

    .img-font-header{
      display: flex;
      align-items: center;
      width: px2rem(710px);
      padding: px2rem(20px) px2rem(20px);
      &>div:nth-child(1){
        &>span:nth-child(1) {
          display: inline-block;
          width: px2rem(5px);
          height: px2rem(32px);
          border-radius: px2rem(6px);
          background: #D90000;
          vertical-align: middle;
        }

        .header-title {
          display: inline-block;
          font-weight: 500;
          color: #333333;
          font-size: px2rem(32px);
          line-height: px2rem(48px);
          vertical-align: middle;
          margin-left: px2rem(10px);
        }
      }
    }
  }

  .arr-img-wrap{
    width: px2rem(35px);
    height: px2rem(35px);
    margin-left: px2rem(10px);
  }

  .return-home-page{
    position: fixed;
    left: 0;
    bottom: px2rem(100px);
  }

  .header-icon-img{
    width: px2rem(40px);
    height: px2rem(40px);
    border-radius: px2rem(20px);
    margin-left: px2rem(10px);
  }
</style>
