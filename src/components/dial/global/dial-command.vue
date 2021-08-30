<template>
   <DialDialog :show="show" @close="close()">
       <div slot="tille-name" class="tille-name">输口令开启抽奖</div>
        <div slot="container" class="container">
        </div>
   </DialDialog>
</template>

<script>
import DialDialog from '@/components/dial/global/dial-dialog'
import { mapMutations } from 'vuex'
export default {
  name: '',
  components: { DialDialog },
  props: {
    show: {
      type: Boolean,
      default: false
    }
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
    ...mapMutations('dial', {
      setIsModelShow: 'SET_IS_MODEL_SHOW'
    })
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
</style>
