// latest: 马红更 2017-9-22 9:27 AM
import { Model } from 'common'
import './ruledetail'

Model.define('coderule', {
  proxy: {
    get: '/ma-contract/coderule/queryByPk',
    post: '/ma-contract/coderule/save',
    delete: '/ma-contract/coderule/delete'
  },
  meta: {
    // 基础信息
    id: {type: 'integer'},
    parentId: {type: 'integer'},
    parentName: {type: 'string'},
    level: {type: 'integer'},
    code: {type: 'string'},
    name: {type: 'string'},
    codelength: {type: 'integer'},
    codetype: {type: 'string'},
    creator: {type: 'integer'},
    creationtime: {type: 'string'},
    modifier: {type: 'integer'},
    modifytime: {type: 'string'},
    pkGroup: {type: 'integer'},
    pkOrg: {type: 'integer'},
    dr: {type: 'integer'},
    vdef1: {type: 'string'}
  },
  associations: {
    detailList: {
      type: 'hasMany', // hasMany
      model: 'coderule.detail'
    },
  }
})
//alert(coderule.detail)
export default Model.create('coderule')
