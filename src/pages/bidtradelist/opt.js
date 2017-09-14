// latest: zhangmyh 2017-3-1 10:41 AM
import { indexOf, map } from 'lodash'
import { Post, URLs } from 'common'
/* global u __ */

// 根据状态显示不同的操作
var opt = {
  '1': ['view_publish', 'commit'],
  '3': ['view_publish', 'publish'],
  '4': ['view_sign'],
  '5': ['view_sign'],
  '6': ['view_bt', 'set'],
  '7': ['hall'],
  '8': ['hall'],
  '9': ['view_end'],
  '10': ['view_end'],
  '11': ['view_sign'],
  '15': ['view_bt', 'set']
}

let handlers = {
  view_publish: {
    text: '查看详情',
    handler (obj) {
      window.location.href = '../bidtradeeditor/index.' + __('locale') + '.html?id=' + obj.row.value.id + window.location.hash
    }
  },
  view_sign: {
    text: '查看详情',
    handler (obj) {
      window.location.href = '../prequalification/index.' + __('locale') + '.html?id=' + obj.row.value.id + window.location.hash
    }
  },
  view_end: {
    text: '查看竞价清单',
    handler (obj) {
      window.location.href = '../bidlist/index.' + __('locale') + '.html?id=' + obj.row.value.id + window.location.hash
    }
  },
  view_bt: {
    text: '查看详情',
    handler (obj) {
      window.location.href = '../bidtradedetail/index.' + __('locale') + '.html?id=' + obj.row.value.id + window.location.hash
    }
  },
  set: {
    text: '竞价设置',
    handler (obj) {
      window.location.href = '../biddingSettings/index.' + __('locale') + '.html?id=' + obj.row.value.id + window.location.hash
    }
  },
  // commit: {
  //   text: '提交',
  //   handler (obj, callback) {
  //     // let bidtradeID = obj.row.value.id
  //     u.confirmDialog({
  //       msg: '是否确认提交？',
  //       title: '提交确认',
  //       onOk: async function () {
  //         /* let supplierID = window.global.user.enterpriseId
  //         let data = await Post(URLs.bt_commitBt.url, { bidtradeID, supplierID })
  //         if (data.status) {
  //           callback('success', data.msg || '提交成功')
  //         } else {
  //           callback('fail', data.msg || '提交失败')
  //         } */
  //       }
  //     })
  //   }
  // },
  publish: {
    text: '发布',
    handler (obj, callback) {
      let bidtradeID = obj.row.value.id
      let params = {
        id: bidtradeID
      }
      u.confirmDialog({
        msg: '是否确认发布？',
        title: '发布确认',
        onOk: async function () {
          // let supplierID = window.global.user.enterpriseId
          let data = await Post(URLs.bt_publishMulBt.url, params)
          if (data.status) {
            callback('success', data.msg || '已拒绝')
          } else {
            callback('fail', data.msg || '拒绝失败')
          }
        }
      })
    }
  },
  hall: {
    text: '监控大厅',
    handler (obj) {
      window.location.href = '../biddingMonitor/index.' + __('locale') + '.html?id=' + obj.row.value.id + window.location.hash
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
      var hasOpt = opt[obj.row.value.billstatus]
      return indexOf(hasOpt, key) === -1 || hide(obj.row.value)
    }
    handlerObj.callback = callback
    return handlerObj
  })
}
