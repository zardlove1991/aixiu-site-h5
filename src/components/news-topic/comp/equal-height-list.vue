<template>
<div class='equal-height-wrap'>
  <div v-for='(item, index) in columnList' :key='index'>
    <EqualHeightItemVue :itemObj='item'
      :isMobileHeaderIconType='isMobileHeaderIconType'>
    </EqualHeightItemVue>
  </div>
</div>
</template>

<script>
import EqualHeightItemVue from './equal-height-item.vue'
import STORAGE from '@/utils/storage'
export default {
  data () {
    return {
      columnList: [],
      curDetailInfo: {}
    }
  },
  components: {
    EqualHeightItemVue
  },
  mounted () {
    let curId = this.$route.query.id
    this.curDetailInfo = STORAGE.get('detailInfo')
    this.columnList = []
    for (let i of this.curDetailInfo.limit.column_set.column_list) {
      if (i.id === curId) {
        this.columnList = [i]
      }
    }

    // 判断是不是隐藏图标
    let isMobileHeaderIcon = this.curDetailInfo.limit.column_set.is_mobile_header_icon
    if (isMobileHeaderIcon === 1) {
      this.isMobileHeaderIconType = true
    } else if (isMobileHeaderIcon === 0) {
      this.isMobileHeaderIconType = false
    }
  }
}
</script>

<style lang='scss' scoped>
  @import "@/styles/index.scss";
</style>
