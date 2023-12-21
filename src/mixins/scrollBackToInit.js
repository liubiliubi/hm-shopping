export default {
  beforeRouteLeave (to, from, next) {
    this.scrollY = document.documentElement.scrollTop
    next()
  },
  activated () {
    document.documentElement.scrollTo(0, this.scrollY)
  },
  data () {
    return {
      scrollY: 0 // 记录离开页面前的滚动高度
    }
  }
}
