import { changeCount, delSelect, getCartList } from '@/api/cart'
import { Toast } from 'vant'
export default {
  namespaced: true,
  state () {
    return {
      cartList: []
    }
  },
  mutations: {
    setCartList (state, newList) {
      state.cartList = newList
    },
    toggleCheck (state, goodsId) {
      // 对应 ID 的项 状态取反
      const goods = state.cartList.find(item => item.goods_id === goodsId)
      goods.isChecked = !goods.isChecked
    },
    toggleAllCheck (state, flag) {
      // 让所有小选框，同步设置
      state.cartList.forEach(item => {
        item.isChecked = flag
      })
    },
    changeCount (state, { goodsNum, goodsId }) {
      const goods = state.cartList.find(item => item.goods_id === goodsId)
      goods.goods_num = goodsNum
    }
  },
  actions: {
    async getCartAction (context) {
      const {
        data: { list }
      } = await getCartList()
      // 后台返回的数据不包含复选框的选中状态，
      // 需要手动维护数据，给每一项添加一个isChecked 标记
      list.forEach(item => {
        item.isChecked = true
      })
      context.commit('setCartList', list)
    },
    async changeCountAction (context, { goodsNum, goodsId, goodsSkuId }) {
      // 先本地修改
      context.commit('changeCount', { goodsNum, goodsId })
      // 再同步到后台
      await changeCount(goodsNum, goodsId, goodsSkuId)
    },
    // 删除购物车数据
    async delSelectAction (context) {
      const selCartList = context.getters.selCartList
      const cartIds = selCartList.map(item => item.id)
      await delSelect(cartIds)
      Toast('删除成功')

      // 重新拉取最新的购物车数据（重新渲染）
      await context.dispatch('getCartAction')
    }
  },
  getters: {
    cartTotal (state) {
      return state.cartList.reduce(function (sum, item) {
        return (sum += item.goods_num)
      }, 0)
    },
    // 选中的商品项
    selCartList (state) {
      return state.cartList.filter(item => item.isChecked)
    },
    // 选中的总数
    selCount (state, getters) {
      return getters.selCartList.reduce(function (sum, item) {
        return (sum += item.goods_num)
      }, 0)
    },
    // 选中的商品总价
    selPrice (state, getters) {
      return getters.selCartList
        .reduce(function (sum, item) {
          return (sum += item.goods_num * item.goods.goods_price_min)
        }, 0)
        .toFixed(2)
    },
    // 是否全选
    isAllChecked (state) {
      return state.cartList.every(item => item.isChecked)
    }
  }
}
