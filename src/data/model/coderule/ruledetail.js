// latest: 马红更 2017-9-22 9:27 AM
import { Model } from 'common'
// import 'model/contracttype'

Model.define('coderule.detail', {
  proxy: {
    get: '/ma-contract/coderule/queryByPk',
    post: '/ma-contract/coderule/save'
  },
  meta: {
    // 基础信息
    id: {type: 'integer'},
    coderuleId: {type: 'integer'},
    elemtype: {type: 'string'},//0=常量，1=编码实体，2=时间类型，3=流水号
    elemvalue: {type: 'string'},
    elemlength: {type: 'integer'},
    elemorder: {type: 'integer'},
    isrefer: {type: 'string'},//0=非流水依据，1=实体或按年流水，2=按月流水，3=按日流水
    dr: {type: 'integer'},
    vdef1: {type: 'string'}
    
  }
})

export default Model.create('coderule.detail')
