import ko from 'knockout'
import 'ko-epui/dist/ko-epui.css'
import 'ko-epui'
import 'components'

var viewModel = {
  id: ko.observable('10')
}
window.u.setCookie('u_locale', 'zh_CN')
ko.applyBindings(viewModel)
