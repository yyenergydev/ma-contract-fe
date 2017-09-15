// latest: tangh 2017-09-13 13:31 AM
import './index.less'
import 'ko-epui/dist/ko-epui.css'
import 'ko-epui'
import 'components'

import Collection from 'common/vo/collection'
import 'collection/department'
import 'collection/contracttype'
import contracttype from 'model/contracttype'
import {Post} from 'common'
// import Adapter from './adapter'
// import chooseRefer from 'components/modalrefer/chooseRefer'
/* eslint-disable */
/* global ko u $ __ */

let typeId = window.global.query('id')
var viewModel

// const chooseOrg = chooseRefer('org', 'component', {
//   model: contracttype,
//   adapter: Adapter.org
// }, {
//   repeatable: false,
//   multiSelect: true
// })

function init () {
  let collection = Collection.create('collection.contracttype')
  // let tree = Collection.create('contracttype')
  let tree = Collection.create('collection.department')
  let enterpriseId = window.global.user.enterpriseId
  tree.load({enterpriseId: enterpriseId})

  console.log('加载合同树表enterpriseId' + enterpriseId)
  console.log(tree.datatable)
  // let selectedOrg = {}
  viewModel = {
    treemodel: tree.datatable,
    treeOption: {
      callback: {
        beforeClick: async function (id, obj) {
          if (!obj.flag) {
            // var {result} = await Post('/ma-contract/contracttype/tree', {
            var {result} = await Post('/cpu-basedocrefer/basedocrefer/orgdept/getorgbyparentid', {
              enterpriseId: enterpriseId,
              parentId: obj.id
            })
            tree.datatable.addSimpleData(result)
            obj.flag = true
          }
          // selectedOrg = obj
          collection.datatable.removeAllRows()
          collection.load({
            organizationid: obj.id,
            pageIndex: 0,
            pageSize: 10
          })
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
    // chooseOrg
  }
  window.app = window.u.createApp({
    el: 'body',
    model: viewModel
  })
}

function add () {
  window.location.href = '../bidtradeeditor/index.' + __('locale') + '.html?id=' + 0 + '&type=2'
}

(async function () {
  init()
})()
