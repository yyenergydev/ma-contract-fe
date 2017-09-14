// latest: zhangmyh 2017-3-30 3:03 PM
import './index.less'
import 'ko-epui/dist/ko-epui.css'
import 'ko-epui'
import 'components'
import { debounce, indexOf } from 'lodash'
import { Get, URLs } from 'common'
import bidtradedef from 'model/bidtrade'
import Adapter from './adapter'
import Operater from './opt'
import { personrefer, personsrefer } from 'components/modalrefer'
import chooseRefer from 'components/modalrefer/chooseRefer'
import personM from 'model/person'
import uMessage from 'components/message'
/* global ko u $ */

let bidtradeId = window.global.query('id')
let reqids = window.global.query('reqids')
let deliverAddrOpt = []
var viewModel

function doNothing () {}

function removeItem (list) {
  return function (index) {
    bidtradedef.associations['bidtrade' + list + 'List'].datatable.removeRows([ index ])
  }
}
const removeMeterial = removeItem('Material')
const removeTemplete = removeItem('Templete')

const addMaterial = chooseRefer('material', 'association', {
  model: bidtradedef,
  association: 'bidtradeMaterialList',
  adapter: Adapter.material
}, {
  repeatable: true,
  multiSelect: true
})

const chooseSupplyDoc = chooseRefer('supplier', 'association', {
  model: bidtradedef,
  association: 'bidtradeSupplierList',
  adapter: Adapter.supplier
}, {
  repeatable: false,
  multiSelect: true
})

const chooseSupplyDoc4Grid = chooseRefer('supplier', 'cell', {
  model: bidtradedef,
  association: 'bidtradeMaterialList',
  adapter: Adapter.supplier4grid
}, {
  repeatable: false,
  multiSelect: false
})

const chooseOrg = chooseRefer('org', 'component', {
  model: bidtradedef.datatable,
  adapter: Adapter.org
}, {
  repeatable: false,
  multiSelect: false
})

