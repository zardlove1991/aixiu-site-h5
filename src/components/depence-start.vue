<template lang="html">
  <!--当前开始考试页面-->
  <div class="depence-start-wrap depence-wrap" v-if="examInfo">
    <div class="header-top" v-if="examInfo.person_status !== 0">
      <div class="end-tips">测评已提交</div>
      <!-- <div class="to-score" @click.stop="toStatistic">查看测评结果</div> -->
    </div>
    <div class="header-normal" v-else>
      <div class="end-tips">
        <div class="end-tangan"></div>
        答题规范:每个用户最多提交一次</div>
    </div>
    <!--头部背景 暂时没有先注释掉-->
    <div class="header-wrap" v-if="examInfo.limit.backgroud.indexpic">
      <template>
        <img :src="examInfo.limit.backgroud.indexpic" class="bg" />
        <!--透明遮罩-->
      </template>
      <!--默认的背景图片-->
    </div>
    <!--主体展示部分-->
    <div class="content-wrap">
      <div class="content">
        <!--头部-->
        <div class="header-desc">
          <div class="title">{{examInfo.title}}</div>
        </div>
        <div class="exam-time">
          <div class="icon-time"></div>
          {{examInfo.start_time}} - {{examInfo.end_time}}
        </div>
        <div class="body-wrap">
          <!--信息展示-->
          <div class="row">
            <div class="row-icon row-naozhong"></div>
            <div>
              <div class="desc">{{ _dealLimitTimeTip(examInfo.limit_time) }}</div>
              <div class="title">测评时长</div>
            </div>
          </div>
          <div class="row">
            <div class="row-icon row-juanzi"></div>
            <div>
              <div class="desc">{{`${examInfo.question_num}题`}}</div>
              <div class="title">试题数量</div>
            </div>
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
            <div class="row-icon row-jianguo"></div>
            <div>
              <div class="desc">{{`${examInfo.total_score}分`}}</div>
              <div class="title">满分</div>
            </div>
          </div>
        </div>
        <!--底部-->
        <!-- <div class="footer-brief" v-show="examInfo.brief">{{examInfo.brief}}</div> -->
      </div>
    </div>
    <!--底部按钮-->
    <div class="btn-area" >
      <button class="start-exambtn" @click.stop="goExamPage" v-if ="examInfo.person_status === 0">开始答题</button>
      <button class="end-exambtn" v-else>开始答题</button>
    </div>
    <my-model
      :show="App"
      :isLock="true"
      :showBtn="false">
      <div class="suspend-model" slot="content">
        <div class="app-bg"></div>
        <div class="tip">请在{{examInfo.limit.default_download_app}}App内参与活动</div>
        <div class="tip-btn" @click.stop="goDownload(examInfo.limit.download_link)">去下载</div>
      </div>
    </my-model>
    <!--底部已考按钮组-->
    <!-- <div v-else class="btn-area reset-exam-btns" :class="{'center': !examInfo.restart}">
      <button class="reset" v-show="examInfo.restart" @click.stop="startReExam">重新测验</button>
      <button class="show" @click.stop="jumpGradePage">查看成绩</button>
    </div> -->
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { Toast, Indicator } from 'mint-ui'
import STORAGE from '@/utils/storage'
import { setBrowserTitle, setTheme } from '@/utils/utils'
import { DEPENCE } from '@/common/currency'
import mixins from '@/mixins/index'
import MyModel from './depence/model'

