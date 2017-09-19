// latest: tangh 2017-9-13 09:27 AM
import { Collection } from 'common'
import 'model/contracttype'

Collection.define('collection.contracttype', {
  model: 'model.contracttype',
  proxy: {
    get: '/ma-contract/contracttype/list',
    loadmethod: 'get'
  }
})

export default Collection.create('collection.contracttype')
