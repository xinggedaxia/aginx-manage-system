import request from '@/utils/request'

export function fetchList(data) {
  return request({
    url: '/operation/getOperationList.do',
    method: 'get',
    params: data
  })
}
