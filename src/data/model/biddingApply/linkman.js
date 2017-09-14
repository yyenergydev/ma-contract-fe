// latest: caolin 2017-5-5 06:35 PM
import {Model} from 'common'
Model.define('bidtrade.linkman', {
  proxy: {
    loadmethod: 'get',
    get: '/cpu-bidtrade/bidtradeRegister/getContact'
  },
  meta: {
    'enterpriseName':'',//租户名称
    'name': '', // 联系人姓名
    'phone': '', //联系人电话
    'email': '' // email
  },
})
export default Model.create('bidtrade.linkman')
