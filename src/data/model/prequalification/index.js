// latest: wangk2 2017-2-21 06:35 PM
import {Model} from 'common'
import './qualifyDetail'
Model.define('ycctrl.prequalification', {
  proxy: {
    get: '/cpu-bidtrade/bidtrade/getBidqualify',
    post: '/cpu-bidtrade/bidtrade/commitBidqualify'
  },
  meta: {
    'code': '', // 编号
    'enterpriseName': '', // 发起公司
    'materials': '', // 竞价物料
    'registEndTime': '', // 报名截止日期
    'bidStartTime': '',
    'title': ''// 标题
  },
  associations: {
    bidtradeRegisterlist: {
      type: 'hasMany', // hasMany
      model: 'ycctrl.bidingApplydetail'
    }
  }
})

export default Model.create('ycctrl.prequalification')
