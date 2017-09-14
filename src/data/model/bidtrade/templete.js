// latest: zhangmyh 2017-2-13 2:32 PM
import { Model } from 'common'

Model.define('bidtrade.templete', {
  meta: {
    createTime: '',
    isProduct: '',  // 产品项 选中为1
    creator: '',
    modifiedtime: '',
    modifier: '',
    priceUnit: { type: 'integer' }
  }
})
