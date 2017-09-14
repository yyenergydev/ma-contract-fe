// latest: wangk2 2017-2-21 06:35 PM
import {Model} from 'common'
Model.define('bidtrade.bidquoteblist', {
  meta: {
    'id': '', //
    'materialId': '', // 物料id number
    'materialName': '', // 物料名称  string
    'purNum': '', // 购买数量   number
    'quoteId': '', // 企业经营范围  string  @mock=石灰石,熟料、水泥
    'reqTime': {type: 'date'}, // 需求时间   string
    'createTime': {type: 'date'}, // 报价时间
    'supplyId': '', //
    'taxPrice': '', //  含税单价
    'taxRate': ''// 税率
  }
})
