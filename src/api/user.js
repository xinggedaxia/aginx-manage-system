import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/login.do',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/user/getInfo.do',
    method: 'get'
    // params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}
