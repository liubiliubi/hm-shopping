import { getInfo, setInfo } from '@/utils/storage'

export default {
  namespaced: true,
  state () {
    return {
      userInfo: getInfo()
    }
  },
  mutations: {
    setUserInfo (state, newUserInfo) {
      state.userInfo = newUserInfo
      setInfo(newUserInfo)
    }
  },
  actions: {
    logout (context) {
      // 个人信息要重置
      context.commit('setUserInfo', {})

      // 购物车信息要重置(跨模块)
      context.commit('cart/setCartList', [], { root: true })
    }
  },
  getters: {}
}
