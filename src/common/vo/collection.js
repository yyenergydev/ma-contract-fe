// latest: zhangmyh 2017-2-27 2:23 PM
import { Model, Post, Get, EventBus } from 'common'
import { each, extend } from 'lodash'

let EventEmit = require('eventemitter2').EventEmitter2
let _config = {}

export default function Collection (config) {
  EventEmit.apply(this)
  var { model, proxy } = config
  this._config = config
  this.proxy = proxy
  this._model = Model.create(model, false)
  this.datatable = this._model.datatable
  this.associations = this._model.associations
}

Collection.prototype = Object.create(EventEmit.prototype)
Collection.define = function (name, config) {
  if (!name) {
    console.error('需要知道Collection模型名称')
    return
  }
  if (_config[name]) {
    console.error('当前Collection模型已存在:' + name)
    return
  }
  _config[name] = config
}

Collection.create = function (name) {
  var config = _config[name]
  if (!config) {
    console.error('不存在Collection模型:' + name)
    return
  }
  config.name = name
  return new Collection(config)
}

Collection.prototype.load = async function (params, config = {}) {
  let data
  params = extend(this.params || {}, {
    pageIndex: 0
  }, params)
  this.params = params

  window.global.hash('pageindex', params.pageIndex)
  if (config.localData) {
    data = config.localData
  } else {
    let url = (config.url) ? config.url : this.proxy.get
    let method = (config.method) ? config.method : this.proxy.loadmethod
    let ajax = (method === 'post') ? Post : Get
    data = await ajax(url, params)
  }

  if (data.data) {
    this.data = data.data
  } else {
    this.data = data
  }
  debugger
  // 修改datatable，暂时兼容后台无result情况
  // 如后台全部保证存在result，可去掉判断
  if (this.data.result) {
    this.datatable.setSimpleData(this.data.result, {
      'unSelect': 'true'
    })
  } else if (this.data) {
    //mahonggeng 连同后台一起修改返回数据格式
    this.datatable.setSimpleData(this.data, {
      'unSelect': 'true'
    })
  } else {
    this.datatable.setSimpleData('', {
      'unSelect': 'true'
    })
  }

  this.emit('data', data, this)
  // 设置分页
  // console.log(this._config.name)
  EventBus.emit('pagination.' + this._config.name, this.data)
}

Collection.prototype.setData = function (data) {
  this.datatable.setSimpleData(data, {
    'unSelect': 'true'
  })
}

Collection.prototype.getSelected = function () {
  let viewModel = this.datatable
  let indexs = viewModel.getSelectedIndexs()
  let data = viewModel.getSimpleData()
  let rs = []
  each(indexs, function (val) {
    rs.push(data[val])
  })
  return rs
}

Collection.prototype.count = async function (params = {}) {
  let url = this.proxy.count
  let errorFlag = false
  if (!url) {
    errorFlag = true
  }
  if (!errorFlag) {
    let data = await Get(url, params)
    if (data.status) {
      return data.data
    }
  }
  return { status: 0, msg: '查询失败' }
}