export default {
  mixins: [mixins],
  props: {
    id: String
  },
  data () {
    return {
      App: false,
      starMap: {
        easy: 0,
        middle: 2,
        hard: 4
      }
    }
  },
  components: { MyModel },
  computed: {
    ...mapGetters('depence', ['examInfo', 'answerCardInfo'])
  },
  created () {
    this.initStartInfo()
  },
  methods: {
    goDownload (url) {
      window.location.href = url
    },
    toStatistic () {
      let examId = this.id
      this.$router.push({
        path: `/statistic/${examId}`
      })
    },
    async initStartInfo () {
      let examId = this.id
      try {
        await this.getExamDetail({id: examId})
        // 设置标题
        setBrowserTitle(this.examInfo.title)
        setTheme(this.id)
        STORAGE.set('guid', this.examInfo.guid)
      } catch (err) {
        console.log(err)
      }
    },
    async startReExam () {
      let examId = this.id
      // let redirectParams = this.redirectParams
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
              restart: 'need'
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
      // let redirectParams = this.redirectParams
      // 去往查看考试概况页面
      if (!this.examInfo.limit.is_page_submit) {
        this.$router.push({
          path: `/alllist/${examId}`,
          query: { rtp: 'exam' }
        })
      } else {
        this.$router.push({
          path: `/depencelist/${examId}`,
          query: { rtp: 'exam' }
        })
      }
    },
    jumpGradePage () {
      let examId = this.id
      // let redirectParams = this.redirectParams // mixin中的公共属性
      // 跳转去往答题卡页面
      this.$router.push({
        path: `/depencecard/${examId}`
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
  align-items: center;
  width: 100%;
  height: 100vh;
  padding-top:px2rem(80px);
  background-color:#1F52E7;
  background-repeat: no-repeat;
  background-position: center;
  @include img-retina('~@/assets/common/bg@2x.png','~@/assets/common/bg@3x.png', 100%, 100%);
  .exam-time{
    @include font-dpr(15px);
    color:#fff;
    margin-bottom:px2rem(87px);
    display:flex;
    align-items:center;
  }
  .icon-time{
    width:px2rem(34px);
    height:px2rem(34px);
    margin-right:px2rem(20px);
    @include img-retina('~@/assets/common/timeInfo@2x.png','~@/assets/common/timeInfo@3x.png', 100%, 100%);
  }
  .header-top{
    background-color:#FFF1ED;
    z-index: 1;
    height:px2rem(90px);
    display:flex;
    flex:1;
    align-items: center;
    position: absolute;
    left:0;
    top:0;
    width:100%;
    color:#FF6A45;
    padding-left:px2rem(43px);
    padding-right:px2rem(20px);
    @include font-dpr(14px);
    box-sizing: border-box;
    .to-score{
      height:px2rem(54px);
      line-height:px2rem(54px);
      text-align:center;
      width:px2rem(200px);
      border:1px solid #FF6A45;
      border-radius: 27px;
    }
  }
  .end-tips{
    flex:1;
    display:flex;
    align-items: center;
  }
  .end-tangan{
    width:px2rem(36px);
    height:px2rem(36px);
    margin-right:px2rem(20px);
    @include img-retina('~@/assets/common/gantan@2x.png','~@/assets/common/gantan@3x.png', 100%, 100%);
  }
  .header-normal{
    background: rgba(0,0,0,0.50);
    z-index: 1;
    height:px2rem(80px);
    display:flex;
    flex:1;
    align-items: center;
    position: absolute;
    left:0;
    top:0;
    width:100%;
    color:#fff;
    padding-left:px2rem(43px);
    padding-right:px2rem(20px);
    @include font-dpr(14px);
    box-sizing: border-box;
  }
  .header-wrap{
    position: relative;
    width: 100%;
    height: px2rem(420px);
    overflow: hidden;
    .bg{
      width: 100%;
      height: 100%;
      object-fit: cover;
      filter: blur(4px);
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
    .content{
      border-radius:px2rem(6px);
      box-shadow: 0 0 px2rem(10px) rgba(180, 180, 180, 0.17);
      box-sizing: border-box;
      // @include bg-color('bgColor');
      .header-desc{
        margin:px2rem(26px) 0;
        .title{
          line-height: px2rem(68px);
          font-family:SourceHanSansCN-Medium;
          font-weight: bold;
          display:block;
          @include font-dpr(26px);
          color:#fff;
          @include line-overflow(2);
        }
      }
      .body-wrap{
        width: 100%;
        overflow: hidden;
        display:flex;
        .row{
          flex: 1;
          display: flex;
          position:relative;
          justify-content: center;
          align-items: center;
          text-align:center;
          height:px2rem(150px);
          background:rgba(255,255,255,0.2);
          color:#fff;
          @include font-dpr(15px);
          &:nth-child(2){
            margin:0 px2rem(21px);
          }
          .title{
            @include font-dpr(14px);
          }
          .desc{
            @include font-dpr(16px);
            margin-bottom:px2rem(22px);
          }
          .title,.desc{
            line-height: 1;
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
        .row-icon{
          width:px2rem(80px);
          height:px2rem(80px);
          position:absolute;
          right:px2rem(10px);
          top:px2rem(20px);
          background-position: center;
          background-repeat: no-repeat;
        }
        .row-naozhong{
          @include img-retina('~@/assets/common/row_click@2x.png','~@/assets/common/row_click@3x.png', 100%, 100%);
        }
        .row-juanzi{
          @include img-retina('~@/assets/common/juanzi@2x.png','~@/assets/common/juanzi@3x.png', 100%, 100%);
        }
        .row-jianguo{
          @include img-retina('~@/assets/common/jianguo@2x.png','~@/assets/common/jianguo@3x.png', 100%, 100%);
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
  .btn-area{
    display:flex;
    width:100%;
    margin-top:px2rem(354px);
  }
  .start-exambtn{
    flex:1;
    border-radius: px2rem(8px);
    margin:0 px2rem(30px);
    height: px2rem(90px);
    line-height: px2rem(90px);
    text-align: center;
    border: none;
    color:#fff;
    @include font-dpr(16px);
    @include bg-color('btnColor')
  }
  .end-exambtn{
    flex:1;
    border-radius: px2rem(8px);
    margin:0 px2rem(30px);
    height: px2rem(90px);
    line-height: px2rem(90px);
    text-align: center;
    border: none;
    background-color:#CCC;
    @include font-dpr(16px);
    @include font-color('bgColor');
  }
  .reset-exam-btns{
    display: flex;
    justify-content: space-between;
    padding: 0 px2rem(30px) px2rem(30px);
    width: 100%;
    box-sizing: border-box;
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
  .suspend-model{
    padding:px2rem(49px) px2rem(51px) px2rem(41px);
    box-sizing: border-box;
    .app-bg{
      width: px2rem(370px);
      height: px2rem(224px);
      margin:0  auto;
      @include img-retina("~@/assets/common/Bitmap@2x.png","~@/assets/common/Bitmap@3x.png", 100%, 100%);
      background-repeat: no-repeat;
      background-position: center;
    }
    .tip,.desc{
      line-height: 1;
    }
    .tip{
      font-weight: bold;
      text-align: center;
      margin-bottom:px2rem(80px);
      @include font-dpr(15px);
      color:#666666;
    }
    .desc{
      @include font-dpr(14px);
      @include font-color('tipColor');
    }
    .tip-btn{
      width:px2rem(305px);
      height:px2rem(90px);
      line-height: px2rem(90px);
      text-align: center;
      color:#fff;
      background:linear-gradient(136deg,rgba(0,209,170,1) 0%,rgba(0,207,198,1) 100%);
      @include font-dpr(16px);
      margin:0 auto;
      margin-top:px2rem;
      border-radius: 5px;
      -webkit-border-radius: 5px;
      -moz-border-radius: 5px;
      -ms-border-radius: 5px;
      -o-border-radius: 5px;
    }
  }
}
</style>
