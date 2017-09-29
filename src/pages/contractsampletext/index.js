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
        //beforeClick: async function (id, obj) {
        beforeClick: async function (id, obj) {
          var str ='' ;
          str = getAllChildrenNodes(obj,str);
          collection.load({idstr: obj.id+str});

          viewModel.selectedtype = obj

          /* 
          collection.datatable.removeAllRows()
          var {data} = await Get(collection.proxy.get, {
            id: obj.id
          })
          collection.datatable.setSimpleData(data.result)
          console.log('1111111'+JSON.stringify(data)) */
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
      }],
      onDblClickFun: function (obj){
        debugger
        window.location.href = '../contractsampletextedit/index.' + __('locale') + '.html?textid=' + obj.rowObj.value.id + window.location.hash

      }
    },

    model: collection.model,
    add,
    addContractsampletextedit,
    deleteRows: debounce(async function (data) {
      var data = collection.datatable.getSimpleData({type:'select'})
      var ids = []
      $.each(data,function(index,row){
        collection.datatable.removeRow(index)
        ids.push(row.id);
      })
      var result = await Post(collection.proxy.delete,{ids:ids})
      if (result.status === 1) {
        uMessage('success', result.msg || '删除成功')
      } else {
        uMessage('fail', result.msg || '删除失败')
      }
    }, 0),
    save: debounce(async function (data) {
      var json = collection.datatable.getSimpleData();
      var data = await Post(collection.proxy.post, json)
      if (data.status === 1) {
        collection.datatable.removeAllRows()
        collection.datatable.setSimpleData(data.data)
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

function addContractsampletextedit () {
  var conttype = viewModel.selectedtype;
  if(conttype.id==null){
    uMessage('提示', '请选择合同类型')
    return
  }

  var data = {
    "contracttypeId": conttype.id,
    "contracttypeName": conttype.name
  }
  //collection.datatable.addSimpleData(data);
  debugger
  window.location.href = '../contractsampletextedit/index.' + __('locale') + '.html?inittypeid=' + conttype.id + '&initname='+escape(conttype.name) + '&textid=0'
}

function getAllChildrenNodes(treeNode,result){
  if (treeNode.isParent) {
    var childrenNodes = treeNode.children;
    if (childrenNodes) {
        for (var i = 0; i < childrenNodes.length; i++) {
            result += ',' + childrenNodes[i].id;
            result = getAllChildrenNodes(childrenNodes[i], result);
        }
    }
}
return result;
}

(async function () {
  //界面初始化赋值
  init()
})()