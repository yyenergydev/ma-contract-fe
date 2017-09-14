// latest: zhangmyh 2017-2-23 4:45 PM
// 物料参照
/* global $ u */
import Collection from 'common/vo/collection'
import 'collection/material/materialClass'
import 'collection/material/materialDoc'
import { Post } from 'common'

function init (refer) {
  // 树形控件加载有误,所以需要每次都重新加载
  let collection = Collection.create('material.materiallist')
  let tree = Collection.create('material.classlist')
  let enterpriseId = refer.options.enterpriseId || window.global.user.enterpriseId
  tree.load({ enterpriseId })
  let selectedData = []
  let vm = {
    treemodel: tree.datatable,
    treeOption: {
      callback: {
        beforeClick: async function (id, obj) {
          if (!obj.flag) {
            var res = await Post('/cpu-basedocrefer/basedocrefer/materialdoc/getmatclassbyparentid', {
              enterpriseId,
              parentid: obj.id
            })
            tree.datatable.addSimpleData(res.data.result)
            obj.flag = true
          }
          collection.datatable.removeAllRows()
          collection.load({
            enterpriseId,
            materialClassId: obj.id,
            pageIndex: 0,
            pageSize: 10
          })
        }
      }
    },
    gridconfig: {
      id: 'gridmaterial',
      data: collection,
      type: 'grid',
      multiSelect: true,
      editable: false,
      pagination: true,
      fields: [
        {
          'field': 'name',
          'dataType': 'String',
          'title': '物料名',
          'sortable': true,
          'canSwap': true,
          'width': '40%'
        }, {
          'field': 'measdoc',
          'dataType': 'String',
          'title': '单位',
          'renderType': 'timeRender',
          'sortable': true,
          'width': '30%'
        }
      ]
    }
  }

  let app = u.createApp()
  app.init(vm, $('#material_refer')[0])

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
    let data = collection.datatable.getRowByRowId(obj.rowIds[obj.rowIds.length - 1]).data
    selectedData.push({
      id: data.id.value,
      name: data.name.value,
      classId: data.classId.value,
      className: data.className.value,
      measdoc: data.measdoc.value
    })
  })

  tree.datatable.on('select', function (obj) {})
}

let template = require('./index.html')
export default {
  init,
  template
}
