// 事件总线--or 通用事件处理
// var EventEmitter2 = require('eventemitter2').EventEmitter2

import {EventEmitter2} from 'eventemitter2'
var server = new EventEmitter2({
  //
  // set this to `true` to use wildcards. It defaults to `false`.
  //
  wildcard: true,
  //
  // the delimiter used to segment namespaces, defaults to `.`.
  //
  // delimiter: '::',
  //
  // set this to `true` if you want to emit the newListener event. The default value is `true`.
  //
  newListener: false,
  //
  // the maximum amount of listeners that can be assigned to an event, default 10.
  //
  maxListeners: 20
})
// 追加分页事件
// require('./pagination').default(server)
var toastr = window.toastr || {}
toastr.options = {
  'closeButton': true,
  'debug': false,
  'progressBar': true,
  'preventDuplicates': false,
  'positionClass': 'toast-top-center',
  'onclick': null,
  'showDuration': '400',
  'hideDuration': '1000',
  'timeOut': '3000',
  'extendedTimeOut': '1000',
  'showEasing': 'swing',
  'hideEasing': 'linear',
  'showMethod': 'fadeIn',
  'hideMethod': 'fadeOut'
}
/* global alert */
server.on('success', function (value) {
  // toastr.success(value || '操作成功', '成功')
  alert(value || '操作成功')
})
// 服务不是错误,只是失败
server.on('fail', function (value) {
  alert(value || '操作失败')
  // toastr.error(value || '操作失败', '失败')
})

export default server
