import 'ko-epui/dist/ko-epui.css'
import 'ko-epui'
import 'components'
import _ from 'lodash'
import projectdef from 'collection/projectdef'
import operation from './opt'
/* global __ */
/* global ko */

let collection = projectdef
collection.load()
var viewModel = {
  id: ko.observable(10),
  q: ko.observable(''),
  clickme: function (msg) {
    console.log('')
  },
  query: function (msg) {
    console.log('query' + this.q())
  },
  stateclick: function (msg) {
    console.log('stateclick: ' + msg.state)
  },
  stateindex: ko.observable(0),
  statuItems: ko.observableArray([
    {
      title: '待收货',
      state: 1,
      num: 0
    },
    {
      title: '已收货',
      state: 2,
      num: 0
    },
    {
      title: '待收货',
      state: 3,
      num: 0
    }
  ]),
  config: {
    'id': 'grid1',
    'data': collection,
    'type': 'grid',
    'multiSelect': true,
    'editable': false,
    pagination: true,
    fields: [{
      'field': 'subject',
      'dataType': 'String',
      'title': '标题',
      'width': '200'
    }, {
      'field': 'detailList',
      'dataType': 'String',
      'title': '竞价物资',
      'width': '300',
      renderType (obj) {
        // 主体数据
        var id = obj.row.value.id
        var data = _.find(collection.data.result, function (rs) {
          return rs.id === id
        })
        if (!data || !data.detailList) {
          return ''
        }
        var text = _.map(data.detailList, function (v) {
          return v.materialName
        }).join(',')
        obj.element.innerHTML = '<span title="' + text + '">' + text + '</span>'
      }
    }, {
      'field': 'createTime',
      'dataType': 'String',
      'title': '创建时间',
      'width': '180'
    }, {
      'field': 'statusNameShow',
      'dataType': 'String',
      'title': __('status'),
      'width': '180'
    }, {
      'field': 'statusNameShow',
      'title': __('operation'),
      dataType: 'action',
      item: operation()
    }]
  }
}
window.app = window.u.createApp({
  el: 'body',
  model: viewModel
})
viewModel.stateindex(1)
