import { Collection } from 'common'
import 'model/bidtrade'

Collection.define('bidtradelist', {
  model: 'bidtrade.detail',
  proxy: {
    get: '/cpu-bidtrade/bidtrade/list'
  }
})

export default Collection.create('bidtradelist')
