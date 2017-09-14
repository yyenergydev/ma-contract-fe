// 部门人员参照
/* global $ u */
import Collection from 'common/vo/collection'
/* eslint-disable no-unused-vars */
import supplydoc from 'collection/supplydoc'
/* eslint-disable no-unused-vars */
// import {Post} from 'common'

function init (refer) {
  // 每次都重新加载
  let collection = Collection.create('collection.supplydoc')
  let enterpriseId = refer.enterpriseId || window.global.user.enterpriseId
  collection.load({enterpriseId: enterpriseId, pageSize: 10})

  let vm = {
    config: {
      'id': 'gridperson',
      'data': collection,
      'type': 'grid',
      'multiSelect': false,
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
    let selectData = collection.datatable.getCurrentRow()
    let data = {
      id: selectData.data.id.value,
      name: selectData.data.name.value,
      code: selectData.data.code.value,
      supplyid: selectData.data.supplyId.value
    }
    return data
  })
  collection.datatable.on('select', function (obj) {
    refer.submit()
  })
}
let template = require('./index.html')
export default {
  init,
  template
}
