// latest: wangk2 2017-2-21 06:35 PM
import {Model} from 'common'
import './detail'
Model.define('bidtrade.biddingApply', {
  proxy: {
    get: '/cpu-bidtrade/bidtradeRegister/getTradebyTradeid'
  },
  meta: {
    'bidDeposit': '', // 竞价保证金 string
    'bidStartTime': {type: 'datetime'}, //  竞价单开始日期 string
    'contact': '', // 公司联系人 string
    'email': '', // 邮箱  string
    'fax': '', // 传真  string
    'id': '', //  竞价单id number
    'registEndTime': {type: 'datetime'}, //  报名截止时间  string
    'tel': '', // 联系电话  string
    'title': '', // 竞价单标题 string
    'code': '', // 编号
    'purEnterpriseName': '',
    'enterpriseName': '', // 发起公司
    'supCertificateRequire': '', // 证件要求
    'otherCert': '',
    'supOtherRequire': '' // 供应商其他要求
  },
  associations: {
    bidtradeMaterialList: {
      type: 'hasMany', // hasMany
      model: 'ycctrl.bidingApplydetail'
    }
  }
})
export default {
  trade: Model.create('bidtrade.biddingApply'),
}

