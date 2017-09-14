import './global'
// fn 通常是ajax请求
window.global.btnClickMask = function (fn) {
  var e = arguments[arguments.length - 1]
  var el = e.target.parentElement
  el.setAttribute('disabled', 'disabled')
  fn().then(() => {
    el.removeAttribute('disabled')
  }).catch(() => {
    el.removeAttribute('disabled')
  })
}

export function buttonClick2disable (ajax) {
  var e = arguments[arguments.length - 1]
  var btn = e.target.parentElement
  btn.setAttribute('disabled', 'disabled')
  // promise 不会包含always 2016年10月20日10:25:57
  // ajax().always(function(){
  //   btn.removeAttribute('disabled');
  // })
  ajax()
    .then(() => {
      btn.removeAttribute('disabled')
    })
    .catch(() => {
      btn.removeAttribute('disabled')
    })
}
