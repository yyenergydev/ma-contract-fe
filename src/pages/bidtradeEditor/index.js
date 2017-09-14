// latest: zhangmyh 2017-5-2 11:00 AM
import './index.less'
import 'ko-epui/dist/ko-epui.css'
import 'ko-epui'
import 'components'
import { debounce, indexOf, map } from 'lodash'
import { Get, URLs } from 'common'
import bidtradedef from 'model/bidtrade'
import Adapter from './adapter'
import Operater from './opt'
import { personrefer, personsrefer } from 'components/modalrefer'
import chooseRefer from 'components/modalrefer/chooseRefer'
import personM from 'model/person'
import uMessage from 'components/message'
/* eslint-disable */
/* global ko u $ __ */

let bidtradeId = window.global.query('id')
let bidType = window.global.query('type')
var supervisors_ = []
let reqids = window.global.query('reqids')
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
const chooseDepartment = chooseRefer('department', 'cell', {
  model: bidtradedef,
  association: 'bidtradeMaterialList',
  adapter: Adapter.department4grid
}, {
  repeatable: false,
  multiSelect: false,
  hasDepartment: true
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

bidtradedef.datatable.on('quoteMode.valueChange', function (value) {
  if (value.newValue == 1) {
    $('#materialList').hide()
    $('#templete_list').show()
  } else {
    $('#templete_list').hide()
    $('#materialList').show()
  }
})
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
  // if (true) {
  //  supervisors_ = [
  //     {'supervisorId': 12,'supervisorName':'李游民'},
  //     {'supervisorId': 15,'supervisorName':'上官安安'}
  //   ]
  // }

  viewModel = {
    id: ko.observable(bidtradeId),
    supplier: ko.observable(false),
    title: ko.observable('供应商标题'),
    byamount: ko.observable(true),
    isCtrlOpen: ko.observable(0),
    supervisors_: ko.observableArray(supervisors_),
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
    // bidTypeOpt: [
    //   {
    //     value: '1',
    //     name: '竞买'
    //   }, {
    //     value: '2',
    //     name: '竞卖'
    //   }
    // ],
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
      // {
      //   value: '1',
      //   name: '总价报价'
      // },
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
          'width': '100'
        }, {
          'field': 'materialName',
          'dataType': 'String',
          'title': '物料名称',
          'editType': addMaterial,
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
          'editType': addMaterial,
          'width': '80'
        }, {
          field: 'supEnterpriseName',
          dataType: 'String',
          title: '建议供应商',
          editType: chooseSupplyDoc4Grid,
          width: '120'
        }, {
          'field': 'reqOrgName',
          'dataType': 'String',
          'title': '需求组织',
          'editType': chooseOrgDoc4Grid,
          'width': '100'
        }, {
          'field': 'planPersonName',
          'dataType': 'String',
          'title': '计划员',
          'editType': choosePerson(function (info) {
            let currentRow = bidtradedef.associations['bidtradeMaterialList'].datatable.getCurrentRow()
            currentRow.setValue('planPersonId', info.id)
            currentRow.setValue('planPersonName', info.personname)
            currentRow.setValue('planDeptName', info.organizationname)
            currentRow.setValue('planDeptId', info.organizationid)
            // currentRow.setValue('supEnterpriseName', supplier.name)
          }),
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
        }, {
          'field': 'operation',
          'title': '操作',
          'dataType': 'action',
          'item': Operater(removeMeterial)
        }
      ]
    },
    materialListCfg1: {
      id: 'material_grid1',
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
          'editType': 'string',
          'width': '100',
          editable: false,
        }, {
          'field': 'materialName',
          'dataType': 'String',
          'title': '物料名称',
          'editType': 'string',
          'renderType': 'timeRender',
          'sortable': true,
          'width': '100',
          editable: false,
        }, {
          'field': 'num',
          'dataType': 'String',
          'title': '数量',
          'editType': 'float',
          editable: false,
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
          'editType': 'string',
          'width': '80',
          'editable': false,
        }, {
          field: 'supEnterpriseName',
          dataType: 'String',
          title: '建议供应商',
          editType: 'string',
          width: '120',
          editable: false,
        }, {
          'field': 'reqOrgName',
          'dataType': 'String',
          'title': '需求组织',
          'editType': 'string',
          'width': '100',
          editable: false,
        }, {
          'field': 'planPersonName',
          'dataType': 'String',
          'title': '计划员',
          'editType': 'string',
          'width': '100',
          editable: false,
        }, {
          'field': 'planDeptName',
          'dataType': 'String',
          'title': '计划部门',
          'editType': 'string',
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
          'width': '100',
          editable: false,
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
    callbackDatas: function (data) {
      techAttachList(data)
    },
    save: debounce(async function () {
      // 竞买
      viewModel.model.setValue('bidType', bidType)
      // viewModel.model.setValue('supervisors', JSON.stringify(viewModel.model.getValue('supervisors')))
      $('#saveId').attr('disabled', true)
      $('#saveId').removeClass('btn-primary')
      $('#savespan').attr('disabled', true)
      var data = await bidtradedef.save()

      if (data.status == '1') {
        uMessage('success', data.msg || '保存成功')
        $('#saveId').removeAttr('disabled', true)
        $('#saveId').addClass('btn-primary')
        $('#savespan').removeAttr('disabled', true)
      } else {
        uMessage('fail', data.msg || '保存失败')
        $('#saveId').removeAttr('disabled', true)
        $('#saveId').addClass('btn-primary')
        $('#savespan').removeAttr('disabled', true)
      }
    }, 0),
    publish: debounce(async function () {
      if (bidtradedef.associations.bidtradeMaterialList.datatable.getAllRows() <= 0) {
        uMessage('fail', '请添加物料')
        return
      }
      viewModel.model.setValue('bidType', bidType)// 竞买
      var data = await bidtradedef.save(URLs.bt_publishBt.url)
      if (data.status == '1') {
        // uMessage('success', data.msg || '发布成功')
        window.location.href = '../bidtradelist/index.' + __('locale') + '.html'
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
      var ids = []
      var lastText = ''
      var nameText = ''
      if (info) {
        info.forEach(function (one) {
          var returndata = {}
          returndata.supervisorId = one.id.value
          returndata.supervisorName = one.personname
          var text = one.id.value + ':' + one.personname
          lastText += text + ','
          nameText += one.personname + ' '
          ids.push(one.id.value)
          obj.push(returndata)
        })
      }
      supervisors_ = obj
      viewModel.model.setValue('supervisors_', obj)
      viewModel.model.setValue('supervisors', JSON.stringify(obj))
      viewModel.model.setValue('supervisorName', nameText)
      viewModel.model.setValue('supervisorId', lastText)
    }),
    chooseContact: choosePerson(function (info) {
      viewModel.model.setValue('contact', info.personname)
    }),
    chooseOrg
  }

  window.app = u.createApp({ el: 'body', model: viewModel })
}

