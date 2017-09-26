// latest: tangh 2017-9-25 11:27 AM
import { Collection } from 'common'
import 'model/contracttemplate'

Collection.define('collection.contracttemplate', {
  model: 'model.contracttemplate',
  proxy: {
    get: '/ma-contract/contracttemplate/list',
    loadmethod: 'get'
  }
})

export default Collection.create('collection.contracttemplate')
