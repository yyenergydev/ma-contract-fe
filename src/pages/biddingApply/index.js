// author: wangk2
// latest: zhangmyh 2017-3-22 4:15 PM
import 'ko-epui/dist/ko-epui.css'
import 'ko-epui'
import 'components'
import { debounce } from 'lodash'
import biddingApply from 'model/biddingApply'
import bidpromise from 'model/biddingApply/bidpromise'
import uMessage from 'components/message'
import Countdown from 'components/countdown'
import 'components/countdown/countdown.css'
import 'static/vendor/tweenmax'
import './format.js'
/* global ko __ $ */

var id = window.global.query('id')
id = id || window.global.query('tradeid')
let trade = biddingApply.trade
trade.load({ tradeid: id })
bidpromise.load({ bidtradeID: id, enterpriseId: window.global.user.enterpriseId })

trade.on('data', function (data) {
  var ret = data.registEndTime
  var red = new Date()
  red.setTime(ret)
  var res = red.format('yyyy/MM/dd HH:mm:ss')
  Countdown.init('#timer', res)
  var bst = data.bidStartTime
  var bsd = new Date()
  bsd.setTime(bst)
  var bss = bsd.format('yyyy/MM/dd HH:mm:ss')
  viewModel.registEndTime(res)
  viewModel.bidStartTime(bss)
  if (!data.supCertificateRequire || data.supCertificateRequire == 0) {
    viewModel.supCertificateRequire(false)
    viewModel.fivecard(false)
    viewModel.threecard(false)
    viewModel.model.setValue('supCertificateRequire', null)
  } else {
    viewModel.supCertificateRequire(true)
    viewModel.threecard(true)
    viewModel.model.setValue('supCertificateRequire', 1)
    viewModel.model_pm.setValue('supCertificateRequire', 1)
  }
})
trade.datatable.on('supCertificateRequire.valueChange', function (value) {
  if (value.newValue == 1) {
    viewModel.threecard(true)
    viewModel.fivecard(false)
    viewModel.model_pm.setValue('supCertificateRequire', 1)
  } if (value.newValue == 2) {
    viewModel.fivecard(true)
    $('#uploader_bidtrade_four-4').children().eq(1).css({'width': '20px', 'height': '20px'})
    $('#uploader_bidtrade_five-5').children().eq(1).css({'width': '20px', 'height': '20px'})
    $('#uploader_bidtrade_six-6').children().eq(1).css({'width': '20px', 'height': '20px'})
    $('#uploader_bidtrade_seven-7').children().eq(1).css({'width': '20px', 'height': '20px'})
    $('#uploader_bidtrade_eight-8').children().eq(1).css({'width': '20px', 'height': '20px'})
    viewModel.threecard(false)
    viewModel.model_pm.setValue('supCertificateRequire', 2)
  }
})

var viewModel = {
  id: ko.observable(),
  fs_1: ko.observable(0),
  fs_2: ko.observable(0),
  fs_3: ko.observable(0),
  fs_4: ko.observable(0),
  fs_5: ko.observable(0),
  fs_6: ko.observable(0),
  fs_7: ko.observable(0),
  fs_8: ko.observable(0),
  threecard: ko.observable(false),
  fivecard: ko.observable(false),
  supCertificateRequire: ko.observable(false),
  promisStatus: ko.observable(true),
  registEndTime: ko.observable(''),
  bidStartTime: ko.observable(''),
  // statusType: ko.observable(statusType),
  checkboxData: [{value: '1', name: '我承诺我所提供的资料真实有效'}],
  // event
  // 报名
  apply: function () {
  },
  // 数据
  model: trade.datatable,
  model_pm: bidpromise.datatable,
  // 证件要求
  certificateRequire: [{value: '1', name: '三证合一'}, {value: '2', name: '传统'}],
  // 税务发票信息
  taxinvoicedata: [{value: '0', name: '不提供'}, {value: '1', name: '普通发票'}, {value: '2', name: '增值税发票'}],
  // 保存
  save: debounce(async function () {
    $('#msgBtn').attr('disabled', true)
    $('#msgBtn').removeClass('btn-primary')
    var data = await bidpromise.save()
    if (data.status == '1') {
      uMessage('success', data.msg || '保存成功')
    } else {
      uMessage('fail', data.msg || '保存失败')
    }
    $('#saveId').removeAttr('disabled', true)
    $('#saveId').addClass('btn-primary')
  }, 300, { maxWait: 2000 }),
  // 报名
  sign: debounce(async function () {
    $('#signId').attr('disabled', true)
    $('#signId').removeClass('btn-primary')
    let flag = true
    if (viewModel.model.getValue('supCertificateRequire') != null) {
      flag = false
      let supCertificateRequire = viewModel.model_pm.getValue('supCertificateRequire')
      if (supCertificateRequire == 2) {
        flag = viewModel.fs_4() > 0 && viewModel.fs_5() > 0 && viewModel.fs_6() > 0 && viewModel.fs_7() > 0 && viewModel.fs_8() > 0
      } else {
        flag = viewModel.fs_1() > 0 && viewModel.fs_2() > 0 && viewModel.fs_3() > 0
      }
    }
    if (flag) {
      var data = await bidpromise.save('/cpu-bidtrade/bidtradeRegister/sign')
      if (data.status == '1') {
        // uMessage('success', data.msg || '报名成功')
        return window.location.href = '../bidtradesuplist/index.' + __('locale') + '.html'
      } else {
        uMessage('fail', data.msg || '报名失败')
      }
    } else {
      uMessage('fail', '请上传所需附件')
    }
    // })
  }, 300, { maxWait: 2000 }),
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
      {'field': 'unit', 'dataType': 'String', 'title': '单位', 'width': '125'},
      {'field': 'supEnterpriseName', 'dataType': 'String', 'title': '建议供应商', 'width': '125'},
      {'field': 'reqOrgName', 'dataType': 'String', 'title': '需求组织', 'width': '125'},
      {'field': 'planPersonName', 'dataType': 'String', 'title': '计划员', 'width': '125'},
      {'field': 'planDeptName', 'dataType': 'String', 'title': '计划部门', 'width': '125'},
      {'field': 'note', 'dataType': 'String', 'title': '物料说明', 'width': '150'},
      {'field': 'reqTime', 'dataType': 'String', 'title': '需求时间', 'width': '150'},
    ]
  }
}

window.app = window.u.createApp({
  el: 'body',
  model: viewModel
})
