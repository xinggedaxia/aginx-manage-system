export default function(config) {
  let methodsCode = ''

  // 新增方法模板代码
  const createMethod = `
    // 点击新增按钮
    handleCreate() {
      this.resetCreateFormData()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 重置新增表单数据
    resetCreateFormData() {
      this.createFormData = { ...this.createFormDataTemp }
    },
    // 新增数据
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.buttonLoading = true
          createApi(this.createFormData).then(() => {
            this.dialogFormVisible = false
            this.buttonLoading = false
            this.getList()
            this.$notify({
              title: '成功',
              message: '新增成功',
              type: 'success',
              duration: 2000
            })
          }).catch((e) => {
          this.buttonLoading = false
            console.log(e)
          })
        }
      })
    },
`
  const updateMethod = `
    // 点击编辑
    handleUpdate(row) {
      this.createFormData = { ...row } // copy obj
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 保存编辑
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.buttonLoading = true
          const tempData = { ...this.createFormData }
          updateApi(tempData).then(() => {
            this.dialogFormVisible = false
            this.buttonLoading = false
            this.getList()
            this.$notify({
              title: '成功',
              message: '编辑成功',
              type: 'success',
              duration: 2000
            })
          }).catch((e) => {
            this.buttonLoading = false
            console.log(e)
          })
        }
      })
    },`
  const deleteMethod = `
    // 删除数据
    handleDelete(row, index) {
      this.listLoading = true
      deleteApi(row.id).then(() => {
          this.dialogFormVisible = false
          this.listLoading = false
          if (this.list.length === 1 && this.listQuery.pageNumber !== 1) {
            this.listQuery.pageNumber--
          }
          this.getList()
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          })
        }).catch((e) => {
            this.listLoading = false
            console.log(e)
          })
    },`
  const toggleMethod = `
    // 状态切换
    handleToggle(row, index) {
      toggleApi(row.id).then(() => {
          this.dialogFormVisible = false
          this.getList()
          this.$notify({
            title: '成功',
            message: '操作成功',
            type: 'success',
            duration: 2000
          })
        }).catch((e) => {
            console.log(e)
          })
    },`
  const resetQueryMethod = `
    // 重置搜索条件
    resetQuery() {
      this.listQuery = { ...this.listQueryTemp }
      this.getList()
    },`

  const downLoadMethod = `
    // 导出表格数据
    handleDownload() {
        /* this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })*/
      },
    // 表格数据格式化
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
   }))
},`
  const customMethod = `
     // 自定义方法
     handleCustom(){

     },`
  const customMethodTable = `
     // 自定义表格方法
     handleTableCustom(){

     },`
  const uncaughtMethod = `
     uncaughtMethod(){
        console.log('未被捕获的方法类型，请先配置');
     },`

  const Buttons = config.formButtons.concat(config.tableButtons)

  // 拿到所有按钮，获取对应事件
  for (const button of Buttons) {
    switch (button) {
      case 'add':
        methodsCode += createMethod
        break
      case 'reset':
        methodsCode += resetQueryMethod
        break
      case 'export':
        methodsCode += downLoadMethod
        break
      case 'edit':
        methodsCode += updateMethod
        break
      case 'delete':
        methodsCode += deleteMethod
        break
      case 'toggle':
        methodsCode += toggleMethod
        break
      case 'custom':
        methodsCode += customMethod
        break
      case 'custom_t':
        methodsCode += customMethodTable
        break
      case 'search':
        break
      default:
        methodsCode += uncaughtMethod
    }
  }

  return `
  methods: {
    //点击搜索
    handleSearch() {
      this.listQuery.pageNum = 1 //重置pageNum
      this.getList()
    },
    // 获取列表
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.data.total
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
      })
    },
    ${methodsCode.trim()}`
}
