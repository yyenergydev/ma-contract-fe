// latest: zhangmyh 2017-2-23 4:26 PM
import { Collection } from 'common'
import 'model/material/materialClass'

Collection.define('material.classlist', {
  model: 'material.materialclass',
  proxy: {
    loadmethod: 'post',
    get: '/cpu-basedocrefer/basedocrefer/materialdoc/getmatclassbyparentid'
  }
})

export default Collection.create('material.classlist')
