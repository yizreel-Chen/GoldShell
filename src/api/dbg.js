import request from '../utils/request'

// 获得矿机kernel运行信息
export function getdbgkmsg(params) {
  return request({
    url: '/dbg/kmsg',
    method: 'get',
    params
  })
}

// 获取矿机系统运行信息
export function getdbgsyslog(params) {
  return request({
    url: '/dbg/syslog',
    method: 'get',
    params
  })
}

// 获得矿机系统进程运行信息
export function getdbgpsinfo(params) {
  return request({
    url: '/dbg/psinfo',
    method: 'get',
    params
  })
}

// 获得矿机memory使用信息
export function getdbgmeminfo(params) {
  return request({
    url: '/dbg/meminfo',
    method: 'get',
    params
  })
}

// 获得矿机版本信息
export function getdbgvsinfo(params) {
  return request({
    url: '/dbg/vsinfo',
    method: 'get',
    params
  })
}

// 获得矿机芯片运行信息
export function getdbgicinfo(params) {
  return request({
    url: '/dbg/icinfo',
    method: 'get',
    params
  })
}

// 获得矿机挖矿信息
export function getdbgminerinfo(params) {
  return request({
    url: '/dbg/minerinfo',
    method: 'get',
    params
  })
}

// 获得矿机挖矿软件运行信息
export function getminersyslog(params) {
  return request({
    url: '/dbg/minersyslog',
    method: 'get',
    params
  })
}

// 获得设置矿池和算法的记录信息
export function getminerhistory(params) {
  return request({
    url: '/dbg/minerhistory',
    method: 'get',
    params
  })
}

// 获得矿机监控进程运行信息
export function getmonitorlog(params) {
  return request({
    url: '/dbg/monitorlog',
    method: 'get',
    params
  })
}