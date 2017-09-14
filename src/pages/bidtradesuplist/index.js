// latest: zhangmyh 2017-4-28 10:30 PM
import 'ko-epui/dist/ko-epui.css'
import 'ko-epui'
import 'components'
import { cloneDeep, findIndex, map } from 'lodash'
import { Get, URLs } from 'common'
import collection from 'collection/bidtrade_sup'
import operation from './opt'
/* global ko app u __ */

// 全局变量
var tabIndex = window.global.hash('tabindex') || 0
var tabName = window.global.hash('tabname') || 'registerSup'
var pageIndex = window.global.hash('pageindex') || 0
var viewModel

const showMessage = function (status, msg) {
  if (status == 'success') {
    u.showMessage({position: 'top', msg})
    collection.load({ status: viewModel.state() })
  } else {
    u.showMessage({position: 'top', msg})
  }
}

const columnSetting = [{
  'field': 'title',
  'dataType': 'String',
  'title': __('bidtrade_title'),
  'width': '13%'
}, {
  'field': 'materials',
  'dataType': 'String',
  'title': __('bidtrade_material'),
  'width': '15%'
}, {
  'field': 'createTime',
  'dataType': 'String',
  'title': __('createtime'),
  'width': '15%'
}, {
  'field': 'registEndTime',
  'dataType': 'String',
  'title': __('bt_registEndTime'),
  'width': '15%'
}, {
  'field': 'bidStartTime',
  'dataType': 'String',
  'title': __('bt_bidStartTime'),
  'width': '15%'
}, {
  'field': 'bidEndTime',
  'dataType': 'String',
  'title': __('bt_biddingEndTime'),
  'width': '15%'
}, {
  'field': 'bidConfirmTime',
  'dataType': 'String',
  'title': __('bt_bidConfirmTime'),
  'width': '15%'
}, {
  'field': 'bidCloseTime',
  'dataType': 'String',
  'title': __('bt_bidCloseTime'),
  'width': '15%'
}, {
  'field': 'billstatus',
  'dataType': 'String',
  'title': __('status'),
  'width': '30%',
  renderType (obj) {
    const stateConverter = function (state) {
      switch (state) {
        case 4:
          return '待报名'
        case 5:
          return '报名已截止'
        case 6:
          return '待竞价'
        case 7:
          return '竞价中'
        case 8:
          return '竞价延时'
        case 9:
          return '竞价结束'
        case 10:
          return '已定标'
        case 15:
          return '已流标'
        default:
          return ''
      }
    }
    const supplyState = function (state) {
      switch (state) {
        case 1:
          return ''
        case 2:
          return '已报名'
        case 3:
          return '审核通过'
        case 4:
          return '已淘汰'
        case 5:
          return '已通过'
        case 6:
          return '已拒绝'
        case 7:
          return '未报价'
        case 8:
          return '已报价'
        case 9:
          return '淘汰'
        default:
          return ''
      }
    }
    let stat = parseInt(obj.row.value.billstatus)
    let supstat = parseInt(obj.row.value.supStatus)
    let text = stateConverter(stat)
    let suptext = supplyState(supstat)
    if (suptext) {
      if (supstat == '2' || supstat == '6') {
        obj.element.innerHTML = '<span title="' + suptext + '">' + suptext + '</span>'
      } else {
        obj.element.innerHTML = '<span title="' + text + suptext + '">' + text + ' ' + suptext + '</span>'
      }
      // 竞价中 后面只出现 已报价
      if (stat == '7' || stat == '8' || stat == '9') {
        if (supstat == '7' || supstat == '8' || supstat == '9') {
          obj.element.innerHTML = '<span title="' + text + suptext + '">' + text + ' ' + suptext + '</span>'
        } else {
          obj.element.innerHTML = '<span title="' + text + '">' + text + '</span>'
        }
      }
    } else {
      obj.element.innerHTML = '<span title="' + text + '">' + text + '</span>'
    }
  }
}, {
  field: 'operation',
  title: __('operation'),
  dataType: 'action',
  item: operation(showMessage),
  width: '16%'
}]

