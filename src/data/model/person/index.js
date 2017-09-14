import {Model} from 'common'
Model.define('model.person', {
  proxy: {
    get: '/cpu-project-def/ycctrl/projectdef/detail/:id',
    post: '/cpu-project-def/ycctrl/projectdef/detail'
  },
  meta: {
    id: '',
    personname: '',
    statusName: ''
  }
})

export default Model.create('model.person')
