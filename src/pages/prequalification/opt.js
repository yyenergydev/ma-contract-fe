// latest: wangk2 2017-2-21 06:35 PM
import _ from 'lodash'
import eliminate from 'components/modalrefer/eliminate'
// import {Get} from 'common'
// import EventBus from 'common/eventbus'
var opt = {
  '0': ['open', 'pass', 'out'],
  '1': ['open', 'pass', 'out'],
  '2': ['open', 'pass', 'out'],
  '3': ['open', 'pass', 'out'],
  '4': ['open', 'pass', 'out'],
  '5': ['open', 'pass', 'out'],
  '6': ['open', 'pass', 'out'],
  '7': ['open', 'pass', 'out']
}

let handlers = {
  open: {
    text: '查看详情',
    handler (obj, e) {
      window.location.href = '../biddingInfo/index.zh_CN.html?bidtradeId=' + obj.row.value.bidtradeID + '&enterpriseId=' + obj.row.value.enterpriseId+'&issupplyLinkman=1'
    }
  },
  pass: {
    text: '通过',
    handler (obj, e) {
      window.app.dataTables.detailmode.getRow(obj.row.valueIndex).setValue('state', 5)
    }
  },
  out: {
    text: '淘汰',
    handler (obj, e) {
      window.u.refer({
        isPOPMode: true,
        searchInput: null,
        contentId: 'refer_eliminate',
        okId: 'okBtn',
        cancelId: 'cancelBtn',
        width: '500px',
        height: null,
        module: eliminate,
        title: '淘汰理由',
        onOk: async function (msg) {
          window.app.dataTables.detailmode.getRow(obj.row.valueIndex).setValue('state', 4)
          window.app.dataTables.detailmode.getRow(obj.row.valueIndex).setValue('rejectReason', msg)
        },
        onCancel: function () {}
      })
    }
  }
}

export default function createOptItem (obj) {
  return _.map(handlers, function (handlerObj, key) {
    var hide = handlerObj.hide || function () {
      return false
    }
    // 这里可以统一在handlers里定义
    handlerObj.hidden = function (obj) {
      var hasOpt = opt[obj.row.value.state]
      return _.indexOf(hasOpt, key) === -1 || hide(obj.row.value)
    }
    return handlerObj
  })
}
