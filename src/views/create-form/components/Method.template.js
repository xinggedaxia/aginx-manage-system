export default function() {
  const tableColumnsCode = ''
  const tableButtonsCode = ''

  return `
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.data.total
        this.listLoading = false
      })
    },`
}
