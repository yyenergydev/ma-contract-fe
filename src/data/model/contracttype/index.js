// latest: tangh 2017-9-13 09:27 AM
import { Model } from 'common'

Model.define('model.contracttype', {
  proxy: {
    get: '/ma-contract/contracttype/getContracttypebyId',
    post: '/ma-contract/contracttype/save'
  },
  meta: {
    id: {type: 'integer'},
    code: {type: 'string', required: true, nullMsg: '请输入合同类型编码'},
    name: {type: 'string', required: true, nullMsg: '请输入合同类型名称'},
    level: {type: 'integer'},
    ifGlobal: {type: 'string'},
    parentId: {type: 'integer'},
    templateId: {type: 'string', required: true, nullMsg: '请选择会签单模板'},
    useScope: {type: 'string', required: true, nullMsg: '请选择使用范围'},
    creator: {type: 'string'},
    createTime: {type: 'date'},
    modifier: {type: 'string'},
    modifiedtime: {type: 'date'},
    pkGroup: {type: 'string'},
    pname: {type: 'string'},
    remark: {type: 'string'}
  }
})

export default Model.create('model.contracttype')
