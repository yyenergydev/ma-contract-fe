// latest: zhangmyh 2017-4-24 1:43 PM
import { Collection } from 'common'
import 'model/supplydoc'
Collection.define('collection.supplydoc', {
  model: 'model.supplydoc',
  proxy: {
    get: '/cpu-basedocrefer/basedocrefer/supplydoc/getsupplydoc2'
    // loadmethod: 'post',
    // get: '/cpu-basedocrefer/basedocrefer/supplydoc/getsupplydoc'
  }
})

export default Collection.create('collection.supplydoc')
