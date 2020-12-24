import request from '@/utils/request'

export function fetchList(data) {
  return request({
    url: '/user/getUserList.do',
    method: 'get',
    data
  })
}
export function createAccount(data) {
  // return request({
  //   url: '/user/login.do',
  //   method: 'post',
  //   data
  // })
}
export function updateAccount(data) {
  // return request({
  //   url: '/user/login.do',
  //   method: 'post',
  //   data
  // })
}
