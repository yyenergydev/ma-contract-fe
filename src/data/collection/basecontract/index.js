import { Collection } from 'common'
import 'model/basecontract'

Collection.define('contractlist', {
  model: 'basecontract.detail',
  proxy: {
    get: '/ma-contract/basecontract/list'
  }
})

export default Collection.create('contractlist')
