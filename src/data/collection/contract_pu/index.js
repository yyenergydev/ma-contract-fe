// latest: tangh 2017-9-20 09:27 AM
import { Collection } from 'common'
import 'model/contract_pu'

Collection.define('collection.contract_pu', {
  model: 'model.contract_pu',
  proxy: {
    get: '/ma-contract/contract_pu/list',
    loadmethod: 'get'
  }
})

export default Collection.create('collection.contract_pu')
