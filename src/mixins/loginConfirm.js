export default {
  // 此处编写的就是 vue 组件实例的 配置项， 通过一定的语法，可以直接混入到组件内部
  // data methods computed 生命周期函数 ... 都可以
  // 注意点：如果此处和组件内，提供了同名的 data 或 methods(键名相同) ... 则组件内优先级更高
  methods: {
    loginConfirm () {
      // 判断token是否存在
      // 1.token不存在，弹对话框
      // 2.token存在，继续请求操作
      if (!this.$store.getters.token) {
        // 弹确认框
        this.$dialog
          .confirm({
            confirmButtonText: '去登陆',
            cancelButtonText: '再逛逛',
            title: '温馨提示',
            message: '此操作需要先登录才能继续操作'
          })
          .then(() => {
            // 如果希望登陆后跳转回，需要携带当前的路径作为参数
            this.$router.replace({
              path: '/login',
              query: {
                backUrl: this.$route.fullPath
              }
            })
          })
          .catch(() => {})
        return true
      }
      return false
    }
  }
}
