// latest: zhangmyh 2017-2-23 4:26 PM
import { Collection } from 'common'
import 'model/material/materialDoc'

Collection.define('material.materiallist', {
  model: 'material.materialdoc',
  proxy: {
    loadmethod: 'post',
    get: '/cpu-basedocrefer/basedocrefer/materialdoc/getmaterial'
  }
})

export default Collection.create('material.materiallist')
