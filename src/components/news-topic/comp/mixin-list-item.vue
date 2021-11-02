<template>
<div class='mixin-list-wrap'>
  <div class='standard-style'>
    <div class='img-font-header'>
      <div>
        <span></span>
        <span>{{title}}</span>
      </div>
      <img v-if='isMobileHeaderIconType && arrIcon !== ""'
        :src="arrIcon" alt=""  class='arr-img-wrap'/>
    </div>
    <div v-for='(item, index) in worksList' :key='index' class='all-works-list'>
      <div v-if='item[0] !== undefined'
        @click='jumpLinkFun(item[0])'
        class='column-1 base-box-style'>
        <div class='column-left'>
          <div>{{item[0].title}}</div>
          <div>
            <span>{{item[0].source}}</span>
          </div>
        </div>
        <div class='column-right'>
          <img :src="imgRender(item[0])" alt=""  @click.stop='showVideDialog(item[0])'>
          <span v-if='item[0].type === "video"'>00:00</span>
          <span v-if='item[0].type !== "video" && item[0].imgList.length > 0'>{{item[0].imgList.length}}图</span>
        </div>
      </div>
      <div v-if='item[1] !== undefined'
        @click='jumpLinkFun(item[1])'
        class='column-2 base-box-style'>
        <div>{{item[1].title}}</div>
        <div v-if='Array.isArray(item[1].imgList)'
          @click.stop='showVideDialog(item[1])'
          class='coloumn-2-2'>
          <template v-for='(item, index) in item[1].imgList'>
            <img v-if='index <= 2'
            :key='index' :src="item.host + item.filename" alt="" class='img-wrap'>
          </template>
        </div>
        <div class='coloumn-2-3'>
          <span>{{item[1].source}}</span>
        </div>
      </div>
      <div v-if='item[2] !== undefined'
        @click='jumpLinkFun(item[2])'
        class='column-3 base-box-style'>
        <div v-if='Array.isArray(item[2].imgList) && item[2].imgList.length !== 0' class='column-3-left'>
          <img @click.stop='showVideDialog(item[2])'
          :src="item[2].imgList[0].host + item[2].imgList[0].filename" alt=""/>
          <span>{{item[2].imgList.length}}图</span>
        </div>
        <div class='column-3-right'>
          <div>{{item[2].title}}</div>
          <div>
            <span>{{item[2].source}}</span>
          </div>
        </div>
      </div>
      <div v-if='item[3] !== undefined'  @click='jumpLinkFun(item[3])' class='column-4 base-box-style'>
        <div>{{item[3].title}}</div>
        <div>
          <span>{{item[3].source}}</span>
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
      videoShowType: false,
      worksList: [],
      title: '',
      mgURL: require('@/assets/news-topic/null-img.png'),
      arrIcon: require('@/assets/news-topic/arr.png'),
      curItemObj: {},
      curVideoPoster: '',
      curVideoUrl: ''
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
    },
    initData (data) {
      this.title = data.title
      this.arrIcon = data.poster
      // 设置title
      setBrowserTitle(data.title)
      this.blendData(data.data)
    },
    blendData (data) {
      // 每4个元素组装成一个单位
      let loopNum = Math.ceil(data.length / 4)
      for (let i = 0; i < loopNum; i++) {
        this.worksList.push(data.splice(0, 4))
      }
    }
  }
}
</script>

<style lang='scss' scoped>
  @import "@/styles/index.scss";
