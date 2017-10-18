// latest: mahonggeng 2017-09-22 13:31 AM
import './index.less'
import 'ko-epui/dist/ko-epui.css'
import 'ko-epui'
import 'components'
import {debounce} from 'lodash'
import Collection from 'common/vo/collection'
import 'collection/department'
import tree from 'collection/coderule'
import 'collection/coderule'
import coderule from 'model/coderule'
import coderuledetail from 'model/coderule/ruledetail'
import contractsampletext from 'model/contractsampletext'
import {Get,Post,Delete} from 'common'
import chooseRefer from 'components/modalrefer/chooseRefer'
import uMessage from 'components/message'
/* global ko u $ __ */

// let typeId = window.global.query('id')
var viewModel

const chooseContracttype = chooseRefer('contracttype', 'component', {
  model: coderule.datatable,
  adapter: {
    idKey: 'id',
    textKey: 'codetype',
    adapter: {
      id: 'id',
      codetype: 'name'
    }
  }
}, {
  repeatable: false,
  multiSelect: false
})

const chooseOrgDoc4Grid = chooseRefer('contracttype', 'cell', {
  model: coderule,
  association: 'detailList',
  adapter: {
    adapter: {
      reqOrgId: 'id',
      reqOrgName: 'name'
    }
  }
}, {
  repeatable: false,
  multiSelect: false,
  hasDepartment: false
})

const chooseElemType = chooseRefer('elemtype', 'cell', {
  model: coderule,
  association: 'detailList',
  adapter: {
    adapter: {
      reqOrgId: 'id',
      reqOrgName: 'elemtype'
    }
  }
}, {
  repeatable: false,
  multiSelect: false,
  hasDepartment: false
})

