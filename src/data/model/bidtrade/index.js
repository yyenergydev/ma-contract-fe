// latest: zhangmyh 2017-3-15 9:27 AM
import { Model } from 'common'
import './material'
import './supplier'
import './templete'

Model.define('bidtrade.detail', {
  proxy: {
    get: '/cpu-bidtrade/bidtrade/getBidTradebyIdforsup',
    post: '/cpu-bidtrade/bidtrade/save'
  },
  meta: {
    // 基础信息
    id: { type: 'integer' },
    title: { type: 'string', required: true, nullMsg: '请添加竞价标题' },
    createTime: { type: 'date' },
    modifiedtime: { type: 'date' },
    regNum: '',
    // 对供应商要求
    supBusinessMode: { type: 'string' },
    supBusinessScope: { type: 'string' },
    supRegisterMoney: { type: 'integer', errorMsg: '注册资金请输入数字' },
    deliveryAddress: { type: 'string' },
    bidDeposit: { type: 'integer', errorMsg: '竞价保证金请输入数字' },
    paytype: { type: 'string' },
    deliveryCon: { type: 'string' },
    supCertificateRequire: { type: 'string' },
    otherCert: '', // 添加其他证件要求 // 添加其他证件要求
    supInvoiceRequire: { type: 'string' },
    supOtherRequire: { type: 'string' }, // 其他要求
    // 竞价设置
    registEndTime: {
      type: 'date',
      check: function (data) {
        let status = 1
        let msg = ''
        if (!data) {
          status = 0
          msg = '请添加报名截止时间'
        } else {
          let now = new Date()
          if (data < now.getTime()) {
            status = 0
            msg = '报名截止时间早于当前时间'
          }
        }
        return { status, msg }
      }
    },
    bidStartTime: {type: 'date', required: true, nullMsg: '请添加竞价开始时间'},
    biddingTime: {
      type: 'integer',
      required: true,
      nullMsg: '请添加竞价时长',
      check: function (data) {
        let msg = ''
        let status = 1
        if (data > 10000) {
          status = 0
          msg = '竞价时长不能超过10000'
        }
        return { status, msg }
      } },
    delayTime: '',
    supervisors: '',
    supervisors_: '',
    promptList: { type: 'integer' },
    bidType: '', // { type: 'string', required: true, nullMsg: '请选择竞价方式', },
    lowBiddingSteptype: { type: 'string', default: {value: '1'} },
    lowBiddingStep: { type: 'string', regexp: '^\\+?[1-9]?[0-9]*$', regmsg: '步长请输入非零的正整数' },
    highPrice: { type: 'integer', errorMsg: '最高限价请输入数字' },
    lowPrice: { type: 'integer', errorMsg: '最低限价请输入数字' },
    bidProcess: { type: 'string', required: true, nullMsg: '请选择竞价过程' },
    qualifiedAudit: { type: 'string', errorMsg: '请选择资格审核' },
    supervisorId: { type: 'integer' },
    supervisorName: { type: 'string' },
    hasSuperviseDept: '', // 是否启用监督人
    // 报价模版
    quoteMode: { type: 'string', default: {value: '2'} }, // 默认为2
    // 发布渠道及联系方式
    inquiryScope: { type: 'string', required: true, nullMsg: '请选择竞价范围' },
    inquiryType: { type: 'string' },
    contactType: { type: 'string', required: true, nullMsg: '请选择联系方式' },
    contact: {type: 'string', required: true, nullMsg: '请选择联系人'},
    purchaseEn: '', // 默认采购企业
    tel: {type: 'number', required: true, nullMsg: '请添加联系电话'},
    email: { type: 'string' },
    isCtrlOpen: '', // 是否启用监督人
    preQualification: '',
    statusName: ''
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
