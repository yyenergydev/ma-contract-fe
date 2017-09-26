// latest: mahonggeng 2017-09-22 13:31 AM
import './index.less'
import 'ko-epui/dist/ko-epui.css'
import 'ko-epui'
import 'components'
import {debounce} from 'lodash'
import Collection from 'common/vo/collection'
import 'collection/department'
import collection from 'collection/contractsampletext'
import contracttype from 'model/contracttype'
import contractsampletext from 'model/contractsampletext'
import {Get,Post,Delete} from 'common'
import chooseRefer from 'components/modalrefer/chooseRefer'
import uMessage from 'components/message'
/* eslint-disable */
/* global ko u $ __ */

// let typeId = window.global.query('id')
var viewModel


function init () {
  //let collection = Collection.create('collection.contractsampletext')
  let tree = Collection.create('collection.contracttype')
  tree.load({pageIndex: 0, parentid: 0})//加载合同类型树根节点


  viewModel = {

    treemodel: tree.datatable,
    selectedtype: {id: null, name: null, level: -1},
    treeOption: {
      callback: {
        beforeClick: async function (id, obj) {
          viewModel.selectedtype = obj
          collection.datatable.removeAllRows()

          var {data} = await Get(collection.proxy.get, {
            id: obj.id
          })
          collection.datatable.setSimpleData(data.result)
          console.log('1111111'+JSON.stringify(data))
          
        }
      }
    },
    config: {
      'id': 'gridcontracttype',
      'data': collection,
      'type': 'grid',
      'multiSelect': true,
      'showNumCol': true,
      'editable': true,
      pagination: true,
      fields: [{
        'field': 'contracttypeId',
        'dataType': 'integer',
        'title': '合同类型',
        'width': '0',
        'visible': false
      },{
        'field': 'contracttypeName',
        'dataType': 'string',
        'title': '合同类型',
        'width': '20%'
      }, {
        'field': 'code',
        'dataType': 'string',
        'title': '示范文本编码',
        'width': '20%'
      }, {
        'field': 'name',
        'dataType': 'string',
        'title': '示范文本名称',
        'width': '20%'
      }, {
        'field': 'version',
        'dataType': 'float',
        'title': '版本号',
        'width': '20%'
      }]
    },

    model: collection.model,
    add,
    deleteRows: debounce(async function (data) {
      var data = collection.datatable.getSimpleData({type:'select'})
      var ids = []
      $.each(data,function(index,row){
        collection.datatable.removeRow(index)
        ids.push(row.id);
      })
      debugger
      var data = Delete(collection.proxy.delete,{ids:ids})
      if (data.status === 1) {
        uMessage('success', data.msg || '保存成功')
    
      } else {
        uMessage('fail', data.msg || '保存失败')
    
      }
    }, 0),
    save: debounce(async function (data) {
      //viewModel.model.setValue('bidType', bidType)
      // viewModel.model.setValue('supervisors', JSON.stringify(viewModel.model.getValue('supervisors')))
     /*  $('#saveId').attr('disabled', true)
      $('#saveId').removeClass('btn-primary')
      $('#savespan').attr('disabled', true) */
      //var data = await collection.model.save()

      var json = collection.datatable.getSimpleData();
      var data = await Post(collection.proxy.post, json)
      console.log(json)
      console.log(data)
      debugger
      collection.datatable.removeAllRows()
      collection.datatable.setSimpleData(data.data.result)

      if (data.status === 1) {
        uMessage('success', data.msg || '保存成功')
    
      } else {
        uMessage('fail', data.msg || '保存失败')
    
      }
    }, 0)
  }
  window.app = window.u.createApp({
    el: 'body',
    model: viewModel
  })
}

function add(){
  var conttype = viewModel.selectedtype;
  if(conttype.id==null){
    uMessage('提示', '请选择合同类型')
    return
  }

  var data = [{
    "contracttypeId": conttype.id,
    "contracttypeName": conttype.name
  }]
  collection.datatable.addSimpleData(data);
}

function deleteRows(){
  var data = collection.datatable.getSimpleData({type:'select'})

  var ids = []
  $.each(data,function(index,row){
    ids.push(row.id);
  })
  Delete(collection.proxy.delete,{ids:ids})

}

(async function () {
  //界面初始化赋值
  init()
})()