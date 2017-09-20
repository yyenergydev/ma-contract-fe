import _ from 'lodash'

var config = {
  // 是否统一文本
  sftywb: {
    1: '是',
    2: '否'
  },
  // 是否系统内合同
  sfxtnht: {
    1: '是',
    2: '否'
  }
}

window.config = config
export default config

export function getStore (name) {
  var store = config[name]
  if (!store) return
  return _.map(store, function (text, key) {
    return {
      name: text,
      value: key
    }
  })
}
