import request from '@/utils/request'

/*
  题目类型
*/
// 查询
export function getQuestionType(params) {
  return request({
    url: '/quesType/getQuesTypeList.do',
    method: 'get',
    params
  })
}

// 新增
export function addQuestionType(data) {
  return request({
    url: '/quesType/addQuesType.do',
    method: 'post',
    data
  })
}
// 更新
export function updateQuestionType(data) {
  return request({
    url: '/quesType/updateQuesType.do',
    method: 'post',
    data
  })
}
// 删除
export function deleteQuestionType(data) {
  return request({
    url: '/quesType/deleteQuesType.do',
    method: 'post',
    data
  })
}

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
