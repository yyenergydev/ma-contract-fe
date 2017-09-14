// edit: zhangmyh 2017-5-2 11:26 PM
import { Get, URLs } from 'common'
/* global $ */

export default function deliveraddress (params) {
  let addrList = []
  this.model = params.model
  this.dataSource = addrList

  // 获取地址下拉数据
  const getAddrs = async function () {
    let addrData = await Get(URLs.deliverAddr.url, {})
    addrList = []
    addrData.forEach((obj) => {
      let address = JSON.parse(obj.mapping[0].address)
      let fulladdress = obj.consignee.person_name + obj.consignee.mobile + address.area0.name + address.area1.name + address.area2.name + address.detail_address
      addrList.push({
        value: obj.id,
        name: fulladdress
      })
    })

    const _setComboData = function () {
      const ele = $('u-select>div')
      if (ele.length <= 0 || !ele[0]['u.Combo']) {
        setTimeout(function () {
          _setComboData()
        }, 150)
      } else {
        ele[0]['u.Combo'].setComboData(addrList)
      }
    }
    _setComboData()
  }

  getAddrs()
}
