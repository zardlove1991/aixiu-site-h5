<template>
  <div class="dialog" v-if="show">
      <div class="dialog-wrap">
        <div class="dialog-header">
            <div slot="left" class="close-wrap" @click.stop="close()">
              <div class="close"></div>
            </div>
        </div>
        <div class="header-bg"></div>
        <slot class="container"  name='container'></slot>
        <div class="dialog-footer">

        </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  name: '',
  components: {},
  props: {
    show: {type: Boolean, require: true}
  },
  data () {
    return {}
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
    close () {
      this.$emit('close')
    },
    ...mapMutations('lottery', {
      setIsModelShow: 'SET_IS_MODEL_SHOW'
    })
  }
}
</script>

<style scoped lang="scss">
@import "@/styles/index.scss";
.dialog {
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
  padding-left: px2rem(40px);
  padding-right: px2rem(40px);
  // overflow-y: auto;
//   position: relative;
.dialog-wrap{
    width: px2rem(600px);
    height: px2rem(600px);
    opacity: 1;
    background: linear-gradient(181deg,#ff8f68 0%, #ff1a4a 80%, #ff093f 100%);
    border-radius: px2rem(16px);
    position: relative;
}
  .dialog-header{
    width: px2rem(600px);
    height: px2rem(51px);
    background-color:linear-gradient(181deg,#ff8f68 0%, #ff1a4a 80%, #ff093f 100%);
    position: relative;
    opacity: 1;
    .close-wrap{
      width: px2rem(50px);
      height: px2rem(51px);
      // padding-right: px2rem(30px);
      // padding-top: px2rem(30px);
      float: right;
      cursor: pointer;
      position: relative;
      .close{
        width: px2rem(20px);
        height: px2rem(20px);
        // opacity: 0.4;
        @include img-retina("~@/assets/lottery/close_1.png",
        "~@/assets/lottery/close_1@2x.png", 100%, 100%);
        // background-position: top;
        background-repeat: no-repeat;
        position: absolute;
        top:px2rem(30px);
        // right:px2rem(30px);
        cursor: pointer;
        &::after{
            color: #fff;
        }
        z-index: 10;
      }
    }
  }
  .header-bg{
    width: px2rem(600px);
    height: px2rem(202px);
    opacity: 1;
    @include img-retina("~@/assets/lottery/dial-header.png",
    "~@/assets/lottery/dial-header@2x.png", 100%,100%);
    background-repeat: no-repeat;
    position: absolute;
    left:-4%; top:-19.5%;
   }
  .container{
    padding-top: px2rem(50px);
    padding-bottom: px2rem(42px);
    width: px2rem(600px);
    padding-left: px2rem(40px);
    padding-right: px2rem(40px);
    background-color: initial;
  }
  .dialog-footer{
    width: px2rem(380px);
    height: px2rem(20px);
    opacity: 0.8;
    background: #ffcd7d;
    border-radius: 50%;
    filter: blur(40px);
    position: absolute;
    left: px2rem(51px);
    bottom: 0;
  }
}
</style>
