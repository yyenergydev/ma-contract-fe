// latest: zhangmyh 2017-2-15 12:27 PM
import { Collection } from 'common'
import 'model/bidtrade'

Collection.define('bidtradesuplist', {
  model: 'bidtrade.detail',
  proxy: {
    get: '/cpu-bidtrade/bidtrade/listForSup'
  }
})

export default Collection.create('bidtradesuplist')
