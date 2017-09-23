// latest: tangh 2017-9-22 09:27 AM
import { Model } from 'common'

Model.define('model.industrycategory', {
  proxy: {
    get: '/ma-contract/industrycategory/getIcById',
    post: '/ma-contract/industrycategory/save'
  },
  meta: {
    id: {type: 'integer'},
    code: {type: 'string'}, // 行业类别编码
    name: {type: 'string'}, // 行业类别名称
    creator: {type: 'string'}, // 创建人
    creationtime: {type: 'string'}, // 创建时间
    modifier: {type: 'string'}, // 修改人
    modifytime: {type: 'string'}, // 修改时间
    status: {type: 'string'}, // 状态
    reason: {type: 'string'} // 停用原因
  }
})

export default Model.create('model.industrycategory')
