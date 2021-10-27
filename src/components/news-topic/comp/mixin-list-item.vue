<template>
<div class='mixin-list-wrap'>
  <div class='standard-style'>
    <div class='img-font-header'>
      <div>
        <span></span>
        <span>{{title}}</span>
      </div>
      <img :src="arrIcon" alt=""  class='arr-img-wrap'>
    </div>
    <div v-for='(item, index) in worksList' :key='index'>
      <div v-if='item[0] !== undefined' class='column-1 base-box-style'>
        <div class='column-left'>
          <div>{{item[0].title}}</div>
          <div>
            <span>{{item[0].source}}</span>
          </div>
        </div>
        <div class='column-right'>
          <img :src="imgRender(item[0])" alt="">
          <span v-if='item[0].type === "video"'>00:00</span>
        </div>
      </div>
      <div v-if='item[1] !== undefined' class='column-2 base-box-style'>
        <div>{{item[1].title}}</div>
        <div v-if='Array.isArray(item[1].material)' class='coloumn-2-2'>
          <img v-for='(item, index) in item[1].material'
            :key='index' :src="item" alt="" class='img-wrap'>
        </div>
        <div class='coloumn-2-3'>
          <span>{{item[1].source}}</span>
        </div>
      </div>
      <div v-if='item[2] !== undefined' class='column-3 base-box-style'>
        <div v-if='Array.isArray(item[2].material) && item[2].material.length !== 0' class='column-3-left'>
          <img :src="item[2].material[0]" alt=""/>
          <span>{{item[2].material.length}}图</span>
        </div>
        <div class='column-3-right'>
          <div>{{item[2].title}}</div>
          <div>
            <span>{{item[2].source}}</span>
          </div>
        </div>
      </div>
      <div v-if='item[3] !== undefined' class='column-4 base-box-style'>
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
</div>
</template>

<script>
import ReturnBtn from './return-btn.vue'
export default {
  data () {
    return {
      worksList: [],
      title: '',
      mgURL: require('@/assets/news-topic/null-img.png'),
      arrIcon: require('@/assets/news-topic/arr.png'),
      curItemObj: {}
    }
  },
  components: {
    ReturnBtn
  },
  props: {
    itemObj: {
      type: Object,
      default: () => {}
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
      this.blendData(data.data)
    },
    blendData (data) {
      // 每4个元素组装成一个单位
      let itemArr = []
      this.worksList = []
      for (let i = 0; i < data.length; i++) {
        itemArr.push(data[i])
        if ((i + 1) % 4 === 0) {
          this.worksList.push(itemArr)
          itemArr = []
        }
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

.return-home-page{
  position: fixed;
  left: 0;
  bottom: px2rem(100px);
}
</style>
