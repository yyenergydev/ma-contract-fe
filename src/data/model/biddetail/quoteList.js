// latest: wangk2 2017-2-21 06:35 PM
import {Model} from 'common'
Model.define('ycctrl.quotelist', {
  proxy: {
    loadmethod: 'post',
    get: '/cpu-bidtrade/bidtrade/getBidQuotedetail'
  },
  meta: {
    'sortItemMap': null,
    'extFields': null,
    'enterpriseId': null,
    'enterpriseName': null,
    'sysVersion': null,
    'createTime': { type: 'date' },
    'modifiedtime': { type: 'date' },
    'creator': null,
    'modifier': null,
    'dr': null,
    'id': null,
    'supplyId': null,
    'bidtradeId': null,
    'latestPrice': null,
    'bidPrice': null,
    'initPrice': null,
    'outReason': null,
    'status': { type: 'integer' },
    'supplyName': '',
    'sortno': '', // 排名
    'bidRound': '',
    'bidTime': { type: 'date' },
    'bidtradeSupply': null,
    'range': '',
    'roundStatus': '',
    'isquote': '',
    'bidquoteblist': null,
    'freight': null
  }
})
export default Model.create('ycctrl.quotelist')
