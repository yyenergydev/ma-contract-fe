// latest: wangk2 2017-3-8 10:36 AM
import 'ko-epui/dist/ko-epui.css'
import 'ko-epui'
import 'components'
import 'common/utils'
// import { debounce } from 'lodash'
import { Get, URLs } from 'common'
import bidtradedef from 'model/bidtrade'
import './index.less'
import Operater from './opt'
/* global ko */
/* global u $ */

let bidtradeId = window.global.query('id')
let type = window.global.query('type') || false
let deliverAddrOpt = {}
var viewModel
function init () {
  viewModel = {
    id: ko.observable(''),
    title: ko.observable('供应商标题'),
    type: ko.observable(type),
    titleList: [
      '基础信息',
      '物料信息',
      '对供应商要求',
      '竞价设置',
      '报价模版',
      '发布渠道及联系方式'
    ],
    supBusiModeOpt: function (v) {
      if (!v) {
        return ''
      }
      var arr = v.split(',')
      const supBusiMode = {
        '1': '生产加工',
        '2': '经销批发',
        '3': '商业服务'
      }
      let text = arr.map(function (item) {
        return supBusiMode[item]
      })
      return text.join(',')
    },
    supCertReqOpt: function (v) {
      if (!v) {
        return ''
      }
      var arr = v.split(',')
      const supCertReq = {
        '1': '三证合一',
        '2': '组织机构代码',
        '3': '营业执照',
        '4': '税务登记证',
        '5': '其它证书'
      }
      let text = arr.map(function (item) {
        return supCertReq[item]
      })
      return text.join(',')
    },
    sign: function () {
      return window.location.href = '../biddingApply/index.zh_CN.html?tradeid=' + bidtradeId
    },
    supInvoiceOpt: function (v) {
      if (!v) {
        return ''
      }
      var arr = v.split(',')
      const supInvoice = {
        '1': '增值税专用发票',
        '2': '增值税普通发票',
        '3': '不用发票'
      }
      let text = arr.map(function (item) {
        return supInvoice[item]
      })
      return text.join(',')
    },
    bidTypeOpt: function (v) {
      if (!v) {
        return ''
      }
      const bidType = {
        '1': '竞买',
        '2': '竞卖'
      }
      return bidType[v]
    },
    bidProcessOpt: function (v) {
      if (!v) {
        return ''
      }
      var arr = v.split(',')
      const bidProcess = {
        '1': '公开最新价格',
        '2': '公开竞价公司名称',
        '3': '公开最新排名',
        '4': '内部公开竞价公司名称'
      }
      let text = arr.map(function (item) {
        return bidProcess[item]
      })
      return text.join(',')
    },
    preQualificationOpt: function (v) {
      if (!v) {
        return ''
      }
      const preQualification = {
        '1': '资格先审',
        '2': '资格后审'
      }
      return preQualification[v]
    },
    quoteModeOpt: function (v) {
      if (!v) {
        return ''
      }
      const quoteMode = {
        // '1': '总价报价',
        '2': '明细报价'
      }
      return quoteMode[v]
    },
    contactTypeOpt: function (v) {
      if (!v) {
        return ''
      }
      const contactType = {
        '1': '登录后可见',
        '2': '报价后可见',
        '3': '公开'
      }
      return contactType[v]
    },
    inquiryScopeOpt: function (v) {
      if (!v) {
        return ''
      }
      var arr = v.split(',')
      const inquiryScope = {
        '1': '云采平台',
        '2': '阿里1688',
      }
      let text = arr.map(function (item) {
        return inquiryScope[item]
      })
      return text.join(',')
    },
    inquiryTypeOpt: function (v) {
      if (!v) {
        return ''
      }
      var arr = v.split(',')
      const inquiryType = {
        '1': '广泛征集供应商报价（系统会为您匹配供应商，供应商也可以通过搜索找到您的询价单）',
        '2': '发布到我的采购门户（只有访问采购商门户的供应商才可以看到询价信息）',
        '3': '邀请指定供应商报价（只有被邀请的供应商可以看到询价信息）'
      }
      let text = arr.map(function (item) {
        return inquiryType[item]
      })
      return text.join(',')
    },
    deliverAddr: function (id) {
      return deliverAddrOpt[id]
    },
    materialListCfg: {
      id: 'material_grid',
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
    templeteListCfg: {
      id: 'templete_grid',
      data: bidtradedef.associations.bidtradeTempleteList,
      type: 'grid',
      multiSelect: false,
      editable: false,
      canDrag: false,
      canSwap: false,
      columnMenu: false,
      fields: [
        {
          'field': 'priceUnit',
          'dataType': 'String',
          'title': '报价单元',
          'width': '17%'
        }, {
          'field': 'isProduct',
          'dataType': 'checkbox',
          'title': '产品项',
          'renderType': 'boolean',
          'width': '17%',
        }, {
          'field': 'totalAmount',
          'dataType': 'String',
          'title': '合计金额',
          'width': '17%'
        }, {
          'field': 'discountRate',
          'dataType': 'String',
          'title': '折现率',
          'width': '17%'
        }, {
          'field': 'memo',
          'dataType': 'String',
          'title': '备注',
          'width': '17%'
        }, {
          'field': 'operation',
          'title': '操作',
          'dataType': 'action',
          'item': Operater()
        }
      ]
    },
    model: bidtradedef.datatable,
    supplierModel: bidtradedef.associations.bidtradeSupplierList.datatable
  }

  window.app = u.createApp({ el: 'body', model: viewModel })
}

(async function () {
  let addrData = await Get(URLs.deliverAddr.url, {})
  addrData.forEach((obj) => {
    let address = JSON.parse(obj.mapping[0].address)
    let fulladdress = obj.consignee.person_name + obj.consignee.mobile + address.area0.name + address.area1.name + address.area2.name + address.detail_address
    deliverAddrOpt[obj.id] = fulladdress
  })

  if (isNaN(bidtradeId)) {
    bidtradeId = 0
  }
  if (bidtradeId > 0) {
    bidtradedef.load({ id: bidtradeId })
  }
  bidtradedef.on('data', function (data) {
    if (data.quoteMode == 1) {
      $('#materialList').hide()
      $('#templete_list').show()
    } else {
      $('#templete_list').hide()
      $('#materialList').show()
    }
    if (type == 1) {
      $('#signId').removeAttr('style')
    }
  })
  init()
  // 使组件不可编辑
  // setTimeout(function () {
  //   const pageapp = window.app
  //   // radio
  //   pageapp.getComp('bidType').setEnable(false)
  //   pageapp.getComp('preQlf').setEnable(false)
  //   pageapp.getComp('qMode').setEnable(false)
  //   pageapp.getComp('conType').setEnable(false)

  //   // select
  //   pageapp.getComp('dlvAddr').setEnable(false)

  //   // checkbox
  //   pageapp.getComp('supBM').setEnable(false)
  //   pageapp.getComp('supCR').setEnable(false)
  //   pageapp.getComp('supIR').setEnable(false)
  //   pageapp.getComp('bidPc').setEnable(false)
  //   pageapp.getComp('iqSO').setEnable(false)
  //   pageapp.getComp('iqTO').setEnable(false)
  // }, 100)
})()
