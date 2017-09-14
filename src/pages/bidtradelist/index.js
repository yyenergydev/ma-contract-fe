// latest: zhangmyh 2017-5-2 11:01 AM
import 'ko-epui/dist/ko-epui.css'
import 'ko-epui'
import 'components'
import { cloneDeep, findIndex, map } from 'lodash'
import { Get, Post, URLs } from 'common'
import collection from 'collection/bidtrade'
import operation from './opt'
/* global ko app u __ */

// 全局变量
var tabIndex = window.global.hash('tabindex') || 0
var tabName = window.global.hash('tabname') || 'bidrelease'
var pageIndex = window.global.hash('pageindex') || 0

var viewModel
let type = window.global.query('type')
const showMessage = function (status, msg) {
  if (status == 'success') {
    u.showMessage({position: 'top', msg})
    collection.load({ status: viewModel.state() })
  } else {
    u.showMessage({position: 'top', msg})
  }
}
// 标题 竞价物资 创建时间 状态 操作
const columnSetting = [{
  'field': 'title',
  'dataType': 'String',
  'title': __('bidtrade_title'),
  'width': '15%'
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
  'field': 'regNum',
  'dataType': 'String',
  'title': __('bt_regnum'),
  'width': '15%',
  renderType (obj) {
    let n = obj.row.value.regNum
    if (!n || isNaN(n)) {
      n = 0
    }
    obj.element.innerHTML = '<span title="' + n + '">' + n + '</span>'
  }
}, {
  'field': 'bidStartTime',
  'dataType': 'String',
  'title': __('bt_bidStartTime'),
  'width': '15%'
}, {
  'field': 'billstatus',
  'dataType': 'String',
  'title': __('status'),
  'width': '25%',
  renderType (obj) {
    const stateConverter = function (state) {
      switch (state) {
        case 1:
          return '待提交'
        case 2:
          return '审批中'
        case 3:
          return '待发布'
        case 4:
          return '接受报名中'
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
        case 11:
          return '待提交'
        case 12:
          return '审批中'
        case 13:
          return '待竞价'
        case 14:
          return '审批中'
        case 15:
          return '已流标'
        default:
          return ''
      }
    }

    let text = stateConverter(parseInt(obj.row.value.billstatus))
    obj.element.innerHTML = '<span title="' + text + '">' + text + '</span>'
  }
}, {
  field: 'operation',
  title: __('operation'),
  dataType: 'action',
  item: operation(showMessage)
}]

let statusData = [
  {
    title: '待发布',
    state: 'bidrelease',
    num: 0
  },
  {
    title: '接受报名中',
    state: 'bidregistering',
    num: 0
  },
  {
    title: '待竞价',
    state: 'tobid',
    num: 0
  },
  {
    title: '竞价中',
    state: 'inbidding',
    num: 0
  },
  {
    title: '已推荐供应商',
    state: 'suprecommended',
    num: 0
  },
  {
    title: '已定标',
    state: 'bidconfirmed',
    num: 0
  },
  {
    title: '已流标',
    state: 'ended',
    num: 0
  },
  {
    title: '全部',
    state: 'all',
    num: 0
  }
]

async function refreshTabs (data) {
  let statData = await Get(URLs.bt_statByStatus.url, {bidType: type})
  map(statData.data, function (n, key) {
    let idx = findIndex(data, ['state', key])
    if (idx > -1) {
      data[idx].num = n
    }
    return 0
  })
  return cloneDeep(data)
}

function addBidtrade () {
  window.location.href = '../bidtradeeditor/index.' + __('locale') + '.html?id=' + 0 + '&type=' + type
}

function removeBidtrades () {
  let rows = collection.datatable.getSelectedRows()
  let params = {
    ids: rows.map(function (row) {
      return row.getValue('id')
    })
  }
  u.confirmDialog({
    msg: '是否确认删除？',
    title: '删除确认',
    onOk: async function () {
      let data = await Post(URLs.bt_removeBt.url, params)
      /* if (data.status) {
        rows.forEach(function (obj) {
          collection.datatable.removeRows([obj])
        })
      } */
      if (data.status) {
        showMessage('success', data.msg || '删除成功')
      } else {
        showMessage('fail', data.msg || '删除失败')
      }
    }
  })
}

