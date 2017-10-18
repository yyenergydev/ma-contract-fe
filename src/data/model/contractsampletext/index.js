// latest: 马红更 2017-9-22 9:27 AM
import { Model } from 'common'
// import 'model/contracttype'

Model.define('contractsampletext.detail', {
  proxy: {
    get: '/ma-contract/contractsampletext/queryByPk',
    post: '/ma-contract/contractsampletext/save'
  },
  meta: {
    // 基础信息
    id: {type: 'integer'},
    code: {type: 'string'},
    name: {type: 'string'},
    version: {type: 'float'},
    contracttypeId: {type: 'integer'},
    contracttypeName: {type: 'string'},
    creator: {type: 'integer'},
    creationtime: {type: 'string'},
    modifier: {type: 'integer'},
    modifytime: {type: 'string'},
    pk_group: {type: 'integer'},
    pk_org: {type: 'integer'},
    dr: {type: 'integer'},
    vdef1: {type: 'string'}
  }
})

export default Model.create('contractsampletext.detail')
