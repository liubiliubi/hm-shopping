import store from '@/store'
import axios from 'axios'
import { Toast } from 'vant'

// 创建axios实例，好处：不会污染原始的axios实例
// 接口文档地址 'https://apifox.com/apidoc/shared-12ab6b18-adc2-444c-ad11-0e60f5693f66/doc-2221080'
const instance = axios.create({
  baseURL: 'http://cba.itlike.com/public/index.php?s=/api/',
  timeout: 5000
})

// 自定义配置 - 请求/响应 拦截器
// 添加请求拦截器
instance.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    // 开启laoding，禁止背景点击（节流处理，防止多次无效触发）
    Toast.loading({
      message: '加载中...',
      forbidClick: true,
      loadingType: 'spinner', // 配置loading图标
      duration: 0 // 只能clear()手动清楚 toast 轻提示
    })

    // 只要有token，就在请求时携带，便于请求需要授权的接口
    const token = store.getters.token
    if (token) {
      config.headers['Access-Token'] = token
      config.headers.platform = 'H5'
    }

    return config
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 添加响应拦截器
instance.interceptors.response.use(
  function (response) {
    // 2xx 范围内的状态码都会触发该函数
    // 对响应数据做点什么
    const res = response.data
    if (res.status !== 200) {
      // 给错误提示
      Toast(res.message)
      // 抛出一个错误的promise
      return Promise.reject(res.message)
    } else {
      Toast.clear()
    }
    return res
  },
  function (error) {
    // 对响应错误做点什么
    return Promise.reject(error)
  }
)

// 导出实例
export default instance
