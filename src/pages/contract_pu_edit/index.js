// latest: tangh 2017-09-13 13:31 AM
import './index.less'
import 'ko-epui/dist/ko-epui.css'
import 'ko-epui'
import 'components'
import {debounce} from 'lodash'
// import Collection from 'common/vo/collection'
import 'collection/department'
import 'collection/contract_pu'
import ctpu from 'model/contract_pu'
// import {Post} from 'common/Ajax'
// import Adapter from './adapter'
// import chooseRefer from 'components/modalrefer/chooseRefer'
import uMessage from 'components/message'
import { personrefer } from 'components/modalrefer'
import {getStore} from 'common/combobox'
/* eslint-disable */
/* global ko u $ __ */

// let typeId = window.global.query('id')
var viewModel

// const chooseOrg = chooseRefer('org', 'component', {
//   model: ctpu.datatable,
//   adapter: Adapter.org
// }, {
//   repeatable: false,
//   multiSelect: false
// })
ctpu.datatable.on('isCommonText.valueChange', function (value) {
  if (value.newValue == 1) {
    $('#contractText').show()
  } else {
    $('#contractText').hide()
  }
})

function init () {
  // let collection = Collection.create('collection.contracttype')
  // let tree = Collection.create('collection.contracttype')
  // tree.load({pageIndex: 0, parentid: 0})//加载合同类型树根节点

  viewModel = {
    titleList: [
      '标准信息',
      '业务信息',
      '合同基本条款'
    ],
    comboData1: getStore('yesorno'),
    comboData2: getStore('mnyflow'),
    comboData3: getStore('settlement'),
    comboData4: getStore('ymd'),
    comboData5: getStore('paytype'),
    comboData6: getStore('status'),
    ctputerms: {
      id: 'terms_grid',
      data: ctpu.associations.terms,
      type: 'grid',
      multiSelect: false,
      editable: true,
      canDrag: false,
      canSwap: false,
      columnMenu: false,
      fields: [
        {
          'field': 'materialCode',
          'dataType': 'String',
          'title': '物料编码',
          'editType': 'string',
          'renderType': 'timeRender',
          'sortable': true,
          'width': '120',
          'editable': false
        }, {
          'field': 'materialName',
          'dataType': 'String',
          'title': '物料名称',
          'editType': 'string',
          'renderType': 'timeRender',
          'sortable': true,
          'width': '200',
          'editable': false
        }, {
          'field': 'materialClassCode',
          'dataType': 'String',
          'title': '物料分类编码',
          'editType': 'string',
          'sortable': true,
          'width': '120',
          'editable': false
        }, {
          'field': 'materialClassName',
          'dataType': 'String',
          'title': '物料分类名称',
          'editType': 'string',
          'renderType': 'timeRender',
          'sortable': true,
          'width': '200',
          'editable': false
        }, {
          'field': 'projectname',
          'dataType': 'String',
          'title': '项目',
          'editType': 'string',
          'width': '200',
          'editable': false
        }, {
          'field': 'projectcode',
          'dataType': 'String',
          'title': '项目编码',
          'editType': 'string',
          'width': '100',
          'editable': false
        }, {
          'field': 'engineercode',
          'dataType': 'String',
          'title': '工程编码',
          'editType': 'string',
          'width': '100',
          'editable': false
        }, {
          'field': 'engineerregno',
          'dataType': 'String',
          'title': '工程登记号',
          'editType': 'string',
          'width': '120',
          'editable': false
        }, {
          'field': 'erpcode',
          'dataType': 'String',
          'title': 'ERP定义号',
          'editType': 'string',
          'width': '100',
          'editable': false
        }, {
          'field': 'projectnameshort',
          'dataType': 'String',
          'title': '项目简称',
          'editType': 'string',
          'width': '100',
          'editable': false
        }, {
          'field': 'castunitid',
          'dataType': 'String',
          'title': '单位',
          'editType': 'string',
          'width': '80',
          'editable': false
        }, {
          'field': 'nastnum',
          'dataType': 'String',
          'title': '数量',
          'editType': 'float',
          'editOptions': {
            'validType': 'float',
            'precision': '0',
            'max': 10000
          },
          'sumCol': true,
          'width': '80',
          'editable': false
        }, {
          'field': 'converate',
          'dataType': 'String',
          'title': '换算率',
          'editType': 'string',
          'width': '100',
          'editable': false
        }, {
          'field': 'cunitid',
          'dataType': 'String',
          'title': '主单位',
          'editType': 'string',
          'width': '80',
          'editable': false
        }, {
          'field': 'nnum',
          'dataType': 'String',
          'title': '主数量',
          'editType': 'float',
          'editOptions': {
            'validType': 'float',
            'precision': '0',
            'max': 10000
          },
          'sumCol': true,
          'width': '80',
          'editable': false
        }, {
          'field': 'nqtorigprice',
          'dataType': 'String',
          'title': '无税单价',
          'editType': 'string',
          'width': '100',
          'editable': false
        }, {
          'field': 'nqtorigtaxprice',
          'dataType': 'String',
          'title': '含税单价',
          'editType': 'string',
          'width': '100',
          'editable': false
        }, {
          'field': 'ngprice',
          'dataType': 'String',
          'title': '主本币无税单价',
          'editType': 'string',
          'width': '120',
          'editable': false
        }, {
          'field': 'ngtaxprice',
          'dataType': 'String',
          'title': '主本币含税单价',
          'editType': 'string',
          'width': '120',
          'editable': false
        }, {
          'field': 'norigmny',
          'dataType': 'String',
          'title': '无税金额',
          'editType': 'string',
          'width': '100',
          'editable': false
        }, {
          'field': 'ntaxrate',
          'dataType': 'String',
          'title': '税率',
          'editType': 'string',
          'width': '60',
          'editable': false
        }, {
          'field': 'ftaxtypeflag',
          'dataType': 'String',
          'title': '扣税类别',
          'editType': 'string',
          'width': '100',
          'editable': false
        }, {
          'field': 'pricesum',
          'dataType': 'String',
          'title': '价稅合计',
          'editType': 'string',
          'width': '100',
          'editable': false
        }, {
          'field': 'nmny',
          'dataType': 'String',
          'title': '本币无税金额',
          'editType': 'string',
          'width': '120',
          'editable': false
        }, {
          'field': 'npricesum',
          'dataType': 'String',
          'title': '本币价稅合计',
          'editType': 'string',
          'width': '120',
          'editable': false
        }, {
          'field': 'ctaxcodeid',
          'dataType': 'String',
          'title': '税码',
          'editType': 'string',
          'width': '100',
          'editable': false
        }, {
          'field': 'nnosubtaxrate',
          'dataType': 'String',
          'title': '不可抵扣税率',
          'editType': 'string',
          'width': '120',
          'editable': false
        }, {
          'field': 'ncalcostmny',
          'dataType': 'String',
          'title': '计成本金额',
          'editType': 'string',
          'width': '120',
          'editable': false
        }, {
          'field': 'nordnum',
          'dataType': 'String',
          'title': '累计订单主数量',
          'editType': 'string',
          'width': '200',
          'editable': false
        }, {
          'field': 'nordpricesum',
          'dataType': 'String',
          'title': '累计订单价稅合计',
          'editType': 'string',
          'width': '200',
          'editable': false
        }
      ]
    },
    model: ctpu.datatable,
    callbackDatas: function (data) {
      techAttachList(data)
    },
    tmpSave,
    save: debounce(async function () {
      //保存校验
      if (valid()) {
        var data = await ctpu.save()
        if (data.status == '1') {
          uMessage('success', data.msg || '保存成功')
        } else {
          uMessage('fail', data.msg || '保存失败')
        }
      }
    }, 0),
    flow,
    chooseContrTpl: choosePerson(function (info) {
      console.log(info)
      viewModel.model.setValue('projectid', info.id)
      viewModel.model.setValue('projectid', info.personname)
    })
  }
  window.app = window.u.createApp({
    el: 'body',
    model: viewModel
  })
}

function tmpSave () {
  uMessage('warning', '功能开发...')
}

function flow () {
  uMessage('warning', '功能开发...')
}

function setDefault () {
  // ctpu.datatable.ref('isCommonText')(2)
  // ctpu.datatable.ref('isSystemContract')(1)
  // var comboboxAObject = window.app.getComp('status');
  // comboboxAObject.setEnable(false);
}

function valid () {
  // var inputTypeCode = viewModel.model.getValue('code')
  // if (inputTypeCode != null) {
  //   if (inputTypeCode.length != 5) {
  //     uMessage('warning', '请输入5位长度合同类型编码，如A0000！')
  //     return false
  //   }
  // }
  return true
}

function choosePerson (callback) {
  return function () {
    personrefer({
      onOk: callback,
      onCancel: doNothing
    })
  }
}

function doNothing () {}

(async function () {
  //界面初始化赋值
  setDefault()

  init()
})()
/* eslint-disable */
