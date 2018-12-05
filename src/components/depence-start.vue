<template lang="html">
  <!--当前开始考试页面-->
  <div class="depence-start-wrap" v-if="examInfo">
    <!--头部背景 暂时没有先注释掉-->
    <div class="header-wrap">
      <!-- <img :src="" class="bg" /> -->
    </div>
    <!--主体展示部分-->
    <div class="content-wrap">
      <div class="content">
        <!--头部-->
        <div class="header-desc">
          <!-- <img :src="testImgUrl" alt="" class="avater"> -->
          <span class="title">{{examInfo.title}}</span>
        </div>
        <div class="body-wrap">
          <!--信息展示-->
          <div class="row">
            <span class="title">试题数量</span>
            <span class="desc">{{`${examInfo.question_num}题, 总计${examInfo.total_score}分`}}</span>
          </div>
          <div class="row">
            <span class="title">考试时间</span>
            <span class="desc">{{`${examInfo.limit_time}分钟`}}</span>
          </div>
          <div class="row">
            <span class="title">考试难度</span>
            <div class="desc-wrap">
              <i class="star" :class='{active: index <= _getStarNum(examInfo.level)}' v-for="(val,index) in 5" :key='index'></i>
            </div>
          </div>
          <div class="row">
            <span class="title">辅导老师</span>
            <span class="desc">{{examInfo.builder || '暂无'}}</span>
          </div>
          <div class="row">
            <span class="title">考试次数</span>
            <span class="desc">{{examInfo.restart ? '不限' : '1次'}}</span>
          </div>
        </div>
        <!--底部-->
        <div class="footer-brief" v-show="examInfo.brief">{{examInfo.brief}}</div>
      </div>
    </div>
    <!--底部按钮-->
    <button class="start-exambtn" @click.stop="goExamPage">开始测验</button>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { setBrowserTitle } from '@/utils/utils'

export default {
  props: {
    id: String
  },
  data () {
    return {
      testImgUrl: 'https://images3.alphacoders.com/825/825213.png',
      starMap: {
        easy: 0,
        middle: 2,
        hard: 4
      }
    }
  },
  computed: {
    ...mapGetters('depence', ['examInfo'])
  },
  created () {
    this.initStartInfo()
  },
  methods: {
    async initStartInfo () {
      let examId = this.id
      try {
        await this.getExamDetail({id: examId})
        // 设置标题
        setBrowserTitle(this.examInfo.title)
      } catch (err) {
        console.log(err)
      }
    },
    goExamPage () {
      let examId = this.id
      // 去往查看考试概况页面
      this.$router.push({
        path: `/depencelist/${examId}`,
        query: { rtp: 'exam' }
      })
    },
    _getStarNum (level) {
      let starMap = this.starMap
      let curLevel = starMap[level] || -1
      return curLevel
    },
    ...mapActions('depence', {
      getExamDetail: 'GET_EXAM_DETAIL'
    })
  }
}
</script>

<style lang="scss">
@import "@/styles/index.scss";

.depence-start-wrap{
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100vh;
  .header-wrap{
    width: 100%;
    height: px2rem(332px);
    overflow: hidden;
    @include bg-color('themeColor');
    .bg{
      width: 100%;
      height: 100%;
      object-fit: cover;
      filter: blur(2px);
    }
  }
  .content-wrap{
    position: relative;
    flex:1;
    width: 100%;
    @include bg-color('tipBgColor');
    .content{
      position: absolute;
      top: px2rem(-176px);
      right: px2rem(30px);
      left:px2rem(30px);
      bottom: px2rem(30px);
      padding: 0 px2rem(50px);
      border-radius:px2rem(6px);
      box-shadow: 0 0 px2rem(10px) rgba(180, 180, 180, 0.17);
      box-sizing: border-box;
      @include bg-color('bgColor');
      .header-desc,.body-wrap{
        margin: 0 px2rem(22px);
      }
      .header-desc{
        display: flex;
        justify-content: center;
        align-items: center;
        padding: px2rem(60px) 0 px2rem(39px);
        @include border('bottom',1px,solid,'lineColor');
        .avater{
          width: px2rem(125px);
          height: px2rem(125px);
          object-fit: cover;
          border-radius: px2rem(5px);
        }
        .title{
          max-width: px2rem(470px);
          line-height: px2rem(50px);
          font-weight: bold;
          text-align: center;
          @include font-dpr(17px);
          @include font-color('titleColor');
        }
      }
      .body-wrap{
        width: 100%;
        overflow: hidden;
        .row{
          display: flex;
          align-items: center;
          margin-top: px2rem(40px);
          @include font-dpr(15px)
          .title,.desc{
            line-height: 1;
          }
          .title{
            margin-right: px2rem(58px);
            @include font-color('tipColor');
          }
          .desc{
            flex:1;
            @include font-color('titleColor');
          }
          .desc-wrap{
            flex:1;
            display: flex;
            align-items: center;
            .star{
              width: px2rem(34px);
              height: px2rem(32px);
              margin-right: px2rem(10px);
              background-repeat: no-repeat;
              background-position: center;
              @include img-retina('~@/assets/common/star_n@2x.png', '~@/assets/common/star_n@3x.png', 100%, 100%);
              &.active{
                @include img-retina('~@/assets/common/star_h@2x.png', '~@/assets/common/star_h@3x.png', 100%, 100%);
              }
              &:last-child{
                margin-right: 0;
              }
            }
          }
        }
      }
      .footer-brief{
        margin-top: px2rem(40px);
        width: 100%;
        padding: px2rem(18px) px2rem(22px) px2rem(15px);
        box-sizing: border-box;
        line-height: px2rem(40px);
        @include bg-color('tipBgColor');
        @include font-dpr(13px);
        @include font-color('descColor')
      }
    }
  }
  .start-exambtn{
    width: 100%;
    height: px2rem(100px);
    line-height: px2rem(100px);
    text-align: center;
    border: none;
    @include font-dpr(16px);
    @include font-color('bgColor');
    @include bg-color('themeColor')
  }
}
</style>
