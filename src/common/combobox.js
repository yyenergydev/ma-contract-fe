import _ from 'lodash'

var config = {
  // 是/否
  yesorno: {
    1: '是',
    2: '否'
  },
  // 资金流向
  mnyflow: {
    1: '收款',
    2: '付款',
    3: '无金额'
  },
  // 结算方式
  settlement: {
    1: '现金',
    2: '支票',
    3: '银行转账',
    4: '网银转账',
    5: '银行汇票',
    6: '商业汇票',
    7: '委托收付款'
  },
  // 年/月/日
  ymd: {
    1: '年',
    2: '月',
    3: '日'
  },
  // 支付类型
  paytype: {
    1: '预付款',
    2: '进度款',
    3: '进账款',
    4: '结算款'
  },
  // 合同状态
  status: {
    1: '自由态',
    2: '审批中',
    3: '审批通过',
    4: '生效',
    5: '退回修改',
    6: '中止',
    7: '结束',
    8: '作废'
  }
}

window.config = config
export default config

export function getStore (name) {
  var store = config[name]
  if (!store) return
  return _.map(store, function (text, key) {
    return {
      name: text,
      value: key
    }
  })
}
