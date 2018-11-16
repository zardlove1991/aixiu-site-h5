<template lang="html">
  <div class="denpncelist-wrap" v-if="examList.length">
    <!--头部组件-->
    <exam-header :list="examList"></exam-header>
    <!-- <subject-header :list="subjectList"></subject-header> -->
    <!--主体试题渲染-->
    <div class="list-wrap">
      <div class="list-item-wrap" v-for="(item,index) in examList" :key="item.id">
        <template v-if="index == currentIndex">
          <h3 class="subject-type">
            <span>{{item.typeTip}}</span>
            <span class="score" v-show="item.score">{{`(${item.score}分)`}}</span>
          </h3>
          <p class="subject-title">{{`${index+1}. ${item.title}`}}</p>
          <!--题干的每题数据-->
          <div class="media-wrap" v-for="(media,mediaKey) in item.annex" :key="mediaKey">
            <img v-if="mediaKey=='image' && media.length" :src="media[0]"  v-preview="media[0]" preview-nav-enable="false" class="my-img"/>
            <!--音频播放-->
            <my-audio v-if="mediaKey=='audio' && media.length" class="my-audio" :src="media[0]"></my-audio>
            <!--视频播放-->
            <my-video v-if="mediaKey=='video' && media.length" class="my-video" :src="media[0]"></my-video>
          </div>
          <!--每个选择项-->
          <div class="subject-select-wrap" v-for="(optItem,optIndex) in item.options" :key='optIndex'>
            <!--每个选择项描述-->
            <div class="select-tip-wrap" @click.stop="selectOption(optIndex)">
              <div class="select-tip" :class="{active: optItem.selectIndex === optIndex}">{{optItem.selectTip}}</div>
              <div class="select-desc">{{optItem.name}}</div>
            </div>
            <div class="media-wrap" v-for="(media,mediaKey) in optItem.annex" :key="mediaKey">
              <img v-if="mediaKey=='image' && media.length" :src="media[0]"  v-preview="media[0]" preview-nav-enable="false" class="my-img"/>
              <!--音频播放-->
              <my-audio v-if="mediaKey=='audio' && media.length" class="my-audio" :src="media[0]"></my-audio>
              <!--视频播放-->
              <my-video v-if="mediaKey=='video' && media.length" class="my-video" :src="media[0]"></my-video>
            </div>
          </div>
          <!--答案解析-->
          <div class="answerinfo-wrap" v-if="false">
            <div class="correct-answer">答案: D</div>
            <div class="answer-analysis">
              <h4 class="title">解析</h4>
              <p class="content">依照《考工记》都城设计礼制--左祖右社,午门之前分设太庙和社稷坛。显示了族权和神权对皇权的供卫</p>
              <div class="exam-types">
                <span class="tip">考点</span>
                <span class="type" v-for="(item,index) in types" :key="index">{{item}}</span>
              </div>
              <p class="percent">正确率: 75%</p>
            </div>
          </div>
        </template>
      </div>
      <!--底部跳转按钮-->
      <div class="btn-wrap">
        <div class="prev" @click.stop="currentIndex--">上一题</div>
        <div class="next" @click.stop="currentIndex++">下一题</div>
      </div>
    </div>
    <!--试题中断弹窗-->
    <my-model :show="isShowSuspendModel"
              doneText="重新考试"
              cancelText="放弃并交卷"
              @confirm="confirmSuspendModel"
              @cancel="toggleSuspendModel"
    >
      <div class="suspend-model" slot="content">
        <div class="tip-bg"></div>
        <div class="tip">Ops，考试中断了</div>
        <div class="desc">考试题数：30题，考试时间：90分钟</div>
      </div>
    </my-model>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import ExamHeader from './depence/exam-header'
import SubjectHeader from './depence/subject-header'
import MyAudio from './depence/audio'
import MyVideo from './depence/video'
import MyModel from './depence/model'

export default {
  name: 'depence-list',
  props: {
    id: String
  },
  data () {
    return {
      types: ['艺术鉴赏', '文化历史', '古建筑'],
      currentIndex: 0,
      subjectList: [],
      isShowSuspendModel: false
    }
  },
  components: {
    ExamHeader,
    SubjectHeader,
    MyAudio,
    MyVideo,
    MyModel
  },
  computed: {
    ...mapGetters('depence', ['examList'])
  },
  created () {
    this.initList()
  },
  methods: {
    async initList () {
      let examId = this.id || 10001
      await this.getExamList({ id: examId })
    },
    selectOption (index) {
      this.currentIndex = index
    },
    confirmSuspendModel () {
      this.toggleSuspendModel()
    },
    toggleSuspendModel () {
      this.isShowSuspendModel = !this.isShowSuspendModel
    },
    ...mapActions('depence', {
      getExamList: 'GET_EXAMLIST'
    })
  }
}
</script>

