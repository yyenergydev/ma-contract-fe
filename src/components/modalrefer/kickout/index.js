// latest: wangk2 2017-3-23 4:48 PM
/* global $ u ko */

function init (refer) {
  let vm = {
    test: ko.observable('')
  }
  let app = u.createApp()
  app.init(vm, $('#refer_kickout')[0])
  refer.registerSubmitFunc(() => {
    return vm.test()
  })
}
let template = require('./index.html')
export default {
  init,
  template
}
