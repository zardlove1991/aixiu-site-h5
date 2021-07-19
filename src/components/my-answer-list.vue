<template>
  <div class='my-answer-list'>
    <div class='score-num-box'>
      <img :src="imgs.bgImg" alt="">
      <div class='score-num-list'>
        <div class='single-num-box'>
          <div>{{number}}</div>
          <div>总次数</div>
        </div>
        <div class='single-num-box'>
          <div>{{score_num}}</div>
          <div>总分</div>
        </div>
        <div v-if='isIntegralType' class='single-num-box'>
          <div>{{points_num}}</div>
          <div>总积分</div>
        </div>
      </div>
    </div>
    <div class='main-answer-list'>
      <div class='list-header'>
        <van-dropdown-menu active-color="#ee0a24" >
          <van-dropdown-item v-model="timeSelectValue" :options="timeOption" @change='changeTime' />
        </van-dropdown-menu>
      </div>
      <div class='list-wrap'>
        <div v-for='(item, index) in answerInfoList' :key='index'
          @click='goStaticPage(item)'
          class='single-list-wrap'>
          <span>{{item.time}}</span>
          <span>{{item.score}}分</span>
          <span v-if='isIntegralType'>{{item.points}}积分</span>
          <span><van-icon name="arrow" /></span>
        </div>
      </div>
    </div>
    <page-back :path="'/depencestart/' + id" title='返回上一页'/>
  </div>
</template>

<script>
import { DropdownMenu, DropdownItem } from 'vant'
import { mapGetters } from 'vuex'
import PageBack from '@/components/depence/page-back'
import API from '@/api/module/examination'
export default {
  props: {
    id: String
  },
  data () {
    return {
      imgs: {
        bgImg: require('@/assets/myAnswerList/imgBg.png')
      },
      timeTitle: '近一周',
      timeSelectValue: 0,
      timeOption: [
        { text: '近一周', value: 0 },
        { text: '近一个月', value: 1 },
        { text: '近三个月', value: 2 },
        { text: '全部', value: 3 }
      ],
      answerInfoList: [],
      number: 0, // 答题总次数
      score_num: 0, // 答题总分数
      points_num: 0, // 答题总积分
      curTimeType: 1,
      isIntegralType: false
    }
  },
  components: {
    VanDropdownMenu: DropdownMenu,
    VanDropdownItem: DropdownItem,
    PageBack
  },
  computed: {
    ...mapGetters('depence', ['examInfo'])
  },
  mounted () {
    console.log('examInfo', this.examInfo)
    this.initData()
    if (this.examInfo.limit.random.score_conversion === 1) {
      // 存在积分
      this.isIntegralType = true
    } else {
      this.isIntegralType = false
    }
  },
  methods: {
    initData () {
      let voteId = this.id
      API.getMyAnswerList({
        params: {
          week: this.curTimeType,
          page: 1,
          count: 1000
        },
        query: { id: voteId }
      }).then(res => {
        this.answerInfoList = []
        this.answerInfoList = res.data

        this.number = res.number
        this.score_num = res.score_num
        this.points_num = res.points_num
      })
    },
    goStaticPage (item) {
      this.$router.push({
        path: `/exam/statistic/${this.id}`,
        query: {api_person_id: item.api_person_id}
      })
    },
    changeTime (data) {
      // 接口传输值不正确
      this.curTimeType = data
      this.initData()
    }
  }
}
</script>

<style scoped lang='scss'>
/deep/ .van-dropdown-menu__bar{
  box-shadow: 0 0 0#ffffff;
}
.my-answer-list{
  position: relative;
  .score-num-box{
    position: relative;
    .score-num-list{
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      width: 100vw;
      height: 120px;
      color: #ffffff;
      display: flex;
      flex-direction: row;
      padding-top: 25px;
      padding-left: 25px;

      .single-num-box + .single-num-box{
        margin-left: 20px;
      }

      .single-num-box{
        &>div:nth-child(1) {
          font-size: 20px;
          font-weight: 500;
          line-height: 30px;
          margin-bottom: 3px;
        }

        &>div:nth-child(2){
          font-size: 12px;
          font-weight: 400;
          line-height: 12px;
        }
      }
    }
  }

  .main-answer-list{
    padding: 20px 25px;
    position: absolute;
    top: 100px;
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
    background: #ffffff;
    width: 100vw;
    height: calc(100vh - 100px);

    .list-header{
      display: flex;
      justify-content: flex-end;
    }

    .list-wrap{
      overflow-x: hidden;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      max-height: calc(100% - 50px);
      .single-list-wrap{
        font-size: 14px;
        display: flex;
        flex-direction: rows;
        align-items: center;
        line-height: 40px;
        &>span{
          display: inline-block;
          text-align: center;
        }

        &>span:nth-child(1) {
          flex: 7;
          color: #999999;
        }
        &>span:nth-child(2) {
          flex: 3;
        }
        &>span:nth-child(3) {
          flex: 3;
        }
        &>span:nth-child(4) {
          flex: 1;
          text-align: right;
        }
      }
    }
  }
}
</style>
