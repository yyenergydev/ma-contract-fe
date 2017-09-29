// latest: mahonggeng 2017-9-18 11:00 AM
/* eslint-disable */
import './index.less'
import ko from 'knockout'
import 'ko-epui/dist/ko-epui.css'
import 'ko-epui'
import 'components'
import { debounce } from 'lodash'
import { Post } from 'common'
//import contractdef from 'model/basecontract'
//import Adapter from './adapter'
// import Operater from './opt'
// import { personrefer, personsrefer } from 'components/modalrefer'
import chooseRefer from 'components/modalrefer/chooseRefer'
import contractdef from 'model/basecontract'
import uMessage from 'components/message'
//import {contracttyperefer} from 'components/modalrefer'
import commonrefer from './refer'

let contractId = window.global.query('id')
var viewModel

/*const chooseContracttype = chooseRefer('contracttype', 'component', {
  model: contractdef.datatable,
  adapter: {
    idKey: 'contractTypeId',
    textKey: 'contractTypeName',
    adapter: {
      contractTypeId: 'id',
      contractTypeName: 'name'
    }
  },
  onBeforeOK: function onBeforeOK(newdata,data){
    if(data.isParent){
      uMessage('fail', '请选择末级节点!')
      contractdef.datatable.getCurrentRow().setValue('contractTypeName', null)
      contractdef.datatable.getCurrentRow().setValue('contractTypeId', null)
      return false
    }else{
      return true
    }
  }
}, {
  repeatable: false,
  multiSelect: false
})*/

contractdef.datatable.on('isCommonText.valueChange', function (value) {
  if (value.newValue == 1) {
    $('#contractText').attr("readonly",false)
    $("#contractText_input").show()
  } else {
    $('#contractText').attr("readonly",true)
    
    $("#contractText_input").hide()
  }
})

function init () {
  contractdef.datatable.ref('billnum')('JackTest')
  viewModel = {
    id: ko.observable(contractId),
    billnum: ko.observable('JackTestnum'),
    /* callbackDatas: function (data) { // 上传附件会用到
      // techAttachList(data)
    }, */
    isCommonTextData: [{name: '是', value: 1}, {name: '否', value: 2}],
    isSystemContractData: [{name: '是', value: 1}, {name: '否', value: 2}],
    isAssetPlatformData: [{name: '是', value: 1}, {name: '否', value: 2}],
    moneyflowData: [{name: '收款', value: 1}, {name: '付款', value: 2}, {name: '无现金', value: 3}],
    settlementData: [{name: '现金', value: 1}, {name: '支票', value: 2}, {name: '银行转账', value: 3}, {name: '网银转账', value: 3}, {name: '银行汇票', value: 3}, {name: '商业汇票', value: 3}, {name: '托收付款', value: 3}],
    paytypeData: [{name: '预付款', value: 1}, {name: '进度款', value: 2}, {name: '进账款', value: 3}, {name: '结算款', value: '4'}],
    termUnitData: [{name: '年', value: 1}, {name: '月', value: 2}, {name: '日', value: 3}],
    save: debounce(async function () {

    }, 0),
    model: contractdef.datatable,
    showcontracttyperefer: commonrefer.showcontracttyperefer,
    showcontractText: commonrefer.showcontractText,//(contractdef.datatable.ref('contracttypeid')),
    showindustryType: commonrefer.showindustryType,
    showcurrency: commonrefer.showcurrency,
    showcontractOwn: commonrefer.showcontractOwn,
    showcontractOther: commonrefer.showcontractOther,
    showundertaker: commonrefer.showundertaker,
    showundertakedept: commonrefer.showundertakedept,

    contracttypeselect: function (msg) {
      alert(msg);
      console.log('select:' + msg)
    },
    tempsave: debounce(async function () {
      optionControl('tempsave',true)
      //var data = await contractdef.save()
      let data = await Post(contractdef.proxy.temppost, contractdef.getData())
      if (data.status == '1') {
        uMessage('success', data.msg || '暂存成功')
        optionControl('tempsave',false)
      } else {
        uMessage('fail', data.msg || '暂存失败')
        optionControl('tempsave',false)
      }
      contractdef.datatable.setSimpleData(data.data)
    }, 0),
    save: debounce(async function () {
      $('#saveId').attr('disabled', true)
      $('#saveId').removeClass('btn-primary')
      $('#savespan').attr('disabled', true)
      var data = await contractdef.save()

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
    showprocess: debounce(async function(){
      alert("攻城狮正在拼搏,敬请期待")
    },0),
    //chooseContracttype
  }
  window.app = window.u.createApp({el: 'body', model: viewModel})
}

function optionControl(className, flag){
  if(flag){
    $('#'+className).attr('disabled', true)
    $('#'+className).removeClass('btn-primary')
  }else{
    $('#'+className).removeAttr('disabled', true)
    $('#'+className).addClass('btn-primary')
  }
}



(async function () {
  init()
})()
/* eslint-disable */
