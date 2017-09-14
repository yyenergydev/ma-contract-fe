import {Collection} from 'common'
import 'model/department'
Collection.define('collection.department', {
  model: 'model.department',
  proxy: {
    get: '/cpu-basedocrefer/basedocrefer/orgdept/getorgbyparentid',
    loadmethod: 'post'
  }
})

export default Collection.create('collection.department')
