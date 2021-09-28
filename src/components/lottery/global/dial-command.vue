<template>
   <DialDialog :show="show" @close="onClose" v-if="show">
       <div slot="tille-name" class="tille-name">输口令开启抽奖</div>
        <div slot="container" class="container">
          <span class="tips">请务必填写以下信息，奖品才能送到您手中</span>
          <van-form
            @submit="onSubmit"
            @failed="onFailed"
            :show-error="false"
            :show-error-message="false"
            :validate-first="true"
            class="form"
          >
            <van-field
              v-model="user.password"
              name="口令"
              placeholder="请输入口令"
              class="form-input"
            />
            <div class="tips">
               <span >口令提示：{{data.is_pwdTips}}</span>
            </div>
            <div style="margin: 16px">
              <van-button round block  native-type="submit" class="form-btn"
                >确认</van-button
              >
            </div>
          </van-form>
        </div>
   </DialDialog>
</template>

<script>
import DialDialog from '@/components/lottery/global/dial-dialog-title'
import { mapMutations } from 'vuex'
import API from '@/api/module/examination'
export default {
  name: '',
  components: { DialDialog },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      required: true
    },
    isword: {
      type: Number,
      required: true
    },
    data: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      user: { password: this.data.is_pwd },
      formRules: {
        is_pwd: [{ required: true, message: '口令不能为空' }]
      }
    }
  },
  computed: {
    // form: {
    //   get () {
    //     return this.data
    //   },
    //   set (val) {
    //     console.log('rule page数据改变')
    //     this.$emit('update:data', val)
    //   }
    // }
  },
  watch: {
    show (newState) {
      // 更改当前是否显示遮罩的状态
      this.setIsModelShow(newState)
    }
  },
  created () {},
  mounted () {},
  methods: {
    onClose () {
      this.$emit('close')
    },
    ...mapMutations('lottery', {
      setIsModelShow: 'SET_IS_MODEL_SHOW'
    }),
    async onSubmit (values) {
      this.$toast.loading({
        message: '提交中...', // 提升文本
        forbidClick: true, // 是否启用遮罩层
        duration: 0 // 展示时长，为0时一直存在
      })
      try {
        const res = await API.getCheckDraw({ query: { id: this.id }, data: { password: this.user.password } })
        this.$toast.success('验证成功')
        this.$emit('update:isword', res.success)
        this.$parent.onDraw()
        this.onClose()
      } catch (error) {
        this.$toast.fail(error.error_message)
        console.log(error)
      }
    },
    onFailed (error) {
      console.log('验证失败', error)
    }
  }
}
</script>

<style scoped lang='scss'>
@import "@/styles/index.scss";
.title-name{
    width: px2rem(252px);
    height: px2rem(36px);
    opacity: 1;
    font-size: px2rem(36px);
    font-family: SourceHanSansCN, SourceHanSansCN-Medium;
    font-weight: 500;
    text-align: center;
    color: #fff4e3;
    line-height: px2rem(54px);
}
.container {
  padding-top: px2rem(50px);
  padding-left: px2rem(40px);
  padding-bottom: 0 !important;
  .tips{
    width: px2rem(456px);
    height: px2rem(24px);
    opacity: 0.8;
    font-size: px2rem(24px);
    font-family: SourceHanSansCN, SourceHanSansCN-Regular;
    font-weight: 400;
    text-align: left;
    color: #4f0f0f;
    line-height: px2rem(36px);
  }
  .form{
    margin-top:px2rem(30px);
    .form-input{
        width: px2rem(520px);
        height: px2rem(90px);
        opacity: 1;
        background: #f8efdc;
        border-radius: px2rem(8px);
        margin-bottom:px2rem(30px);
        display: flex;
        align-items: center;
        padding:  0 px2rem(30px);
        /deep/ .van-field__control{
            height: px2rem(40px);
            // opacity: 0.3;
            font-size: px2rem(28px);
            font-family: PingFangSC, PingFangSC-Regular;
            font-weight: 400;
            text-align: left;
            color: #4f0f0f;
            line-height: px2rem(40px);
        }
    }
    .form-btn{
        width: px2rem(300px);
        height: px2rem(80px);
        opacity: 1;
        border: none;
        background: linear-gradient(0deg,#ffdaa3 1%, #ffebc5);
        border-radius: px2rem(16px);
        margin: auto;
        // box-shadow: 0 10px 8px -8px #ECBD7B;
        box-shadow: 0 px2rem(16px) 0px 0px #e5b56b;
    }
  }
}
</style>
