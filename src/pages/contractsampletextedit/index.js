// latest: mahonggeng 2017-09-22 13:31 AM
import './index.less'
import 'ko-epui/dist/ko-epui.css'
import 'ko-epui'
import 'components'
import {debounce} from 'lodash'
import Collection from 'common/vo/collection'
import 'collection/department'
import collection from 'collection/contractsampletext'
import contracttype from 'model/contracttype'
import contractsampletext from 'model/contractsampletext'
import {Get,Post,Delete} from 'common'
import chooseRefer from 'components/modalrefer/chooseRefer'
import uMessage from 'components/message'
/* eslint-disable */
/* global ko u $ __ */

let id = window.global.query('textid')
let inittypeid = window.global.query('typeid')
let initname = window.global.query('name')

var viewModel


function init () {
  viewModel = {
    model: contractsampletext.datatable,
    save: debounce(async function (data1) {
      let data = await contractsampletext.save()
      console.log(data)
      debugger
      if (data.status === 1) {
        uMessage('success', data.msg || '保存成功')
      } else {
        uMessage('fail', data.msg || '保存失败')
      }
    }, 0)
  }

  window.app = window.u.createApp({
    el: 'body',
    model: viewModel
  })
}

(async function () {
  setInitVal()
  //界面初始化赋值
  init()

  var ue = UE.getEditor('editor');
  ue.ready(function() {
    //ue.setContent(contractsampletext.datatable.getRow(0).getValue('contracttypeName'))
    ue.setContent(contractsampletext.datatable.getSimpleData()[0].contracttypeName)
  });

})()

function setInitVal(){
  if (isNaN(id)) {
    id = 0
  }
  
  if (id > 0) {
    contractsampletext.load({ id: id })
  } else {
    contractsampletext.datatable.ref('contracttypeId')(inittypeid)
    contractsampletext.datatable.ref('contracttypeName')(unescape(initname))
    console.log(contractsampletext.datatable.ref('contracttypeId'))
  }
}