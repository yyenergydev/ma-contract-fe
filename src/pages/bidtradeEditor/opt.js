export default function materialOperation (handleRemove) {
  return [
    {
      text: '移除',
      handler (obj) {
        handleRemove(obj.row.valueIndex)
      }
    }
  ]
}
