// author: wangk2
// latest: zhangmyh 2017-3-22 4:12 PM
import 'ko-epui/dist/ko-epui.css'
import 'ko-epui'
import 'components'
import { debounce, filter } from 'lodash'
import operation from './opt'
import prequalification from 'model/prequalification'
import eliminate from 'components/modalrefer/eliminate'
import { eliminaterefer } from 'components/modalrefer'
import uMessage from 'components/message'
import Countdown from 'components/countdown'
import 'static/vendor/tweenmax'
import 'components/countdown/countdown.css'
import './format'

/* global ko u __ $ */

var id = window.global.query('id')
// 演示数据
if (id) {
  prequalification.load({
    id: id
  })
}
prequalification.on('data', function (data) {
  /* if (data) {
    data.bidtradeRegisterlist.forEach(function (e) {
      if (e.state != 0) {
        viewModel.detailmode.setValue('state', 1)
      }
      console.log('eeeeeeeeeeee==', e)
    })
  } */
  // console.log(viewModel.model.getSimpleData() + 'my')
  // console.log(viewModel.model.meta.regist_end_time + 'wk')
  var t = viewModel.model.getValue('registEndTime')
  var d = new Date()
  d.setTime(t)
  var s = d.format('yyyy/MM/dd HH:mm:ss')
  Countdown.init('#timer', s)
  if (Countdown.total_seconds <= 0) {
    viewModel.applyVis(true)
  } else {
    viewModel.applyVis(false)
  }

  viewModel.receiveApply(viewModel.detailmode.getAllRows().length)
})
/*
var statusType = function (params) {
  var state = params.row.value.state
  var rejectReason = params.row.value.rejectReason
  switch (state) {
    case 1:
      params.element.innerHTML = '待报名'
      break
    case 2:
      params.element.innerHTML = '已报名'
      break
    case 3:
      params.element.innerHTML = '审核中'
      break
    case 4:
      params.element.innerHTML = '已淘汰 <span style="color:red;font-size:6px">理由:' + rejectReason + '</span>'
      break
    case 5:
      params.element.innerHTML = '已通过'
      break
    case 6:
      params.element.innerHTML = '已拒绝'
      break
    case 7:
      params.element.innerHTML = '未审核'
      break
    default:
      params.element.innerHTML = ''
  }
}
*/
var statusType = function (params) {
  var state = params.row.value.state
  var rejectReason = params.row.value.rejectReason
  switch (state) {
    case 4:
      params.element.innerHTML = '已淘汰 <span style="color:red;font-size:6px">理由:' + rejectReason + '</span>'
      break
    case 5:
      params.element.innerHTML = '已通过'
      break
    default:
      params.element.innerHTML = '已通过'
  }
}
var viewModel = {
  id: ko.observable(''),
  title: ko.observable('供应商标题'),
  applyVis: ko.observable(false),
  receiveApply: ko.observable(0),
  thirdtitle: ko.observable(__('title')),
  urladdress: ko.observable('../bidtradedetail/index.' + __('locale') + '.html?id=' + id),
  preqlfPass: function () {
    window.app.dataTables.detailmode.getSelectedRows().forEach(function (obj) {
      obj.setValue('state', 5)
    })
  },
  preqlfOut: function (data) {
    eliminaterefer({
      contentId: 'refer_eliminate',
      title: '淘汰理由',
      module: eliminate,
      onOk: async function (msg) {
        prequalification.associations.bidtradeRegisterlist.datatable.getSelectedRows().forEach(function (obj) {
          obj.setValue('state', 4)
          obj.setValue('rejectReason', msg)
        })
      },
      onCancel: function () {}
    })
  },
  preqlfSubmit: debounce(async function () {
    // let submitflag = 0;
   // var informInfos = '没有供应商报名，已流标'
    var tobeoperated = filter(viewModel.detailmode.getAllRows(), function (item) {
      return item.getValue('state') == 5
    })
    if (tobeoperated.length != 0) {
      var data = await prequalification.save()
      if (data.status == '1') {
        $('#submitId').hide()
        uMessage('success', data.msg || '保存成功')
      } else {
        uMessage('fail', data.msg || '保存失败')
      }
    } else {
      eliminaterefer({
        contentId: 'refer_eliminate',
        title: '没有供应商报名，将要流标处理，是否提交?',
        onOk: async function (msg) {
          var data = await prequalification.save()
          if (data.status == '1') {
            $('#submitId').hide()
            uMessage('success', data.msg || '保存成功')
          } else {
            uMessage('fail', data.msg || '保存失败')
          }
        },
        onCancel: function () {}
      })
    }
  }, 300, { maxWait: 2000 }),
  comboData: [
    // {
    //   name: '未报名',
    //   value: 1
    // },
    // {
    //   name: '未审核',
    //   value: 2
    // },
    {
      name: '已通过',
      value: 1
    },
    {
      name: '已淘汰',
      value: 0
    }
  ],
  model: prequalification.datatable,
  detailmode: prequalification.associations.bidtradeRegisterlist.datatable,
  // 表格
  detail_grid: {
    'id': 'detail_grid',
    'data': prequalification.associations.bidtradeRegisterlist,
    'type': 'grid',
    'multiSelect': true,
    'editable': false,
    'canDrag': false,
    'canSwap': false,
    'columnMenu': false,
    'autoWidth': false,
    fields: [
      {'field': 'enterpriseName', 'dataType': 'String', 'title': '报名企业', 'width': '15%'},
      {'field': 'enterpriseAddress', 'dataType': 'String', 'title': '经营地址', 'renderType': 'timeRender', 'sortable': true, 'width': '17%'},
      {'field': 'enterpriseMainScope', 'dataType': 'String', 'title': '主营范围', 'sumCol': true, 'width': '18%'},
      {'field': 'signtime', 'dataType': 'Datetime', 'title': '报名时间', 'width': '18%'},
      {'field': 'state', 'renderType': statusType, 'title': '状态', 'sumCol': true, 'width': '13%'},
      {'field': 'statusNameShow', 'title': __('operation'), 'dataType': 'action', 'item': operation()}
    ]
  }
}
window.viewModel = viewModel
window.app = u.createApp({
  el: 'body',
  model: viewModel
})

