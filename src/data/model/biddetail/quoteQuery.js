// latest: wangk2 2017-2-21 06:35 PM
import {Model} from 'common'
Model.define('ycctrl.quoteQuery', {
  proxy: {
    loadmethod: 'post',
    post: '/cpu-bidtrade/bidtrade/getBiddetail',
  },
  meta: {
    'keyword': '',
    'fromprice': '',
    'toprice': '',
    'status': ''
  }
})
export default Model.create('ycctrl.quoteQuery')
