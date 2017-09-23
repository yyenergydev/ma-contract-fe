// latest: tangh 2017-9-22 09:27 AM
import { Collection } from 'common'
import 'model/contract_pu'

Collection.define('collection.contractlist', {
  model: 'model.contract_pu',
  proxy: {
    get: '/ma-contract/contractlist/list',
    loadmethod: 'get'
  }
})

export default Collection.create('collection.contractlist')
