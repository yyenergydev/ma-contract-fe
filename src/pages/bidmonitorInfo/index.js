// latest: wangk2 2017-2-21 06:35 PM
import 'ko-epui/dist/ko-epui.css'
import 'ko-epui'
import 'components'
import { Get } from 'common/Ajax'
import bidmonitorInfo from 'model/bidmonitorInfo'
// import {Post} from 'common/Ajax'
// /* global ko */
 /* global u */
var id = window.global.query('tradeid')
var supplyId = window.global.query('supplyId')// 获取supplyId
bidmonitorInfo.load({tradeid: id, supplyId: supplyId})// enterpriseId: window.global.user.enterpriseId,
// 最终保存的模型
// 按值
function removeByValue (arr, val) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] == val) {
      arr.splice(i, 1)
      break
    }
  }
}
var viewModel = {
  preqlfSubmit: function (data) {
    u.confirmDialog({
      msg: '是否踢出竞价？',
      title: '踢出竞价确认',
      onOk: async function () {
        let res = await Get('/cpu-bidtrade/bidtrade/kickoff', {
          roomid: 'r' + id,
          supplyid: supplyId,
          token: '01e134f5-b2e9-41dd-b984-bafb825228cc',
          url: 'http://172.20.14.96:9097'
        })
        if (res.status == 1) {
          // 移除data到 淘汰模型 todo
          var _data2 = viewModel.supply()
          var _data3 = viewModel.outsupply()
          removeByValue(_data2, data)
          viewModel.supply(_data2)
          _data3.push(data)
          viewModel.outsupply(_data3)
        }
      }
    })
  },
  historyPrice: function () {
    console.log('yusn----', id)
    return window.location.href = '../bidmonitorHistory/index.zh_CN.html?bidtradeId=' + id + '&supplyId=' + supplyId
  },
  model: bidmonitorInfo.datatable,
  detail_grid: {
    'id': 'detail_grid',
    'data': bidmonitorInfo.associations.bidquoteblist,
    'type': 'grid',
    'multiSelect': false,
    'editable': false,
    'canDrag': false,
    'canSwap': false,
    'columnMenu': false,
    'autoWidth': false,
    fields: [
      {'field': 'materialName', 'dataType': 'String', 'title': '物料名称', 'width': '150'},
      {'field': 'purNum', 'dataType': 'number', 'title': '购买数量', 'width': '150'},
      {'field': 'address', 'dataType': 'number', 'title': '送货地址', 'width': '150'},
      {'field': 'reqTime', 'dataType': 'String', 'title': '需求时间', 'width': '150'},
      {'field': 'taxRate', 'title': '税率', 'dataType': 'String', 'width': '150'},
      {'field': 'taxPrice', 'title': '含税单价', 'dataType': 'String', 'width': '150'}
    ]
  }
}
window.app = window.u.createApp({
  el: 'body',
  model: viewModel})
