// latest: zhangmyh 2017-4-24 1:42 PM
// 部门人员参照
import Collection from 'common/vo/collection'
import 'collection/supplydoc'
/* global $ ko u */

let _config
function init (refer) {
  // 每次都重新加载
  let collection = Collection.create('collection.supplydoc')
  let enterpriseId = refer.enterpriseId || window.global.user.enterpriseId
  let selectedData = []
  let selectflag = false
  collection.on('data', function (result) {
    if (_config.multiSelect && !_config.repeatable && refer.options.defaultData) {
      // 初始化默认值
      if (selectedData.length <= 0) {
        let defaultData = refer.options.defaultData()
        if (defaultData instanceof Array) {
          selectedData = defaultData
        }
      }
      let SelectIndex = []
      result.data.result.forEach(function (listItem, i) {
        selectedData.forEach(function (item) {
          if (item.id === listItem.id) {
            SelectIndex.push(i)
          }
        })
      })
      collection.datatable.setRowsSelect(SelectIndex)
    }
    selectflag = true
  })
  collection.load({
    purid: enterpriseId,
    searchKey: '',
    pageSize: 10
  })

  const search = () => {
    collection.load({
      purid: enterpriseId,
      searchKey: vm.searchKey(),
      pageSize: 10,
      pageIndex: 0
    })
  }

  let vm = {
    searchKey: ko.observable(''),
    search,
    gridconfig: {
      id: 'gridperson',
      data: collection,
      type: 'grid',
      multiSelect: true,
      editable: false,
      pagination: true,
      fields: [{
        field: 'name',
        dataType: 'String',
        title: '供应商名称',
        width: '50%'
      }, {
        field: 'code',
        dataType: 'String',
        title: '编码',
        width: '40%'
      }]
    }
  }
  let app = u.createApp()
  app.init(vm, $('#refer_supply')[0])

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
    if (!_config.multiSelect) {
      let selectData = collection.datatable.getCurrentRow().data
      selectedData = {
        id: selectData.id.value,
        name: selectData.name.value,
        code: selectData.code.value,
        supplyid: selectData.supplyId.value
      }
      refer.submit()
      return
    }
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

  $('#refer_supply').on('keypress', 'input', function (e) {
    if (e.keyCode == 13) {
      // 设置延时以让ko绑定输入框值
      setTimeout(search, 50)
    }
  })
}

let template = require('./index.html')
export default function (config) {
  _config = Object.assign({
    multiSelect: false,
    repeatable: false
  }, config)

  return {
    init,
    template
  }
}
