// latest: tangh 2017-9-13 09:27 AM
import { Model } from 'common'

Model.define('model.contracttype', {
  proxy: {
    get: '/ma-contract/contracttype/getContracttypebyId',
    post: '/ma-contract/contracttype/save'
  },
  meta: {
    id: {type: 'integer'},
    code: {type: 'string', required: true, nullMsg: '请输入合同类型编码', minLength: 5, maxLength: 5},
    name: {type: 'string', required: true, nullMsg: '请输入合同类型名称'},
    level: {type: 'integer'},
    isGlobal: {type: 'string'},
    parentId: {type: 'integer'},
    parentName: {type: 'string'},
    templateId: {type: 'integer', required: false, nullMsg: '请选择会签单模板'},
    templateName: {type: 'string'},
    useScopeIds: {type: 'string', required: false, nullMsg: '请选择使用范围'},
    useScopeNames: {type: 'string'},
    creator: {type: 'string'},
    creationtime: {type: 'string'},
    modifier: {type: 'string'},
    modifytime: {type: 'string'},
    pkGroup: {type: 'string'},
    remark: {type: 'string'}
  }
})

export default Model.create('model.contracttype')
