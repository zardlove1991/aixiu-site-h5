<template>
<div class='help-dialog' v-if="show">
     <div class="help">
        <div class="help-header">
            <div class="close-wrap" @click.stop="onClose">
                <i class="close"></i>
            </div>
            <div class="avatar-wrap">
                <!-- <div class="avatar">
                    <img src="https://img01.yzcdn.cn/vant/cat.jpeg" alt="">
                </div>
                <div class="avatar-name">奔跑的草泥马</div> -->
                <div class="avatar" v-if="userInfo">
                    <img :src="userInfo.avatar" alt="" v-lazy='userInfo.avatar'>
                </div>
                <div class="avatar-name">{{userInfo.nick_name}}</div>
            </div>
            <div class="title">邀您助力一起拆盲盒</div>
        </div>
        <div class="container">
            <div class="code-wrap" v-if="code">
                <img :src="code" alt="" class="code">
            </div>
            <!-- <div class="code-wrap">
                <img src="https://img01.yzcdn.cn/vant/cat.jpeg" alt="" class="code">
            </div> -->
            <van-button  block  class="btns" @click="onCopy">复制链接</van-button>
            <div class="tip">长按保存图片</div>
        </div>
     </div>
    </div>
</template>

<script>
import { mapMutations } from 'vuex'
import API from '@/api/module/examination'
import STORAGE from '@/utils/storage'
export default {
  name: '',
  components: {
  },
  props: {
    show: {type: Boolean, require: true},
    activityId: {type: String, require: true}
  },
  data () {
    return {
      userInfo: STORAGE.get('userinfo') || {},
      host: `${window.location.protocol}//${window.location.host}`,
      code: null,
      heaf: null
    }
  },
  computed: {

  },
  watch: {
    show (newState) {
      console.log(newState, 'newState')
      // 更改当前是否显示遮罩的状态
      this.setIsModelShow(newState)
    }
  },
  created () {
  },
  mounted () {
    console.log(this.userInfo, 'this.userInfo')
    console.log(this.$route, 'this.route')
    console.log(this.host, 'this.host')
    this.onLoad()
  },
  methods: {
    onClose () {
      this.$emit('close', false)
    },
    ...mapMutations('lottery', {
      setIsModelShow: 'SET_IS_MODEL_SHOW'
    }),
    async onLoad () {
      try {
        const res = await API.getHelpCode({
          query: { id: this.activityId },
          data: { url: this.host + this.$route.path }
        })
        // console.log(res)
        this.code = res.path
        this.heaf = res.url
        this.userInfo.avatar = res.images
        this.userInfo.nick_name = res.nick_name
        // this.link = this.host + this.$route.path + `?id=${this.activityId}`
      } catch (error) {
        // console.log(error)
        this.$toast(error.error_message)
      }
    },
    onCopy () {
      var oInput = document.createElement('input') // 创建一个隐藏input（重要！）
      oInput.value = this.heaf // 赋值
      document.body.appendChild(oInput)
      oInput.select() // 选择对象
      document.execCommand('Copy') // 执行浏览器复制命令
      oInput.className = 'oInput'
      oInput.style.display = 'none'
      this.$toast.success('复制成功')
    }
  }
}
</script>

<style scoped lang="scss">
@import "@/styles/index.scss";
.help-dialog{
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  z-index: 99;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .help{
    width: px2rem(600px);
    height: px2rem(658px);
    position: relative;
    box-sizing: border-box;
    background-clip: padding-box;
    border-radius: px2rem(24px);
    background: #f6eaf9;
    box-shadow: 0px 0px px2rem(14px) 0px rgba(0,0,0,0.10);
    .help-header{
        width: px2rem(600px);
        height: px2rem(180px);
        @include img-retina("~@/assets/lottery-bindBox/help-header-bg.png",
        "~@/assets/lottery-bindBox/help-header-bg@2x.png", 100%, 100%);
        background-repeat: no-repeat;
        position: relative;
        padding-top: px2rem(40px);
        .close-wrap{
            width: px2rem(50px);
            height: px2rem(50px);
            padding-right: px2rem(30px);
            padding-top: px2rem(30px);
            position: absolute;
            top: 0; right: 0;
            .close {
                display: inline-block;
                width: px2rem(20px);
                height: px2rem(20px);
                @include img-retina("~@/assets/lottery-bindBox/close-white.png",
                "~@/assets/lottery-bindBox/close-white@2x.png", 100%, 100%);
                background-repeat: no-repeat;
            }
        }
        .avatar-wrap{
            width: 100%;
            height: px2rem(40px);
            display: flex;
            align-items: center;
            justify-content: center;
            // margin-top: px2rem(40px);
            margin-bottom: px2rem(24px);
            .avatar{
                width: px2rem(40px);
                height: px2rem(40px);
                border-radius: 50%;
                img{
                    display: inline-block;
                    width: px2rem(40px);
                    height: px2rem(40px);
                    border-radius: 50%;
                }
            }
            .avatar-name{
                height: px2rem(24px);
                font-size: px2rem(24px);
                font-family: SourceHanSansCN, SourceHanSansCN-Medium;
                font-weight: 500;
                text-align: left;
                color: #ffffff;
                line-height: px2rem(24px);
                margin-left: px2rem(16px);
                overflow: hidden;
                text-overflow:ellipsis;
                white-space: nowrap;
            }
        }
        .title{
            width: px2rem(360px);
            height: px2rem(40px);
            font-size: px2rem(40px);
            font-family: SourceHanSansCN, SourceHanSansCN-Medium;
            font-weight: 500;
            text-align: left;
            color: #ffffff;
            line-height: px2rem(40px);
            margin-left: auto;
            margin-right: auto;
        }
    }
    .container{
        width: 100%;
        height: px2rem(478px);
        padding-top: px2rem(50px);
        .code-wrap{
            width: px2rem(204px);
            height: px2rem(204px);
            background: #ffffff;
            border-radius: px2rem(8px);
            padding: px2rem(8px);
            margin-left: auto;
            margin-right: auto;
            margin-bottom: px2rem(50px);
            .code {
                display: inline-block;
                width: px2rem(188px);
                height: px2rem(188px);
                background-repeat: no-repeat;
                background-size: cover;
            }
        }
        .btns{
            width: px2rem(320px);
            height: px2rem(80px);
            background: linear-gradient(180deg,#d27bff, #9358ff);
            border-radius: px2rem(40px);
            font-size: px2rem(28px);
            font-family: SourceHanSansCN, SourceHanSansCN-Medium;
            font-weight: 500;
            text-align: center;
            color: #ffffff;
            line-height: px2rem(80px);
            margin-left: auto;
            margin-right: auto;
            margin-bottom: px2rem(30px);
        }
        .tip{
            width: px2rem(144px);
            height: px2rem(24px);
            opacity: 0.8;
            font-size: px2rem(24px);
            font-family: SourceHanSansCN, SourceHanSansCN-Regular;
            font-weight: 400;
            text-align: left;
            color: #431744;
            line-height: px2rem(24px);
            margin-left: auto;
            margin-right: auto;
        }
    }
  }
}
</style>
