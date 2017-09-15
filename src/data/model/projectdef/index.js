import {Model} from 'common'
import './detail'
Model.define('ycctrl.projectdef', {
  proxy: {
    get: '/cpu-project-def/ycctrl/projectdef/detail/:id',
    post: '/cpu-project-def/ycctrl/projectdef/detail'
  },
  meta: {
    enterpriseId: '',
    enterpriseName: '',
    extFields: '',
    failbidReason: '',
    failbidSegment: '',
    failbidTime: '',
    hasWorkFlows: '',
    id: '',
    modifier: '',
    openPassword: '',
    openTenderType: '',
    purOrgId: '',
    scoreMemo: '',
    signEndTime: '',
    signTimeEnd: '',
    sortItemMap: '',
    statusShow: '',
    // sugSupplierList: '',
    supervisePsnId: '',
    supervisePsnName: '',
    supplierBidList: '',
    sysVersion: '',
    talksEndTime: '',
    talksRound: '',
    talksTimeEnd: '',
    ts: '',
    bidEndTime: '',
    bidTimeEnd: '',
    createTime: {type: 'date'},
    modifiedtime: {type: 'date'},
    creator: '',
    taxInvoType: '',
    billcode: {
      // type: 'integer',
      required: true,
      nullMsg: '编号不能为空!',
      maxLength: 20,
      maxLengthMsg: '编号长度不大于20'
    },
    subject: {
      type: 'string',
      required: true,
      nullMsg: '标题不能为空!'
    },
    purOrgName: {
      type: 'string',
      required: true,
      nullMsg: '采购组织不能为空!'
    },
    purPsnId: '',
    purPsnName: {
      type: 'string',
      required: true,
      nullMsg: '采购负责人不能为空!'
    },
    purBudgetMny: {
      type: 'integer'
    },
    exceptStartTime: {type: 'date'},
    exceptEndTime: {type: 'date'},
    supplierMinNum: {
      type: 'string',
      required: true,
      nullMsg: '参与采购数量不能为空!',
      validType: 'integer'
    },
    purchaseType: {
      type: 'string',
      required: true,
      nullMsg: '采购方式不能为空!'
    },
    singleTenderReason: '',
    isCtrlOpen: '',
    ctrlOpenTime: {type: 'date'},
    hasSuperviseDept: '',
    isExpertReview: '',
    reviewMethodMode: '',
    reviewMethodScore: '',
    isPurUrgent: '',
    urgentReason: '',
    defProjectPsnId: '',
    defProjectPsnName: '',
    defProjectPsnTel: '',
    defProjectPsnEmail: '',
    rowStatus: '',
    status: '',
    statusName: '',
    psnCorpId: '',
    psnCorpName: '',
    psnDeptId: '',
    psnDeptName: '',
    statusNameShow: '',
    dr: ''
  },
  associations: {
    detailList: {
      type: 'hasMany', // hasMany
      model: 'ycctrl.detail'
    }
  }
})

export default Model.create('ycctrl.projectdef')
