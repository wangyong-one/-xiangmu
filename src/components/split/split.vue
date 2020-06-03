// 是维护详情页面的内容之间的空条 因为多次用到就抽象成一个组件
<template>
  <div class="split"></div>
</template>

<script>
  export default {
    name: 'split'
  }
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"
  .split
    width: 100%
    height: 16px
    border-top: 1px solid $color-row-line
    border-bottom: 1px solid $color-row-line
    background: $color-background-ssss
</style>
