import ko from 'knockout'
import 'ko-epui/dist/ko-epui.css'
import 'ko-epui'
import 'components'
import projectdef from 'model/projectdef'
import 'common/utils'
import EventBus from 'common/eventbus'
import _ from 'lodash'
import {personrefer, supplydocrefer, singlesupplydocrefer, orgrefer} from 'components/modalrefer'

/* global __ */
/* global u */
var id = window.global.query('id')
// 演示数据
id = 535
if (id) {
  projectdef.load({
    id: id
  })
}
function chooseperson () {
  personrefer({
    onOk: function (msg) {
      projectdef.associations.detailList.datatable.getCurrentRow().setValue('enterpriseName', msg.personname)
      projectdef.associations.detailList.datatable.getCurrentRow().setValue('enterpriseId', msg.id)
    },
    onCancel: function () {

    }
  })
}
function choosesupplydoc () {
  supplydocrefer({
    defaultData: function () {
      return viewModel.model.getValue('statusName')
    },
    onOk: function (msg) {
      console.log('=============================', msg)
      // 这里返回的msg包含{id: 供应商档案id,name:供应商名称,code:供应商编码,supplyId: 供应商租户id}
      viewModel.model.getCurrentRow().setValue('statusName', msg)
    },
    onCancel: function () {

    }
  })
}
var viewModel = {
  chooseSupplyDoc: function () {
    choosesupplydoc()
  },
  singlesupplydoc: function () {
    singlesupplydocrefer({
      onOk: function (msg) {
        viewModel.model.getCurrentRow().setValue('enterpriseId', msg.id)
        viewModel.model.getCurrentRow().setValue('enterpriseName', msg.name)
      },
      onCancel: function () {

      }
    })
  },
  id: ko.observable(''),
  title: ko.observable('供应商标题'),
  thirdtitle: ko.observable(__('title')),
  ck1: ko.observable(''),
  ck2: ko.observable(''),
  showorgrefer: function () {
    orgrefer({
      onOk: function onOk (msg) {
        projectdef.datatable.getCurrentRow().setValue('enterpriseName', msg.name)
        projectdef.datatable.getCurrentRow().setValue('enterpriseId', msg.id)
      },
      onCancel: function onCancel () {

      }
    })
  },
  showrefer: function () {
    personrefer({
      onOk: function onOk (msg) {
        projectdef.datatable.getCurrentRow().setValue('enterpriseName', msg.personname)
        projectdef.datatable.getCurrentRow().setValue('enterpriseId', msg.id)
        console.log(msg)
      },
      onCancel: function onCancel () {

      }
    })
  },
  modalclick: function (...args) {
    u.confirmDialog({
      msg: '是否保存单据？',       // modal内容
      title: '测试确认',           // modal title
      onOk: function () {          // 确认后的回调
        window.alert('ok')
      },
      onCancel: function () {         // 取消后的回调
        window.alert('cancel')
      }
    })
  },
  select: function (msg) {
    console.log('select:' + msg)
  },
  save2: _.partial(window.global.btnClickMask, async function () {
    var data = await projectdef.save()
    if (data.status) {
      EventBus.emit('success', data.msg || '保存成功')
    } else {
      EventBus.emit('fail', data.msg || '保存失败')
    }
  }),
  comboData: [
    {
      name: '公开招标',
      value: 1
    },
    {
      name: '邀请招标',
      value: 2
    },
    {
      name: '单一来源',
      value: 3
    }
  ],
  checkboxData: [{value: '1', name: '产品一'}, {value: '2', name: '产品二'}],
  radiodata: [
    {value: '1', name: '男'}, {value: '2', name: '女'}
  ],
  model: projectdef.datatable,
  //
  config: {
    'id': 'detail_grid',
    'data': projectdef.associations.detailList,
    'type': 'grid',
    'multiSelect': false,
    'editable': false,
    canDrag: false,
    canSwap: false,
    columnMenu: false,
    autoWidth: true,
    fields: [
      {'field': 'materialClassName', 'dataType': 'String', 'title': '物料分类', 'editType': 'addDetail', 'width': '125'},
      {'field': 'materialName', 'dataType': 'String', 'title': '物料信息', 'editType': 'addDetail', 'renderType': 'timeRender', 'sortable': true, 'width': '125'},
      {'field': 'num', 'dataType': 'String', 'title': '数量', 'editType': 'float', 'editOptions': {'validType': 'float', 'precision': '8'}, 'sumCol': true, 'width': '125'},
      {'field': 'unit', 'dataType': 'String', 'title': '单位', 'editType': 'addDetail', 'width': '125'},
      {'field': 'reqDesc', 'dataType': 'String', 'title': '需求描述', 'editType': 'string', 'sumCol': true, 'width': '125'}
    ]
  },
  editgridconfig: {
    'id': 'edit_grid',
    'data': projectdef.associations.detailList,
    'type': 'grid',
    'multiSelect': false,
    'editable': true,
    canDrag: false,
    canSwap: false,
    columnMenu: false,
    autoWidth: true,
    fields: [
      {'field': 'materialClassName', 'dataType': 'String', 'title': '物料分类', 'editType': choosesupplydoc, 'width': '125'},
      {'field': 'materialName', 'dataType': 'String', 'title': '物料信息', 'editType': 'string', 'renderType': 'timeRender', 'sortable': true, 'width': '125'},
      {'field': 'num', 'dataType': 'String', 'title': '数量', 'editType': 'float', 'editOptions': {'validType': 'float', 'precision': '8'}, 'sumCol': true, 'width': '125'},
      {'field': 'unit', 'dataType': 'String', 'title': '单位', 'editType': 'string', 'width': '125'},
      {'field': 'enterpriseName', 'dataType': 'String', 'title': '人员', 'editType': chooseperson, 'width': '125'},
      {'field': 'reqDesc', 'dataType': 'String', 'title': '需求描述', 'editType': 'string', 'sumCol': true, 'width': '125'}
    ]
  },
  addRow () {
    projectdef.associations.detailList.datatable.createEmptyRow()
  }
}
// var events = {
//  save:
// }
// viewModel = _.extend(viewModel, events)
window.app = u.createApp({
  el: 'body',
  model: viewModel
})
