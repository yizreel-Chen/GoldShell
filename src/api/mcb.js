import request from "../utils/request";

// 获取矿机运行数据
export function getmcbcgminer(params) {
  return request({
    url: '/mcb/cgminer',
    method: 'get',
    params
  })
}

// 获取矿机网络信息
export function getmcbip(params) {
  return request({
    url: '/mcb/ip',
    method: 'get',
    params
  })
}

// 设置矿机ip
export function setmcbip(data) {
  return request({
    url: '/mcb/ip',
    method: 'put',
    data
  })
}

// 获得矿机配置信息
export function getmcbsetting(params) {
  return request({
    url: '/mcb/setting',
    method: 'get',
    params
  })
}

// 设置矿机运行参数
export function setmcbsetting(data) {
  return request({
    url: '/mcb/setting',
    method: 'put',
    data
  })
}

// 获得矿机矿池设置信息
export function getmcbpools(params) {
  return request({
    url: '/mcb/pools',
    method: 'get',
    params
  })
}

// 设置矿机信息
export function setmcbpools(data) {
  return request({
    url: '/mcb/pools',
    method: 'put',
    data
  })
}

// 设置新矿池
export function setmcbnewpool(data) {
  return request({
    url: '/mcb/newpool',
    method: 'put',
    data
  })
}

// 获得矿机信息
export function getmcbstatus(params) {
  return request({
    url: '/mcb/status',
    method: 'get',
    params
  })
}

// 恢复矿机出场设置
export function factoryreset(data) {
  return request({
    url: '/mcb/facrst',
    method: 'put',
    data
  })
}

// 重启矿机
export function restartmcbminer(data) {
  return request({
    url: '/mcb/restart',
    method: 'put',
    data
  })
}

// 更新镜像
export function uploadimage(data) {
  return request({
    url: '/mcb/uploadimage',
    method: 'post',
    data
  })
}

// 获得矿机算法信息
export function getmcbalgosetting(params) {
  return request({
    url: '/mcb/algosetting',
    method: 'get',
    params
  })
}

// 设置矿机运行算法
export function setmcbalgosetting(data) {
  return request({
    url: '/mcb/algosetting',
    method: 'put',
    data
  })
}

// 删除矿池
export function deletepool(data) {
  return request({
    url: '/mcb/delpool',
    method: 'put',
    data
  })
}

// 获取教程
export function gettutorial(params) {
  return request({
    url: '/mcb/tutorial',
    method: 'get',
    params
  })
}

// 获取WIFI网络列表
export function getwifiList(params) {
  return request({
    url: '/mcb/wifisetting',
    method: 'get',
    params
  })
}

// 切换WIFI网络
export function changewifi(data) {
  return request({
    url: '/mcb/wifisetting',
    method: 'put',
    data
  })
}
