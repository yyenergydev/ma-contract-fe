// latest: mahonggeng 2017-9-28 9:08 AM
/* global $ u */
import Collection from 'common/vo/collection'
import collection from 'collection/contractsampletext'
import { Post,Get } from 'common'
import { forEach } from 'lodash'

// let _config
function init (refer) {
  //let enterpriseId = refer.options.enterpriseId || window.global.user.enterpriseId
  let contracttypeid = refer.options.contracttypeid
  collection.load({ id: contracttypeid })
  /* var loaddata = async function() {
    let data = await Get(collection.proxy.get,{ id: contracttypeid })
    console.log(data)
    collection.datatable.setSimpleData(data.data)
    alert(JSON.stringify(data.data));
  }
  loaddata(); */
  let selectItem = {}
  let vm = {
    config: {
      'id': 'gridcontracttype',
      'data': collection,
      'type': 'grid',
      'multiSelect': false,
      'showNumCol': true,
      'editable': false,
      pagination: true,
      fields: [{
        'field': 'contracttypeId',
        'dataType': 'integer',
        'title': '合同类型',
        'width': '0',
        'visible': false
      },{
        'field': 'contracttypeName',
        'dataType': 'string',
        'title': '合同类型',
        'width': '20%'
      }, {
        'field': 'code',
        'dataType': 'string',
        'title': '示范文本编码',
        'width': '20%'
      }, {
        'field': 'name',
        'dataType': 'string',
        'title': '示范文本名称',
        'width': '20%'
      }, {
        'field': 'version',
        'dataType': 'float',
        'title': '版本号',
        'width': '20%'
      }],
      onRowFocus: function (data){
        selectItem = data.rowObj.value
      }
    },
  }
  let app = u.createApp()
  app.init(vm, $('#refer_org')[0])

  refer.registerSubmitFunc(function () {
    return selectItem
  })
}
let template = require('./index.html')
/* export default function (config) {
  _config = Object.assign({
    hasDepartment: true,
    multiSelect: false
  }, config)

  return {
    init,
    template
  }
}
*/
export default {
  init,
  template
}
