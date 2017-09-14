// 部门人员参照
/* global $ u */
import Collection from 'common/vo/collection'
/* eslint-disable no-unused-vars */
import supplydoc from 'collection/supplydoc'
/* eslint-disable no-unused-vars */
import _ from 'lodash'
// import {Post} from 'common'

function init (refer) {
  // 每次都重新加载
  let collection = Collection.create('collection.supplydoc')
  let enterpriseId = refer.enterpriseId || window.global.user.enterpriseId
  let selectedData = []
  let selectflag = false
  collection.on('data', function (result) {
    if (refer.options.defaultData) {
      // 初始化默认值
      let defaultData = refer.options.defaultData()
      if (defaultData instanceof Array) {
        let SelectIndex = []
        result.data.result.forEach(function (listItem, i) {
          defaultData.forEach(function (item) {
            if (item.id === listItem.id) {
              SelectIndex.push(i)
              selectedData.push({
                id: listItem.id,
                name: listItem.name,
                code: listItem.code,
                supplyid: listItem.supplyId
              })
            }
          })
        })
        collection.datatable.setRowsSelect(SelectIndex)
      }
    }
    selectflag = true
  })
  collection.load({enterpriseId: enterpriseId, pageSize: 10})

  let vm = {
    config: {
      'id': 'gridperson',
      'data': collection,
      'type': 'grid',
      'multiSelect': true,
      'editable': false,
      pagination: true,
      fields: [{
        'field': 'name',
        'dataType': 'String',
        'title': '供应商名称',
        'width': '40%'
      }, {
        'field': 'code',
        'dataType': 'String',
        'title': '编码',
        'width': '50%'
      }]
    }
  }
  let app = u.createApp()
  app.init(vm, $('#supplydocrefer')[0])

  // 提交事件
  refer.registerSubmitFunc(() => {
    return selectedData
  })
  collection.datatable.on('unSelect', function (obj) {
    let selectData = collection.datatable.getRowByRowId(obj.rowIds[0])
    let index = -1
    selectedData.forEach(function (item, i) {
      if (item.id === selectData.getValue('id')) {
        index = i
      }
    })
    if (index >= 0) {
      selectedData.splice(index, 1)
    }
  })
  collection.datatable.on('select', function (obj) {
    // 默认初始化已选择数据的时候不触发数据改变
    if (selectflag) {
      let selectData = collection.datatable.getRowByRowId(obj.rowIds[obj.rowIds.length - 1])
      selectedData.push({
        id: selectData.data.id.value,
        name: selectData.data.name.value,
        code: selectData.data.code.value,
        supplyid: selectData.data.supplyId.value
      })
    }
  })
}
let template = require('./index.html')
export default {
  init,
  template
}
