// latest: zhangmyh 2017-3-8 4:48 PM
/* global $ u ko */

function init (refer) {
  let vm = {
    test: ko.observable('')
  }
  let app = u.createApp()
  app.init(vm, $('#refer_bddelay')[0])
  refer.registerSubmitFunc(() => {
    var test = vm.test()
    if (test <= 0) {
      test = 0
    }
    return test
  })
}
let template = require('./index.html')
export default {
  init,
  template
}
