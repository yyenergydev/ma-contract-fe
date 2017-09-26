import contracttype from 'components/modalrefer/contracttype'
import contractdef from 'model/basecontract'
import uMessage from 'components/message'

function commonrefer (option) {
  u.refer({
    isPOPMode: true,
    module: option.model,
    okId: 'okBtn',
    contentId: 'refer',
    width: '800px',
    enterpriseId: 11,
    title: option.title,
    onOk: option.onOk,
    onCancel: option.onCancel
  })
}

function referVal(msg, name, id){
  if(!msg.isParent){
    contractdef.datatable.getCurrentRow().setValue(name, msg.name)
    contractdef.datatable.getCurrentRow().setValue(id, msg.id)
  }else{
    uMessage('fail', '请选择末级节点!')
    contractdef.datatable.getCurrentRow().setValue(name, null)
    contractdef.datatable.getCurrentRow().setValue(id, null)
  }
}

function showcontracttyperefer() {
  commonrefer({
    onOk: function onOk (msg) {
      referVal(msg, 'contractTypeName', 'contractTypeId')
    },
    onCancel: function onCancel () {

    },
    title: '选择合同类型',
    model: contracttype
  })
}
function showindustryType(){
  commonrefer({
    onOk: function onOk (msg) {
      referVal(msg, 'industryType', 'industryTypeId')
    },
    onCancel: function onCancel () {

    },
    title: '选择行业类别',
    model: contracttype
  })
}

function showcurrency() {
  commonrefer({
    onOk: function onOk (msg) {
      referVal(msg, 'currencyName', 'currencyId')
    },
    onCancel: function onCancel () {

    },
    title: '选择币种',
    model: contracttype
  })
}
function showcontractOwn() {
  commonrefer({
    onOk: function onOk (msg) {
      referVal(msg, 'contractOwn', 'contractOwnId')
    },
    onCancel: function onCancel () {

    },
    title: '选择合同我方',
    model: contracttype
  })
}
function showcontractOther() {
  commonrefer({
    onOk: function onOk (msg) {
      referVal(msg, 'contractOther', 'contractOtherId')
    },
    onCancel: function onCancel () {

    },
    title: '选择合同对方',
    model: contracttype
  })
}
function showundertaker() {
  commonrefer({
    onOk: function onOk (msg) {
      referVal(msg, 'undertaker', 'undertakerId')
    },
    onCancel: function onCancel () {

    },
    title: '选择承办人',
    model: contracttype
  })
}

function showundertakedept() {
  commonrefer({
    onOk: function onOk (msg) {
      referVal(msg, 'undertakedept', 'undertakedeptId')
    },
    onCancel: function onCancel () {

    },
    title: '选择承办部门',
    model: contracttype
  })
}

export default {
  showcontracttyperefer,
  showindustryType,
  showcurrency,
  showcontractOwn,
  showcontractOther,
  showundertaker,
  showundertakedept
}