function init () {
  debugger
  console.log(coderule+"-"+coderule.associations.detailList)
  //let collection = Collection.create('collection.contractsampletext')
  //let tree = Collection.create('coderuleList')
  tree.load({pageIndex: 0, parentid: 0})


  viewModel = {

    treemodel: tree.datatable,
    selectObj: {id: null, name: null, level: -1},
    treeOption: {
      callback: {
        //beforeClick: async function (id, obj) {
        beforeClick: async function (id, obj) {
          var str ='' ;
          str = getAllChildrenNodes(obj,str);
          //collection.load({idstr: obj.id+str});
debugger
          viewModel.selectObj = obj

          if (obj.id) {
            coderule.datatable.setSimpleData({
              id:obj.id, 
              parentId:obj.parentId, 
              parentName:obj.parentName,
              code:obj.code,
              name:obj.name,
              level:obj.level,
              codelength:obj.codelength,
              codetype:obj.codetype
            })
          }
        }
      }
    },
    elemtypeData:[{name: '常量', value: 0}, {name: '编码实体', value: 1}],
    addelem: function () {
      var data = [{
        "dr": 0
      }]
      coderule.associations.detailList.datatable.addSimpleData(data);
      //viewModel.gridmodel.addSimpleData(data);
      var data = {
        "pageIndex": 1,
        "pageSize": 10,
        "rows": [
            {
                "data": {
                    "elemtype": "常量",
                    
                }
            }
        ]
      }
    u.compMgr.updateComp();
    viewModel.gridmodel.removeAllRows();
    viewModel.gridmodel.setData(data);
      //coderuledetail.datatable.addSimpleData(data);
    },
    add,
    flash,
    save: debounce(async function () {
      console.log(viewModel.model)
      //保存校验
      var data = await coderule.save()
      if (data.status == '1') {
        uMessage('success', data.msg || '保存成功')
        //flash()
      } else {
        uMessage('fail', data.msg || '保存失败')
      }
    }, 0),
    delete: debounce(async function (data) {
      let level = viewModel.selectObj.level
      if(level==-1){
        uMessage('提示', '请选择要删除的编码规则!')
        return
      }else{
        u.confirmDialog({
          msg: '是否确认删除名称为'+viewModel.selectObj.name+'的规则？',
          title: '删除确认',
          onOk: async function () {
            var result = await Delete(coderule.proxy.delete,{id:viewModel.selectObj.id})
            if (result.status === 1) {
              flash()
              uMessage('success', result.msg || '删除成功')
            } else {
              uMessage('fail', result.msg || '删除失败')
            }
          }
        })
      }
      
    }, 0),
    /* deleteRows: debounce(async function (data) {
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
    }, 0), */
    gridmodel: coderuledetail.datatable,
    config: {
      id: 'gridcoderule',
      //data: coderuledetail,
      data: coderule.associations.detailList,
      type: 'grid',
      multiSelect: false,
      showNumCol: false,
      showHeader: true,
      columnMenu: false,
      editable: true,
      pagination: true,
      fields: [/*{
        'field': 'contracttypeId',
        'dataType': 'integer',
        'title': '合同类型',
        'width': '0',
        'visible': false
      },*/{
        'field': 'elemtype',
        'dataType': 'string',
        'title': '元素类型',
        'editType': function(obj){
          //value,element,gridObj,field,rowObj,rowIndex
          //$(element).
          debugger
    //elemtypeData:[{name: '常量', value: 0}, {name: '编码实体', value: 1}],
          //$("<a href='http://www.baidu.com' title='title' onclick='javascript:alert(\"onclick事件\");' target='_blank' style='color:red;'>百度一下，你就知道</a>").appendTo($(obj.element));
          // $("<u-select params='vm:{data:$root.model,datasource:$root.elemtypeData}, umeta:{\"field\":\"elemtype\"}'/>").appendTo($(obj.element));
        $('<div class="u-combo" id="combo1"><div class="u-input-group u-has-feedback"><input class="u-form-control" /><span class="u-form-control-feedback uf uf-arrow-down" data-role="combo-button"></span></div></div>').appendTo($(obj.element));
        u.compMgr.updateComp();
        document.getElementById('combo1')['u.Combo'].setComboData(viewModel.elemtypeData);

        },
        //'editType': chooseElemType,
        //'editType': 'combo',
        'width': '20%',
        //"editOptions":{"id":"combobox1","type":"combo","datasource":"elemtypeData"}
        //<div options='{"field":"combobox","dataType":"string","title":"下拉","editOptions":{"id":"combobox1","type":"combo","datasource":"comItems"},"editType":"combo","renderType":"comboRender"}'></div>        
      }, {
        'field': 'elemvalue',
        'dataType': 'String',
        'editType': 'date',
        'title': '元素值',
        'width': '20%'
      }, {
        'field': 'isrefer',
        'dataType': 'string',
        'title': '是否流水依据',
        'width': '20%'
      }, {
        'field': 'elemlength',
        'dataType': 'integer',
        'title': '长度',
        'width': '20%'
      }],
      onDblClickFun: function (obj){
        debugger
        window.location.href = '../contractsampletextedit/index.' + __('locale') + '.html?textid=' + obj.rowObj.value.id + window.location.hash

      }
    },

    model: coderule.datatable,
    chooseContracttype: chooseContracttype,
    /*add,
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
    }, 0)*/
  }
  window.app = window.u.createApp({
    el: 'body',
    model: viewModel
  })

  //u.compMgr.updateComp();
}


function add () {
  debugger
  let level = viewModel.selectObj.level
  setDefault()
  if (level != -1) {
    viewModel.model.ref('parentId')(viewModel.selectObj.id)
    viewModel.model.ref('parentName')(viewModel.selectObj.name)
    viewModel.model.ref('level')(level + 1)
    viewModel.model.ref('codetype')(viewModel.selectObj.codetype)
  }else{
    viewModel.model.ref('codetype')(viewModel.model.getValue('codetype'))
  }
}

function setDefault () {
  viewModel.model.setValue('parentId', 0)
  viewModel.model.setValue('level', 1)
  viewModel.model.setValue('codelength', null)
  viewModel.model.setValue('id', null)
  viewModel.model.setValue('code', null)
  viewModel.model.setValue('name', null)
}

function flash (flag) {
  debugger
  let {data} = tree.load({parentid: 0})
  if(flag=='save'){
    viewModel.selectObj = data
  }else if(flag=='delete'){
    coderule.datatable.setSimpleData({level: -1})
    viewModel.selectObj = {level: -1}
  }
}

/*function add(){
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
}*/

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