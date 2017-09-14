// 部门人员参照
/* global $ u */
import Collection from 'common/vo/collection'
/* eslint-disable no-unused-vars */
import person from 'collection/person'
import department from 'collection/department'
/* eslint-disable no-unused-vars */
import {Post} from 'common'

function init (refer) {
  // 树形控件加载有误,所以需要每次都重新加载
  let collection = Collection.create('collection.person')
  let tree = Collection.create('collection.department')
  let enterpriseId = refer.options.enterpriseId || window.global.user.enterpriseId
  tree.load({enterpriseId: enterpriseId})
  let selectedOrg = {}
  let vm = {
    treemodel: tree.datatable,
    treeOption: {
      callback: {
        beforeClick: async function (id, obj) {
          if (!obj.flag) {
            var {result} = await Post('/cpu-basedocrefer/basedocrefer/orgdept/getorgbyparentid', {
              enterpriseId: enterpriseId,
              parentId: obj.id
            })
            tree.datatable.addSimpleData(result)
            obj.flag = true
          }
          selectedOrg = obj
          collection.datatable.removeAllRows()
          collection.load({
            organizationid: obj.id,
            pageIndex: 0,
            pageSize: 10
          })
        }
      }
    },
    config: {
      'id': 'gridperson',
      'data': collection,
      'type': 'grid',
      'multiSelect': false,
      'editable': false,
      pagination: true,
      fields: [{
        'field': 'personname',
        'dataType': 'String',
        'title': '人员',
        'width': '50%'
      }, {
        'field': 'personcode',
        'dataType': 'String',
        'title': '编码',
        'width': '50%'
      }]
    }
  }
  let app = u.createApp()
  app.init(vm, $('#personrefer')[0])
  refer.registerSubmitFunc(() => {
    let selectData = collection.datatable.getCurrentRow().data
    return {
      id: selectData.id.value,
      personname: selectData.personname.value,
      personcode: selectData.personcode.value,
      organizationid: selectData.organizationid.value,
      enterpriseId: selectData.enterpriseId.value,
      organizationname: selectedOrg.name
    }
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
