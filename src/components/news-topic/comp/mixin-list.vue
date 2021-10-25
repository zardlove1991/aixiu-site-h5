<template>
<div>
  <div v-for='(item, index) in columnList' :key='index'>
    <MixinListItem :itemObj='item'></MixinListItem>
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
      columnList: []
    }
  },
  components: {
    MixinListItem
  },
  mounted () {
    this.curDetailInfo = STORAGE.get('detailInfo')
    this.columnList = []
    this.columnList = this.curDetailInfo.limit.column_set.column_list
    console.log('detailInfo', this.curDetailInfo)
  },
  methods: {

  }
}
</script>

<style lang='scss' scoped>

</style>
