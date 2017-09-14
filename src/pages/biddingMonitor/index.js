/* eslint-disable */
// latest: wangk2 2017-3-10 8:33 PM 显示视图模型、从数据库模型data加载
// import { Collection } from 'common'
import 'ko-epui/dist/ko-epui.css'
import 'ko-epui'
import './collection/getquote'
import './index.less'
import './highcharts'
import emitter from './io'
import { Get, Post } from 'common/Ajax'
import Countdown from 'components/countdown'
import delayRefer from 'components/modalrefer/bidtradeDelay'
import 'components/countdown/countdown.css'
import 'static/vendor/tweenmax'
import _ from 'lodash'
import './format.js'
import uMessage from 'components/message'
import kickoutRefer from 'components/modalrefer/kickout'
/* global ko u */
/* global $ */

// 按键触发发送信息事件
document.onkeydown = function (event) {
  var e = event || window.event
  if (e && e.keyCode == 13) {
    viewModel.sendmessage()
  }
}
// 操作页签
$('#quotedetails').ready(function () {
  $('#tabs li').bind('click', function () {
    var index = $(this).index()
    var divs = $('#tabs-body > div')
    $(this).parent().children('li').attr('class', 'tab-nav')// 将所有选项置为未选中
    $(this).attr('class', 'tab-nav-action') // 设置当前选中项为选中样式
    divs.hide() // 隐藏所有选中项内容
    divs.eq(index).show() // 显示选中项对应内容
  })
})
// 按值
// function removeByValue (arr, val) {
//   for (var i = 0; i < arr.length; i++) {
//     if (arr[i] == val) {
//       arr.splice(i, 1)
//       break
//     }
//   }
// }

// 最终保存的模型
var _data = {}
// {}->vm
function wrap (data) {
  var rs = {}
  _.each(data, function (v, k) {
    rs[k] = ko.observable(v || '0')
  })
  return rs
}

function set (vm, data) {
  _.each(data, function (v, k) {
    vm[k] && vm[k](v)
  })
}
// 初始化vm
var viewModel = {
  delayBtn: ko.observable(true),
  closeroomBtn: ko.observable(true),
  operateVis: ko.observable(true),
  kickVis: ko.observable(false),
  kickReason: ko.observable(''),
  everymessage: ko.observable(''),
  receiver: ko.observable(''),
  isOnline: ko.observable(''),
  bidProcess: ko.observable(''),
  bidType: ko.observable(''),
  bidtrade: wrap({
    title: '',
    code: '',
    enterpriseName: '',
  }),
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
    lowBiddingStep: '0'
  }),
  bidStartTime: ko.observable(''),
  supply: ko.observableArray([]),
  outsupply: ko.observableArray([]),
  sort: ko.observableArray([]),
  history: ko.observableArray([]),
  message: ko.observableArray([]),
  select: ko.observableArray([]),
  // 发送消息
  sendmessage: async function () {
    var msg = viewModel.everymessage()
    if (msg) {
      var senderId = _data.bidtradeMsg.senderId
      var bidtradeId = _data.bidtradeMsg.bidtradeId
      var sendtime = new Date().Format('yyyy-MM-dd hh:mm:ss')
      viewModel.receiver($('#testSelect option:selected').text())
      if ($('#testSelect option:selected').text() == '全部') {
        var infoall = '公告'
        await Post('/cpu-bidtrade/bidtrade/sendpublicmsg', {msg: msg, senderid: senderId, bidtradeId: bidtradeId, sendtime: sendtime})
        viewModel.message.push({text: viewModel.everymessage(), info: infoall, sendtime: sendtime})
        viewModel.everymessage('')
      } else {
        var receiver = _.find(_data.registers, function (item) {
          return item.enterpriseName == $('#testSelect option:selected').text()
        })
        var receiverid = 'r' + bidtradeId + '.' + receiver.enterpriseId
        var infoone = '我对' + $('#testSelect option:selected').text() + '说：'
        await Post('/cpu-bidtrade/bidtrade/sendmsg', {msg: msg, senderid: senderId, receiverid: receiverid, sendtime: sendtime, bidtradeId: bidtradeId})
        viewModel.message.push({text: viewModel.everymessage(), info: infoone, sendtime: sendtime})
        viewModel.everymessage('')
      }
    }
  }
}
window.viewModel = viewModel
// render系列,渲染初始化
// 使用ko,则将data数据提供给vm
//获取系统时间

