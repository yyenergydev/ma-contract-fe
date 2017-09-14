/* eslint-disable */
import 'ko-epui/dist/ko-epui.css'
import 'ko-epui'
import 'components'
// import { Collection } from 'common'
import './collection/getquote'
import './index.less'
import './highcharts'
import emitter from './io'
import {Post} from 'common/Ajax'
import './format.js'
import Countdown from 'components/countdown'
import 'components/countdown/countdown.css'
import 'static/vendor/tweenmax'
import uMessage from 'components/message'
import { eliminaterefer } from 'components/modalrefer'
/* global ko  _ */
// // u
// 最终保存的模型
var _data = {}
var supplyId = window.global.query('supplyId')
// {}->vm
function wrap (data) {
  var rs = {}
  _.each(data, function (v, k) {
    rs[k] = ko.observable(v || '0')
  })
  return rs
}
// 按键触发发送信息事件
document.onkeydown = function (event) {
  var e = event || window.event
  if (e && e.keyCode == 13) {
    viewModel.sendmessage()
  }
}
function set (vm, data) {
  _.each(data, function (v, k) {
    vm[k] && vm[k](v)
  })
}
// 初始化vm

var viewModel = {
  bidProcess: ko.observable(''),
  everymessage: ko.observable(''),
  bidType: ko.observable(''),
  latestPrice: ko.observable(''),
  initPrice: ko.observable(''),
  range: ko.observable(''),
  rule: wrap({
    sortItemMap: '0',
    extFields: '0',
    enterpriseId: '0',
    enterpriseName: '0',
    sysVersion: '0',
    createTime: '0',
    modifiedtime: '0',
    creator: '0',
    modifier: '0',
    dr: '0',
    ts: '0',
    id: '0',
    bidtradeId: '0',
    registEndTime: '0',
    bidStartTime: '0',
    bidEndTime: '0',
    biddingTime: '0',
    delayTime: '0',
    promptList: '0',
    bidType: '0',
    highPrice: '0',
    lowPrice: '0',
    bidProcess: '0',
    range: '0',
    lowBiddingStep: '0'
  }),
  bidtrade: wrap({
    title: '',
    code: '',
    enterpriseName: ''
  }),
  // supply:ko.observableArray([]),
  sort: ko.observableArray([]),
  history: ko.observableArray([]),
 shouldShowMessage: ko.observable(true),
  bidStartTime: ko.observable(''),
  message: ko.observableArray([]),
  /*  bidquote:{
      bidPrice:'0',
      freight:'0',
      total:bidPrice+freight,
      material:ko.observableArray([])
  } */
  // 发送消息（只能给采购商）
  sendmessage: async function () {
    console.log(_data)
    var msg = viewModel.everymessage()
    if (msg) {
      var senderId = _data.myself.enterpriseId
      var bidtradeId = _data.myself.bidtradeID
      var sendtime = new Date().Format('yyyy-MM-dd hh:mm:ss')
      var receiverid = _data.bidtradeMsg.senderId
      var info = '我对' + viewModel.bidtrade.enterpriseName() + '说：'
      await Post('/cpu-bidtrade/bidtrade/sendmsg', {msg: msg, senderid: senderId, receiverid: receiverid, sendtime: sendtime, bidtradeId: bidtradeId})
      viewModel.message.push({text: viewModel.everymessage(), info: info, sendtime: sendtime})
      viewModel.everymessage('')
    }
  }
}
// 报价主表
var bidquoteObs = wrap({
  freight: null
})
bidquoteObs.bidquoteblist = ko.observableArray([])
bidquoteObs.bidquoteblist.extend({ rateLimit: 50 })
bidquoteObs.total = ko.computed(function () {
  return _.chain(this.bidquoteblist()).map(function (v) {
    return v.purNum * v.taxPrice()
  }).reduce(_.add).value()
}, bidquoteObs)
// 报价主表计算列
bidquoteObs.bidPrice = ko.computed(function () {
  var freightprice = this.freight() == null ? 0 : (this.freight())
  var totalPrice = this.total() == null ? 0 : (this.total())
  return parseFloat(totalPrice) + parseFloat(freightprice)
}, bidquoteObs)
// 报价物料报价

viewModel.bidquote = bidquoteObs

