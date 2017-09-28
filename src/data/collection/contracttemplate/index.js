// latest: tangh 2017-9-23 11:27 AM
import { Collection } from 'common'
import 'model/contracttemplate'

Collection.define('collection.contracttemplate', {
  model: 'model.contracttemplate',
  proxy: {
    get: '/ma-contract/contracttemplate/list',
    post: '/ma-contract/contracttemplate/save',
    delete: '/ma-contract/contracttemplate/delete',
    loadmethod: 'get'
  }
})

export default Collection.create('collection.contracttemplate')
