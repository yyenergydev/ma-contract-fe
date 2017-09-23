// latest: tangh 2017-9-22 09:27 AM
import { Collection } from 'common'
import 'model/industrycategory'

Collection.define('collection.industrycategory', {
  model: 'model.industrycategory',
  proxy: {
    get: '/ma-contract/industrycategory/list',
    loadmethod: 'get'
  }
})

export default Collection.create('collection.industrycategory')
