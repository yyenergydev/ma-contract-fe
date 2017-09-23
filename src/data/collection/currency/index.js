// latest: tangh 2017-9-23 11:27 AM
import { Collection } from 'common'
import 'model/currency'

Collection.define('collection.currency', {
  model: 'model.currency',
  proxy: {
    get: '/ma-contract/currency/list',
    loadmethod: 'get'
  }
})

export default Collection.create('collection.currency')