window.bidquoteObs = bidquoteObs
window.viewModel = viewModel
// render系列,渲染初始化
// 使用ko,则将data数据提供给vm
emitter
.on('render.rule', function () {
  //var nowDate = $.ajax({type:'HEAD', async:'false'}).getResponseHeader('date')
  var nowDate=_data.bidtrade.currentTime;
  var data = _data.bidtradeSetting
  set(viewModel.rule, data)

  //xxx 
  var bet = data.bidEndTime
  console.log('jingjiadating', bet)
  var bed = new Date()
  bed.setTime(bet)
  var bes = bed.format('yyyy/MM/dd HH:mm:ss')
  Countdown.init('#timer', bes, function () {}, viewModel.autodelay,nowDate)
  var bst = data.bidStartTime
  var bsd = new Date()
  bsd.setTime(bst)
  var bss = bsd.format('yyyy/MM/dd HH:mm:ss')
  viewModel.bidStartTime(bss)
  // 根据值显示文字
  var arr = []
  if (data.bidProcess.indexOf('1') > -1) {
    arr.push('公开价格')
  }
  if (data.bidProcess.indexOf('2') > -1) {
    arr.push('公开竞价公司名称')
  }
  if (data.bidProcess.indexOf('3') > -1) {
    arr.push('公开排名')
  }
  if (data.bidProcess.indexOf('4') > -1) {
    arr.push('内部公开竞价公司名称')
  }
  var str = arr.join(' , ')
  viewModel.bidProcess(str)
  if (data.bidType == '1') {
    viewModel.bidType('竞买')
  } else {
    viewModel.bidType('竞卖')
  }
})
/* //供应商
.on('render.supply',function(data){
  viewModel.supply(data)
}) */
// 排序
.on('render.sort', function () {
  console.log(_data)
  var data = _data.bidquotesort
  viewModel.sort([])
  if (_data.bidtradeSetting.bidProcess.indexOf('2') < 0) {
    data.forEach(function (o) {
      if (o.supplyId != parseInt(supplyId)) {
        o.supplyName = o.randCode
      }
    })
  }
  if (_data.bidtradeSetting.bidProcess.indexOf('1') < 0) {
    data = data.map(function (o, i) {
      return Object.assign({}, o, {
        latestPrice: '-'
      })
    })
  }
  viewModel.sort(data)
  viewModel.sort(viewModel.sort())
  //if (_data.bidtradeSetting.bidProcess.indexOf('3') < 0) {
    viewModel.sort.sort(function (left, right) {
      return left.bidPrice - right.bidPrice
    })
  //}
})
// 竞价单
.on('render.bidtrade', function (data) {
  set(viewModel.bidtrade, data)
})
// 历史记录
.on('render.history', function () {
  // 只显示前四个
  var data = _data.bidquotelist//.slice(0, 4)
  if (_data.bidtradeSetting.bidProcess.indexOf('2') < 0) {
    data.forEach(function (o) {
      if (o.supplyId != parseInt(supplyId)) {
        o.supplyName = o.randCode
      }
    })
  }

  if (_data.bidtradeSetting.bidProcess.indexOf('1') < 0) {
    data = data.map(function (o, i) {
      return Object.assign({}, o, {
        latestPrice: '-',
        initPrice: '-',
        range: '-'
      })
    })
  }
  viewModel.history(data)
})
// 报价 视图模型与模型是不一致的。视图模型时显示绑定的属性是模型的子集。初始化赋值时可以变为一致
.on('render.bidquote', function (data) {
  // viewModel.bidquote.bidPrice(data.bidPrice||0);
  // 运费
  viewModel.bidquote.freight(data.freight)
  viewModel.bidquote.supplyId = data.supplyId
  viewModel.bidquote.bidtradeId = data.bidtradeId
  viewModel.bidquote.bidquoteblist(_.map(data.bidquoteblist, function (v) {
    v.taxPrice = ko.observable(v.taxPrice)
    return v
  }))
})
// 模型维护系列
// 包括模型初始化与模型修正
// 初始化数据,保存,并更新
.on('handler.init', function (data) {
  _data = data
  emitter.emit('render', data)
})
.on('handler.change', function (data) {
  // data.range='xx'
  // 修改模型

  /* 最新报价排序
    供应商最新报价修改
    供应商最新报价插入
    供应商最新报价排序 */

  // 有过报价标志
  var flag = false
  _data.bidquotesort = _.map(_data.bidquotesort, function (v) {
    if (v.supplyId == data.supplyId) {
      flag = true
      return _.extend(v, data)
    }
    return v
  })

  // 如果该供应商没有过报价，插入
  if (flag == false) {
    _data.bidquotesort.push(data)
  }

  // 排序
  /* _data.bidquotesort.sort(function(a,b){
            return b.bidPrice-a.bidPrice}) */
  emitter.emit('render.sort')
  // 修正历史记录
  _data.bidquotelist.unshift(data)
  emitter.emit('render.history')
  // 变更chart图
  emitter.emit('render.highchart', data)
})
.on('handler.delaychange', function (data) {
  _data.bidtradeSetting = data
  emitter.emit('render.rule')
  var d=_.map(_data.bidquotelist,function(v){
        return {
            x:v.bidTime,
            y:v.latestPrice,
            supplyName:v.supplyName
        }
    })
  emitter.emit('render.chartinit',d,data.bidEndTime,data.bidStartTime);
}) 

viewModel = _.extend(viewModel, {
 
  tj () {
    var reg = new RegExp('^[0-9]*$')
      if (!reg.test(ko.toJS(viewModel.bidquote).freight)) {
        uMessage('fail', '物流费用只能是正整数')
        return
      }
    eliminaterefer({
      contentId: 'refer_eliminate',
      title: '此次报价是否提交?',
      onOk: async function (msg) {
        Post('/cpu-bidtrade/bidtrade/savequote', ko.toJS(viewModel.bidquote)).then(function (data) {
          debugger
          if (data.status == '1') {
            uMessage('success', '报价成功')
          } else {
            uMessage('warning', data.msg || '报价失败')
          }
        })
      },
      onCancel: function () {}
    })
  }
  // ccc (data) {
  //   return viewModel.rule[this]()
  // }
})

// window.app = u.createApp({
//   el: '#container',
//   model: viewModel
// })

ko.bindingHandlers.date = {
  init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
      // var obj=valueAccessor(),date
      // //vm
      // if(obj.name=='observable'){
      //   obj=obj()
      // }
      // date=new Date(obj)
      // element.innerHTML=date.getFullYear()+'/'+date.getMonth()+'/'+date.getDate()

  },
  update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
    var obj = valueAccessor()
    var date
    // vm
    if (obj.name == 'observable') {
      obj = obj()
    }
    date = new Date(obj)
    element.innerHTML = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate()
  }
}

ko.bindingHandlers.datetime = {
  init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {

  },
  update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
    var obj = valueAccessor()
    var date
    // vm
    if (obj.name == 'observable') {
      obj = obj()
    }
    date = new Date(obj)
    element.innerHTML = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate() + ' &nbsp' + date.getHours() + ':' + (date.getMinutes() + 1) + ':' + date.getSeconds()
  }
}
ko.applyBindings(viewModel)
/* eslint-disable */
