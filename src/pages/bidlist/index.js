// author: wangk2
// latest: zhangmyh 2017-3-22 4:18 PM
/* eslint-disable */
import 'ko-epui/dist/ko-epui.css'
import 'ko-epui'
import 'components'
import { debounce } from 'lodash'
import operation from './opt'
import biddetail from 'model/biddetail'
import eliminate from 'components/modalrefer/eliminate'
import { eliminaterefer } from 'components/modalrefer'
import Countdown from 'components/countdown'
import {Post} from 'common/Ajax'
import 'static/vendor/tweenmax'
import 'components/countdown/countdown.css'
import './format'
/* global ko u __ */
var supplierID = window.global.user.enterpriseId
var id = window.global.query('id')
// 演示数据
if (id) {
  biddetail.load({
    id: id
  })
}

var statusType = function (params) {
  var status = parseInt(params.row.value.status)
  var  outReason= params.row.value.outReason
  switch (status) {
     
    case 2:
      params.element.innerHTML = '已淘汰'
      break
   
    default:
      params.element.innerHTML = ''
  }
}

var viewModel = {
  id: ko.observable(''),
  title: ko.observable('供应商标题'),
  applyVis: ko.observable(false),
  receiveApply: ko.observable(0),
  thirdtitle: ko.observable(__('title')),
  preqlfPass: function () {
    biddetail.associations.quotelist.datatable.getSelectedRows().forEach(function (obj) {
      obj.setValue('status', 5)
    })
  },
  keyword:ko.observable(),
  fromprice:ko.observable(),
  toprice:ko.observable(),
  preqlfOut: function (data) {
     eliminaterefer({
        contentId: 'refer_eliminate',
        title: '淘汰理由',
        module: eliminate,
        onOk: async function (msg) {
          biddetail.associations.quotelist.datatable.getSelectedRows().forEach(function(obj){
             obj.setValue('status', 4)
             obj.setValue('outReason',msg)
           })
        },
        onCancel: function () {}
      })
  },
  recommend: function () {
    return window.location.href = '../recommendSupplier/index.' + __('locale') + '.html'
  },
  preqlfSubmit: debounce(async function () {
    var informInfo = '没有供应商报名，已流标'
    if (viewModel.detailmode.getAllRows().length == 0) {
      u.showMessage({msg: informInfo, position: 'top'})
    } else {
      var data = await biddetail.save()
      var preqrightInfo = '提交审核成功'
      var preqwrongInfo = '提交审核失败'
      if (data.status) {
        u.showMessage({msg: preqrightInfo, position: 'top'})
      } else {
        u.showMessage({msg: preqwrongInfo, position: 'top'})
      }
    }
  }, 300, { maxWait: 2000 }),
  querylist: debounce(async function () {
    var param = {
      bidtradeId: id, //竞价单id
      //id: id,
      keyword: viewModel.keyword(), //按供应商名称查询
      fromprice: viewModel.fromprice(), //报价区间按最低
      toprice: viewModel.toprice() //报价区间按最高
    }
    // biddetail.associations.quotelist.load(param)
    let data = await Post('/cpu-bidtrade/bidtrade/getBidQuotedetail', param)
    let model = biddetail.associations.quotelist.datatable
    if (data.status == '1') {
      model.removeAllRows()
      model.addSimpleData(data.data)
      model.setAllRowsUnSelect()
    } else {
      uMessage('fail', '查询失败')
    }
  }),
  comboData: [
    //达申提供2：已报名，3：审核通过，4：已淘汰，5：已通过，6：已拒绝
    {
      name: '未通过',
      value: 0
    },
        {
      name: '已通过',
      value: 1
    }
  ],
  model: biddetail.datatable,
  detail_grid: {
    'id': 'detail_grid',
    'data': biddetail.associations.quotelist,
    'type': 'grid',
    'multiSelect': true,
    'editable': false,
    'canDrag': false,
    'canSwap': false,
    'columnMenu': false,
    'autoWidth': false,
    fields: [
      {'field': 'supplyName', 'dataType': 'String', 'title': '报价企业', 'width': '15%'},
      {'field': 'initPrice', 'dataType': 'String', 'title': '最初报价', 'width': '13%'},
      {'field': 'latestPrice', 'dataType': 'String', 'title': '最终报价', 'width': '13%'},
      {'field': 'sortno', 'dataType': 'String', 'title': '排名', 'width': '5%'},
      {'field': 'bidTime', 'dataType': 'String', 'title': '最终报价时间', 'width': '15%'},
      {'field': 'status', 'renderType': statusType, 'title': '状态', 'sumCol': true, 'width': '15%'}
      // {'field': 'statusNameShow', 'title': __('operation'), 'dataType': 'action', 'item': operation()}
    ]
  }
}

window.app = u.createApp({
  el: 'body',
  model: viewModel
})
/* eslint-disable */
