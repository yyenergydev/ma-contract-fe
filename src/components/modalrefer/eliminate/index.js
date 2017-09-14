// latest: zhangmyh 2017-3-8 4:48 PM
/* global $ u ko */

function init (refer) {
  let vm = {
    test: ko.observable('')
  }
  let app = u.createApp()
  app.init(vm, $('#refer_eliminate')[0])
  refer.registerSubmitFunc(() => {
    return vm.test()
  })
}
let template = require('./index.html')
export default {
  init,
  template
}
