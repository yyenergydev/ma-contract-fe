// latest: tangh 2017-9-20 09:27 AM
import { Model } from 'common'
import './terms'

Model.define('model.contract_pu', {
  proxy: {
    get: '/ma-contract/contract_pu/getCtPubyId',
    post: '/ma-contract/contract_pu/save'
  },
  meta: {
    // 标准信息
    id: {type: 'integer'},
    billnum: {type: 'string'}, // 单据号
    code: {type: 'string'}, // 合同编码
    name: {type: 'string'}, // 合同名称
    contractTypeId: {type: 'integer'}, // 合同类型id
    contractTypeName: {type: 'string'}, // 合同类型名称
    isCommonText: {type: 'string'}, // 是否统一文本
    contractText: {type: 'string'},
    isAssetPlatform: {type: 'string'}, // 是否资产经营性平台
    isSystemContract: {type: 'string'}, // 是否系统内合同
    industryType: {type: 'string'}, // 行业类别
    moneyflow: {type: 'string'},
    contractmny: {type: 'string'},
    currencyId: {type: 'integer'},
    currencyName: {type: 'string'},
    contractOwn: {type: 'string'},
    contractOther: {type: 'string'},
    settlement: {type: 'string'}, // 结算方式
    contractTerm: {type: 'integer'}, // 合同期限
    termUnit: {type: 'string'}, // 期限单位
    signDate: {type: 'date'},
    paytype: {type: 'string'},
    undertaker: {type: 'string'}, // 承办人
    undertakedept: {type: 'string'}, // 承办部门
    contractStatus: {type: 'string'},
    contractCount: {type: 'integer'},
    changedate: {type: 'date'},
    isPlaceFile: {type: 'string'}, // 是否归档
    remark: {type: 'string'},
    marker: {type: 'string'},
    markdate: {type: 'date'},
    attach: {type: 'string'},
    dr: {type: 'integer'},
    // 业务信息
    biddingno: {type: 'string'}, // 中标通知单号
    ctrantypeid: {type: 'string'}, // 交易类型
    valdate: {type: 'date', required: true, nullMsg: '请输入计划生效日期'}, // 计划生效日期
    invallidate: {type: 'date', required: true, nullMsg: '请输入计划终止日期'}, // 计划终止日期
    projectid: {type: 'string'}, // 项目
    projectcode: {type: 'string'}, // 项目编码
    eps: {type: 'string'}, // 企业项目结构eps
    engineercode: {type: 'string'}, // 工程编码
    engineerregno: {type: 'string'}, // 工程登记号
    erpcode: {type: 'string'}, // erp定义号
    projectnameshort: {type: 'string'}, // 项目简称
    pk_payterm: {type: 'string'} // 付款协议
  },
  associations: {
    terms: {
      type: 'hasMany', // hasMany
      model: 'model.contract_pu_terms'
    }
  }
})

export default Model.create('model.contract_pu')
