// latest: wangk2 2017-2-21 06:35 PM
import {Model} from 'common'
Model.define('ycctrl.bidingApplydetail', {
  meta: {
    'address': '', //  收货地址  string
    'bidtradeId': '', //  竞价单id number
    'id': '', //    number
    'materialClassId': '',
    'materialClassName': '', // 物料分类名称  string
    'materialId': '', //  物料id  number
    'materialName': '', //  物料名称  string
    'num': '', // 采购数量  number
    'reqOrgName': '', //  需求公司  string
    'reqTime': {type: 'date'}, // 需求时间  string
    'reqdesc': '', // 需求描述  string
    'enterpriseId': '',
    'planDeptId': '',
    'planDeptName': '',
    'planPersonId': '',
    'planPersonName': '',
    'reqOrgId': '',
    'supEnterpriseId': '',
    'supEnterpriseName': '',
    'unit': '',
    'unitid': ''
  }
})
