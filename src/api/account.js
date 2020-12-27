import request from '@/utils/request'

export function fetchList(data) {
  return request({
    url: '/user/getUserList.do',
    method: 'get',
    params: data
  })
}

export function createApi(data) {
  return request({
    url: '/user/addUser.do',
    method: 'post',
    data
  })
}
export function deleteApi(data) {
  return request({
    url: '/user/deleteUser.do',
    method: 'post',
    data
  })
}

export function updateAccount(data) {
  // return request({
  //   url: '/user/login.do',
  //   method: 'post',
  //   data
  // })
}
