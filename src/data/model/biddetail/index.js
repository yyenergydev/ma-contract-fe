// latest: wangk2 2017-2-21 06:35 PM
import {Model} from 'common'
import './quotelist'
Model.define('ycctrl.biddetail', {
  proxy: {
    get: '/cpu-bidtrade/bidtrade/getBiddetail'
  },
  meta: {
    'code': '', // 编号
    'enterpriseName': '', // 发起公司
    'materials': '', // 竞价物料
    'registEndTime': '', // 报名截止日期
    'title': '' // 标题
  },
  associations: {
    quotelist: {
      type: 'hasMany', // hasMany
      model: 'ycctrl.quotelist'
    }
  }
})

export default Model.create('ycctrl.biddetail')