.mixin-list-wrap{
  padding: 0 px2rem(20px);
  .arr-img-wrap{
    margin-left: px2rem(10px);
    width: px2rem(35px);
    height: px2rem(35px);
  }
  .standard-style{
    width: px2rem(710px);
    .base-box-style {
      padding: px2rem(24px);
      background: #ffffff;
      border-radius: px2rem(12px);
      box-shadow: 0px 4px px2rem(14px) px2rem(2px) rgba(0,0,0,0.04);
    }
    .base-box-style + .base-box-style{
      margin-top: px2rem(30px);
    }
    .column-1{
      display: flex;
      justify-content: space-between;
      .column-left{
        &>div:nth-child(1) {
          font-size: px2rem(32px);
          color: #333333;
        }
        &>div:nth-child(2) {
          font-size: px2rem(24px);
          color: #999999;
          margin-top: px2rem(20px);
          &>span:nth-child(2) {
            margin: 0 px2rem(10px);
          }
        }
      }
      .column-right{
        width: px2rem(216px);
        margin-left: px2rem(30px);
        position: relative;
        &>img{
          width: px2rem(216px);
          height: px2rem(162px);
          border-radius: px2rem(8px);
        }

        &>span{
          position: absolute;
          bottom: px2rem(19px);
          right: px2rem(19px);
          display: inline-block;
          width: px2rem(76px);
          height: px2rem(34px);
          line-height: px2rem(34px);
          border-radius: px2rem(17px);
          text-align: center;
          position: absolute;
          color: #ffffff;
          background: rgba(0, 0 , 0, .7);
          font-size: px2rem(22px);
        }
      }
    }
    .column-2 {
      &>div:nth-child(1) {
        color: #333333;
        font-size: px2rem(32px);
      }
      .coloumn-2-2{
        margin-top: px2rem(20px);
        display: flex;
        justify-content: flex-start;
        flex-direction: row;
        .img-wrap{
          width: px2rem(216px);
          height: px2rem(162px);
          border-radius: px2rem(8px);
        }
        .img-wrap + .img-wrap{
          margin-left: px2rem(7px);
        }
      }

      .coloumn-2-3{
        margin-top: px2rem(20px);
        color: #999999;
        font-size: px2rem(24px);
        &>span:nth-child(2) {
          margin: 0 px2rem(10px);
        }
      }
    }

    .column-3{
      display: flex;
      justify-content: flex-start;
      .column-3-left {
        width: px2rem(216px);
        margin-right: px2rem(26px);
        position: relative;
        &>img:nth-of-type(1) {
          width: px2rem(216px);
          height: px2rem(162px);
          vertical-align: middle;
          border-radius: px2rem(8px);
        }

        &>span:nth-of-type(1) {
          position: absolute;
          bottom: px2rem(14px);
          right: px2rem(14px);
          display: inline-block;
          width: px2rem(64px);
          height: px2rem(34px);
          line-height: px2rem(34px);
          text-align: center;
          border-radius: px2rem(17px);
          color: #FFFFFF;
          background: rgba(0, 0, 0, 0.7);
          font-size: px2rem(22px);
        }
      }

      .column-3-right{
        &>div:nth-child(1) {
          font-size: px2rem(32px);
          color: #333333;
        }

        &>div:nth-child(2) {
          margin-top: px2rem(20px);
          color: #999999;
          font-size: px2rem(24px);
          &>span:nth-child(2) {
            margin: 0 px2rem(10px);
          }
        }
      }
    }

    .column-4{
      &>div:nth-child(1) {
        color: #333333;
        font-size: px2rem(32px);
      }

      &>div:nth-child(2) {
        margin-top: px2rem(20px);
        color: #999999;
        font-size: px2rem(24px);
        &>span:nth-child(2) {
          margin: 0 px2rem(10px);
        }
      }
    }
  }

  .img-font-header{
    display: flex;
    // justify-content: space-between;
    align-items: center;
    // background: #fbfbfb;
    width: px2rem(710px);
    margin: px2rem(20px) 0;
    &>div:nth-child(1){
      &>span:nth-child(1) {
        display: inline-block;
        width: px2rem(5px);
        height: px2rem(32px);
        border-radius: px2rem(6px);
        background: #D90000;
        vertical-align: middle;
      }
      &>span:nth-child(2) {
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

  .all-works-list{
    margin-bottom: px2rem(30px);
  }

  .video-popup-wrap{
    width: 80vw;
    height: px2rem(400px);
  }

.return-home-page{
  position: fixed;
  left: 0;
  bottom: px2rem(100px);
}
</style>
