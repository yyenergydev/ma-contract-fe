import { Collection } from 'common'
import '../model/getquote'

Collection.define('bidtrade.getquote', {
  model: 'bidtrade.getquote',
  proxy: {
    proxy: {
      get: '/cpu-bidtrade/bidtrade/getquote'
    }
  }
})
