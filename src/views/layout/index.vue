<template lang="">
  <div>
    <keep-alive :include="keepArr">
      <router-view></router-view>
    </keep-alive>
    <van-tabbar
      v-model="active"
      active-color="#ee0a24"
      inactive-color="#000"
      route
    >
      <van-tabbar-item icon="wap-home-o" to="/home">首页</van-tabbar-item>
      <van-tabbar-item icon="apps-o" to="/category">分类</van-tabbar-item>
      <van-tabbar-item icon="shopping-cart-o" to="/cart"
        >购物车</van-tabbar-item
      >
      <van-tabbar-item icon="user-o" to="/user">用户</van-tabbar-item>
    </van-tabbar>
  </div>
</template>
<script>
export default {
  name: 'LayoutIndex',
  data () {
    return {
      active: 0,
      keepArr: ['HomePage', 'CategoryPage']
    }
  }
}
</script>
<style lang=""></style>
