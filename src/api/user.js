import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/login.do',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/user/getInfo.do',
    method: 'get'
  })
}

export function logout() {
  alert('from api/user:这儿要对接口')
  return Promise.resolve()
  // return request({
  //   url: '/vue-admin-template/user/logout',
  //   method: 'post'
  // })
}
