// latest: tangh 2017-09-25 13:31 AM
import './index.less'
import 'ko-epui/dist/ko-epui.css'
import 'ko-epui'
import 'components'
import {debounce} from 'lodash'
import {Post} from 'common'
import collection from 'collection/contracttemplate'
import Operater from './opt'
import uMessage from 'components/message'
/* eslint-disable */
/* global ko u app $ __ */

var pageIndex = window.global.hash('pageindex') || 0
var viewModel
var userId

const columnSetting = [{
  'field': 'code',
  'dataType': 'String',
  'title': '<span class="required">*</span>模板编码',
  'editable': true,
  'width': '15%'
}, {
  'field': 'name',
  'dataType': 'String',
  'title': '<span class="required">*</span>模板名称',
  'editable': true,
  'width': '15%'
}, {
  'field': 'useScopeNames',
  'dataType': 'String',
  'title': '使用范围',
  'editable': true,
  'width': '15%'
}, {
  'field': 'version',
  'dataType': 'Integer',
  'title': '版本号',
  'editable': false,
  'width': '10%'
}, {
  'field': 'status',
  'dataType': 'Integer',
  'title': '启用状态',
  'editable': false,
  'width': '10%',
  renderType (obj) {
    const stateConverter = function (state) {
      switch (state) {
        case 0:
          return '未启用'
        case 1:
          return '已启用'
        default:
          return ''
      }
    }
    let text = stateConverter(obj.row.value.status)
    obj.element.innerHTML = '<span title="' + text + '">' + text + '</span>'
  }
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
  'editType': 'datetime',
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
    id: ko.observable(''),
    title: ko.observable('合同会签单模板'),
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
    copy: function () {
      let rows = collection.datatable.getSelectedRows()
      if (rows.length > 0) {
        rows.forEach(function (obj) {
          var data = [{
            "code": obj.data.code,
            "name": obj.data.name
            // "version": 1,
            // "creator": userId,
            // "creationtime": getNowFormatDate()
          }]
          collection.datatable.addSimpleData(data);
        })
      }
    },
    save: debounce(async function () {
      $('#saveId').attr('disabled', true)
      $('#saveId').removeClass('btn-primary')
      $('#savespan').attr('disabled', true)
      var json = collection.datatable.getSimpleData();
      var data = await Post(collection.proxy.post, json)     
      if (data.status == '1') {
        uMessage('success', data.msg || '保存成功')
        $('#saveId').removeAttr('disabled', true)
        $('#saveId').addClass('btn-primary')
        $('#savespan').removeAttr('disabled', true)
        collection.load({ pageIndex: pageIndex })
      } else {
        uMessage('fail', data.msg || '保存失败')
        $('#saveId').removeAttr('disabled', true)
        $('#saveId').addClass('btn-primary')
        $('#savespan').removeAttr('disabled', true)
      }

    }, 0),
    deleteRows: debounce(async function (data) {
      var data = collection.datatable.getSimpleData({type:'select'})
      // u.confirmDialog({
      //   msg: '是否确认删除？',
      //   title: '删除确认',
      //   onOk: async function () {
          var ids = []
          $.each(data,function(index,row){
            // collection.datatable.removeRow(index)
            ids.push(row.id);
          })
          if (ids.length == 0) {
            uMessage('warning', data.msg || '请选择要删除的模板!')
            return
          }
          var data = await Post(collection.proxy.delete, {ids:ids})
          if (data.status) {
            uMessage('success', data.msg || '删除成功')
            collection.load({ pageIndex: pageIndex })
          } else {
            uMessage('fail', data.msg || '删除失败')
          }
      //   }
      // })
    }, 0),
    design: function () {

    },
    bOpen: async function () {
      var data = collection.datatable.getSimpleData({type:'select'})
      var ids = []
      $.each(data,function(index,row){
        // collection.datatable.removeRow(index)
        ids.push(row.id);
      })
      if (ids.length == 0) {
        uMessage('warning', data.msg || '请选择要删除的模板!')
        return
      }
      var data = await Post(Operater.bt_openBt.url, {ids:ids})
      if (data.status) {
        showMessage('success', data.msg || '启用成功')
        collection.load({ pageIndex: pageIndex })
      } else {
        showMessage('fail', data.msg || '启用失败')
      }
      collection.load({ pageIndex: pageIndex })
    }
  }
  window.app = window.u.createApp({
    el: 'body',
    model: viewModel
  })
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
  init()
})()
