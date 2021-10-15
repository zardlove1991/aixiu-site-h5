<template>
<div class='info-card-list'>
  <!-- 标准列表-混合样式 -->
  <div v-if='columnTypeValue === 1' class='standard-style'>
    <div class='img-font-header'>
      <div>
        <span></span>
        <span>{{title}}</span>
      </div>
      <div>
        <img :src="arrIcon" alt="" class='arr-img-wrap'>
      </div>
    </div>
    <div v-for='(item, index) in worksList' :key='index'>
      <div v-if='item[0] !== undefined' class='column-1 base-box-style'>
        <div class='column-left'>
          <div>{{item[0].title}}</div>
          <div>
            <span>{{item[0].source}}</span>
            <span>2小时前</span>
            <span>94评</span>
          </div>
        </div>
        <div class='column-right'>
          <img :src="mgURL" alt="">
          <span>16:27</span>
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
          <span>2小时前</span>
          <span>94评</span>
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
            <span>7小时前</span>
            <span>94评</span>
          </div>
        </div>
      </div>
      <div v-if='item[3] !== undefined' class='column-4 base-box-style'>
        <div>{{item[3].title}}</div>
        <div>
          <span>{{item[3].source}}</span>
          <span>7小时前</span>
          <span>94评</span>
        </div>
      </div>
    </div>
  </div>

  <!-- 等高样式-上图下文字 -->
  <div v-if='columnTypeValue === 2' class='img-font-wrap'>
    <div class='img-font-header'>
      <div>
        <span></span>
        <span>{{title}}</span>
      </div>
      <div>
        <img :src="arrIcon" alt="" class='arr-img-wrap'>
      </div>
    </div>
    <div class='imgfont-list-wrap'>
      <div v-for='(item, index) in infoList' :key='index' class='imgfont-info-list'>
        <div>
          <img src="" alt="">
        </div>
        <div>苹果卡内基图书馆获美国建筑，奖馆内开设</div>
        <div>网易新闻 2小时前</div>
      </div>
    </div>
  </div>

  <!-- 卡片样式-文字在图上 -->
  <div v-if='columnTypeValue === 3' class='card-font-img'>
    <div class='card-font-header'>
      <div>
        <img src="" alt="">
        <div>媒体关注</div>
      </div>
      <div>全部</div>
    </div>
    <div class='ctx-img-wrap'>
      <img src="" alt="">
      <div class='ctx-img-info'>
        <div>苹果卡内基图书馆获美国建筑奖馆内开设</div>
        <div>网易新闻 2小时前</div>
      </div>
      <div class='ctx-detail-wrap'>
        <div>
          <div>卡内基图书馆随后也正式更名为苹果卡内基图书馆</div>
          <div>网易新闻 3小时前</div>
        </div>
        <div>
          <img src="" alt="">
        </div>
      </div>
      <div class='ctx-more-num'>
        <span>剩余3篇</span>
        <span></span>
      </div>
    </div>
  </div>

</div>
</template>

<script>
export default {
  props: {
    infoDetail: {
      type: Object,
      default: () => {}
    },
    changeChildListObj: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    infoDetail: {
      handler (newData, oldData) {
        this.initRender(newData)
      },
      deep: true
    },
    changeChildListObj: {
      handler (newData, oldData) {
        this.reRenderList(newData)
      },
      deep: true
    }
  },
  data () {
    return {
      infoList: [],
      mgURL: require('@/assets/news/normal-bg.png'),
      arrIcon: require('@/assets/news-topic/arr.png'),
      columnTypeValue: 1,
      worksList: [],
      informationContentData: [],
      title: ''
    }
  },
  methods: {
    initRender (data) {
      // 如果全局选中使用全局的布局, 没有选中使用自己定义的布局
      this.columnTypeValue = data.limit.column_set.all_column_display
      if (this.columnTypeValue !== 1) {
        this.columnTypeValue = data.limit.column_set.column_list[0].columnDisplay
      }
      // console.log('this.columnTypeValue', data.limit.column_set.column_list[0].columnDisplay)

      // 默认获取第一个
      this.informationContentData = data.information_content_data
      this.worksList = []
      this.worksList = this.informationContentData[0].data
      this.title = this.informationContentData[0].title

      if (this.columnTypeValue === 1) {
        this.blendData(this.informationContentData[0].data)
      }
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
      console.log('this.worksList', this.worksList)
    },
    reRenderList (data) {
      let _data = data.data
      this.blendData(_data)
    }
  }
}
</script>

<style lang='scss' scoped>
  @import "@/styles/index.scss";

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
    justify-content: space-between;
    align-items: center;
    background: #fbfbfb;
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

.info-card-list{
  margin-bottom: px2rem(30px);
  margin-top: px2rem(30px);
  padding: 0 px2rem(20px);
  background: #fbfbfb;
  .img-font-wrap{
    background: #fbfbfb;
    .imgfont-list-wrap{
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
    }

    .imgfont-info-list{
      width: px2rem(370px);
      background: #ffffff;
      &>div:nth-child(1) {
        width: px2rem(370px);
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
}

.card-font-img{
  margin: 0 px2rem(30px);
  width: px2rem(690px);
  border-radius: px2rem(16px);
  box-shadow: 0px 4px 14px 2px rgba(0,0,0,0.04);
  padding: px2rem(20px) px2rem(30px);
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
  height: px2rem(302px);
  position: relative;
  .ctx-img-info{
    position: absolute;
    bottom: px2rem(30px);
    left: px2rem(30px);
    &>div:nth-child(1){
      color: #ffffff;
      mix-blend-mode: difference;
      font-size: px2rem(32px);
      font-weight: 500;
    }

    &>div:nth-child(2) {
      color: #ffffff;
      font-size: px2rem(24px);
      mix-blend-mode: difference;
    }
  }
}

.ctx-detail-wrap{
  display: flex;
  flex-direction: row;
  border-bottom: 1px solid #eeeeee;
  padding-bottom: px2rem(20px);
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
  }
}

.arr-img-wrap{
  width: px2rem(17px);
  height: px2rem(30px);
}

.ctx-more-num{
  color: #D90000;
  padding: px2rem(20px) 0;
}
</style>
