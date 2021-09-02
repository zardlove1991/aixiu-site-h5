<template>
  <DialDialog :show="show" @close="onClose">
    <div slot="tille-name" class="tille-name">收获地址</div>
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
          v-model="user.name"
          name="真实姓名"
          placeholder="真实姓名"
          :rules="formRules.name"
          class="form-input"
        />
        <van-field
          v-model="user.phone"
          name="手机号"
          placeholder="手机号"
          :rules="formRules.phone"
          class="form-input"
        />
        <van-field
          type="textarea"
          v-model="user.address"
          name="详细地址"
          placeholder="详细地址"
          :rules="formRules.address"
          class="form-textarea"
        />
        <div class="form-sub">
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
export default {
  name: 'Address',
  components: { DialDialog },
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      user: { name: '', phone: '', address: '' },
      formRules: {
        name: [{ required: true, message: '真实姓名不能为空' }],
        phone: [
          { required: true, message: '手机号不能为空' },
          {
            pattern:
              /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/,
            message: '手机号格式错误'
          }
        ],
        address: [{ required: true, message: '详细地址不能为空' }]
      }
    }
  },
  computed: {},
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
    onSubmit (values) {
      this.$toast.loading({
        message: '提交中...', // 提升文本
        forbidClick: true, // 是否启用遮罩层
        duration: 0 // 展示时长，为0时一直存在
      })
      try {
        this.close()
      } catch (error) {
        // console.log(error)
      }
    },
    onFailed (error) {
      console.log('验证失败', error)
    }
  }
}
</script>

<style scoped lang="scss">
@import "@/styles/index.scss";
.container {
  padding-top: px2rem(50px);
  padding-left: px2rem(40px);
  padding-bottom: 0 !important;
  .tips {
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
    .form-textarea{
        width: px2rem(520px);
        height: px2rem(140px);
        opacity: 1;
        background: #f8efdc;
        border-radius: px2rem(8px);
        padding:  0 px2rem(30px);
        overflow-y: auto;
        margin-bottom:px2rem(60px);
    }
    .form-btn{
        width: px2rem(300px);
        height: px2rem(80px);
        opacity: 1;
        background: linear-gradient(0deg,#ffdaa3 1%, #ffebc5);
        border-radius: px2rem(16px);
        margin: auto;
        // box-shadow: 0 10px 8px -8px #ECBD7B;
        box-shadow: 0 px2rem(16px) 0px 0px #e5b56b;
    }
  }
}
</style>
