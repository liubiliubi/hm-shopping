<template lang="">
  <div class="login">
    <van-nav-bar title="会员登陆" left-arrow @click-left="$router.go(-1)" />
    <div class="container">
      <!-- title 区域 -->
      <div class="title">
        <h3>手机号登陆</h3>
        <p>未注册的手机号登录后将自动注册</p>
      </div>

      <!-- form 区域 -->
      <div class="form">
        <div class="form-item">
          <input
            class="inp"
            maxlength="11"
            placeholder="请输入手机号码"
            type="text"
            v-model="mobile"
          />
        </div>
        <div class="form-item">
          <input
            class="inp"
            maxlength="11"
            placeholder="请输入图形验证码"
            type="text"
            v-model="picCode"
          />
          <img v-if="picUrl" :src="picUrl" alt="" @click="getPicCode" />
        </div>
        <div class="form-item">
          <input
            class="inp"
            maxlength="11"
            placeholder="请输入短信验证码"
            type="text"
            v-model="smsCode"
          />
          <button @click="getSmsCode">
            {{
              second === totalSecond
                ? '获取验证码'
                : '(' + second + ')' + '秒后重新发送'
            }}
          </button>
        </div>

        <!-- button 区域 -->
        <div class="login-btn" @click="login">登录</div>
      </div>
    </div>
  </div>
</template>
<script>
import { getPicCode, getSmsCode, codeLogin } from '@/api/login'
import { mapMutations } from 'vuex'
export default {
  name: 'LoginIndex',
  data () {
    return {
      picCode: '',
      picKey: '',
      picUrl: '',
      totalSecond: 60,
      second: 60,
      timer: null, // 定时器id
      mobile: '',
      smsCode: ''
    }
  },
  methods: {
    ...mapMutations('user', ['setUserInfo']),
    // 图形验证码
    async getPicCode () {
      const {
        data: { base64, key }
      } = await getPicCode()
      this.picUrl = base64
      this.picKey = key
    },
    // 短信验证码 设置了节流阀
    async getSmsCode () {
      if (!this.validFn()) {
        return
      }
      // 当目前没有定时器开着，且 totalSecond 和 second 一致（秒数归为）才可以开始倒计时
      if (!this.timer && this.second === this.totalSecond) {
        // 发起请求（希望如果响应的status非200，最好抛出一个promise错误，await只会等待成功的promise）
        await getSmsCode(this.picCode, this.picKey, this.mobile).catch(err => {
          console.log(err)
          this.getPicCode()
          this.picCode = ''
          throw Error('123')
        })
        // if (res.status === 500) {
        //   this.getPicCode()
        //   this.picCode = ''
        //   return
        // }
        this.$toast('短信发送成功,请注意查收~')
        // 开启倒计时
        this.timer = setInterval(() => {
          this.second--
          if (this.second <= 0) {
            clearInterval(this.timer)
            this.timer = null
            this.second = this.totalSecond
          }
        }, 1000)
      }
    },
    // 校验两个验证码是否合法
    validFn () {
      if (!/^1[3-9]\d{9}$/.test(this.mobile)) {
        this.$toast('请输入正确的电话号码！')
        return false
      }
      if (!/^\w{4}$/.test(this.picCode)) {
        this.$toast('请输入正确的图形验证码！')
        return false
      }
      return true
    },
    // 登录
    async login () {
      if (!this.validFn()) {
        return
      }
      if (!/^\d{6}$/.test(this.smsCode)) {
        this.$toast('请输入正确的手机验证码')
        return
      }

      const res = await codeLogin(this.mobile, this.smsCode)
      this.setUserInfo(res.data)
      this.$toast('登陆成功')
      const url = this.$route.query.backUrl || '/'
      this.$router.replace(url)
    }
  },
  created () {
    this.getPicCode()
  },
  // 离开页面清楚定时器
  destroyed () {
    clearInterval(this.timer)
  }
}
</script>
<style lang="less" scoped>
.container {
  padding: 49px 29px;

  .title {
    margin-bottom: 20px;
    h3 {
      font-size: 26px;
      font-weight: normal;
    }
    p {
      line-height: 40px;
      font-size: 14px;
      color: #b8b8b8;
    }
  }
  .form-item {
    border-bottom: 1px solid #f3f1f2;
    padding: 8px;
    margin-bottom: 14px;
    display: flex;
    align-items: center;
    .inp {
      display: block;
      border: none;
      outline: none;
      height: 32px;
      font-size: 14px;
      flex: 1;
    }
    img {
      width: 94px;
      height: 31px;
    }
    button {
      height: 31px;
      border: none;
      background-color: transparent;
      color: #cea26a;
      font-size: 13px;
      padding-left: 9px;
    }
  }
  .login-btn {
    width: 100%;
    height: 42px;
    margin-top: 39px;
    background: linear-gradient(90deg, #ecb53c, #ff9211);
    color: #fff;
    border-radius: 39px;
    box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.1);
    letter-spacing: 2px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
