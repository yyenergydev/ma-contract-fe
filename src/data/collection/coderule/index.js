// latest: 马红更 2017-9-22 09:27 AM
import { Collection } from 'common'
import 'model/coderule'

Collection.define('coderuleList', {
  model: 'coderule',
  proxy: {
    get: '/ma-contract/coderule/list',
    loadmethod: 'get'
  }
})

export default Collection.create('coderuleList')
