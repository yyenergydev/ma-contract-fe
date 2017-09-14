/* global $ */
/* global u */
/* global app */
/* global Row */
/* global localStorage */

// 全局静态信息
var global = window.global = {
  apiprefix: '',
  // 获取url查询参数
  query (val) {
    var split = window.location.search.match(new RegExp('[?=&]*' + val + '=([^&]*)'))
    return split && split[1] || ''
  },
  hash (key, val) {
    let from = window.location.hash.slice(1)
    let split
    if (val !== undefined) {
      split = from.match(new RegExp('[#=&]*' + key + '=([^&]*)'))
      let v
      if (split) {
        v = from.replace(new RegExp(key + '=([^&]*)'), function () {
          return key + '=' + val
        })
      } else {
        let p = from ? from + '&' : ''
        v = p + key + '=' + val
      }
      window.location.hash = v
      return val
    } else {
      split = window.location.hash.match(new RegExp('[#=&]*' + key + '=([^&]*)'))
      return split && split[1] || ''
    }
  },
  // rest服务
  get (url, data) {
    return $.ajax({
      url: getUrl(url, data),
      method: 'get',
      data: data,
      dataType: 'json',
      contentType: 'application/json'
    })
  },
  post (url, data) {
    return $.ajax({
      url: getUrl(url, data),
      method: 'post',
      data: JSON.stringify(data),
      dataType: 'json',
      contentType: 'application/json'
    })
  },
  isEn () {
    return window.location.pathname.slice(-8) == '.en.html'
  }
}

function getUrl (url, query) {
  if (!query) {
    return url
  }
  url = url.replace(/:[^/.]*/g, function (val) {
    return query[val.slice(1)] || ''
  })
  return url
}

var user = {}
try {
  user = JSON.parse(localStorage.getItem('user')).user
  global.user = user
} catch (e) {
  $.ajax({
    url: '/yuncai/ebvplogin',
    method: 'get',
    dataType: 'json',
    contentType: 'application/json',
    success (data) {
      user = data.user
      global.user = user
      localStorage.setItem('user', JSON.stringify(data))
    }
  })
}

// 附件上下文

if (window.location.href.indexOf('.yonyou.com') >= 0 || window.location.href.indexOf('localhost') >= 0) {
  // 如果需要使用yc环境进行开发则把isDevUseYc改成true,完全是因为nginx不应该不同环境配置两个contxt,这样处理起来很麻烦
  // add 因为oss回调的时候是按照ip回调的,不按照域名,所以只能用两个context来区分了
  let isDevUseYc = false
  if (window.location.href.indexOf('yc.yonyou.com') >= 0 || isDevUseYc) {
    window.$fileuploadurl = '/file1/'
  } else {
    window.$fileuploadurl = '/file/'
  }
} else {
  window.$fileuploadurl = '/file/'
}

// iuap 默认参数
var gridCompProto = $.fn.grid.gridComp.prototype
var oldinitDefault = gridCompProto.initDefault
gridCompProto.initDefault = function () {
  oldinitDefault.apply(this, arguments)
  this.defaults.contentSelect = false
  this.defaults.showEditIcon = true
}

/**
 * 增加datatable方法
 * 没有id,直接进行删除
 * 有id,修改状态
 **/
u.DataTable.prototype.delRow = function (obj) {
  if (!obj.row.value.id) {
    var rowID = obj.row.value['$_#_@_id']
    obj.gridObj.dataTable.removeRowByRowId(rowID)
  } else {
    var row = obj.gridObj.dataTable.getRow(obj.row.valueIndex)
    row.setValue('rowStatus', 'del')
    var id = obj.gridObj.options.id
    app.getComp(id).silence = true
    app.getComp(id).grid.deleteOneRow(obj.rowIndex)
    app.getComp(id).silence = false
  }
}

// 重写新增数据的方法
var oldRowInit = Row.prototype.init
Row.prototype.init = function () {
  oldRowInit.apply(this, arguments)
  if (!this.data['rowStatus']) {
    this.data['rowStatus'] = {}
  }
  if (!this.data['rowStatus']['value']) {
    this.data['rowStatus']['value'] = 'new'
  }
}

// 重写修改数据的方法
var oldRowSetValue = Row.prototype.setValue
Row.prototype.setValue = function (field) {
  oldRowSetValue.apply(this, arguments)
  // 修改这行的
  if (!this.data['rowStatus']) {
    this.data['rowStatus'] = {}
  }

  if (field != 'rowStatus') {
    // if(!this.data['rowStatus']['value']){
    this.data['rowStatus']['value'] = 'upd'
    // }
  }
}
