import request from '@/utils/request'

/*
  题目类型
*/

/*
  题目维护
*/

// 新增
export function addQuestion(data) {
  return request({
    url: '/ques/addQues.do',
    method: 'post',
    data
  })
}
