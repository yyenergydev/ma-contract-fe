// latest: mahonggeng 2017-9-17 9:08 AM
/* global $ u */
import Collection from 'common/vo/collection'
import 'collection/contracttype'
import { Post } from 'common'
import { forEach } from 'lodash'

// let _config
function init (refer) {
  // 树形控件加载有误,所以需要每次都重新加载
  let trees = Collection.create('collection.contracttype')
  trees.load()
  let selectItem = {}
  let vm = {
    treemodel: trees.datatable,
    treeOption: {
      callback: {
        beforeClick: async function (id, obj) {
          if (!obj.flag) {
            let { result } = await Post('/ma-contract/contracttype/list', {
              //enterpriseId: enterpriseId,
              parentId: obj.id
            })
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
export default {
  init,
  template
}