emitter
  .on('render.rule', function () {
    var nowDate=_data.bidtrade.currentTime
   /* $.ajax({type:'get', async:false}).success(function (data, status, xh){
      nowDate=new Date(xh.getResponseHeader( "Date" )).getTime()
      debugger
    })*/

    debugger
    var data = _data.bidtradeSetting
    set(viewModel.rule, data)
    var t = data.bidEndTime
    var d = new Date()
    d.setTime(t)
    var s = d.format('yyyy/MM/dd HH:mm:ss')
    Countdown.init('#timer', s, viewModel.autocloseroom, null,nowDate )
    var bst = data.bidStartTime
    var bsd = new Date()
    bsd.setTime(bst)
    var bss = bsd.format('yyyy/MM/dd HH:mm:ss')
    viewModel.bidStartTime(bss)
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
  // 供应商
  .on('render.supply', function () {
    var data = _data.inBidquotelist
    // map data obs
    debugger
    data.map(function (item) {
      if (item.isquote == true) {
        item.isquote = '在线'
      }
      if (item.isquote == false) {
        item.isquote = '离线'
      }
    })
    viewModel.supply([])
    if (_data.bidtradeSetting.bidProcess.indexOf('4') < 0) {
      data.forEach(function (o) {
       // o.supplyName = o.randCode
      })
    }
    debugger
    viewModel.supply(data)
  })
  .on('render.outsupply', function () {
    var data = _data.outBidquotelist
     data.map(function (item) {
      if (item.isquote == true) {
        item.isquote = '在线'
      }
      if (item.isquote == false) {
        item.isquote = '离线'
      }
    })
    // map data obs
    viewModel.outsupply([])
    if (_data.bidtradeSetting.bidProcess.indexOf('4') < 0) {
      data.forEach(function (o) {
        //o.supplyName = o.randCode
      })
    }
    viewModel.outsupply(data)
  })
  // 排序
  .on('render.sort', function () {
    var data = _data.bidquotesort
    viewModel.sort([])
    if (_data.bidtradeSetting.bidProcess.indexOf('4') < 0) {
      data.forEach(function (o) {
       /// o.supplyName = o.randCode
      })
    }
    viewModel.sort(data)
    viewModel.sort.sort(function (left, right) {
      return left.bidPrice - right.bidPrice
    })
  })
  // 历史记录
  .on('render.history', function () {
    // 只显示前四个
    var data = _data.bidquotelist;//.slice(0, 4)
    if (_data.bidtradeSetting.bidProcess.indexOf('4') < 0) {
      data.forEach(function (o) {
       // o.supplyName = o.randCode
      })
    }
    viewModel.history(data)
  })
  // 竞价单
  .on('render.bidtrade', function () {
    var data = _data.bidtrade
    set(viewModel.bidtrade, data)
  })
  .on('render.registers', function () {
    var data = _data.registers
    var arr = data.map(function (item) {
      return {
        id: item.enterpriseName,
        name: item.enterpriseName
      }
    })
    viewModel.select(arr)
  })

  //输入数据模型、修改倒计时、修改规则、修改图表
  .on('handler.delaychange', function (data) {
    debugger
    uMessage('success', data.msg || '延时成功')
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

  // 模型维护系列
  // 包括模型初始化与模型修正
  // 初始化数据,保存,并更新
  .on('handler.init', function (data) {
    _data = data
    emitter.emit('render', data)
  })
  .on('handler.change', function (data) {
    // 1、更新竞价排名
    var flag = false
    _data.inBidquotelist = _.map(_data.bidquotesort, function (v) {
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
    // _data.bidquotesort.sort(function(a,b){return b.bidPrice-a.bidPrice})
    emitter.emit('render.sort')

    // 2、修正历史记录
    _data.bidquotelist.unshift(data)
    emitter.emit('render.history')

    // 3、变更chart图
    emitter.emit('render.highchart', data)

    // 4、更新供应商管理
    var flag2 = false
    debugger
    _data.inBidquotelist = _.map(_data.inBidquotelist, function (v) {
      if (v.supplyId == data.supplyId) {
        flag2 = true
        return _.extend(v, data)
      }
      return v
    })
    // // 如果该供应商没有过报价，插入
    if (flag2 == false) {
      _data.inBidquotelist.push(data)
    }
    emitter.emit('render.supply')
    emitter.emit('render.outsupply')
  })

viewModel = _.extend(viewModel, {

  // 踢人
  deleteUser: async function (data) {
    window.u.refer({
      isPOPMode: true,
      searchInput: null,
      contentId: 'refer_kickout',
      okId: 'okBtn',
      cancelId: 'cancelBtn',
      width: '500px',
      height: null,
      module: kickoutRefer,
      title: '踢出',
      onOk: async function (msg) {
        let res = await Get('/cpu-bidtrade/bidtrade/kickoff', {
          roomid: 'r' + _data.bidtradeMsg.bidtradeId,
          supplyid: data.supplyId,
          token: _data.bidtradeMsg.token,
          url: _data.bidtradeMsg.url,
          kickreason:msg
        })
        // 踢出成功
        if (res.status == 1) {
          data.isquote = '离线'
          viewModel.outsupply.push(data)
          viewModel.supply.remove(data)
          viewModel.kickVis(true)
          viewModel.kickReason(msg)
          // 移除data到 淘汰模型 todo
         /* var _data2 = viewModel.supply()
          var _data3 = viewModel.outsupply()
          // var index = _.find(_data2, function (item) {
          //   return item.id = data.id
          // })
          // _data2 = _data2.splice(index + 1, 1)
          removeByValue(_data2, data)
          viewModel.supply(_data2)
          _data3.push(data)
          viewModel.outsupply(_data3) */
        }else{
          alert("踢出失败");
        }
      }
    })
  },

  // 恢复竞价
  restoreUser: async function (data) {
    u.confirmDialog({
      msg: '是否恢复竞价？',
      title: '恢复竞价确认',
      onOk: async function () {

        let res = await Get('/cpu-bidtrade/bidtrade/pullin', {
          roomid: data.bidtradeId,

          supplyid: data.supplyId,
          token: _data.bidtradeMsg.token,
          url: _data.bidtradeMsg.url
        })
        if (res.status == 1) {
          /* var _data3 = viewModel.outsupply()
          removeByValue(_data3, data)
          viewModel.outsupply(_data3)
          var _data2 = viewModel.supply()
          _data2.push(data)
          viewModel.supply(_data2) */
          viewModel.outsupply.remove(data)
          viewModel.supply.push(data)
        }
      }
    })
  },
  // 自动关闭
  autocloseroom: async function (data) {
    let res = await Get('/cpu-bidtrade/bidtrade/closeroom', {
      roomid: 'r' + _data.bidtradeMsg.bidtradeId,
      token: _data.bidtradeMsg.token,
      url: _data.bidtradeMsg.url
    })
    if (res.status == 1) {
      viewModel.delayBtn(false)
      viewModel.closeroomBtn(false)
      viewModel.operateVis(false)
        // 关闭状态样式 todo
    }
  },
  // 关闭大厅
  closeroom: async function (data) {
    u.confirmDialog({
      msg: '是否关闭大厅？',
      title: '关闭大厅确认',
      onOk: async function () {
        let res = await Get('/cpu-bidtrade/bidtrade/closeroom', {
          roomid: 'r' + _data.bidtradeMsg.bidtradeId,
          token: _data.bidtradeMsg.token,
          url: _data.bidtradeMsg.url
        })
        debugger
        if (res.status == 1) {
            // EventBus.emit('faill','参数flag不正确!');
          viewModel.delayBtn(false)
          viewModel.closeroomBtn(false)
          viewModel.operateVis(false)
          var t = 0
          var d = new Date()
          d.setTime(t)
          var s = d.format('yyyy/MM/dd HH:mm:ss')
          Countdown.init('#timer', s)
        }
      }
    })
  },
  // 延时
  delay: function (data) {
    window.u.refer({
      isPOPMode: true,
      searchInput: null,
      contentId: 'delay_refer',
      okId: 'okBtn',
      cancelId: 'cancelBtn',
      width: '500px',
      height: null,
      module: delayRefer,
      title: '延时',
      onOk: async function (msg) {
        console.log('wk11', _data.bidtradeSetting.bidEndTime)
        var bidtradeId = _data.bidtradeSetting.bidtradeId
        var delayTime = parseInt(msg)
        var data = await Post('/cpu-bidtrade/bidtrade/postpone', {bidtradeId: bidtradeId, delayTime: delayTime})
        debugger
        if (data.status != '1') {
           uMessage('fail', data.msg || '延时失败')
        }
      },
      onCancel: function () {}
    })
  }
})

// window.app = u.createApp({
//   el: '#container',
//   model: viewModel
// })

ko.bindingHandlers.date = {
  init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
    // var obj=valueAccessor(),date
    // //vm
    // if(obj.name=="observable"){
    //   obj=obj()
    // }
    // date=new Date(obj)
    // element.innerHTML=date.getFullYear()+"/"+date.getMonth()+"/"+date.getDate()
  },
  update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
    let obj = valueAccessor() || ''
    let date
    // vm
    // MODIFY BY SONGHLC  obj可能为空
    if (obj && obj.name == 'observable') {
      obj = obj()
    }
    date = new Date(obj)
    element.innerHTML = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate()
  }
}

ko.bindingHandlers.datetime = {
  init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {},
  update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
    let obj = valueAccessor()
    let date
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
