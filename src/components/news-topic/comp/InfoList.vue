<template>
<div class='info-card-list'>
  <!-- 标准列表-混合样式 -->
  <div v-if='columnTypeValue === 1' class='standard-style'>
    <div class='img-font-header'>
      <div>
        <span></span>
        <span>{{title}}</span>
      </div>
      <img @click='goMixinList' :src="arrIcon" alt="" class='arr-img-wrap'>
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
          <img :src="mgURL" alt="">
          <span>00:00</span>
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

  <!-- 等高样式-上图下文字 -->
  <div v-if='columnTypeValue === 2' class='img-font-wrap'>
    <div class='img-font-header'>
      <div>
        <span></span>
        <span>{{title}}</span>
      </div>
      <img :src="arrIcon" @click='goEqualHeight' alt="" class='arr-img-wrap'>
    </div>
    <div class='imgfont-list-wrap'>
      <div v-for='(item, index) in worksList' :key='index' class='imgfont-info-list'>
        <div>
          <img :src="item.material[0]" alt="">
        </div>
        <div>{{item.title}}</div>
        <div>
          <span>{{item.source}}</span>
        </div>
      </div>
    </div>
  </div>

  <!-- 卡片样式-文字在图上 -->
  <div v-if='columnTypeValue === 3' class='card-font-img'>
    <div class='card-font-header'>
      <div>
        <img :src="columnPoster" alt="">
        <div>{{title}}</div>
      </div>
      <div @click='goCardStyle'>全部</div>
    </div>
    <div class='ctx-img-wrap'>
      <div class='ctx-img-m'>
        <img :src="firstWorksArr[0].material[0]" alt="">
        <div class='ctx-img-info'>
          <div>{{firstWorksArr[0].title}}</div>
          <div>{{firstWorksArr[0].source}}</div>
        </div>
      </div>

      <template v-for='(item, index) in remainData'>
        <div :key='index'  v-if='index <= pointIndex'
          class='ctx-detail-wrap'>
          <div>
            <div>{{item.title}}</div>
            <div>{{item.source}}</div>
          </div>
          <div>
            <img :src="item.material[0]" alt="">
          </div>
        </div>
      </template>
      <div v-if='remainNum > 0' class='ctx-more-num' @click='showRemain'>
        <span>剩余{{remainNum}}篇</span>
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
        console.log('changeChildListObj', newData)
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
      title: '',
      columnPoster: '',
      remainNum: 0,
      firstWorksArr: [],
      remainData: [],
      pointIndex: 0
    }
  },
  methods: {
    goMixinList () {
      this.$router.push({name: 'mobile-topic-mixinlist'})
    },
    goEqualHeight () {
      this.$router.push({name: 'mobile-equal-height'})
    },
    goCardStyle () {
      this.$router.push({name: 'mobile-card-list'})
    },
    initRender (data) {
      // 如果全局选中使用全局的布局, 没有选中使用自己定义的布局
      this.columnTypeValue = data.limit.column_set.all_column_display
      if (this.columnTypeValue !== 1) {
        this.columnTypeValue = data.limit.column_set.column_list[0].columnDisplay
      }

      // 默认获取第一个
      this.informationContentData = data.information_content_data
      this.worksList = []
      this.worksList = this.informationContentData[0].data
      this.title = this.informationContentData[0].title
      this.columnPoster = this.informationContentData[0].poster

      this.reRenderList(this.informationContentData[0])
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
    },
    reRenderList (data) {
      let _data = JSON.parse(JSON.stringify(data.data))
      console.log('999', _data)
      if (this.columnTypeValue === 1) {
        this.blendData(_data)
      } else if (this.columnTypeValue === 2) {
        this.worksList = _data
      } else if (this.columnTypeValue === 3) {
        this.remainNum = _data.length - 2
        this.firstWorksArr = []
        this.firstWorksArr = _data.splice(0, 1)
        this.remainData = []
        this.remainData = _data
      }
    },
    showRemain () {
      if (this.pointIndex === 0) {
        this.pointIndex = this.remainData.length
      } else {
        this.pointIndex = 0
      }
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
    width: px2rem(750px);
    padding: px2rem(20px);
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
  // padding: 0 px2rem(20px);
  // background: #fbfbfb;
  .img-font-wrap{
    background: #fbfbfb;
    .imgfont-list-wrap{
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      padding: 0 px2rem(20px);
      &>div:nth-child(2n) {
        margin-left: px2rem(10px);
      }
    }

    .imgfont-info-list{
      width: px2rem(350px);
      background: #ffffff;

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
}

.card-font-img{
  width: px2rem(730px);
  border-radius: px2rem(16px);
  box-shadow: 0px 4px 14px 2px rgba(0,0,0,0.04);
  padding: px2rem(20px) px2rem(30px);
  margin: 0 auto;

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

.ctx-img-m{
  height: px2rem(302px);
  position: relative;
}

.ctx-img-wrap{
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

.arr-img-wrap{
  width: px2rem(17px);
  height: px2rem(30px);
}
.ctx-more-num{
  color: #D90000;
  padding: px2rem(20px) 0;
}
</style>
