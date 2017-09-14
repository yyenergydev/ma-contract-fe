// latest: wangk2 2017-2-21 06:35 PM
import 'ko-epui/dist/ko-epui.css'
import 'ko-epui'
import 'components'
import biddingApply from 'model/biddingApply'
import bidpromise from 'model/biddingApply/bidpromise'
import linkman from 'model/biddingApply/linkman'
import 'common/utils'
import Countdown from 'components/countdown'
import 'components/countdown/countdown.css'
import 'static/vendor/tweenmax'
// import EventBus from 'common/eventbus'
// import _ from 'lodash'
// import {Post} from 'common/Ajax'
/* global ko */
// /* global u */
// var id = window.global.query('id')
let trade = biddingApply.trade
var bidtradeId = window.global.query('bidtradeId')
var bidtradeRegisterType=window.global.query('issupplyLinkman')

trade.load({tradeid: bidtradeId})
bidpromise.load({bidtradeID: bidtradeId, enterpriseId: window.global.query('enterpriseId')})

//如果是采购商查看报名
if(bidtradeRegisterType){
  debugger
  bidpromise.on(
    'data',
    function(data){
      linkman.load({supplyId: data.enterpriseId})
      viewModel.issupplyLinkman(true)
    }
  )
}
trade.on('data', function (data) {
  var registEndTime = '2017-01-28 00:00:00'
  var time = registEndTime.replace('/-/g', '//')
  console.log(time + 'wk')
  Countdown.init('#timer', time)
  if (Countdown.total_seconds <= 0) {
  }
  
})
var viewModel = {
  id: ko.observable(),
  issupplyLinkman:ko.observable(false),
  promisStatus: ko.observable(true),
  checkboxData: [{value: '1', name: '我承诺我所提供的资料真实有效'}],
  // 数据
  model: trade.datatable,
  model_pm: bidpromise.datatable,
  model_linkman:linkman.datatable,
  detail_grid: {
    'id': 'detail_grid',
    'data': trade.associations.bidtradeMaterialList,
    'type': 'grid',
    'multiSelect': false,
    'editable': false,
    canDrag: false,
    canSwap: false,
    columnMenu: false,
    autoWidth: true,
    fields: [
      {'field': 'materialClassName', 'dataType': 'String', 'title': '物料分类信息', 'width': '220'},
      {'field': 'materialName', 'dataType': 'String', 'title': '物料信息', 'width': '125'},
      {'field': 'num', 'dataType': 'String', 'title': '数量', 'sumCol': true, 'width': '125'},
      {'field': 'unit', 'dataType': 'String', 'title': '需求公司', 'width': '125'},
      {'field': 'reqdesc', 'dataType': 'String', 'title': '需求描述', 'width': '150'},
      {'field': 'reqOrgName', 'dataType': 'String', 'title': '需求公司', 'width': '150'},
      {'field': 'reqTime', 'dataType': 'String', 'title': '需求时间', 'width': '150'},
      {'field': 'receiveAddress', 'dataType': 'String', 'title': '收货地址及方式', 'width': '150'}
    ]
  }
}
window.viewModel=viewModel
window.app = window.u.createApp({
  el: 'body',
  model: viewModel})
