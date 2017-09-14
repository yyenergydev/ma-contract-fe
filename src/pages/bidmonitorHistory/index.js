// latest: wangk2 2017-2-21 06:35 PM
import 'ko-epui/dist/ko-epui.css'
import 'ko-epui'
import 'components'
import { Get } from 'common/Ajax'
import { map } from 'lodash'
import bidmonitorHistory from 'model/bidmonitorHistory'
// import {Get} from 'common/Ajax'
// /* global ko u */
// /* global app */
var viewModel
// var hisList
var id = window.global.query('bidtradeId')
var supplyId = window.global.query('supplyId')// 获取supplyId
const fieldList = [
         {'field': 'bidtime', 'dataType': 'date', 'title': '时间', 'width': '150'},
         {'field': 'bidprice', 'dataType': 'String', 'title': '总报价', 'width': '150'},
        // {'field': 'taxRate', 'dataType': 'String', 'title': '税率', 'width': '150'}
]
async function init () {
  let data1 = await Get('/cpu-bidtrade/bidtrade/bidquote/getquoteDetailList', {tradeid: id, supplyId: supplyId})
  map(data1.data, function (n, key) {
    if (key == 'fields') {
      for (var p in n) {
        if (!(p == 'bidtime' || p == 'bidprice')) {
          fieldList.push({'field': p, 'dataType': 'String', 'title': n[p], 'width': '150'})
        }
      }
    }
  })
  bidmonitorHistory.load({tradeid: id, supplyId: supplyId})
  // bidmonitorHistory.on('data', async function (data) {
  //   // let grid = app.getComp('bdgrid').grid
  //   // grid.setCoulmnWidthByField('bidtime', 300)
  // })
  viewModel = {
    model: bidmonitorHistory.datatable,
    detail_grid: {
      'id': 'bdgrid',
      'data': bidmonitorHistory.associations.datalist,
      'type': 'grid',
      'multiSelect': false,
      'editable': false,
      'canDrag': false,
      // 'fixed': false,
      'canSwap': false,
      'columnMenu': false,
      'autoWidth': false,
      fields: fieldList
    }
  }
  window.app = window.u.createApp({
    el: 'body',
    model: viewModel
  })
}
(async function () {
  init()
})()
