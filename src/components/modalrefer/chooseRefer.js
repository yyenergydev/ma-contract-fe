// latest: zhangmyh 2017-3-30 2:23 PM
/* global $ u */
import { findIndex, forEach, map } from 'lodash'
import supplier from './supplier'
import org from './org'
import material from './material'
import contracttype from './contracttype'

const referList = {
  supplier: {
    module: supplier,
    title: '选择供应商'
  },
  org: {
    module: org,
    title: '选择组织'
  },
  material: {
    module: material,
    title: '选择物料'
  },
  contracttype: {
    module: contracttype,
    title: '选择合同类型'
  }
}

function adapter (v, conf, from = 'page') {
  if (conf.adapter && conf.adapter.adapter) {
    let d = {}
    forEach(conf.adapter.adapter, function (r, a) {
      if (from == 'page') {
        d[a] = v[r]
      } else {
        d[r] = v[a]
      }
    })
    return d
  }
  return v
}

function getRefer (config) {
  if (typeof config.module == 'function') {
    config.module = config.module(config.args)
  }

  u.refer(Object.assign({
    isPOPMode: true,
    okId: 'okBtn',
    contentId: 'refer',
    width: '800px',
    title: '',
    // enterpriseId: window.global.user.enterpriseId,
    enterpriseId: 11,
    onCancel () {}
  }, config))
}

function value4Com (config, referArgs) {
  return function (data) {
    if (!referArgs.multiSelect) {
      let newdata = adapter(data, config)
      if (config.onBeforeOK && typeof config.onBeforeOK == 'function') {
        if (!config.onBeforeOK(newdata, data)) {
          return false
        }
      }
      if (config.adapter && config.adapter.textKey) {
        config.model.setValue(config.adapter.textKey, newdata[config.adapter.textKey])
      }
      if (config.adapter && config.adapter.idKey) {
        config.model.setValue(config.adapter.idKey, newdata[config.adapter.idKey])
      }
      if (config.onAfterOK && typeof config.onAfterOK == 'function') {
        config.onAfterOK(newdata)
      }
      return true
    }
  }
}

function value4Grids (config, referArgs, model) {
  return function (data) {
    if (!config.association) {
      return
    }

    if (referArgs.multiSelect) {
      // 多选
      let newRows = []
      if (referArgs && !referArgs.repeatable) {
        const listkey = (config.adapter && config.adapter.idKey) ? config.adapter.idKey : 'id'
        const referkey = (config.adapter && config.adapter.referIdKey) ? config.adapter.referIdKey : 'id'

        let rows = model.getAllRows()
        let existData = rows.map(function (row) {
          return {
            id: row.getValue(listkey),
            rowId: row.rowId,
            dt: true
          }
        })
        data.forEach(function (item) {
          let idx = findIndex(existData, ['id', item[referkey]])
          if (idx < 0) {
            let newdata = adapter(item, config)
            newRows.push(newdata)
          } else {
            existData[idx].dt = false
          }
        })
        if (config.onBeforeOK && typeof config.onBeforeOK == 'function') {
          if (!config.onBeforeOK(newRows)) {
            return false
          }
        }
        existData = existData.reverse()
        existData.forEach(function (o, i) {
          if (o.dt) {
            model.removeRowByRowId(o.rowId)
          }
        })
        model.addSimpleData(newRows)
        if (config.onAfterOK && typeof config.onAfterOK == 'function') {
          config.onAfterOK(newRows)
        }
      } else {
        data.forEach(function (item) {
          let newdata = adapter(item, config)
          newRows.push(newdata)
        })
        if (config.onBeforeOK && typeof config.onBeforeOK == 'function') {
          if (!config.onBeforeOK(newRows)) {
            return false
          }
        }
        model.addSimpleData(newRows)
        if (config.onAfterOK && typeof config.onAfterOK == 'function') {
          config.onAfterOK(newRows)
        }
      }
    } else {
      // 单选
      let newdata
      if (referArgs && referArgs.repeatable) {
        newdata = adapter(data, config)
        model.addSimpleData(newdata)
      } else {
        const listkey = (config.adapter && config.adapter.idKey) ? config.adapter.idKey : 'id'
        const referkey = (config.adapter && config.adapter.referIdKey) ? config.adapter.referIdKey : 'id'
        let rows = model.getAllRows()

        let existData = rows.map(function (row) {
          return row.getValue(listkey)
        })
        if ($.inArray(data[referkey], existData) < 0) {
          newdata = adapter(data, config)

          if (config.onBeforeOK && typeof config.onBeforeOK == 'function') {
            if (!config.onBeforeOK(newdata)) {
              return false
            }
          }
          model.addSimpleData(newdata)
          if (config.onAfterOK && typeof config.onAfterOK == 'function') {
            config.onAfterOK(newdata)
          }
        }
      }
    }
    return true
  }
}

