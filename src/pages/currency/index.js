// latest: tangh 2017-09-22 13:31 AM
import './index.less'
import 'ko-epui/dist/ko-epui.css'
import 'ko-epui'
import 'components'
import {debounce} from 'lodash'
import {Post, Get, URLs} from 'common'
import collection from 'collection/currency'
import uMessage from 'components/message'
/* eslint-disable */
/* global ko u app $ __ */

var pageIndex = window.global.hash('pageindex') || 0
var viewModel
var userId

const columnSetting = [{
  'field': 'code',
  'dataType': 'String',
  'title': '<span class="required">*</span>币种编码',
  'editable': true,
  'width': '15%'
}, {
  'field': 'name',
  'dataType': 'String',
  'title': '<span class="required">*</span>币种名称',
  'editable': true,
  'width': '15%'
}, {
  'field': 'symbol',
  'dataType': 'String',
  'title': '币种币符',
  'editable': true,
  'width': '15%'
}, {
  'field': 'precision',
  'dataType': 'String',
  'title': '精度',
  'editable': true,
  'width': '10%'
}, {
  'field': 'creator',
  'dataType': 'String',
  'title': '创建人',
  'editable': false,
  'width': '10%'
}, {
  'field': 'creationtime',
  'dataType': 'String',
  'title': '创建时间',
  // 'editType': 'datetime',
  'editable': false,
  'width': '15%'
}, {
  'field': 'modifier',
  'dataType': 'String',
  'title': '最后修改人',
  'editable': false,
  'width': '10%'
}, {
  'field': 'modifytime',
  'dataType': 'String',
  'title': '最后修改时间',
  'editType': 'datetime',
  'editable': false,
  'width': '15%'
}]

function init () {
  collection.load({ pageIndex: pageIndex })

  viewModel = {
    id: ko.observable(10),
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
      editable: true,
      pagination: true,
      autoWidth: true,
      noScroll: true,
      fields: columnSetting
    },
    add: function () {
      var data = [{
        "creator": userId,
        "creationtime": getNowFormatDate()
      }]
      collection.datatable.addSimpleData(data);
    },
    save: debounce(async function () {
      $('#saveId').attr('disabled', true)
      $('#saveId').removeClass('btn-primary')
      $('#savespan').attr('disabled', true)
      var data = await collection.save()

      if (data.status == '1') {
        uMessage('success', data.msg || '保存成功')
        $('#saveId').removeAttr('disabled', true)
        $('#saveId').addClass('btn-primary')
        $('#savespan').removeAttr('disabled', true)
      } else {
        uMessage('fail', data.msg || '保存失败')
        $('#saveId').removeAttr('disabled', true)
        $('#saveId').addClass('btn-primary')
        $('#savespan').removeAttr('disabled', true)
      }

    }, 0),
    deleteBill
  }
  window.app = window.u.createApp({
    el: 'body',
    model: viewModel
  })
}

function deleteBill () {
  let rows = collection.datatable.getSelectedRows()
  console.log(rows)
  
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
      collection.datatable.removeAllRows(rows);
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

function delCheck () {

}
// 获取系统当前时间
function getNowFormatDate() {
    var date = new Date()
    var seperator1 = "-"
    var seperator2 = ":"
    var month = date.getMonth() + 1
    var strDate = date.getDate()
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
            + " " + date.getHours() + seperator2 + date.getMinutes()
            + seperator2 + date.getSeconds()
    return currentdate
}

(async function () {
  //界面初始化赋值
  var {data} = await Get('/cpu-bidtrade/bidtrade/getBidInfo')
  console.log(data)
  userId = data.contact
  init()
})()
