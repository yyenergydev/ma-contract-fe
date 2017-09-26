// latest: tangh 2017-9-25 11:27 AM
import { Model } from 'common'

Model.define('model.contracttemplate', {
  proxy: {
    get: '/ma-contract/contracttemplate/getEntityById',
    post: '/ma-contract/contracttemplate/save'
  },
  meta: {
    id: {type: 'integer'},
    code: {type: 'string'}, // 模板编码
    name: {type: 'string'}, // 模板名称
    useScopeIds: {type: 'string'}, // 使用范围
    useScopeNames: {type: 'string'}, // 使用范围
    version: {type: 'string'}, // 版本号
    status: {type: 'string'}, // 使用状态
    creator: {type: 'string'}, // 创建人
    creationtime: {type: 'string'}, // 创建时间
    modifier: {type: 'string'}, // 修改人
    modifytime: {type: 'string'} // 修改时间
  }
})

export default Model.create('model.contracttemplate')
