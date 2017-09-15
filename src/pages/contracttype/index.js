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
/* eslint-disable */
/* global ko u $ __ */

let typeId = window.global.query('id')
var viewModel

const chooseOrg = chooseRefer('org', 'component', {
  model: contracttype.datatable,
  adapter: Adapter.org
}, {
  repeatable: false,
  multiSelect: true
})

function init () {
  let collection = Collection.create('collection.contracttype')
  let tree = Collection.create('collection.contracttype')
  // let tree = Collection.create('collection.department')
  let enterpriseId = window.global.user.enterpriseId
  tree.load({parentId: 0})
  // tree.load({enterpriseId: enterpriseId})
  console.log(tree.datatable)
  // let selectedOrg = {}
  viewModel = {
    treemodel: tree.datatable,
    treeOption: {
      callback: {
        beforeClick: async function (id, obj) {
          if (!obj.flag) {
            var {result} = await Post('/ma-contract/contracttype/list', {
            // var {result} = await Post('/cpu-basedocrefer/basedocrefer/orgdept/getorgbyparentid', {
              // enterpriseId: enterpriseId,
              parentId: obj.id
            })
            // tree.datatable.addSimpleData(result)
            obj.flag = true
          }
          console.log (obj)
          // selectedOrg = obj
          // collection.datatable.removeAllRows()
          // collection.load({
          //   id: obj.id,
          //   pageIndex: 0,
          //   pageSize: 10
          // })
          //右侧合同单据赋值
          if (obj.id) {
            contracttype.datatable.ref('id')(obj.id)
            contracttype.datatable.ref('parentId')(obj.parentId)
            // contracttype.datatable.ref('parentName')(obj.parentName)
            contracttype.datatable.ref('code')(obj.code)
            contracttype.datatable.ref('name')(obj.name)
            contracttype.datatable.ref('remark')(obj.remark)
            contracttype.datatable.ref('level')(obj.level)
            
          } else {
            contracttype.datatable.ref('parentId')(obj.id)
            // contracttype.datatable.ref('parentName')(obj.name)
            let level = obj.level + 1
            contracttype.datatable.ref('level')(level)
          }
        }
      }
    },
    // billcontrtype: {
    //   id: ko.observable(typeId),
    //   code: ko.observable(true),
    //   name: ko.observable(true),
    //   templateId: ko.observable(true),
    //   useScope: ko.observable(true),
    //   remark: ko.observable(true)
    // },
    model: contracttype.datatable,
    chooseOrg,
    add,
    save: debounce(async function () {
      viewModel.model.setValue('isGlobal', 0)
      //保存校验
      // var newTypeCode = viewModel.model.code
      // debugger
      // console.log(newTypeCode)
      // if (newTypeCode == '1') {
      //   uMessage('fail', data.msg || '合同类型编码已存在！')
      //   return false
      // }
      var data = await contracttype.save()
      if (data.status == '1') {
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

function add () {
  console.log('功能开发...')
  window.location.href = '../edit/index.' + __('locale') + '.html?id=' + 0 + '&type=2'
}

(async function () {
  //界面初始化赋值
  // contracttype.datatable.ref('parentName')('Jack02')

  init()
})()