function publishBidtrades () {
  let rows = collection.datatable.getSelectedRows()
  let params = {
    ids: rows.map(function (row) {
      return row.getValue('id')
    })
  }
  u.confirmDialog({
    msg: '是否确认发布？',
    title: '发布确认',
    onOk: async function () {
      let data = await Post(URLs.bt_publishMulBt.url, params)
      if (data.status) {
        showMessage('success', data.msg || '操作成功')
      } else {
        showMessage('fail', data.msg || '操作失败')
      }
    }
  })
}

function init () {
  // 默认查询待发布

  collection.load({ billstatus: tabName, bidType: type, pageIndex: pageIndex })
  collection.on('data', async function (data) {
    // 改变tabs数值
    /* const state = viewModel.state()
    const newStatusData = cloneDeep(viewModel.statuItems())
    let index = findIndex(newStatusData, ['state', state])
    newStatusData[index].num = data.data.totalCount
    viewModel.statuItems(newStatusData) */

    let states = await refreshTabs(viewModel.statuItems())
    viewModel.statuItems(states)

    // 显示隐藏列，false 表示隐藏
    const setColumnVisible = function (visible) {
      let grid = app.getComp('bdgrid').grid
      return function (...cols) {
        cols.forEach(function (col) {
          grid.setColumnVisibleByIndex(findIndex(columnSetting, ['field', col]), visible)
        })
      }
    }
    const showCol = setColumnVisible(true)
    const hideCol = setColumnVisible(false)
    switch (viewModel.state()) {
      case 'bidrelease':
        showCol('createTime', 'registEndTime')
        hideCol('bidStartTime', 'regNum')
        // $('#bdgrid_content_table').find('col').css({'width': '15%'})

        // var len = $('#bdgrid_content_table').find('col').length
        // for (var i = 0; i < len; i++) {
        //   $('#bdgrid_content_table').find('col').css({'width': '15%'})
        // }
        break
      case 'bidregistering':
        showCol('createTime', 'registEndTime', 'regNum')
        hideCol('bidStartTime')
        // $('#bdgrid_content_table').find('col').css({'width': '15%'})
        break
      case 'tobid':
        showCol('bidStartTime', 'regNum')
        hideCol('createTime', 'registEndTime')
        // $('#bdgrid_content_table').find('col').css({'width': '15%'})
        break
      case 'inbidding':
        showCol('bidStartTime', 'regNum')
        hideCol('createTime', 'registEndTime')
        // $('#bdgrid_content_table').find('col').css({'width': '15%'})
        break
      case 'bidconfirmed':
        hideCol('createTime', 'registEndTime', 'bidStartTime', 'regNum')
        // $('#bdgrid_content_table').find('col').css({'width': '15%'})
        break
      case 'ended':
        showCol('createTime', 'registEndTime', 'bidStartTime')
        hideCol('regNum')
        // $('#bdgrid_content_table').find('col').css({'width': '15%'})
        break
      case 'all':
        showCol('createTime', 'registEndTime', 'bidStartTime')
        hideCol('regNum')
        // $('#bdgrid_content_table').find('col').css({'width': '15%'})
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
    state: ko.observable('bidrelease'),
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
    },
    addBidtrade,
    removeBidtrades,
    publishBidtrades
  }
  viewModel.state(tabName)
  viewModel.stateindex(tabIndex)
  window.app = window.u.createApp({
    el: 'body',
    model: viewModel
  })
}

(async function () {
  /* let statData = await Get(URLs.bt_statByStatus.url, {})
  map(statData.data, function (n, key) {
    let idx = findIndex(statusData, ['state', key])
    if (idx > -1) {
      statusData[idx].num = n
    }
    return 0
  }) */
  // await refreshTabs(statusData)
  init()
})()
