// edit: zhangmyh 2017-5-2 10:07 PM
/* global __ */

const urllist = {
  'btList': {
    title: __('bidmng_title'),
    url: 'bidtradelist'
  },
  'btSupList': {
    title: __('bidmng_title'),
    url: 'bidtradesuplist'
  },
  'editBt': {
    title: __('edit_title'),
    url: 'bidtradeeditor'
  },
  'btDetail': {
    title: __('edit_title'),
    url: 'bidtradedetail'
  },
  'btSupDetail': {
    title: '供应商竞价单',
    url: 'bidtradesupdetail'
  },
  'preQlf': {
    title: __('preqlf_title'),
    url: 'prequalification'
  },
  /* 'bidDetailed': { // 竞价清单
    title: __('bid_detailed'),
    url: 'bidlist'
  }, */
  'bdSetting': {
    title: '竞价设置',
    url: 'biddingSettings'
  },
  'applyBd': {
    title: '竞价报名',
    url: 'biddingApply'
  },
  'bidList': {
    title: '竞价清单',
    url: 'bidlist'
  },
  'bdMonitor': {
    title: '竞价监控大厅',
    url: 'biddingMonitor'
  },
  'bdHall': {
    title: '竞价大厅',
    url: 'biddingHall'
  },
  'bdmonitorIf': {
    title: '报价详情',
    url: 'bidmonitorInfo'
  },
  'bidmonitorHistory': {
    title: '历史报价详情',
    url: 'bidmonitorHistory'
  },
  'recommendSupplier': {
    title: '推荐供应商',
    url: 'recommendSupplier'
  },
  'contractList': {
    title: '合同管理',
    url: ''
  },
  'editBaseContract': {
    title: '标准合同',
    url: 'basecontract'
  },
  'contractsampletext': {
    title:'合同示范文本',
    url: 'contractsampletext'
  }
}

function getURL (url) {
  return `../${url}/index.${__('locale')}.html`
}

function getURLItem (items) {
  return items.map(function (item, i) {
    return {
      text: urllist[item].title,
      url: (i) ? getURL(urllist[item].url) : '',
      level: i
    }
  })
}

function breadcrumb (params) {
  let list
  // 倒序添加除主页以外的项
  switch (params.path) {
    case 'btList':
      list = ['btList']
      break
    case 'btSupList':
      list = ['btSupList']
      break
    case 'editBt':
      list = ['editBt', 'btList']
      break
    case 'btDetail':
      list = ['btDetail', 'btList']
      break
    case 'btSupDetail':
      list = ['btSupDetail', 'btSupList']
      break
    case 'bdSetting':
      list = ['bdSetting']
      break
    case 'bidList':
      list = ['bidList', 'btList']
      break
    case 'preQlf':
      list = ['preQlf', 'btSupList']
      break
    case 'applyBd':
      list = ['applyBd', 'preQlf', 'btList']
      break
    case 'bdList':
      list = ['bdList', 'btSupList']
      break
    case 'bdMonitor':
      list = ['bdMonitor', 'btList']
      break
    case 'bdHall':
      list = ['bdHall', 'btSupList']
      break
    case 'bdmonitorIf':
      list = ['bdmonitorIf', 'btList']
      break
    case 'bidmonitorHistory':
      list = ['bidmonitorHistory', 'bdmonitorIf', 'bdMonitor', 'btList']
      break
    case 'recommendSupplier':
      list = ['recommendSupplier', 'bidList', 'btList']
    /* case 'bidDetailed':
      list = ['bidDetailed', 'btList']
      break */
    case 'editBaseContract':
      list = ['editBaseContract', 'contractList']
      break
    case 'contractsampletext':
      list = ['contractsampletext', 'contractList']
      break
    default:
      break
  }
  this.titleList = getURLItem(list).reverse()
  // /pages/home/home
  this.home = '/yuncai/workbench#/pages/home/home'
  this.homeText = __('index')
}

export default breadcrumb
