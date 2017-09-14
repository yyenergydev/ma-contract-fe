// latest: wangk2 2017-2-21 06:35 PM
import {Model} from 'common'
import './bidMonitorHistorylist'
Model.define('bidtrade.bidmonitorHistory', {
  proxy: {
    loadmethod: 'get',
    get: '/cpu-bidtrade/bidtrade/bidquote/getquoteDetailList'
  },
  meta: {
    'bidquote': '', //
    'bidEndTime': {type: 'date'}, // 截止时间
    'bidName': '',
    'id': '',
    'supplyId': '',
    'bidtradeId': '',
    'supplyName': '',
    'fields': ''
  },
  associations: {
    datalist: {
      type: 'hasMany', // hasMany
      model: 'bidtrade.bidMonitorHistorylist'
    }
  }
})
export default Model.create('bidtrade.bidmonitorHistory')

