// latest: zhangmyh 2017-4-11 10:04 AM
/* global $ */

/**
* 消息显示组件
* uMessage([ type, msg, position, timeout, width ])
* uMessage([config])
** type 类型 可选值：success fail warning info 默认值：info
** msg 消息文字
** position 显示位置 默认值：center
** timeout 关闭延时 单位：秒 默认值：2
** width 消息框宽度 可接受数字和像素值字符串 默认值: 500
**/

import './index.less'

export default function (config) {
  if (typeof config == 'string') {
    var type = config
    var msg = arguments[1]
    var position = arguments[2]
    var timeout = arguments[3]
    var width = arguments[4]
  } else if (typeof config == 'object') {
    /* eslint-disable */
    var { type, position, msg, timeout, width } = config
    /* eslint-disable */
  } else {
    return false
  }
  let msgType, showMsg

  switch (type) {
    case 'success':
      showMsg = `<div class="u-message-title">成功</div><div class="u-message-content">${msg}</div>`
      msgType = 'success'
      break
    case 'fail':
      // showMsg = '<i class="uf uf-close-c margin-r-5"></i>' + msg
      showMsg = `<div class="u-message-title">失败</div><div class="u-message-content">${msg}</div>`
      msgType = 'error'
      break
    case 'warning':
      showMsg = `<div class="u-message-title">警告</div><div class="u-message-content">${msg}</div>`
      msgType = 'warning'
      break
    default:
      showMsg = `<div class="u-message-title">信息</div><div class="u-message-content">${msg}</div>`
      msgType = 'info'
      break
  }
  if (!position) {
    position = 'top'
  }
  if (width) {
    if (!isNaN(width)) {
      width = width + 'px'
    }
  } else {
    width = '300px'
  }

  if ($('.u-message:hidden')) {
    $('.u-message:hidden').unbind('mouseout').unbind('mouseover').remove()
  }

  window.u.showMessage({ msg: showMsg, position, msgType, width })
  if (msgType == 'success' || msgType == 'fail' || msgType == 'warning') {
    if (!timeout) {
      timeout = 3
    }
  } else {
    timeout = 2
  }

  if (timeout > 0) {
    let _timer = null
    let piece = Math.round(timeout) * 1000 / 40
    let step

    let ele = $('.u-message:nth-last-child(1)')
    if(ele.length <= 0) {
      ele = $('.u-message')
    }

    const clearProgress = () => {
      $('.u-message-progress:nth-last-child(1)').hide()
      clearInterval(_timer)
    }
    const setProgress = () => {
      let pele = $('.u-message-progress:nth-last-child(1)')
      if(pele.length <= 0) {
        pele = $('.u-message-progress')
      }
      if (pele.length <= 0) {
        if (pele.length <= 0) {
          pele = $('<div class="u-message-progress" style="width: 100%"></div>')
          ele.append(pele)
        }
      } else {
        pele.width('100%')
      }
      pele.show()

      step = 100 / piece
      clearInterval(_timer)
      _timer = setInterval(function () {
        if (piece <= 0) {
          let c = $('.u-message:nth-last-child(1)')
          if (c.length <= 0) {
            c = $('.u-message')
          }
          clearProgress()
          c.hide()
        } else {
          $('.u-message-progress:nth-last-child(1)').width((step * piece) + '%')
          piece--
        }
      }, 40)
    }

    ele.on('mouseover', function () {
      clearProgress()
    })
    ele.on('mouseout', function () {
      setProgress()
    })
    setProgress()
  }

  return true
}
