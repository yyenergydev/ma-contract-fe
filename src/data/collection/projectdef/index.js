import {Collection} from 'common'
import 'model/projectdef'
Collection.define('ycctrl.projectdef', {
  model: 'ycctrl.projectdef',
  proxy: {
    // get: '/cpu-project-def/ycctrl/projectdef/list'
    get: '/cpu-bidtrade/bidtrade/list'
  }
})

export default Collection.create('ycctrl.projectdef')
