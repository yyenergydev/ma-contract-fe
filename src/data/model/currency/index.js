// latest: tangh 2017-9-23 11:27 AM
import { Model } from 'common'

Model.define('model.currency', {
  proxy: {
    get: '/ma-contract/currency/getEntityById',
    post: '/ma-contract/currency/save'
  },
  meta: {
    id: {type: 'integer'},
    code: {type: 'string'}, // 币种编码
    name: {type: 'string'}, // 币种名称
    symbol: {type: 'string'}, // 币种币符
    precision: {type: 'string'}, // 精度
    creator: {type: 'string'}, // 创建人
    creationtime: {type: 'string'}, // 创建时间
    modifier: {type: 'string'}, // 修改人
    modifytime: {type: 'string'} // 修改时间
  }
})

export default Model.create('model.currency')
