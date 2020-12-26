export default function(config) {
  let filterCode = ''
  config.tableData.forEach((item, index) => {
    if (item.use && item.needFilter) {
      filterCode += `
             ${item.stringName}Filter: function(${item.stringName}) {
                return ${item.stringName}
              },`
    }
  })

  return `
    filters: {
    ${filterCode.trim()}
  },`
}
