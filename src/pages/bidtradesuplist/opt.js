// latest: wangk2 2017-3-3 10:45 PM
import { indexOf, map } from 'lodash'
import { Post, URLs } from 'common'
/* global u __ */

// 根据状态显示不同的操作
var opt = {
  '4|1': ['view_bt', 'apply', 'refuse'],
  '4|2': ['view_bt', 'modifyapply'], // , 'withdraw'  yusn暂时先注释
  '5|1': ['view_bt'],
  '5|2': ['view_bt'],
  '6|1': ['view_bt'],
  '7|1': ['view_bt'],
  '8|1': ['view_bt'],
  '9|1': ['view_bt'],
  '6|4': ['view_bt'],
  '6|5': ['view_bt'],
  '7|9': ['view_bt'],
  '7|5': ['view_bt', 'hall'],
  '7|7': ['view_bt', 'hall'],
  '7|8': ['view_bt', 'hall'],
  '9': ['view_bt', 'view_end'],
  '10': ['view_bt', 'view_end']
}
// var opt = {
//   '4|1': ['view_bt', 'apply', 'refuse'],
//   '4|2': ['view_bt', 'modifyapply'], // , 'withdraw'  yusn暂时先注释
//   '5|1': ['view_bt'],
//   '5|2': ['view_bt', 'modifyapply'],
//   '6|1': ['view_bt'],
//   '7|1': ['view_bt'],
//   '8|1': ['view_bt'],
//   '9|1': ['view_bt'],
//   '6|4': ['view_bt'],
//   '6|5': ['view_bt'],
//   '7|9': ['view_bt'],
//   '7|5': ['hall'],
//   '7|7': ['hall'],
//   '7|8': ['hall'],
//   '9': ['view_end'],
//   '10': ['view_end']
// }

let handlers = {
  view_bt: {
    text: '查看详情',
    handler (obj) {
      window.location.href = '../bidtradesupdetail/index.' + __('locale') + '.html?id=' + obj.row.value.id + window.location.hash
    }
  },
  apply: {
    text: '报名',
    handler (obj) {
      window.location.href = '../biddingApply/index.' + __('locale') + '.html?id=' + obj.row.value.id
    }
  },
  modifyapply: {
    text: '修改报名内容',
    handler (obj) {
      window.location.href = '../biddingApply/index.' + __('locale') + '.html?id=' + obj.row.value.id
    }
  },
  refuse: {
    text: '拒绝',
    handler (obj, callback) {
      let bidtradeID = obj.row.value.id
      u.confirmDialog({
        msg: '是否拒绝？',
        title: '拒绝确认',
        onOk: async function () {
          let supplierID = window.global.user.enterpriseId
          let data = await Post(URLs.bt_refuseReg.url, { bidtradeID, supplierID })
          if (data.status) {
            callback('success', data.msg || '已拒绝')
          } else {
            callback('fail', data.msg || '拒绝失败')
          }
        }
      })
    }
  },
  withdraw: {
    text: '撤回报名',
    handler (obj, callback) {
      let bidtradeID = obj.row.value.id
      u.confirmDialog({
        msg: '是否撤回？',
        title: '撤回报名',
        onOk: async function () {
          let supplierID = window.global.user.enterpriseId
          let data = await Post(URLs.bt_refuseReg.url, { bidtradeID, supplierID })
          if (data.status) {
            callback('success', data.msg || '已撤回')
          } else {
            callback('fail', data.msg || '撤回失败')
          }
        }
      })
    }
  },
  hall: {
    text: '竞价大厅',
    handler (obj) {
      window.location.href = '../biddingHall/index.' + __('locale') + '.html?id=' + obj.row.value.id + '&supplyId=' + window.global.user.enterpriseId
    }
  }
}

export default function createOptItem (callback) {
  return map(handlers, function (handlerObj, key) {
    var hide = handlerObj.hide || function () {
      return false
    }
    // 这里可以统一在handlers里定义
    handlerObj.hidden = function (obj) {
      var hasOpt = opt[obj.row.value.billstatus + '|' + obj.row.value.supStatus]
      return indexOf(hasOpt, key) === -1 || hide(obj.row.value)
    }
    handlerObj.callback = callback
    return handlerObj
  })
}
