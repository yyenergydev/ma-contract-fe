// latest: wangk2 2017-2-21 06:35 PM
import {Model} from 'common'
Model.define('bidtrade.biddingInfo', {
  proxy: {
    get: '/cpu-bidtrade/bidtradeRegister/getRegisterbyTradeid'
  },
  meta: {
    'bidtradeID': '', // 竞价单ID number
    'bidtradeInvoiceInfo': '', //  竞价单发票信息 number
    'bidtradePromise': '', // 竞价承诺 string
    'createTime': '', // 创建时间  string
    'creator': '', // 创建人  string
    'dr': '', //  删除标记 boolean
    'enterpriseId': '', // 企业id  number
    'enterpriseName': '', // 企业名称  string
    'extFields': '', //
    'id': '', // number
    'modifiedtime': '', // 修改时间 string
    'modifier': '', // 修改人ID number
    'sortItemMap': '', //
    'state': '', // 状态（0：保存，1：已报名....）number
    'supplierID': '', // 供应商IDnumber
    'sysVersion': ''
  }
})
export default {
  trade: Model.create('bidtrade.biddingInfo'),
}

