// latest: zhangmyh 2017-1-23 5:22 PM
import material from './modal/material'
/* global $ */
/* global u */

// 使用组建的方式
var ko = window.ko
var modalVm = {
  material: material
}

// 创建弹出层
function createModalElement (templateName, viewModel) {
  let deferredElement = $.Deferred()
  const html = require('./modal/' + templateName + '/index.html')

  let $div = $('<div id="modal_' + templateName + '" style="display: none"></div>').append(html)
  $('body').append($div)
  deferredElement.resolve($div)
  return deferredElement
}

// modal初始化
function init4Modal (viewModel, $div) {
  var name = $div.attr('id')
  u.createApp({
    el: '#' + name,
    model: viewModel
  })

  var { width, height } = viewModel
  var md = u.dialog({
    id: 'modalwrap_' + name,
    content: '#' + name,
    hasCloseMenu: false,
    width: width,
    height: height || '670px'
  })
  $div.data('md', md)
}

// 处理/追加vm
function addModalVM (viewModel, $div, deferredModalResult) {
  viewModel.modal = {
    close: function (result) {
      if (typeof result !== 'undefined') {
        deferredModalResult.resolveWith(undefined, [result])
      } else {
        deferredModalResult.rejectWith()
      }
    }
  }
}

function destoryModal (viewModel, $div, deferredModalResult) {
  let $md = $div.data('md')
  // let id = $div.attr('id')
  deferredModalResult.always(function () {
    // 取消遮照
    $md.close()
    // 干掉关联
    $div.remove()
  })
}

// 显示拟态框
ko.showModal = function (name, params) {
  var vm = modalVm[name]
  if (!vm) {
    console.error('不存在' + name + '的vm')
    return new Promise(function (resolve, reject) {})
  }

  var div = $('#modal_' + name)
  if (div.length === 0) {
    // 创建viewModel
    var viewModel = new vm(params)
    // 2016年9月8日17:02:09 当前Promise不包含all语法
    return createModalElement(name, viewModel).pipe(function ($div) {
      var deferredModalResult = $.Deferred()
      // 管道操作,懒得处理

      init4Modal(viewModel, $div, deferredModalResult)
      addModalVM(viewModel, $div, deferredModalResult)
      destoryModal(viewModel, $div, deferredModalResult)

      return deferredModalResult
    })
  } else {
    console.error('modal框' + name + '的id被占用')
    return new Promise(function (resolve, reject) {})
  }
}
