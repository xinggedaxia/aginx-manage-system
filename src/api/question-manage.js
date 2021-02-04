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
// 获取所有题型
export function getAllQuestion() {
  return request({
    url: '/quesType/getAllQuesType.do',
    method: 'get'
  })
}

/*
  题目维护
*/

// 新增
export function addQuestion(data) {
  return request({
    url: '/question/addQuestion.do',
    method: 'post',
    data
  })
}
// 查询
export function getQuestion(params) {
  return request({
    url: '/question/getQuestionList.do',
    method: 'get',
    params
  })
}
// 更新题目
export function updateQuestion(data) {
  return request({
    url: '/question/updateQuestion.do',
    method: 'post',
    data
  })
}
// 删除
export function deleteQuestion(data) {
  return request({
    url: '/question/deleteQuestion.do',
    method: 'post',
    data
  })
}

