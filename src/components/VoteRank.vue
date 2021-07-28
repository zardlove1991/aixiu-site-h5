<template>
<div class='vote-rank-wrap'>
  <div class='vote-rank-main'>
    <div class='search-group'>
      <div>
        <el-select v-model="areaValue" @change='choiceAreaFun'
          placeholder="请选择"
          size='small'
          class='select-wrap'>
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class='search-group-2'>
        <div class='input-icon-wrap'>
          <input class='input-wrap'
            v-model.trim='curPartyName'
            @keyup.13 = "searchFun"
            type="text" name="" id=""
            placeholder="请输入党支部名称"/>
          <!-- <van-icon name="search"  class='icon-box'/> -->
        </div>
      </div>
    </div>
    <div class='list-wrap'>
      <div v-for='(item, index) in voteList' :key='index' class='single-list-wrap'>
        <div class='single-list-1'>
          <img v-if='index <= 2' :src="imgs['rank' + (index + 1)]" alt="" class='rank-img'>
          <span v-if='index > 2'>{{index + 1}}</span>
        </div>
        <div class='single-list-2'>
          <div>{{item.party_name}}</div>
          <div>{{item.party_address}}</div>
        </div>
        <div class='single-list-3'>{{item.num}}分</div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import API from '@/api/module/examination'
import { mapGetters } from 'vuex'
import { Select, Option } from 'element-ui'
import mixins from '@/mixins/index'
import wx from '@/config/weixin-js-sdk'
export default {
  mixins: [mixins],
  data () {
    return {
      imgs: {
        bgImg: require('@/assets/voteRank/def-bg-img.png'),
        rank1: require('@/assets/voteRank/rank1.png'),
        rank2: require('@/assets/voteRank/rank2.png'),
        rank3: require('@/assets/voteRank/rank3.png')
      },
      areaValue: '',
      options: [],
      curPartyName: '',
      voteRequestObj: {
        page: 1, // 当前的页数
        count: 1000, // 每页显示多少条
        unique_name: 'voting',
        type: '',
        name: '', // 需要搜索的党支部名称
        party_address: '' // 下拉选择的赛区名称
      },
      voteList: []
    }
  },
  computed: {
    ...mapGetters('depence', ['examInfo'])
  },
  props: {
    id: String
  },
  components: {
    ElSelect: Select,
    ElOption: Option
  },
  mounted () {
    this.getGameArea()
    this.getVoteList()
  },
  methods: {
    getVoteList () {
      API.getExerciseRankList({
        query: { id: this.id },
        params: this.voteRequestObj
      }).then(res => {
        this.voteList = []
        this.voteList = res.data
      })

      // let _imgUrl = this.imgs.bgImg
      // setTimeout(() => {
      //   console.log('2', this.examInfo.id)
      //   this.initPageShareInfoFun({
      //     id: this.examInfo.id,
      //     title: 'IPTV投票积分排行榜',
      //     desc: 'IPTV投票积分排行榜',
      //     indexpic: _imgUrl,
      //     mark: 'examination'
      //   }, this.shareAddTimes())
      // }, 3000)

      let _imgUrl = this.imgs.bgImg
      console.log('77-----------', this.initPageShareInfo)
      this.initPageShareInfo({
        id: this.examInfo.id,
        title: 'IPTV投票积分排行榜',
        desc: 'IPTV投票积分排行榜',
        indexpic: _imgUrl,
        mark: 'examination'
      }, this.shareAddTimes())
      // setTimeout(() => {
      //   console.log('33')

      // }, 3000)
    },
    shareAddTimes () { // 分享成功回调

    },
    initPageShareInfoFun (data, callback) {
      let auth = () => {
        let params = {
          title: data.title, // 分享标题
          desc: data.desc, // 分享描述
          imgUrl: data.indexpic, // 分享图标
          link: data.link, // 分享链接
          success: () => {
            // 用户确认分享后执行的回调函数
            console.log('setShare', data)
            // this.setShare({
            //   id: data.id,
            //   title: params.title,
            //   from: params.from,
            //   mark: data.mark
            // })
            // 回调函数
            if (callback && typeof callback === 'function') {
              callback()
            }
          },
          fail: function (err) {
            console.log(err)
          },
          cancel: function () {
            // 用户取消分享后执行的回调函数
          }
        }
        // console.log('执行了分享参数调用', params)
        // 执行调用
        wx.execute('shareQQZone', params)
        wx.execute('shareQQFriends', params)
        wx.execute('shareWeChatZone', params)
        wx.execute('shareFriends', params)
        wx.execute('shareWeibo', params)
      }
      // 执行分享SDK调用
      setTimeout(() => {
        auth()
      }, 1000)
    },
    choiceAreaFun () {
      this.voteRequestObj.party_address = this.areaValue
      this.getVoteList()
    },
    getGameArea () {
      API.getPartyGameArea({query: {id: this.id}, params: {type: 'voting'}}).then(res => {
        this.options = [{
          label: '全部赛区',
          value: ''
        }]

        // eslint-disable-next-line no-unused-vars
        for (let [i, item] of Object.entries(res)) {
          this.options.push({
            label: item,
            value: item
          })
        }
      })
    },
    searchFun () {
      this.voteRequestObj.name = this.curPartyName
      this.getVoteList()
    }
  }
}
</script>
<style lang='scss' scoped>
@import "@/styles/index.scss";
/deep/ .el-select .el-input__inner{
  background: #F8EBD8;
  color: #E2C59A;
  border: #F8EBD8;
}

