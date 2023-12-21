<template lang="">
  <keep-alive :include="keepArr">
    <router-view></router-view>
  </keep-alive>
</template>
<script>
export default {
  data () {
    return {
      keepArr: ['LayoutIndex']
    }
  }
}
</script>
<style lang=""></style>
