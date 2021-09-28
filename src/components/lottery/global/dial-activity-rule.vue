<template>
  <DialDialog :show="show" @close="onClose">
    <div slot="tille-name" class="tille-name">活动规则</div>
    <div slot="container" class="container">
      <div class="container-desc" v-html="data">
        <!-- {{data}} -->
      </div>
      <!-- <div class="container-desc">活动时间：本活动为长期活动，具体在线时间以页面呈现为准抽奖细节：<br/>1. 每天每个微信号可投票十票，投票后点 击此链接幸运抽奖，进入抽奖页面。</div> -->
      <!-- <div class="container-img">
          <img src="https://img01.yzcdn.cn/vant/cat.jpeg" alt="">
      </div> -->
      <!-- <div class="container-rep">2. 粉丝福利抽奖活动将于9月30日重新开 放，更多丰富奖品由[荣舍]、[楚翘城]、[飞视文化]提供。</div> -->
    </div>
  </DialDialog>

</template>

<script>
import DialDialog from '@/components/lottery/global/dial-dialog-title'
import { mapMutations } from 'vuex'
export default {
  name: 'ActivityRule',
  components: { DialDialog },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    data: {
      type: String
    }
  },
  data () {
    return { }
  },
  computed: {
  },
  watch: {
    show (newState) {
      // 更改当前是否显示遮罩的状态
      this.setIsModelShow(newState)
    }
  },
  created () {
  },
  mounted () {
  },
  methods: {
    onClose () {
      this.$emit('close')
    },
    ...mapMutations('lottery', {
      setIsModelShow: 'SET_IS_MODEL_SHOW'
    })
  }
}
</script>
<style lang='scss'>
.container {
  .container-desc {
    img {
      // max-width: 100% !important;
      width:auto;
      height:auto;
      object-fit: none;
    }
  }
}
</style>
<style scoped lang="scss">
@import "@/styles/index.scss";
 .container{
    padding-top: px2rem(50px);
    padding-bottom: px2rem(42px);
    width: px2rem(600px);
    max-height: px2rem(600px);
    padding-left: px2rem(40px);
    padding-right: px2rem(40px);
    background-color: #fff;
    overflow-y: auto;
  .container-desc{
    width: px2rem(506px);
    // height: px2rem(178px);
    opacity: 1;
    font-size: px2rem(28px);
    font-family: SourceHanSansCN, SourceHanSansCN-Regular;
    font-weight: 400;
    text-align: left;
    color: #4f0f0f;
    white-space: pre-line;
    line-height: px2rem(42px);
    margin-bottom: px2rem(30px);
    p {
     
    }
    .container-img{
      width: px2rem(520px);
      height: px2rem(300px);
      border-radius: px2rem(2px);
      img{
        display: block;width: 100%; height: 100%;
      }
      margin-bottom: px2rem(30px);
    }
  }
  .container-rep{
    width: px2rem(497px);
    height: px2rem(128px);
    opacity: 1;
    font-size: px2rem(28px);
    font-family: SourceHanSansCN, SourceHanSansCN-Regular;
    font-weight: 400;
    text-align: left;
    color: #4f0f0f;
    line-height: px2rem(42px);
  }
}
</style>
