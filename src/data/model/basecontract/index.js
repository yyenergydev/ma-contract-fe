// latest: mahonggeng 2017-9-15 9:27 AM
import { Model } from 'common'
// import './material'

Model.define('basecontract.detail', {
  proxy: {
    get: '/ma-contract/basecontract/list',
    post: '/ma-contract/basecontract/save',
    temppost: '/ma-contract/basecontract/tempsave'
  },
  meta: {
    // 基础信息
    id: {type: 'integer'},
    billnum: {type: 'string'},
    code: {type: 'string'},
    name: {type: 'string', required: true, nullMsg: '请输入合同名称'},
    contractTypeId: {type: 'integer', required: true, nullMsg: '请选择合同类型'},
    contractTypeName: {type: 'string'},
    isCommonText: {type: 'string', required: true, nullMsg: '请输入是否统一文本'},
    contractTextId: {type: 'integer'},
    contractText: {type: 'string'},
    isAssetPlatform: {type: 'string', required: true, nullMsg: '请输入是否资产经营性平台'}, // 是否资产经营性平台
    isSystemContract: {type: 'string', required: true, nullMsg: '请输入是否系统内合同'}, // 是否系统内合同
    industryTypeId: {type: 'integer'},
    industryType: {type: 'string', required: true, nullMsg: '请输入行业类别'}, // 行业类别
    moneyflow: {type: 'string', required: true, nullMsg: '请输入资金流向'},
    contractmny: {type: 'integer', required: true, nullMsg: '请输入合同金额', errorMsg: '请输入数字'},
    currencyId: {type: 'integer'/*, required: true, nullMsg: '请输入币种'*/},
    currencyName: {type: 'string'},
    contractOwnId: {type: 'integer'},
    contractOwn: {type: 'string', required: true, nullMsg: '请输入合同我方'},
    contractOtherId: {type: 'integer'},
    contractOther: {type: 'string', required: true, nullMsg: '请输入合同对方'},
    settlement: {type: 'string'}, // 结算方式
    contractTerm: {type: 'integer', errorMsg: '请输入数字'}, // 合同期限
    termUnit: {type: 'string'}, // 期限单位
    signDate: {type: 'date'},
    paytype: {type: 'string'},
    undertakerId: {type: 'integer'/*, required: true, nullMsg: '请输入承办人'*/},
    undertaker: {type: 'string'}, // 承办人
    undertakedeptId: {type: 'integer'/*, required: true, nullMsg: '请输入承办部门'*/},
    undertakedept: {type: 'string'}, // 承办部门
    contractStatus: {type: 'string'},
    contractCount: {type: 'integer', errorMsg: '请输入数字'},
    changedate: {type: 'date'},
    isPlaceFile: {type: 'string'}, // 是否归档
    remark: {type: 'string'},
    marker: {type: 'string'},
    markdate: {type: 'date'},
    creator: {type: 'integer'},
    creationtime: {type: 'string'},
    modifier: {type: 'integer'},
    modifytime: {type: 'string'},
    pk_group: {type: 'integer'},
    pk_org: {type: 'integer'},
    dr: {type: 'integer'}
  }
})

export default Model.create('basecontract.detail')
