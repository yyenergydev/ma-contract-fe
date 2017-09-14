// latest: wangk2 2017-2-21 06:35 PM
import {Model} from 'common'
import './bidquoteblist'
Model.define('bidtrade.bidmonitorInfo', {
  proxy: {
    loadmethod: 'get',
    get: '/cpu-bidtrade/bidtrade/getquoteDetail'
  },
  meta: {
    'bidPrice': '', // 报价金额 number
    'bidRound': '', //  报价轮次 number
    'bidTime': {type: 'date'}, // 报价时间 string
    'bidtradeId': '', // 竞价单id  number
    'enterpriseId': '', // 租户id  number
    'initPrice': '', //  初始报价 number
    'isOnline': '', // 是否在线  boolean
    'isquote': '',
    'latestPrice': '', // 最新报价  number
    'outReason': '', // 淘汰原因 string
    'status': '', // 状态 number 0:未报价，1:报价中，2:淘汰
    'supplyId': '', // 供应商id number
    'supplyName': '', // 供应商名称 string
    'range': '', // 降幅
    'freight': 0// 物流费用
  },
  associations: {
    bidquoteblist: {
      type: 'hasMany', // hasMany
      model: 'bidtrade.bidquoteblist'
    }
  }
})
export default Model.create('bidtrade.bidmonitorInfo')