const chooseOrgDoc4Grid = chooseRefer('org', 'cell', {
  model: bidtradedef,
  association: 'bidtradeMaterialList',
  adapter: Adapter.org4grid
}, {
  repeatable: false,
  multiSelect: false,
  hasDepartment: false
})
function choosePersons (callback) {
  return function () {
    personsrefer({
      onOk: callback,
      onCancel: doNothing
    })
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
bidtradedef.datatable.on('lowBiddingSteptype.valueChange', function (value) {
  if (value.newValue == 1) {
    viewModel.byamount(true)
    viewModel.bypercentage(false)
  } else {
    viewModel.byamount(false)
    viewModel.bypercentage(true)
  }
})
bidtradedef.datatable.on('isCtrlOpen.valueChange', function ({field, newValue, oldValue, rowId}) {
  // 隐藏时,删除数据,重新启用需重选
  if (newValue == 0) {
    viewModel.model.setValue('supervisorName', '')
    viewModel.model.setValue('supervisorId', '')
  }
})
bidtradedef.datatable.on('inquiryScope.valueChange', function ({field, newValue, oldValue, rowId}) {
  var str = 1
  if (newValue.indexOf(str) != -1) {
    viewModel.inquiryTypeVis(true)
  } else {
    viewModel.inquiryTypeVis(false)
    viewModel.model.setValue('inquiryType', '')
  }
})
bidtradedef.datatable.on('inquiryType.valueChange', function ({field, newValue, oldValue, rowId}) {
  console.log(viewModel.model.getValue('inquiryType'))
  let newv = newValue.split(',')
  let has1 = indexOf(newv, '1')
  let has2 = indexOf(newv, '2')
  if (has1 > -1 && has2 > -1) {
    let oldv = oldValue.split(',')
    let has = indexOf(oldv, '1')
    if (has > -1) {
      newv.splice(has1, 1)
    } else {
      has = indexOf(oldv, '2')
      if (has > -1) {
        newv.splice(has2, 1)
      }
    }
    bidtradedef.datatable.setValue(field, newv.join(','))
  }
  if (newValue.indexOf('3') > -1) {
    viewModel.supplier(true)
  } else {
    viewModel.supplier(false)
  }
})
function init () {
  viewModel = {
    id: ko.observable(bidtradeId),
    supplier: ko.observable(false),
    title: ko.observable('供应商标题'),
    byamount: ko.observable(false),
    supervisors: ko.observableArray([]),
    bypercentage: ko.observable(false),
    inquiryTypeVis: ko.observable(false),
    titleList: [
      '基础信息',
      '对供应商要求',
      '竞价设置',
      '报价模版',
      '发布渠道及联系方式'
    ],
    supBusiModeData: [
      {
        value: '1',
        name: '生产加工'
      }, {
        value: '2',
        name: '经销批发'
      }, {
        value: '3',
        name: '商业服务'
      }
    ],
    supCertReqData: [
      {
        value: '1',
        name: '三证合一'
      }, {
        value: '2',
        name: '传统五证'
      }
    ],
    supInvReqData: [
      {
        value: '1',
        name: '增值税专用发票'
      }, {
        value: '2',
        name: '增值税普通发票'
      }, {
        value: '3',
        name: '不用发票'
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
        name: '公开价格'
      }, {
        value: '2',
        name: '公开竞价公司名称'
      }, {
        value: '3',
        name: '公开排名'
      }, {
        value: '4',
        name: '内部公开竞价公司名称'
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
    quoteModeOpt: [
      {
        value: '2',
        name: '明细报价'
      }
    ],
    contactTypeOpt: [
      {
        value: '1',
        name: '登录后可见'
      }, {
        value: '2',
        name: '报价后可见'
      }, {
        value: '3',
        name: '公开'
      }
    ],
    materialListCfg1: {
      id: 'material_grid1',
      data: bidtradedef.associations.bidtradeMaterialList,
      type: 'grid',
      multiSelect: false,
      editable: false,
      canDrag: false,
      canSwap: false,
      columnMenu: false,
      fields: [
        {
          'field': 'materialClassName',
          'dataType': 'String',
          'title': '物料分类',
          'width': '125'
        }, {
          'field': 'materialName',
          'dataType': 'String',
          'title': '物料名称',
          'renderType': 'timeRender',
          'sortable': true,
          'width': '125'
        }, {
          'field': 'num',
          'dataType': 'String',
          'title': '数量',
          'sumCol': true,
          'width': '125'
        }, {
          'field': 'unit',
          'dataType': 'String',
          'title': '单位',
          'width': '125'
        }, {
          'field': 'supEnterpriseName',
          'dataType': 'String',
          'title': '建议供应商',
          'width': '125'
        }, {
          'field': 'reqOrgName',
          'dataType': 'String',
          'title': '需求组织',
          'width': '125'
        }, {
          'field': 'planDeptName',
          'dataType': 'String',
          'title': '计划部门',
          'width': '125'
        }, {
          'field': 'planPersonName',
          'dataType': 'String',
          'title': '计划员',
          'width': '125'
        }, {
          'field': 'reqTime',
          'dataType': 'String',
          'title': '需求时间',
          'sumCol': true,
          'width': '125'
        }
      ]
    },
    inquiryScopeOpt: [
      {
        value: '1',
        name: '云采平台'
      }/*, {
        value: '2',
        name: '阿里1688'
      } */
    ],
    inquiryTypeOpt: [
      {
        value: '1',
        name: '广泛征集供应商报价  <span class="font-gray">（系统会为您匹配供应商，供应商也可以通过搜索找到您的询价单）</span>'
      }, {
        value: '2',
        name: '发布到我的采购门户  <span class="font-gray">（只有访问采购商门户的供应商才可以看到询价信息）</span>'
      }, {
        value: '3',
        name: '邀请指定供应商报价  <span class="font-gray">（只有被邀请的&nbsp;<button id="supplier" class="btn btn-primary" style="padding:0;" data-bind="click: $root.chooseSupplyDoc,enable:$root.supplier" >供应商</button>&nbsp;可以看到询价信息）</span>'
      }
    ],
    deliverAddrOpt,
    materialListCfg: {
      id: 'material_grid',
      data: bidtradedef.associations.bidtradeMaterialList,
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
          'editType': addMaterial,
          'width': '125'
        }, {
          'field': 'materialName',
          'dataType': 'String',
          'title': '物料名称',
          'editType': addMaterial,
          'renderType': 'timeRender',
          'sortable': true,
          'width': '125'
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
          'width': '125'
        }, {
          'field': 'unit',
          'dataType': 'String',
          'title': '单位',
          'editType': addMaterial,
          'width': '125'
        }, {
          field: 'supEnterpriseName',
          dataType: 'String',
          title: '建议供应商',
          editType: chooseSupplyDoc4Grid,
          width: '125'
        }, {
          'field': 'reqOrgName',
          'dataType': 'String',
          'title': '需求组织',
          'editType': chooseOrgDoc4Grid,
          'width': '125'
        }, {
          'field': 'planDeptName',
          'dataType': 'String',
          'title': '计划部门',
          'editType': 'string',
          'width': '125'
        }, {
          'field': 'note',
          'dataType': 'String',
          'title': '物料说明',
          'editType': 'string',
          'width': '300'
        }, {
          'field': 'planPersonName',
          'dataType': 'String',
          'title': '计划员',
          'editType': choosePerson(function (info) {
            let currentRow = bidtradedef.associations['bidtradeMaterialList'].datatable.getCurrentRow()
            currentRow.setValue('planPersonId', info.id)
            currentRow.setValue('planPersonName', info.personname)
            // currentRow.setValue('supEnterpriseName', supplier.name)
          }),
          'width': '125'
        }, {
          'field': 'reqTime',
          'dataType': 'String',
          'title': '需求时间',
          'editType': 'date',
          'sumCol': true,
          'width': '125'
        }, {
          'field': 'operation',
          'title': '操作',
          'dataType': 'action',
          'item': Operater(removeMeterial)
        }
      ]
    },
    templeteListCfg: {
      id: 'templete_grid',
      data: bidtradedef.associations.bidtradeTempleteList,
      type: 'grid',
      multiSelect: false,
      editable: true,
      canDrag: false,
      canSwap: false,
      columnMenu: false,
      fields: [
        {
          'field': 'priceUnit',
          'dataType': 'String',
          'title': '报价单元',
          'editType': 'string',
          'width': '150'
        }, {
          'field': 'isProduct',
          'dataType': 'checkbox',
          'title': '产品项',
          'renderType': 'booleanRender',
          'editType': 'string',
          'width': '125'
        }, {
          'field': 'totalAmount',
          'dataType': 'String',
          'title': '合计金额',
          'editType': 'string',
          'width': '150'
        }, {
          'field': 'discountRate',
          'dataType': 'String',
          'title': '折现率',
          'editType': 'string',
          'width': '150'
        }, {
          'field': 'memo',
          'dataType': 'String',
          'title': '备注',
          'editType': 'string'
        }, {
          'field': 'operation',
          'title': '操作',
          'dataType': 'action',
          'item': Operater(removeTemplete),
          'editable': false
        }
      ]
    },
    save: debounce(async function () {
      viewModel.model.setValue('bidType', 2)// 竞卖
      var data = await bidtradedef.save()
      if (data.status == '1') {
        uMessage('success', data.msg || '保存成功')
      } else {
        uMessage('fail', data.msg || '保存失败')
      }
      // if (data.status) {
      //   EventBus.emit('success', data.msg || '保存成功')
      //   // window.location.href = '../bidtradelist/index.' + __('locale') + '.html'
      // } else {
      //   let msg = (data.msg || '保存失败').replace(/<br>/g, '\n')
      //   EventBus.emit('fail', msg)
      // }
    }, 300, { maxWait: 2000 }),
    publish: debounce(async function () {
      var data = await bidtradedef.save(URLs.bt_publishBt.url)
      if (data.status == '1') {
        uMessage('success', data.msg || '发布成功')
      } else {
        uMessage('fail', data.msg || '发布失败')
      }
      // if (data.status) {
      //   EventBus.emit('success', data.msg || '发布成功')
      //   // window.location.href = '../bidtradelist/index.' + __('locale') + '.html'
      // } else {
      //   let msg = (data.msg || '发布失败').replace(/<br>/g, '\n')
      //   EventBus.emit('fail', msg)
      // }
    }, 300, { maxWait: 2000 }),
    model: bidtradedef.datatable,
    supplierModel: bidtradedef.associations.bidtradeSupplierList.datatable,
    addMaterial: addMaterial,
    addTemplete () {
      bidtradedef.associations['bidtradeTempleteList'].datatable.createEmptyRow()
    },
    chooseSupervisor: choosePersons(function (info) {
      var obj = []
      if (info) {
        info.forEach(function (one) {
          var returndata = {}
          returndata.supervisorId = one.id
          returndata.supervisorName = one.personname
          obj.push(returndata)
        })
      }
      viewModel.model.setValue('supervisors', obj)
      // viewModel.model.setValue('supervisorId', info.id)
      // viewModel.model.setValue('supervisorName', info.personname)
    }),
    chooseContact: choosePerson(function (info) {
      viewModel.model.setValue('contact', info.personname)
    }),
    chooseOrg
  }

  window.app = u.createApp({ el: 'body', model: viewModel })
}

(async function () {
  let addrData = await Get(URLs.deliverAddr.url, {})
  addrData.forEach((obj) => {
    let address = JSON.parse(obj.mapping[0].address)
    let fulladdress = obj.consignee.person_name + obj.consignee.mobile + address.area0.name + address.area1.name + address.area2.name + address.detail_address
    deliverAddrOpt.push({
      value: obj.id,
      name: fulladdress
    })
  })

  if (isNaN(bidtradeId)) {
    bidtradeId = 0
  }
  if (bidtradeId > 0) {
    bidtradedef.load({ id: bidtradeId })
  }
  if (reqids) {
    setTimeout(async function () {
      var {data} = await Get('/cpu-bidtrade/bidtrade/detail4req', {
        reqids: reqids
      })
      bidtradedef.setSimpleData(data)
      personM.load({
        userId: window.global.user.userId
      })

      personM.on('data', function (obj) {
        bidtradedef.setValue('contact', obj.personname)
      })
    })
  } else {
    // personM.load({
    //   userId: window.global.user.userId
    // })
    // personM.on('data', function (obj) {
    //   bidtradedef.setValue('contact', obj.personname)
    // })
  }

  init()
  setTimeout(function () {
    $('#supplier').click(function (event) {
      console.log('wl')
      chooseSupplyDoc()
      event.stopPropagation()
    })
  }, 0)
})()
