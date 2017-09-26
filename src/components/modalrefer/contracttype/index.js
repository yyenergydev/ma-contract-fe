// latest: zhangmyh 2017-3-17 9:08 AM
// 部门参照
/* global $ u */
import Collection from 'common/vo/collection'
import 'collection/contracttype'
import { Post } from 'common'
import { forEach } from 'lodash'

// let _config
function init (refer) {
  // 树形控件加载有误,所以需要每次都重新加载
  let trees = Collection.create('collection.contracttype')
  let enterpriseId = refer.options.enterpriseId || window.global.user.enterpriseId
  trees.load({ enterpriseId: enterpriseId })
  let selectItem = {}
  let vm = {
    treemodel: trees.datatable,
    treeOption: {
      /* check: {
        enable: true
      }, */
      callback: {
        /* onCheck: function () {
          console.log('zmy', arguments)
        }, */
        beforeClick: async function (id, obj) {
          if (!obj.flag) {
            let { result } = await Post('/ma-contract/contracttype/list', {
              //enterpriseId: enterpriseId,
              parentId: obj.id
            })
           /* _config.hasDepartment = true
            if (_config.hasDepartment) {
              trees.datatable.addSimpleData(result)
            } else {
              let newdata = []
              result.forEach(function (orginfo) {
                console.log('yusn', orginfo)
                if (parseInt(orginfo.orgType) >= 2) {
                  newdata.push(orginfo)
                }
              })
              trees.datatable.addSimpleData(newdata)
            } */
            /* let newdata = []
            result.forEach(function (orginfo) {
              //if (parseInt(orginfo.orgType) >= 2) {
                newdata.push(orginfo)
              //}
            }) */
            //trees.datatable.addSimpleData(result[0])
            obj.flag = true
          }
          selectItem = obj
        }
      }
    }
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
