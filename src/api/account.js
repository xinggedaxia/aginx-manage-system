import request from '@/utils/request'
import jsencrypt from '@/utils/jsencrypt'

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
  return request({
    url: '/user/updateUserInfo.do',
    method: 'post',
    data
  })
}

export function updatePasswordApi(data) {
  const pwdOld = jsencrypt.encrypt(data.password)
  const pwdNew = jsencrypt.encrypt(data.newPassword)
  return request({
    url: '/user/updatePwd.do',
    method: 'post',
    data: {
      pwdOld,
      pwdNew
    }
  })
}

export function updateInfoSelfApi(data) {
  return request({
    url: '/user/updateInfoSelf.do',
    method: 'post',
    data: data
  })
}