function value4Grid (config, referArgs) {
  return value4Grids(config, referArgs, config.model)
}

function value4Asso (config, referArgs) {
  return value4Grids(config, referArgs, config.model.associations[config.association].datatable)
}

function value4Cell (config, referArgs) {
  return function (data) {
    let currentRow = config.model.associations[config.association].datatable.getCurrentRow()
    let newdata = adapter(data, config)
    if (config.onBeforeOK && typeof config.onBeforeOK == 'function') {
      if (!config.onBeforeOK(newdata)) {
        return false
      }
    }
    map(newdata, function (v, k) {
      currentRow.setValue(k, v)
    })
    if (config.onAfterOK && typeof config.onAfterOK == 'function') {
      config.onAfterOK(newdata)
    }
    return true
  }
}

function value4Normal (config, referArgs) {
  return function (data) {
    let newdata = adapter(data, config)

    if (config.onBeforeOK && typeof config.onBeforeOK == 'function') {
      if (!config.onBeforeOK(newdata)) {
        return false
      }
    }
    if (config.onOK && typeof config.onOK == 'function') {
      config.onOK(newdata)
    }
    if (config.onAfterOK && typeof config.onAfterOK == 'function') {
      return config.onAfterOK(newdata)
    }
    return true
  }
}

export default function (referType, targetType, config, referArgs = {}) {
  referType = referType.toLowerCase()
  targetType = targetType.toLowerCase()
  let module = referList[referType]
  return function (obj) {
    if (config.add2Args) {
      referArgs = Object.assign(referArgs, config.add2Args(obj))
    }
    let defaultData = function () {
      return []
    }
    if (config.defaultData) {
      defaultData = config.defaultData
    } else if (targetType == 'grid' || targetType == 'association') {
      defaultData = function () {
        if (referArgs && referArgs.repeatable) {
          return []
        }
        let rows
        if (targetType == 'grid') {
          rows = config.model.getSimpleData()
        } else if (targetType == 'association') {
          rows = config.model.associations[config.association].datatable.getSimpleData()
        }
        if (!rows) {
          return []
        }
        return rows.map(function (row) {
          // return row.getValue(config.adapter.idKey)
          return adapter(row, config, 'refer')
        })
      }
    }

    let onOk
    switch (targetType) {
      case 'grid':
        onOk = value4Grid(config, referArgs)
        break
      case 'association':
        onOk = value4Asso(config, referArgs)
        break
      case 'component':
        onOk = value4Com(config, referArgs)
        break
      case 'cell':
        onOk = value4Cell(config, referArgs)
        break
      default:
        onOk = value4Normal(config, referArgs)
        break
    }

    let referconfig = {
      module: module.module,
      args: referArgs,
      title: module.title,
      onOk,
      defaultData
    }

    if (config.onCancel) {
      referconfig.onCancel = config.onCancel
    }
    getRefer(referconfig)
  }
}
