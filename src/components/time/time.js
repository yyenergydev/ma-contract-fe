import ko from 'knockout'

ko.bindingHandlers.time = {
  init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
    var obj = valueAccessor()
    var date = new Date(obj)
    element.innerHTML = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
  },
  update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
  }
}

