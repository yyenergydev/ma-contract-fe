// latest: zhangmyh 2017-2-15 3:21 PM
import { Model } from 'common'

Model.define('bidtrade.supplier', {
  meta: {
    id: '',
    createTime: '',
    creator: '',
    modifiedtime: '',
    modifier: '',
    state: { type: 'integer' },
    supEnterpriseId: '',
    supplierId: '',
    supplierName: '',
    supEnterpriseName: ''
  }
})
