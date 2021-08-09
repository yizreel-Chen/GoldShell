import request from '../utils/request'

// 获得矿机的实时算力曲线
export function getcpbhshistory(params) {
  return request({
    url: '/cpb/hshistory',
    method: 'get',
    params
  })
}