let statusData = [
  {
    title: '待报名',
    state: 'registerSup',
    num: 0
  },
  {
    title: '待竞价',
    state: 'tobidSup',
    num: 0
  },
  {
    title: '竞价中',
    state: 'biddingSup',
    num: 0
  },
  {
    title: '已定标',
    state: 'bidconfirmedSup',
    num: 0
  },
  {
    title: '已截止',
    state: 'endedSup',
    num: 0
  },
  {
    title: '已拒绝',
    state: 'rejectSup',
    num: 0
  },
  {
    title: '所有',
    state: 'allSup',
    num: 0
  }
]

async function refreshTabs (data) {
  let statData = await Get(URLs.bt_supStatByStatus.url, {})
  map(statData.data, function (n, key) {
    let idx = findIndex(data, ['state', key])
    if (idx > -1) {
      data[idx].num = n
    }
    return 0
  })
  return cloneDeep(data)
}

function init () {
  // 默认查询待发布
  collection.load({ billstatus: tabName, pageIndex: pageIndex })
  // collection.load({ billstatus: 'registerSup' })
  collection.on('data', async function (data) {
    // 改变tabs数值
    let states = await refreshTabs(viewModel.statuItems())
    viewModel.statuItems(states)

    // 显示隐藏列，false 表示隐藏
    const setColumn = function (visible) {
      let grid = app.getComp('bdgrid').grid
      return function (...cols) {
        cols.forEach(function (col) {
          grid.setColumnVisibleByIndex(findIndex(columnSetting, ['field', col]), visible)
        })
      }
    }
    const showCol = setColumn(true)
    const hideCol = setColumn(false)
    switch (viewModel.state()) {
      case 'registerSup':
        showCol('registEndTime', 'billstatus')
        hideCol('createTime', 'bidEndTime', 'bidStartTime', 'bidConfirmTime', 'bidCloseTime')
        break
      case 'rejectSup':
        showCol('createTime', 'registEndTime', 'billstatus')
        hideCol('bidStartTime', 'registEndTime', 'bidCloseTime', 'bidConfirmTime')
        break
      case 'tobidSup':
      case 'biddingSup':
        showCol('bidStartTime', 'bidEndTime', 'billstatus')
        hideCol('createTime', 'registEndTime', 'bidConfirmTime', 'bidCloseTime')
        break
      case 'bidconfirmedSup':
        showCol('bidStartTime', 'billstatus')
        hideCol('biddingEndTime', 'createTime', 'registEndTime', 'bidCloseTime')
        break
      case 'endedSup':
        showCol('createTime', 'bidCloseTime', 'billstatus')
        hideCol('registEndTime', 'bidStartTime', 'biddingEndTime')
        break
      case 'allSup':
        showCol('createTime', 'registEndTime', 'billstatus')
        hideCol('bidStartTime', 'registEndTime', 'bidCloseTime')
        break
    }
  })

  viewModel = {
    id: ko.observable(10),
    q: ko.observable(''),
    clickme: function (msg) {
      console.log('')
    },
    query: function (msg) {
      console.log('query' + this.q())
    },
    stateclick: function (msg) {
      collection.load({ billstatus: msg.state })
      window.global.hash('tabname', msg.state)
      window.global.hash('tabindex', viewModel.stateindex())
      viewModel.state(msg.state)
    },
    state: ko.observable('registerSup'),
    stateindex: ko.observable(0),
    statuItems: ko.observableArray(statusData),
    gridconfig: {
      id: 'bdgrid',
      data: collection,
      type: 'grid',
      multiSelect: true,
      editable: false,
      pagination: true,
      autoWidth: true,
      noScroll: true,
      fields: columnSetting
    }
  }
  viewModel.state(tabName)
  viewModel.stateindex(tabIndex)
  window.app = window.u.createApp({
    el: 'body',
    model: viewModel
  })
}

(async function () {
  // await refreshTabs(statusData)
  init()
})()