/deep/ .select-wrap{
  border-radius: 5px;
}

/deep/ .el-icon-arrow-up:before{
  color: #E2C59A;
}

.el-select-dropdown__item.selected{
  color: #E2C59A !important;
}

.el-select-dropdown__item{
  padding-left: 10px;
}

input::-webkit-input-placeholder {
  /* placeholder颜色 */
  color: #E2C59A;
}

.vote-rank-wrap {
  width: 100vw;
  height: 100vh;
  background:url('~@/assets/voteRank/def-bg-img.png') no-repeat center center;
  background-size: 100vw 100vh;
  padding: 0 px2rem(30px) px2rem(30px);
  border: 1px solid transparent;
  .vote-rank-main{
    // width: px2rem(690px);
    background: #FFF8ED;
    border-radius: px2rem(16px);
    padding: px2rem(20px);
    margin-top: px2rem(250px);
    margin-bottom: px2rem(30px);
    box-sizing: border-box;
    .search-group{
      display: flex;
      flex-direction: row;
      .select-wrap{
        width: px2rem(240px);
        height: px2rem(68px);
        background: #F8EBD8;
      }

      .search-group-2{
        flex: 1;
      }
    }

    .list-wrap{
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      margin-top: 10px;
      min-height: px2rem(700px);
      max-height: px2rem(980px);
      .single-list-wrap{
        padding-top: px2rem(70px);
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        .single-list-1 {
          width: px2rem(80px);
          min-width: px2rem(60px);
          font-size: px2rem(34px);
          color: #DF0000;
          font-weight: 500;
          text-align: left;
          .rank-img{
            width: px2rem(42px);
            height: px2rem(50px);
          }
        }

        .single-list-2 {
          flex: 1;
          max-width: px2rem(450px);
          &>div:nth-child(1) {
            color: #000000;
            font-size: px2rem(30px);
            font-weight: 500;
            line-height: px2rem(38px);
          }

          &>div:nth-child(2) {
            line-height: px2rem(24px);
            color: #aba69e;
            margin-top: px2rem(20px);
          }
        }

        .single-list-3 {
          text-align: center;
          width: px2rem(120px);
          min-width: px2rem(120px);
          max-width: px2rem(120px);
          font-size: px2rem(28px);
          color: #DF0000;
        }
      }

    }
  }

  .input-icon-wrap{
    position: relative;
    .icon-box {
      position: absolute;
      top: px2rem(10px);
      right: px2rem(15px);
      color: #E2C59A;
      font-size: px2rem(40px);
    }

    .input-wrap{
      outline: none;
      -webkit-appearance: none; /*去除系统默认的样式*/
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0); /* 点击高亮的颜色*/
      display: inline-block;
      // width: px2rem(390px);
      width: 95%;
      height: px2rem(68px);
      margin-left: px2rem(20px);
      border-radius: px2rem(8px);
      border: 1px solid #F8EBD8;
      padding-left: 5px;
      font-size: px2rem(28px);
      background: #F8EBD8;
    }
  }
}
</style>
