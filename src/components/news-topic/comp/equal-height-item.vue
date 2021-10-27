<template>
  <div class='equal-height-wrap'>
    <div class='img-font-wrap'>
      <div class='img-font-header'>
        <div>
          <span></span>
          <span>{{title}}</span>
        </div>
        <img :src="arrIcon" alt="" class='arr-img-wrap'>
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
      title: '',
      arrIcon: '',
      worksList: []
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
    initData (data) {
      this.title = data.title
      this.arrIcon = data.poster
      // console.log('data', data)
      this.worksList = []
      this.worksList = data.data
    }
  }
}
</script>

<style lang='scss' scoped>
  @import "@/styles/index.scss";
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
</style>
