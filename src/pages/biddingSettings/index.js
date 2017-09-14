// author: wangk2
// latest: zhangmyh 2017-3-22 4:20 PM
import 'ko-epui/dist/ko-epui.css'
import 'ko-epui'
import './index.less'
import 'components'
import { debounce } from 'lodash'
import { Post } from 'common/Ajax'
import Operater from './opt'
import bidsetting from 'model/bidsetting'
import { personrefer } from 'components/modalrefer'
import uMessage from 'components/message'
/* global u ko */

var id = window.global.query('id')
// 演示数据
bidsetting.load({id: id})

function doNothing () {}
function removeItem (list) {
  return function (index) {
    bidsetting.associations['bidtrade' + list + 'List'].datatable.removeRows([ index ])
  }
}
function choosePerson (callback) {
  return function () {
    personrefer({
      onOk: callback,
      onCancel: doNothing
    })
  }
}
bidsetting.datatable.on('lowBiddingSteptype.valueChange', function (value) {
  if (value.newValue == 1) {
    viewModel.byamount(true)
    viewModel.bypercentage(false)
  } else {
    viewModel.byamount(false)
    viewModel.bypercentage(true)
  }
})
let removeTemplete = removeItem('Templete')

var viewModel = {
  id: ko.observable(),
  byamount: ko.observable(false),
  bypercentage: ko.observable(false),
  titleList: [
    '竞价设置',
    '报价模版',
    '竞价密码管理'
  ],
  bidTypeOpt: [
    {
      value: '1',
      name: '竞买'
    }, {
      value: '2',
      name: '竞卖'
    }
  ],
  bidProcessData: [
    {
      value: '1',
      name: '公开最新价格'
    }, {
      value: '2',
      name: '公开竞价公司名称'
    }, {
      value: '3',
      name: '公开最新排名'
    }, {
      value: '4',
      name: '内部公开竞价公司名称'
    }
  ],
  quoteModeOpt: [
    // {
    //   value: '0',
    //   name: '总价报价'
    // },
    {
      value: '1',
      name: '明细报价'
    }
  ],
  lowStepOpt: [
    {
      value: '1',
      name: '按金额'
    }, {
      value: '2',
      name: '按百分比'
    }
  ],
  preQlfOpt: [
    {
      value: '1',
      name: '资格先审'
    }, {
      value: '2',
      name: '资格后审'
    }
  ],
  materialListCfg: {
    id: 'material_grid',
    data: bidsetting.associations.bidtradeTempleteList,
    type: 'grid',
    multiSelect: false,
    editable: true,
    canDrag: false,
    canSwap: false,
    columnMenu: false,
    fields: [
      {
        'field': 'materialClassName',
        'dataType': 'String',
        'title': '物料分类',
        'editType': 'String',
        'width': '100'
      }, {
        'field': 'materialName',
        'dataType': 'String',
        'title': '物料名称',
        'editType': 'String',
        'renderType': 'timeRender',
        'sortable': true,
        'width': '100'
      }, {
        'field': 'num',
        'dataType': 'String',
        'title': '数量',
        'editType': 'float',
        'editOptions': {
          'validType': 'float',
          'precision': '0',
          'max': 10000
        },
        'sumCol': true,
        'width': '80'
      }, {
        'field': 'unit',
        'dataType': 'String',
        'title': '单位',
        'editType': 'String',
        'width': '80'
      }, {
        field: 'supEnterpriseName',
        dataType: 'String',
        title: '建议供应商',
        editType: 'String',
        width: '120'
      }, {
        'field': 'reqOrgName',
        'dataType': 'String',
        'title': '需求组织',
        'editType': 'String',
        'width': '100'
      }, {
        'field': 'planPersonName',
        'dataType': 'String',
        'title': '计划员',
        'editType': 'String',
        'width': '100'
      }, {
        'field': 'planDeptName',
        'dataType': 'String',
        'title': '计划部门',
        'editType': 'String',
        'width': '100',
        editable: false,
      }, {
        'field': 'note',
        'dataType': 'String',
        'title': '物料说明',
        'editType': 'string',
        'width': '100'
      }, {
        'field': 'reqTime',
        'dataType': 'String',
        'title': '需求时间',
        'editType': 'date',
        'sumCol': true,
        'width': '100'
      }, {
        'field': 'address',
        'dataType': 'String',
        'title': '收货地址',
        'editType': 'string',
        'width': '250'
      }
    ]
  },
  templeteListCfg: {
    id: 'templete_grid',
    data: bidsetting.associations.bidtradeTempleteList,
    type: 'grid',
    multiSelect: false,
    editable: true,
    canDrag: false,
    canSwap: false,
    columnMenu: false,
    autoWidth: false,
    fields: [
      {
        'field': 'priceUnit',
        'dataType': 'String',
        'title': '报价单元',
        'editType': 'string',
        'width': '17%'
      }, {
        'field': 'isProduct',
        'dataType': 'checkbox',
        'title': '产品项',
        'renderType': 'booleanRender',
        'editType': 'string',
        'width': '17%'
      }, {
        'field': 'totalAmount',
        'dataType': 'String',
        'title': '合计金额',
        'editType': 'string',
        'width': '17%'
      }, {
        'field': 'discountRate',
        'dataType': 'String',
        'title': '折现率',
        'editType': 'string',
        'width': '17%'
      }, {
        'field': 'memo',
        'dataType': 'String',
        'title': '备注',
        'editType': 'string',
        'width': '17%'
      }, {
        'field': 'operation',
        'title': '操作',
        'dataType': 'action',
        'item': Operater(removeTemplete),
        'editable': false
      }
    ]
  },
  passwordManageCfg: {
    'id': 'passwordManage_grid',
    'data': bidsetting.associations.bidtradeRegisterList,
    'type': 'grid',
    'multiSelect': true,
    'editable': false,
    canDrag: false,
    canSwap: false,
    columnMenu: false,
    autoWidth: true,
    fields: [
      {'field': 'enterpriseName', 'dataType': 'String', 'title': '供应商', 'width': '125'},
      {'field': 'linkman', 'dataType': 'String', 'title': '联系人', 'sortable': true, 'width': '125'},
      {'field': 'linktype', 'dataType': 'String', 'title': '联系方式', 'sumCol': true, 'width': '125'},
      {'field': 'email', 'dataType': 'String', 'title': '邮箱', 'width': '125'},
      {'field': 'isSendPwd',
        'dataType': 'String',
        'title': '密码发送',
        'sumCol': true,
        'width': '100',
        renderType (obj) {
          const passwordConverter = function (state) {
            switch (state) {
              case 0:
                return '未发送'
              case 1:
                return '已发送'
              default:
                return ''
            }
          }
          let text = passwordConverter(parseInt(obj.row.value.isSendPwd))
          obj.element.innerHTML = '<span title="' + text + '">' + text + '</span>'
        }
      },
      {'field': 'sendPwdTime', 'dataType': 'String', 'title': '发送时间', 'sumCol': true, 'width': '100'}
    ]
  },
  // 发布密码
  issuepassword: async function () {
    var _data = window.app.dataTables.detailmodel.getSelectedRows().map(function (item) {
      return item.getSimpleData()
    })
    console.log(_data)
    var data = await Post('/cpu-bidtrade/bidtrade/createpassword', _data)
    if (data.status == '1') {
      uMessage('success', data.msg || '发布成功')
    } else {
      uMessage('fail', data.msg || '发布失败')
    }
  },
  save: debounce(async function () {
    var data = await bidsetting.save()
    if (data.status == '1') {
      uMessage('success', data.msg || '保存成功')
    } else {
      uMessage('fail', data.msg || '保存失败')
    }
  }, 300, { maxWait: 2000 }),
  model: bidsetting.datatable,
  detailmodel: bidsetting.associations.bidtradeRegisterList.datatable,
  chooseSupervisor: choosePerson(function (info) {
    viewModel.model.setValue('supervisorId', info.id)
    viewModel.model.setValue('supervisorName', info.personname)
  }),
  addTemplete () {
    bidsetting.associations['bidtradeTempleteList'].datatable.createEmptyRow()
  }
}

window.app = u.createApp({
  el: 'body',
  model: viewModel
})
