// latest: tangh 2017-09-22 13:31 AM
import './index.less'
import 'ko-epui/dist/ko-epui.css'
import 'ko-epui'
import 'components'
import {debounce} from 'lodash'
import {Post} from 'common'
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
  'editable': true,
  'width': '15%'
}, {
  'field': 'name',
  'dataType': 'String',
  'title': '行业类别名称',
  'editable': true,
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
      var data = [{
      }]
      collection.datatable.addSimpleData(data);
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
            uMessage('warning', data.msg || '请选择要删除的行业类别!')
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
    stop: function () {
    }
  }
  window.app = window.u.createApp({
    el: 'body',
    model: viewModel
  })
}

function delCheck () {
}

(async function () {
  //界面初始化赋值
  init()
})()