(async function () {
  if (isNaN(bidtradeId)) {
    bidtradeId = 0
  }
  var datatemp
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

  // 编辑竞价单
  if (bidtradeId > 0) {
    let data1 = await Get('/cpu-bidtrade/bidtrade/getBidTradebyIdforsup', { id: bidtradeId })
    map(data1.data, function (n, key) {
      if (key == 'supervisorId') {
        if (n) {
          let str = n.split(',')
          for (var p in str) {
            let result = {}
            if (str[p]) {
              let resultArray = str[p].split(':')
              result.supervisorId = resultArray[0]
              result.supervisorName = resultArray[1]
              supervisors_.push(result)
            }
          }
        }
      }
    })
    bidtradedef.load({ id: bidtradeId })
    bidtradedef.on('data', function (data) {
      viewModel.inquiryTypeVis(true)
    })
  } else {
    // 新建竞价单、获取初始化竞价单赋值
    var {data} = await Get('/cpu-bidtrade/bidtrade/getBidInfo')
    datatemp={data}
    window.bidtradedef = bidtradedef
    bidtradedef.datatable.ref('contact')(data.contact)
    bidtradedef.datatable.ref('tel')(data.tel)
    bidtradedef.datatable.ref('email')(data.email)
    bidtradedef.datatable.ref('purchaseEn')(data.purchaseEn)
    bidtradedef.datatable.ref('bidType')(bidType)
  }
 
  if(datatemp){
    window.bidtradedef = bidtradedef
    bidtradedef.datatable.ref('contact')(data.contact)
    bidtradedef.datatable.ref('tel')(data.tel)
    bidtradedef.datatable.ref('email')(data.email)
    bidtradedef.datatable.ref('purchaseEn')(data.purchaseEn)
    bidtradedef.datatable.ref('bidType')(bidType)
  }
 
  init()
  setTimeout(function () {
    $('#supplier').click(function (event) {
      chooseSupplyDoc()
      event.stopPropagation()
    })
  }, 0)
})()
/* eslint-disable */
