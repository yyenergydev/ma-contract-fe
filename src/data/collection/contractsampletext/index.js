// latest: 马红更 2017-9-22 09:27 AM
import { Collection } from 'common'
import 'model/contractsampletext'

Collection.define('collection.contractsampletext', {
  model: 'contractsampletext.detail',
  proxy: {
    get: '/ma-contract/contractsampletext/list',
    post: '/ma-contract/contractsampletext/save',
    delete: '/ma-contract/contractsampletext/delete',
    loadmethod: 'get'
  }
})

export default Collection.create('collection.contractsampletext')
