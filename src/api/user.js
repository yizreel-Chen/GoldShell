import request from '../utils/request'

// 登录
export function userLogin(params) {
  return request({
    url: '/user/login',
    method: 'get',
    params
  })
}

// 退出登录
export function userLogout(params) {
  return request({
    url: '/user/logout',
    method: 'get',
    params
  })
}

// 修改登录密码
export function updatepassword(params) {
  return request({
    url: '/user/updatepd',
    method: 'put',
    params
  })
}