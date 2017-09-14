// latest: zhangmyh 2017-2-13 5:01 PM
import { map } from 'lodash'

export default {
  convert2material: function (modals) {
    return map(modals, function (modal) {
      return {
        // enterpriseId    :"",
        // enterpriseName    :"",
        // id: "",
        materialClassId: modal.classId,
        materialClassName: modal.className,
        materialId: modal.id,
        materialName: modal.name,
        // num: "",
        // reqOrgId: "",
        // reqOrgName: "",
        // reqTime: "",
        // sysVersion:"",
        // unitid:""
        unit: modal.measdoc
      }
    })
  }
}
