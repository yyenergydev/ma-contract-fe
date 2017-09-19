// latest: tangh 2017-09-13 13:31 AM
import './index.less'
import 'ko-epui/dist/ko-epui.css'
import 'ko-epui'
import 'components'
import {debounce} from 'lodash'
import Collection from 'common/vo/collection'
import 'collection/department'
import 'collection/contracttype'
import contracttype from 'model/contracttype'
import {Post} from 'common'
import Adapter from './adapter'
import chooseRefer from 'components/modalrefer/chooseRefer'
import uMessage from 'components/message'
import { personrefer } from 'components/modalrefer'
/* eslint-disable */
/* global ko u $ __ */

// let typeId = window.global.query('id')
var viewModel

const chooseOrg = chooseRefer('org', 'component', {
  model: contracttype.datatable,
  adapter: Adapter.org
}, {
  repeatable: false,
  multiSelect: true
})

function init () {
  // let collection = Collection.create('collection.contracttype')
  let tree = Collection.create('collection.contracttype')
  tree.load({pageIndex: 0, parentid: 0})//加载合同类型树根节点

  viewModel = {
    treemodel: tree.datatable,
    treeOption: {
      callback: {
        beforeClick: async function (id, obj) {
          // if (!obj.flag) {
          //   var {result} = await Post('/ma-contract/contracttype/list', {
          //     parentId: obj.id
          //   })
          //   // tree.datatable.addSimpleData(result)
          //   obj.flag = true
          // }
          console.log(obj)
          //右侧合同单据赋值
          if (obj.id) {
            contracttype.datatable.ref('id')(obj.id)
            contracttype.datatable.ref('parentId')(obj.parentId)
            contracttype.datatable.ref('parentName')(obj.parentName)
            contracttype.datatable.ref('code')(obj.code)
            contracttype.datatable.ref('name')(obj.name)
            contracttype.datatable.ref('remark')(obj.remark)
            contracttype.datatable.ref('level')(obj.level)
            viewModel.selectObj.id = obj.id
            viewModel.selectObj.name = obj.name
            viewModel.selectObj.level = obj.level
          }
        }
      }
    },
    model: contracttype.datatable,
    selectObj: {id: null, name: null, level: -1},
    chooseOrg,
    add,
    save: debounce(async function () {
      viewModel.model.setValue('isGlobal', 0)
      // let level = viewModel.model.getValue('level')
      // if(level == null){
      //   viewModel.model.setValue('level', 0)
      // } else {
      //   viewModel.model.setValue('level', level + 1)
      // }
      console.log(viewModel.model)
      //保存校验
      if (valid()) {
        var data = await contracttype.save()
        if (data.status == '1') {
          uMessage('success', data.msg || '保存成功')
          //重新加载
          tree.load({parentid: 0})
        } else {
          uMessage('fail', data.msg || '保存失败')
        }
      }
      
    }, 0),
    delete: function () {
      if (viewModel.model.getValue('id') == null) {
        uMessage('warning', '请选择要删除的合同类型')
        return
      }

      var ret = Post ('/ma-contract/contracttype/delete', {id: viewModel.model.getValue('id')})
      console.log('----' + JSON.stringify(ret))
      // if (data.status == '1') {
      //   uMessage('success', data.msg || '删除成功')
      //   //重新加载
      //   tree.load({pageIndex: 0, parentid: 0})
      // } else {
      //   uMessage('fail', data.msg || '删除失败')
      // }
    },
    chooseContrTpl: choosePerson(function (info) {
      console.log(info)
      viewModel.model.setValue('templateId', info.id)
      viewModel.model.setValue('templateName', info.personname)
    })
  }
  window.app = window.u.createApp({
    el: 'body',
    model: viewModel
  })
}

function add () {
  let level = viewModel.selectObj.level
  if (level == -1) {
    //增加一级根节点
    uMessage('warning', '请先选择左侧合同类型节点')
    return
    // contracttype.datatable.ref('parentId')(0)
    // contracttype.datatable.ref('level')(1)
  } else if (level > 1) {
    //增加下级节点
    uMessage('warning', '请先选择一级或二级节点')
    return
  } else {
    contracttype.datatable.ref('parentId')(viewModel.selectObj.id)
    contracttype.datatable.ref('parentName')(viewModel.selectObj.name)
    contracttype.datatable.ref('level')(level + 1)
  }
  clearNull()
}

function clearNull () {
  viewModel.model.setValue('id', null)
  viewModel.model.setValue('code', null)
  viewModel.model.setValue('name', null)
  viewModel.model.setValue('templateId', null)
  viewModel.model.setValue('useScopeIds', null)
  viewModel.model.setValue('remark', null)
}

function valid () {
  var inputTypeCode = viewModel.model.getValue('code')
  if (inputTypeCode != null) {
    if (inputTypeCode.length != 5) {
      uMessage('warning', '请输入5位长度合同类型编码，如A0000！')
      return false
    }
  }
  return true
}

function choosePerson (callback) {
  return function () {
    personrefer({
      onOk: callback,
      onCancel: doNothing
    })
  }
}

function doNothing () {}

(async function () {
  //界面初始化赋值
  init()
})()
