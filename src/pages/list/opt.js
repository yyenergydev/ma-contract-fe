import _ from 'lodash'
import {Get} from 'common'
import EventBus from 'common/eventbus'
// 根据状态显示不同的操作
var opt = {
  'S01': ['open'],
  'S30': ['open'],
  'S35': ['open']
}
let handlers = {
  open: {
    text: '开启',
    async handler (obj, e) {
      // 时间控制
      let data = await Get('/cpu-biddoc/biddoc/isTime?projectId=' + obj.row.value.id)
      if (data.data === 1) {
        // 监督人控制
        let data = await Get('/cpu-biddoc/biddoc/hasSupervisor?projectId=' + obj.row.value.id)

        // 有监督人
        if (data.data === 1) {
          // ko.showModal('supervisor', {
          //  id: obj.row.value.id
          // })
          // 无监督人
        } else {
          window.location.href = '../bidopen/index.html?id=' + obj.row.value.id + window.location.hash
        }
      } else {
        EventBus.emit('fail', '没有到达指定开启时间！')
      }
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
      var hasOpt = opt[obj.row.value.statusShow]
      return _.indexOf(hasOpt, key) === -1 || hide(obj.row.value)
    }
    return handlerObj
  })
}
