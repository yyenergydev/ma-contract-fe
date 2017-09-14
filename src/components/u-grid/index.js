//  - 'params' is an object whose key/value pairs are the parameters
//    passed from the component binding or custom element
//  - 'componentInfo.element' is the element the component is being
//    injected into. When createViewModel is called, the template has
//    already been injected into this element, but isn't yet bound.
//  - 'componentInfo.templateNodes' is an array containing any DOM
//    nodes that have been supplied to the component. See below.
import _ from 'lodash'
import EventBus from 'common/eventbus'
let editType = {
  default () {

  },
  combo (row, i, dom, vm) {
    // if(!row.editOptions)return;
    // var name="datasource_"+i;
    // vm[name]=getStore(row.editOptions.datasource);
    // row.editOptions.datasource=name;
  }
}
let dataType = {
  // renderType funtion转string
  default (row, i, dom, renderType) {
    fnChange(row, 'renderType', renderType, i)
    fnChange(row, 'editType', renderType, i)
    return row
  },
  // 增加action下的renderType
  action (row, i, dom, renderType) {
    var item = row.item
    var name = 'renderType_' + i
    row.renderType = name
    // 创建列
    renderType[name] = function (obj) {
      _.each(item, function (v) {
        if (v.hidden) {
          if (v.hidden(obj)) {
            return
          }
        }
        var d = document.createElement('a')
        d.textContent = v.text
        d.className = 'grid-opt ' + (v.cls || '')
        d.onclick = _.partial(v.handler, obj, v.callback)
        obj.element.appendChild(d)
      })
    }
    return row
  }
}
function fnChange (row, fnname, vm, i) {
  if (row[fnname] && _.isFunction(row[fnname])) {
    var name = fnname + '_' + i
    vm[name] = row[fnname]
    row[fnname] = name
  }
}
function createGrid (params, componentInfo) {
  let config = params.config
  let dom = componentInfo.element.children[0]
  let fields = config.fields
  delete config.fields
  let data = config.data
  let isshow = window.global.query('show')
  if (isshow) {
    config.editable = false
  }
  config.data = 'data'
  config.canDrag = false
  config.canSwap = false
  config.columnMenu = false
  let vm = {}
  // 修改函数
  _.each(config, function (fn, key) {
    if (_.isFunction(fn)) {
      var name = 'grid_' + key
      config[key] = name
      vm[name] = fn
    }
  })
  dom.setAttribute('u-meta', JSON.stringify(config))
  // 平均宽度
  if (config.autoWidth) {
    _.each(fields, function (row, i) {
      row.width = 100 / fields.length + '%'
    })
  }
   // 修改编辑
  _.each(fields, function (row, i) {
    let type = row.editType
    let fn = editType[type] || editType.default
    fn(row, i, dom, vm)
  })

   // 修改展示
  _.each(fields, function (row, i) {
    var type = row.dataType
    var fn = dataType[row.dataType] || dataType.default
    let _row = fn(row, i, dom, vm)
    var d = document.createElement('div')
    if (type === 'action') {
      d.style.cursor = 'pointer'
    }
    d.setAttribute('options', JSON.stringify(_row))
    dom.appendChild(d)
  })

  // 添加分页
  config.pagination && pagination(dom, vm, data)
  vm = _.extend(vm, {
    data: data.datatable
  })
  window.app.createComp(dom, vm)
}

function pagination (dom, vm, collection, name) {
  // 创建分页组件
  var pag = document.createElement('div')
  pag.className = 'u-pagination'
  pag.setAttribute('options', JSON.stringify({'type': 'pagination', 'data': 'pagination'}))
  var container = document.createElement('div')
  container.className = 'text-center'
  container.appendChild(pag)
  dom.parentElement.appendChild(container)
  var comp = new window.u.pagination({ el: pag, showState: false })

  comp.on('pageChange', function (pageIndex) {
    collection.load({
      pageIndex: pageIndex
    })
    window.global.hash('page', pageIndex)
  })

  EventBus.on('pagination.' + collection._config.name, function (data) {
    comp.update({
      totalPages: data.totalPage,
      pageSize: data.pageSize,
      currentPage: data.pageIndex + 1,
      totalCount: data.totalCount})
  })

  if (collection.data) {
    var page = collection.data
    comp.update({
      totalPages: page.totalPage,
      pageSize: page.pageSize,
      currentPage: page.pageIndex + 1,
      totalCount: page.totalCount
    })
  }
}

export default createGrid
