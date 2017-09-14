// latest: wangk2 2017-2-21 06:35 PM
import {Model} from 'common'
Model.define('bidtrade.bidpromise', {
  proxy: {
    loadmethod: 'post',
    get: '/cpu-bidtrade/bidtradeRegister/getRegisterbyTradeid',
    post: '/cpu-bidtrade/bidtradeRegister/save'
  },
  meta: {
    'bidtradeID': '', // 竞价单ID
    'bidtradeInvoiceInfo': '', //
    'bidtradePromise': '', // 竞价承诺
    'supCertificateRequire': '', // 证件要求
    'createTime': '',
    'creator': '',
    'dr': '',
    'enterpriseName': '',
    'extFields': '',
    'id': '',
    'modifiedtime': '',
    'modifier': '',
    'sortItemMap': '',
    'state': {default: {value: '2'}},
    'sysVersion': '',
    'enterpriseId': '',
    'ts': ''
  },
})
export default Model.create('bidtrade.bidpromise')
