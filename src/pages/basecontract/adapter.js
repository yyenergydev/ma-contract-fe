// latest: zhangmyh 2017-3-30 2:38 PM

export default {
  material: {
    adapter: {
      materialClassId: 'classId',
      materialClassName: 'className',
      materialId: 'id',
      materialName: 'name',
      unit: 'measdoc'
    }
  },
  supplier: {
    idKey: 'supplierId',
    referIdKey: 'id',
    adapter: {
      supplierId: 'id',
      supEnterpriseId: 'supplyid',
      supplierName: 'name'
    }
  },
  supplier4grid: {
    adapter: {
      supEnterpriseId: 'id',
      supEnterpriseName: 'name'
    }
  },
  org: {
    textKey: 'purchaseEn',
    adapter: {
      purchaseEn: 'name'
    }
  },
  org4grid: {
    adapter: {
      reqOrgId: 'id',
      reqOrgName: 'name'
    }
  },
  contracttype: {
    idKey: 'contractTypeId',
    textKey: 'contactTypeName',
    adapter: {
      contractTypeId: 'id'
      contactTypeName: 'name'
    }
  }
}
