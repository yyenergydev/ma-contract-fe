// latest: zhangmyh 2017-2-15 3:25 PM
import { Model } from 'common'
import './material'
import './supplier'
import './templete'

Model.define('bidtrade.detail', {
  proxy: {
    get: '/cpu-bidtrade/bidtrade/getBidTradebyId',
    post: '/cpu-bidtrade/bidtrade/save'
  },
  meta: {
    // 基础信息
    id: { type: 'integer' },
    title: { type: 'string' },
    createTime: { type: 'date' },
    modifiedtime: { type: 'date' },
    // 对供应商要求
    supBusinessMode: { type: 'string' },
    supBusinessScope: { type: 'string' },
    supRegisterMoney: 0,
    deliveryAddress: { type: 'string' },
    bidFile: { type: 'string' },
    paytype: { type: 'string' },
    deliveryCon: { type: 'string' },
    supCertificateRequire: { type: 'string' },
    supInvoiceRequire: { type: 'string' },
    supOtherRequire: { type: 'string' },
    // 竞价设置
    registEndTime: { type: 'string', required: true, nullMsg: '请添加报名截止时间' },
    bidStartTime: { type: 'string', required: true, nullMsg: '请添加竞价开始时间' },
    biddingTime: { type: 'integer', required: true, nullMsg: '请添加竞价时长' },
    delayTime: '',
    promptList: { type: 'integer' },
    bidType: '', // { type: 'string', required: true, nullMsg: '请选择竞价方式', },
    lowBiddingSteptype: { type: 'string' },
    lowBiddingStep: { type: 'string' },
    highPrice: { type: 'string' },
    lowPrice: { type: 'string' },
    bidProcess: { type: 'string', required: true, nullMsg: '请选择竞价过程' },
    qualifiedAudit: { type: 'string', required: true, nullMsg: '请选择资格审核' },
    supervisorId: { type: 'integer' },
    supervisorName: { type: 'string' },
    // 报价模版
    quoteMode: { type: 'string'
    /* , required: true */ },
    // 发布渠道及联系方式
    inquiryScope: { type: 'string', required: true, nullMsg: '请选择询价渠道' },
    inquiryType: { type: 'string' },
    contactType: { type: 'string', required: true, nullMsg: '请选择联系方式' },
    contact: {type: 'string', required: true, nullMsg: '请选择联系人'},
    tel: {required: true, nullMsg: '请添加联系电话', validType: 'phone', notipFlag: true, hasSuccess: true},
    email: { type: 'string' },
    isCtrlOpen: '' // 是否启用监督人
  },
  associations: {
    bidtradeMaterialList: {
      type: 'hasMany', // hasMany
      model: 'bidtrade.material'
    },
    bidtradeSupplierList: {
      type: 'hasMany',
      model: 'bidtrade.supplier'
    },
    bidtradeTempleteList: {
      type: 'hasMany',
      model: 'bidtrade.templete'
    }
  }
})

export default Model.create('bidtrade.detail')
