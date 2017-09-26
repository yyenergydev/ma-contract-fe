import person from 'components/modalrefer/person'
import persons from 'components/modalrefer/persons'
import supplydoc from 'components/modalrefer/supplydoc'
import singlesupplydoc from 'components/modalrefer/singlesupplydoc'
import org from 'components/modalrefer/org'
import material from 'components/modalrefer/material'
import contracttype from 'components/modalrefer/contracttype'
/* global u */
function personrefer (option) {
  u.refer({
    isPOPMode: true,
    module: person,
    okId: 'okBtn',
    contentId: 'refer',
    width: '800px',
    title: '选择人员',
    onOk: option.onOk,
    enterpriseId: window.global.user.enterpriseId,
    onCancel: option.onCancel
  })
}
function personsrefer (option) {
  var personsObj = new persons()
  u.refer({
    isPOPMode: true,
    module: personsObj,
    okId: 'okBtn',
    contentId: 'refer',
    width: '800px',
    title: '选择人员',
    onOk: option.onOk,
    enterpriseId: window.global.user.enterpriseId,
    onCancel: option.onCancel
  })
}
function supplydocrefer (option) {
  u.refer({
    isPOPMode: true,
    module: supplydoc,
    okId: 'okBtn',
    contentId: 'refer',
    width: '800px',
    title: '选择供应商',
    onOk: option.onOk,
    enterpriseId: window.global.user.enterpriseId,
    onCancel: option.onCancel,
    defaultData: option.defaultData
  })
}
function singlesupplydocrefer (option) {
  u.refer({
    isPOPMode: true,
    module: singlesupplydoc,
    okId: 'okBtn',
    contentId: 'refer',
    width: '800px',
    title: '选择供应商',
    onOk: option.onOk,
    enterpriseId: window.global.user.enterpriseId,
    onCancel: option.onCancel
  })
}
function orgrefer (option) {
  u.refer({
    isPOPMode: true,
    module: org,
    okId: 'okBtn',
    contentId: 'refer',
    width: '800px',
    title: '选择组织',
    onOk: option.onOk,
    enterpriseId: window.global.user.enterpriseId,
    onCancel: option.onCancel
  })
}
function contracttyperefer (option) {
  u.refer({
    isPOPMode: true,
    module: contracttype,
    okId: 'okBtn',
    contentId: 'refer',
    width: '800px',
    title: '选择组织',
    onOk: option.onOk,
    onCancel: option.onCancel
  })
}

function materialrefer (option) {
  u.refer({
    isPOPMode: true,
    module: material,
    okId: 'okBtn',
    contentId: 'refer',
    width: '800px',
    title: '选择物料',
    onOk: option.onOk,
    enterpriseId: window.global.user.enterpriseId,
    onCancel: option.onCancel
  })
}
function eliminaterefer (option) {
  u.refer({
    isPOPMode: true,
    searchInput: null,
    contentId: option.contentId,
    okId: 'okBtn',
    cancelId: 'cancelBtn',
    width: '500px',
    height: null,
    module: option.module,
    title: option.title,
    onOk: option.onOk,
    onCancel: function () {}
  })
}
export {
  personrefer,
  supplydocrefer,
  singlesupplydocrefer,
  orgrefer,
  contracttyperefer,
  materialrefer,
  eliminaterefer, // 在这里添加refer参数
  personsrefer
}
