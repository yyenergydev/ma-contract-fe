module.exports = {
  bt_commitBt: {
    type: 'set',
    method: 'post',
    url: '/cpu-bidtrade/commitBidtrade'
  },
  bt_publishBt: {
    type: 'set',
    method: 'post',
    url: '/cpu-bidtrade/bidtrade/publishBidtrade'
  },
  bt_publishMulBt: {
    type: 'set',
    method: 'post',
    url: '/cpu-bidtrade/bidtrade/releaseBidtrade'
  },
  deliverAddr: {
    type: 'get',
    method: 'get',
    url: '/mall-basedoc/deliveraddress'
  },
  bt_statByStatus: {
    type: 'get',
    method: 'get',
    url: '/cpu-bidtrade/bidtrade/statistic'
  },
  bt_supStatByStatus: {
    type: 'get',
    method: 'get',
    url: '/cpu-bidtrade/bidtrade/statisticForSup'
  },
  bt_refuseReg: {
    type: 'set',
    method: 'post',
    url: '/cpu-bidtrade/bidtradeRegister/refuse'
  },
  bt_removeBt: {
    type: 'set',
    method: 'post',
    url: '/cpu-bidtrade/bidtrade/deleteBidtrade'
  }
}
