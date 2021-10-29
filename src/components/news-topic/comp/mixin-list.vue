<template>
<div>
  <div v-for='(item, index) in columnList' :key='index'>
    <MixinListItem :itemObj='item' :isMobileHeaderIconType='isMobileHeaderIconType'></MixinListItem>
  </div>
</div>
</template>

<script>
import MixinListItem from './mixin-list-item.vue'
import STORAGE from '@/utils/storage'
export default {
  data () {
    return {
      curDetailInfo: {},
      columnList: [],
      isMobileHeaderIconType: true
    }
  },
  components: {
    MixinListItem
  },
  mounted () {
    let curId = this.$route.query.id
    this.curDetailInfo = STORAGE.get('detailInfo')
    // 判断是不是隐藏图标
    let isMobileHeaderIcon = this.curDetailInfo.limit.column_set.is_mobile_header_icon
    if (isMobileHeaderIcon === 1) {
      this.isMobileHeaderIconType = true
    } else if (isMobileHeaderIcon === 0) {
      this.isMobileHeaderIconType = false
    }
    this.columnList = []
    for (let i of this.curDetailInfo.limit.column_set.column_list) {
      if (i.id === curId) {
        this.columnList = [i]
      }
    }
  },
  methods: {

  }
}
</script>

<style lang='scss' scoped>

</style>
