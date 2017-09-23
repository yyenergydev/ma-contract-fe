// latest: tangh 2017-09-21 13:31 AM
import './index.less'
import 'ko-epui/dist/ko-epui.css'
import 'ko-epui'
import 'components'
import {Post, URLs} from 'common'
import collection from 'collection/contractlist'
// import uMessage from 'components/message'
/* eslint-disable */
/* global ko u app $ __ */

var pageIndex = window.global.hash('pageindex') || 0
var viewModel

// 序号 单据号 合同名称 合同类型 合同金额 合同对方 资金流向 制单日期
const columnSetting = [{
  'field': 'billnum',
  'dataType': 'String',
  'title': '单据号',
  'width': '15%'
}, {
  'field': 'name',
  'dataType': 'String',
  'title': '合同名称',
  'width': '15%'
}, {
  'field': 'contractTypeName',
  'dataType': 'String',
  'title': '合同类型',
  'width': '15%'
}, {
  'field': 'contractmny',
  'dataType': 'String',
  'title': '合同金额',
  'width': '15%'
}, {
  'field': 'contractOther',
  'dataType': 'String',
  'title': '合同对方',
  'width': '15%'
}, {
  'field': 'moneyflow',
  'dataType': 'String',
  'title': '资金流向',
  'width': '15%'
}, {
  'field': 'markdate',
  'dataType': 'String',
  'title': '制单日期',
  'width': '15%'
}]

function init () {
  collection.load({ pageIndex: pageIndex })

  viewModel = {
    id: ko.observable(10),
    q: ko.observable(''),
    clickme: function (msg) {
      console.log('')
    },
    query: function (msg) {
      console.log('query' + this.q())
    },
    gridconfig: {
      id: 'ctgrid',
      data: collection,
      type: 'grid',
      multiSelect: true,
      editable: false,
      pagination: true,
      autoWidth: true,
      noScroll: true,
      showNumCol: true,
      fields: columnSetting
    },
    submit,
    deleteCt
  }
  window.app = window.u.createApp({
    el: 'body',
    model: viewModel
  })
}

function deleteCt () {
  let rows = collection.datatable.getSelectedRows()
  let params = {
    ids: rows.map(function (row) {
      return row.getValue('id')
    })
  }
  u.confirmDialog({
    msg: '是否确认删除？',
    title: '删除确认',
    onOk: async function () {
      // let data = await Post ('/ma-contract/contractlist/delete', {ids: params})
      delCheck()
      let data = await Post(URLs.bt_removeBt.url, params)
      /* if (data.status) {
        rows.forEach(function (obj) {
          collection.datatable.removeRows([obj])
        })
      } */
      if (data.status) {
        showMessage('success', data.msg || '删除成功')
      } else {
        showMessage('fail', data.msg || '删除失败')
      }
    }
  })
}

function submit () {
  let rows = collection.datatable.getSelectedRows()
  let params = {
    ids: rows.map(function (row) {
      return row.getValue('id')
    })
  }
  u.confirmDialog({
    msg: '是否确认提交？',
    title: '提交确认',
    onOk: async function () {
      let data = await Post(URLs.bt_commitBt.url, params)
      if (data.status) {
        showMessage('success', data.msg || '操作成功')
      } else {
        showMessage('fail', data.msg || '操作失败')
      }
    }
  })
}

function delCheck () {

}

(async function () {
  //界面初始化赋值
  init()
})()
