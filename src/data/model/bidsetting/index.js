import {Model} from 'common'
import './templete'
import './passwordmanage'
Model.define('ycctrl.bidsetting', {
  proxy: {
    get: '/cpu-bidtrade/bidtrade/getDataForSetPageById',
    post: '/cpu-bidtrade/bidtrade/saveForSetPage'
  },
  meta: {
    registEndTime: { type: 'string', required: true, nullMsg: '请添加报名截止时间' },
    bidStartTime: { type: 'string', required: true, nullMsg: '请添加竞价开始时间' },
    biddingTime: { type: 'integer', required: true, nullMsg: '请添加竞价时长' },
    delayTime: '',
    promptList: { type: 'integer' },
    bidType: { type: 'string' },
    lowBiddingSteptype: { type: 'string' },
    lowBiddingStep: { type: 'string' },
    highPrice: { type: 'integer' },
    lowPrice: { type: 'integer' },
    bidProcess: { type: 'string', required: true, nullMsg: '请选择竞价过程' },
    quoteMode: { type: 'string', required: true, nullMsg: '请选择报价模式' },
    supervisorName: '',
    supervisorId: '',
    qualifiedAudit: '',
  },
  associations: {
    bidtradeTempleteList: {
      type: 'hasMany', // hasMany
      model: 'bidsetting.templete'
    },
    bidtradeRegisterList: {
      type: 'hasMany', // hasMany
      model: 'bidsetting.passwordMng'
    }
  }
})

export default Model.create('ycctrl.bidsetting')
