import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  // 开发环境加上 '/proxy' 进入代理
  baseURL: process.env.NODE_ENV === 'development' ? '/proxy' : process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['X-Access-Token'] = getToken()
      // if (config.method === 'get') {
      //   config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
      // }
    }
    return config
  },
  error => {
    // do something with request error
    console.log('ReqError/', error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data

    // 捕获账号异常
    if (res.code === 401 || res.code === 403) {
      // 重新刷新页面（无用户信息）异常会被permission.js捕获，直接跳转到登陆页，此时无需弹窗
      if (store.getters.name) {
        // to re-login
        MessageBox.confirm('你已经被登出, 你可以点击取消留在这个界面, 或者重新登录', '确认登出?', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      } else {
        Message({
          message: res.msg || '身份过期，请重新登录',
          type: 'error',
          duration: 5 * 1000
        })
      }
      return Promise.reject(new Error(res.msg || 'Error'))
    } else if (res.code !== 10000) { // 10000表示成功
      Message({
        message: res.msg || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
      console.log('ResError', res)
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('CatchRrr/' + error) // for debug
    if (error.message) {
      let message = error.message || '请求错误'
      if (error.message.includes('timeout')) {
        message = '请求超时'
      }
      if (error.message.includes('Network Error')) {
        message = '网络请求错误'
      }

      Message({
        message,
        type: 'error',
        duration: 5 * 1000
      })
    } else {
      Message({
        message: '请求错误',
        type: 'error',
        duration: 5 * 1000
      })
    }

    return Promise.reject(error)
  }
)

export default service
