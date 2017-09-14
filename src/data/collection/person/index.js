import {Collection} from 'common'
import 'model/person'
Collection.define('collection.person', {
  model: 'model.person',
  proxy: {
    get: '/cpu-basedocrefer/basedocrefer/person/getperson',
    loadmethod: 'post'
  }
})

export default Collection.create('collection.person')
