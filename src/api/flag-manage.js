import request from '@/utils/request'

export function fetchList(data) {
  return request({
    url: '/mark/getmarkList.do',
    method: 'get',
    params: data
  })
}

export function createFlag(data) {
  return request({
    url: '/mark/addMark.do',
    method: 'post',
    data
  })
}

export function deleteFlag(id) {
  return request({
    url: '/mark/deleteMark.do',
    method: 'post',
    data: { id }
  })
}

export function updateFlag(data) {
  return request({
    url: '/mark/updateMark.do',
    method: 'post',
    data
  })
}
export function getAllFlag() {
  return request({
    url: '/mark/getAllMarks.do',
    method: 'get'
  })
}
