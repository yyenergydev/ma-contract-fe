// latest: wangk2 2017-2-21 06:35 PM
import {Model} from 'common'
Model.define('ycctrl.bidingApplydetail', {
  meta: {
    'bidtradeID': '', //  竞价单ID
    'enterpriseName': '', // 报名企业
    'enterpriseAddress': '', // 企业地址  string
    'enterpriseId': '', //    number
    'enterpriseMainScope': '', // 企业经营范围  string  @mock=石灰石,熟料、水泥
    'id': '', //    number
    'signtime': {type: 'date'}, //  报名时间  string
    'state': '', // 状态（0：保存，1：已报名）  number
    'supplierID': '', //  供应商id number
    'statusNameShow': '',
    'createTime': {type: 'date'},
    'creator': '',
    'dr': '',
    'sysVersion': '', //
    'title': '',  // 竞价单标题 string
    'ts': '', //  @mock=1484841600000
    'billstatus': ''
  }
})
