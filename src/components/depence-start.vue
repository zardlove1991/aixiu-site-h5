<template lang="html">
  <!--当前开始考试页面-->
  <div class="depence-start-wrap" v-if="examInfo">
    <!--头部背景 暂时没有先注释掉-->
    <div class="header-wrap">
      <template v-if="examInfo.indexpic">
        <img :src="examInfo.indexpic" class="bg" />
        <!--透明遮罩-->
        <div class="thumb"></div>
      </template>
      <!--默认的背景图片-->
      <div v-show="!examInfo.indexpic" class="indexpic-bg"></div>
    </div>
    <!--主体展示部分-->
    <div class="content-wrap">
      <div class="content">
        <!--头部-->
        <div class="header-desc">
          <div class="default-avater">
            <img v-show="examInfo.indexpic" :src="examInfo.indexpic" alt="" class="avater">
          </div>
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
            <span class="desc">{{ _dealLimitTimeTip(examInfo.limit_time) }}</span>
          </div>
          <!-- <div class="row">
            <span class="title">考试难度</span>
            <div class="desc-wrap">
              <i class="star" :class='{active: index <= _getStarNum(examInfo.level)}' v-for="(val,index) in 5" :key='index'></i>
            </div>
          </div>
          <div class="row">
            <span class="title">辅导老师</span>
            <span class="desc">{{examInfo.builder || '暂无'}}</span>
          </div> -->
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
    <button v-if ="examInfo.person_status === 0" class="start-exambtn" @click.stop="goExamPage">开始测验</button>
    <!--底部已考按钮组-->
    <div v-else class="reset-exam-btns" :class="{'center': !examInfo.restart}">
      <button class="reset" v-show="examInfo.restart" @click.stop="startReExam">重新测验</button>
      <button class="show" @click.stop="jumpGradePage">查看成绩</button>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { Toast, Indicator } from 'mint-ui'
import { setBrowserTitle } from '@/utils/utils'
import { DEPENCE } from '@/common/currency'
import mixins from '@/mixins/index'

export default {
  mixins: [mixins],
  props: {
    id: String
  },
  data () {
    return {
      starMap: {
        easy: 0,
        middle: 2,
        hard: 4
      }
    }
  },
  computed: {
    ...mapGetters('depence', ['examInfo', 'answerCardInfo'])
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
    async startReExam () {
      let examId = this.id
      let redirectParams = this.redirectParams
      Indicator.open({ spinnerType: 'fading-circle' })
      try {
        await this.getAnswerCardInfo({id: examId})
        // 当上次试卷审核结束后才可以继续重新考试
        if (this.answerCardInfo.essay_status) {
          // 设置当前试题索引
          this.changeSubjectIndex(0)
          // 去往查看考试概况页面
          this.$router.push({
            path: `/depencelist/${examId}`,
            query: {
              rtp: 'exam',
              restart: 'need',
              ...redirectParams
            }
          })
        } else {
          Toast('试卷正在批阅中，暂不支持重新考试')
        }
        // 结束loading
        Indicator.close()
      } catch (err) {
        console.log(err)
        // 结束loading
        Indicator.close()
      }
    },
    goExamPage () {
      let examId = this.id
      let redirectParams = this.redirectParams
      // 去往查看考试概况页面
      this.$router.push({
        path: `/depencelist/${examId}`,
        query: { rtp: 'exam', ...redirectParams }
      })
    },
    jumpGradePage () {
      let examId = this.id
      let redirectParams = this.redirectParams // mixin中的公共属性
      // 跳转去往答题卡页面
      this.$router.push({
        path: `/depencecard/${examId}`,
        query: { ...redirectParams }
      })
    },
    _getStarNum (level) {
      let starMap = this.starMap
      let curLevel = starMap[level] || -1
      return curLevel
    },
    _dealLimitTimeTip (time) {
      return DEPENCE.dealLimitTimeTip(time)
    },
    ...mapActions('depence', {
      getExamDetail: 'GET_EXAM_DETAIL',
      changeSubjectIndex: 'CHANGE_CURRENT_SUBJECT_INDEX',
      getAnswerCardInfo: 'GET_ANSWERCARD_INFO'
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
    position: relative;
    width: 100%;
    height: px2rem(300px);
    overflow: hidden;
    .bg{
      width: 100%;
      height: 100%;
      object-fit: cover;
      filter: blur(4px);
    }
    .thumb{
      position: absolute;
      top:0;
      left:0;
      right: 0;
      bottom:0;
      background-color: rgba(0,0,0,0.08);
      overflow: hidden;
    }
    .indexpic-bg{
      width: 100%;
      height: 100%;
      background-position: center;
      background-repeat: no-repeat;
      @include img-retina('~@/assets/common/empty_indepic_bg@2x.png','~@/assets/common/empty_indepic_bg@3x.png', 100%, 100%);
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
        align-items: center;
        padding: px2rem(60px) 0 px2rem(39px);
        @include border('bottom',1px,solid,'lineColor');
        .default-avater{
          width: px2rem(125px);
          height: px2rem(125px);
          border-radius: px2rem(5px);
          background-position: center;
          background-repeat: no-repeat;
          @include img-retina('~@/assets/common/empty_indexpic@2x.png','~@/assets/common/empty_indexpic@3x.png', 100%, 100%);
          .avater{
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: px2rem(5px);
          }
        }
        .title{
          max-width: px2rem(470px);
          line-height: px2rem(50px);
          font-weight: bold;
          margin-left: px2rem(53px);
          @include font-dpr(17px);
          @include font-color('titleColor');
          @include line-overflow(2);
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
        word-break: break-all;
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
  .reset-exam-btns{
    display: flex;
    justify-content: space-between;
    padding: 0 px2rem(30px) px2rem(30px);
    width: 100%;
    box-sizing: border-box;
    @include bg-color('tipBgColor');
    &.center{
      justify-content: center;
    }
    .reset,.show{
      flex:1;
      height: px2rem(80px);
      line-height: px2rem(80px);
      text-align: center;
      border: none;
      border-radius: px2rem(40px);
      @include font-dpr(16px);
    }
    .reset{
      margin-right: px2rem(30px);
      @include font-color('themeColor');
      @include bg-color('tipBgColor');
      @include border('all', px2rem(1px), solid, 'themeColor');
    }
    .show{
      @include font-color('bgColor');
      @include bg-color('themeColor');
      @include border('all', px2rem(1px), solid, 'themeColor');
    }
  }
}
</style>