<style lang="scss">
@import "@/styles/index.scss";

.denpncelist-wrap{
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  .list-wrap{
    position: relative;
    width: 100%;
    min-height: calc(100% - 50px);
    padding-bottom: px2rem(170px);
    box-sizing: border-box;
    .list-item-wrap{
      width: 100%;
      @include font-dpr(16px);
      @include font-color('titleColor');
      .subject-type{
        display: flex;
        align-items: center;
        padding: px2rem(54px) 0 px2rem(16px) px2rem(32px);
        box-sizing: border-box;
        line-height: 1;
        @include font-dpr(16px);
        .score{
          font-weight: normal;
          margin-left: px2rem(10px);
          @include font-dpr(14px);
        }
      }
      .subject-title{
        @include font-dpr(16px);
        padding:px2rem(39px) px2rem(43px) 0 px2rem(30px);
        box-sizing: border-box;
      }
      .media-wrap{
        padding:0 px2rem(43px) 0 px2rem(30px);
        box-sizing: border-box;
        text-align: center;
        .my-audio,.my-video,.my-img{
          margin-top: px2rem(39px);
        }
        .my-img{
          width: 100%;
          height: px2rem(300px);
          object-fit: cover;
        }
      }
      .subject-select-wrap{
        padding:px2rem(40px) px2rem(43px) 0 px2rem(30px);
        box-sizing: border-box;
        .select-tip-wrap{
          display: flex;
          align-items: center;
          .select-tip{
            display: flex;
            justify-content: center;
            align-items: center;
            width: px2rem(54px);
            height: px2rem(54px);
            border-radius: 50%;
            margin-right: px2rem(40px);
            @include font-dpr(14px);
            @include bg-color('bgColor');
            @extend .box-shadow;
            &.active{
              @include font-color('bgColor');
              @include bg-color('themeColor');
            }
          }
        }
        .media-wrap{
          padding: 0;
        }
      }
      .answerinfo-wrap{
        width: 100%;
        padding-top: px2rem(79px);
        .correct-answer{
          display: flex;
          align-items: center;
          width: 100%;
          height: px2rem(100px);
          padding-left: px2rem(30px);
          box-sizing: border-box;
          @include font-dpr(15px);
          @include font-color('titleColor');
          @include border('bottom',1px,solid,'lineColor');
        }
        .answer-analysis{
          width: 100%;
          padding: 0 px2rem(61px) 0 px2rem(30px);
          box-sizing: border-box;
          .title{
            margin: px2rem(26px) 0;
            @include font-dpr(16px);
            @include font-color('titleColor');
          }
          .content{
            line-height: px2rem(44px);
            @include font-dpr(16px);
            @include font-color('titleColor');
          }
          .exam-types{
            display: flex;
            align-items: center;
            margin: px2rem(44px) 0;
            .tip{
              margin-right: px2rem(19px);
              @include font-dpr(13px);
              @include font-color('tipColor');
            }
            .type{
              padding: px2rem(9px) px2rem(12px);
              border-radius: px2rem(4px);
              margin-right: px2rem(19px);
              line-height: 1;
              @include border('all',1px,solid,'themeColor');
              @include font-dpr(12px);
              @include font-color('themeColor');
            }
          }
          .percent{
            line-height: 1;
            padding-bottom: px2rem(61px);
            @include font-dpr(13px);
            @include font-color('tipColor');
          }
        }
      }
    }
    .btn-wrap{
      position: absolute;
      left: 0;
      right: 0;
      bottom: px2rem(10px);
      display: flex;
      justify-content: space-around;
      .prev,.next{
        display: flex;
        justify-content: center;
        align-items: center;
        width: px2rem(330px);
        height: px2rem(80px);
        border-radius: px2rem(40px);
        @include font-dpr(16px);
      }
      .prev{
        @include font-color('themeColor');
        @include border('all',1px,solid,'themeColor');
      }
      .next{
        @include font-color('bgColor');
        @include bg-color('themeColor');
        @include border('all',1px,solid,'themeColor');
      }
    }
  }
  .suspend-model{
    padding:px2rem(49px) px2rem(51px) px2rem(41px);
    box-sizing: border-box;
    .tip-bg{
      width: px2rem(370px);
      height: px2rem(224px);
      margin:0  auto;
      @include img-retina("~@/assets/common/suspend@2x.png","~@/assets/common/suspend@3x.png", 100%, 100%);
      background-repeat: no-repeat;
      background-position: center;
    }
    .tip,.desc{
      line-height: 1;
    }
    .tip{
      font-weight: bold;
      padding: px2rem(30px) 0;
      text-align: center;
      @include font-dpr(16px);
      @include font-color('titleColor');
    }
    .desc{
      @include font-dpr(14px);
      @include font-color('tipColor');
    }
  }
}
</style>
