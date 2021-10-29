<template>
<div class='card-list-item-wrap'>
  <div class='card-font-img'>
    <div class='card-font-header'>
      <div>
        <img v-if='isMobileHeaderIconType && columnPoster!== ""' :src="columnPoster" alt="">
        <div>{{title}}</div>
      </div>
    </div>
    <div class='ctx-img-wrap'>
      <div class='ctx-img-m'  @click='jumpLinkFun(firstWorksArr[0])'>
        <img @click.stop='showVideDialog(firstWorksArr[0])' :src="firstWorksArr[0].material[0]" alt="">
        <div class='ctx-img-info'>
          <div>{{firstWorksArr[0].title}}</div>
          <div>{{firstWorksArr[0].source}}</div>
        </div>
      </div>
      <template v-for='(item, index) in remainData'>
        <div :key='index' @click='jumpLinkFun(item)' v-if='index <= pointIndex'
          class='ctx-detail-wrap'>
          <div>
            <div>{{item.title}}</div>
            <div>{{item.source}}</div>
          </div>
          <div>
            <img @click.stop='showVideDialog(item)' :src="imgRender(item)" alt="">
          </div>
        </div>
      </template>
      <div v-if='remainNum > 0' class='ctx-more-num' @click='showRemain'>
        <span>剩余{{remainNumTitle}}篇</span>
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
      remainNumTitle: 0,
      mgURL: require('@/assets/news-topic/null-img.png'),
      columnPoster: '',
      firstWorksArr: [],
      remainData: [],
      pointIndex: 0,
      remainNum: 0,
      curItemObj: {},
      arrIcon: '',
      videoShowType: false,
      curVideoPoster: '',
      curVideoUrl: ''
    }
  },
  props: {
    itemObj: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    ReturnBtn,
    myVideo
  },
  watch: {
    itemObj: {
      handler (newData, oldData) {
        this.curItemObj = newData
        this.initData(this.curItemObj)
      },
      deep: true,
      immediate: true
    },
    isMobileHeaderIconType: {
      type: Boolean,
      default: true
    }
  },
  mounted () {

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
    showRemain () {
      if (this.pointIndex === 0) {
        this.pointIndex = this.remainData.length
        this.remainNumTitle = 0
      } else {
        this.pointIndex = 0
        this.remainNumTitle = this.remainData.length - 1
      }
    },
    initData (value) {
      let data = JSON.parse(JSON.stringify(value))
      this.title = data.title
      this.columnPoster = data.poster

      let _data = data.data
      this.remainNum = _data.length - 2
      this.remainNumTitle = this.remainNum
      this.firstWorksArr = []
      this.firstWorksArr = _data.splice(0, 1)
      this.remainData = []
      this.remainData = _data
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
.card-list-item-wrap{
  position: relative;
  .card-font-img{
    width: px2rem(730px);
    border-radius: px2rem(16px);
    box-shadow: 0px 4px 14px 2px rgba(0,0,0,0.04);
    padding: px2rem(20px) px2rem(30px);
    margin: 0 auto;
    // margin-top: px2rem(260px);

  .card-font-header{
    height: px2rem(92px);
    display: flex;
    justify-content: space-between;
    align-items: center;
    &>div:nth-of-type(1) {
      display: flex;
      flex-direction: row;
      font-size: px2rem(32px);
      font-weight: 500;
      &>img:nth-of-type(1){
        width: px2rem(50px);
        height: px2rem(50px);
        border-radius: px2rem(25px);
        margin-right: px2rem(20px);
      }
    }
    &>div:nth-of-type(2) {
      color: #999999;
      font-size: px2rem(26px);
    }
  }
}

.ctx-img-wrap{
  .ctx-img-m{
    position: relative;
    height: px2rem(302px);
  }
  .ctx-img-info{
    position: absolute;
    bottom: px2rem(20px);
    left: px2rem(30px);
    &>div:nth-child(1){
      // color: #ffffff;
      // mix-blend-mode: difference;
      font-size: px2rem(32px);
      font-weight: 500;
    }

    &>div:nth-child(2) {
      // color: #ffffff;
      font-size: px2rem(24px);
      // mix-blend-mode: difference;
    }
  }
}

.ctx-detail-wrap{
  display: flex;
  flex-direction: row;
  border-bottom: 1px solid #eeeeee;
  padding-bottom: px2rem(20px);
  margin-top: px2rem(20px);
  &>div:nth-child(1) {
    flex: 1;
    &>div:nth-child(1){
      font-size: px2rem(32px);
      color: #333333;
    }
    &>div:nth-child(2){
      color: #999999;
      font-size: px2rem(24px);
      margin-top: px2rem(20px);
    }
  }

  &>div:nth-child(2) {
    width: px2rem(216px);
    &>img{
      border-radius: px2rem(8px);
    }
  }
}

.ctx-more-num{
  color: #D90000;
  padding: px2rem(20px) 0;
}

}

.return-home-page{
  position: fixed;
  left: 0;
  bottom: px2rem(100px);
}

  .video-popup-wrap{
    width: 80vw;
    height: px2rem(400px);
  }
</style>
