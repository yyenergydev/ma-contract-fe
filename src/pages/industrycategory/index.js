// latest: tangh 2017-09-22 13:31 AM
import './index.less'
import 'ko-epui/dist/ko-epui.css'
import 'ko-epui'
import 'components'
import {Post, URLs} from 'common'
import collection from 'collection/industrycategory'
// import uMessage from 'components/message'
/* eslint-disable */
/* global ko u app $ __ */

var pageIndex = window.global.hash('pageindex') || 0
var viewModel

const columnSetting = [{
  'field': 'code',
  'dataType': 'String',
  'title': '行业类别编码',
  'width': '15%'
}, {
  'field': 'name',
  'dataType': 'String',
  'title': '行业类别名称',
  'width': '15%'
}, {
  'field': 'creator',
  'dataType': 'String',
  'title': '创建人',
  'width': '15%'
}, {
  'field': 'creationtime',
  'dataType': 'String',
  'title': '创建时间',
  'width': '15%'
}, {
  'field': 'modifier',
  'dataType': 'String',
  'title': '最后修改人',
  'width': '15%'
}, {
  'field': 'modifytime',
  'dataType': 'String',
  'title': '最后修改时间',
  'width': '15%'
}, {
  'field': 'status',
  'dataType': 'String',
  'title': '启用状态',
  'width': '15%'
}, {
  'field': 'reason',
  'dataType': 'String',
  'title': '停用原因',
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
      id: 'grid',
      data: collection,
      type: 'grid',
      multiSelect: true,
      editable: false,
      pagination: true,
      autoWidth: true,
      noScroll: true,
      fields: columnSetting
    },
    add: function () {
    },
    save: function () {
    },
    deleteBill,
    stop: function () {
    }
  }
  window.app = window.u.createApp({
    el: 'body',
    model: viewModel
  })
}

function deleteBill () {
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
