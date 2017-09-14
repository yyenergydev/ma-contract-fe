// latest: zhangmyh 2017-1-22 6:09 PM
import { Model } from 'common'

Model.define('bidtrade.material', {
  meta: {
    createTime: '',
    creator: '',
    modifiedtime: '',
    modifier: '',
    enterpriseId: { type: 'integer' },
    enterpriseName: { type: 'string' },
    id: { type: 'integer' },
    materialClassId: { type: 'integer' },
    materialClassName: { type: 'string' },
    materialId: { type: 'integer' },
    materialName: { type: 'string' },
    num: { type: 'integer', default: {value: '1'} },
    unitid: { type: 'integer' },
    unit: { type: 'string' },
    reqOrgId: { type: 'integer' },
    reqOrgName: { type: 'string' },
    reqTime: { type: 'string' },
    supEnterpriseId: { type: 'integer' },
    supEnterpriseName: { type: 'string' },
    planDeptId: { type: 'integer' },
    planDeptName: { type: 'string' },
    planPersonId: { type: 'integer' },
    planPersonName: { type: 'string' }
  }
})
