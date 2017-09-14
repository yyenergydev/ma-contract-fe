import {Model} from 'common'
Model.define('model.department', {
  proxy: {
    get: '/cpu-project-def/ycctrl/projectdef/detail/:id',
    post: '/cpu-project-def/ycctrl/projectdef/detail'
  },
  meta: {
    billorg: '',
    billorgName: '',
    bizTypes: '',
    createTime: '',
    creator: '',
    dr: '',
    enterpriseId: '',
    enterpriseName: '',
    erpCode: '',
    erpId: '',
    erpParentId: '',
    extFields: '',
    finaorg: '',
    finaorgName: '',
    id: '',
    modifiedtime: '',
    modifier: '',
    orgCode: '',
    orgName: '',
    orgType: '',
    orgTypes: '',
    parentId: '',
    parentName: '',
    purorg: '',
    purorgName: '',
    sortItemMap: '',
    sysVersion: '',
    ts: ''
  }
})

export default Model.create('model.department')
