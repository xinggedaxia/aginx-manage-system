<template>
  <div class="layout-content question-manage">
    <el-card class="box-card">

      <!--搜索栏-->
      <div class="table-page-search-wrapper">
        <el-form :model="listQuery" label-width="80px" size="small">
          <el-row :gutter="48">

            <!--基本搜索条件-->
            <el-col :md="8" :sm="24">
              <el-form-item label="标题:">
                <el-input v-model="listQuery.title" placeholder="请输入标题" @keyup.enter.native="handleSearch" />
              </el-form-item>
            </el-col>
            <el-col :md="8" :sm="24">
              <el-form-item label="类型:">
                <el-select v-model="listQuery.type" placeholder="请选择类型">
                  <el-option label="全部" value="" />
                  <el-option v-for="{label,value} in optionGroup.typeList" :key="value" :label="label" :value="value" />
                </el-select>
              </el-form-item>
            </el-col>

            <!--高级搜索条件-->
            <template v-if="advanced">
              <el-col :md="8" :sm="24">
                <el-form-item label="难度:">
                  <el-select v-model="listQuery.level" placeholder="请选择难度">
                    <el-option label="全部" value="" />
                    <el-option
                      v-for="{label,value} in optionGroup.levelList"
                      :key="value"
                      :label="label"
                      :value="value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :md="8" :sm="24">
                <el-form-item label="创建人:">
                  <el-input v-model="listQuery.createBy" placeholder="请输入创建人" @keyup.enter.native="handleSearch" />
                </el-form-item>
              </el-col>
              <!--              <el-col :md="8" :sm="24">-->
              <!--                <el-form-item label="更新人:">-->
              <!--                  <el-input v-model="listQuery.updateBy" placeholder="请输入更新人" @keyup.enter.native="handleSearch" />-->
              <!--                </el-form-item>-->
              <!--              </el-col>-->
            </template>

            <!--查询操作按钮-->
            <el-col :md="!advanced && 8 || 24" :sm="24">
              <div
                class="table-page-search-submitButtons"
                :style="advanced && { float: 'right', overflow: 'hidden' } || {} "
              >
                <el-button size="small" @click="resetQuery">重置</el-button>
                <el-button type="primary" size="small" @click="handleSearch">查询</el-button>
                <el-button type="primary" size="small" @click="handleCreate">新增</el-button>
                <el-button type="text" @click="advanced=!advanced">
                  {{ advanced ? '收起' : '展开' }}
                  <i :class="advanced?'el-icon-arrow-up':'el-icon-arrow-down'" />
                </el-button>
              </div>
            </el-col>
          </el-row>
        </el-form>
      </div>

      <!--表格-->
      <el-table
        v-loading="listLoading"
        :data="list"
        border
        fit
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column v-slot="{row}" label="标题" prop="title" width="500">
          <template>
            <el-tooltip class="item" effect="dark" :content="row.title" placement="top-start">
              <span>{{ row.title }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column v-slot="{row}" label="类型" prop="type">
          {{ row.type | typeFilter }}
        </el-table-column>
        <el-table-column v-slot="{row}" label="难度" prop="level">
          {{ row.level | levelFilter }}
        </el-table-column>
        <el-table-column label="创建人" prop="createBy" />
        <el-table-column label="创建日期" prop="createTime" />
        <el-table-column label="更新人" prop="updateBy" />
        <el-table-column label="更新日期" prop="updateTime" />

        <!--表格操作列-->
        <el-table-column label="操作" align="center" width="210" class-name="small-padding fixed-width">
          <template v-slot="{row,$index}">
            <el-button type="primary" size="mini" @click="handleUpdate(row)">
              编辑
            </el-button>
            <el-button type="primary" size="mini" @click="handlePreview(row)">
              预览
            </el-button>
            <el-popconfirm
              title="确认删除吗？"
              style="margin-left:10px;"
              @confirm="handleDelete(row,$index)"
            >
              <el-button slot="reference" size="mini" type="danger">
                删除
              </el-button>
            </el-popconfirm>
          </template>
        </el-table-column>

      </el-table>
      <!--分页-->
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.pageNum"
        :limit.sync="listQuery.pageSize"
        @pagination="getList"
      />

      <!--预览弹窗-->
      <el-dialog
        :title="textMap[dialogStatus]"
        :visible.sync="dialogFormVisible"
        custom-class="base-dialog question-manage-dialog"
      >
        <h2 class="title">{{ title }}</h2>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" size="small" @click="dialogFormVisible = false">
            关闭
          </el-button>
        </div>
        <markdown-editor view-modal :answer="answer" height="600px" />
      </el-dialog>
    </el-card>
  </div>
</template>

<script>

import { fetchList, createAccount, updateAccount } from '@/api/question-manage'
import Pagination from '@/components/Pagination' // 分页
import MarkdownEditor from '@/components/MarkdownEditor'

const options = JSON.parse(sessionStorage.getItem('options'))

export default {
  name: 'QuestionManage',
  components: { Pagination, MarkdownEditor },
  filters: {
    typeFilter: function(type) {
      return type
    },
    levelFilter: function(level) {
      return options.questionLevel.map[level]
    }
  },
  data() {
    return {
      title: '', // 弹窗标题
      answer: '', // 弹窗显示内容
      list: [{
        title: '什么是html?什么是html?什么是html?什么是html?什么是html?什么是html?html?什么是html?',
        type: 'html',
        level: 1,
        answer: '## 答案\n' +
          '超文本标记语言（英语：HyperText Markup Language，简称：HTML）是一种用于创建网页的标准标记语言。HTML是一种基础技术，常与CSS、JavaScript一起被众多网站用于设计网页、网页应用程序以及移动应用程序的用户界面[3]。网页浏览器可以读取HTML文件，并将其渲染成可视化网页。HTML描述了一个网站的结构语义随着线索的呈现，使之成为一种标记语言而非编程语言。\n' +
          '\n' +
          'HTML元素是构建网站的基石。HTML允许嵌入图像与对象，并且可以用于创建交互式表单，它被用来结构化信息——例如标题、段落和列表等等，也可用来在一定程度上描述文档的外观和语义。HTML的语言形式为尖括号包围的HTML元素（如<html>），浏览器使用HTML标签和脚本来诠释网页内容，但不会将它们显示在页面上。\n' +
          '\n' +
          'HTML可以嵌入如JavaScript的脚本语言，它们会影响HTML网页的行为。网页浏览器也可以引用层叠样式表（CSS）来定义文本和其它元素的外观与布局。维护HTML和CSS标准的组织万维网联盟（W3C）鼓励人们使用CSS替代一些用于表现的HTML元素[4]。\n' +
          '\n' +
          '## 解析\n' +
          'HTML的首个公开描述出现于一个名为HTML Tags页面存档备份，存于互联网档案馆的文件中，由蒂姆·伯纳斯-李于1991年底提及[8][9]。它描述18个元素，包括HTML初始的、相对简单的设计。除了超链接标签外，其他设计都深受CERN内部一个以标准通用标记语言（SGML）为基础的文件格式SGMLguid的影响。这些元素仍有11个存在于HTML 4中[10]。\n' +
          '\n' +
          '伯纳斯-李认为HTML是SGML的一个应用程序。1993年中期互联网工程任务组（IETF）发布首个HTML规范的提案：“超文本标记语言（HTML）”互联网草案页面存档备份，存于互联网档案馆，由伯纳斯-李与丹·康纳利撰写。其中包括一个SGML文档类型定义来定义语法[11]。草案于6个月后过期，不过值得注意的是其对NCSA Mosaic浏览器嵌入在线图像的自定义标签的认可，这反映IETF把标准立足于成功原型的理念[12]。同样，戴夫·拉格特在1993年末提出的与之竞争的互联网草案“HTML+（超文本标记格式）”建议规范已经实现的功能，如表格与填写表单[13]。\n' +
          '\n' +
          '在HTML和HTML+的草案于1994年初到期后，IETF创建一个HTML工作组，并在1995年完成"HTML 2.0"，这是第一个旨在成为对其后续实现标准的依据的HTML规范[14]。\n' +
          '\n' +
          '在IETF的主持下，HTML标准的进一步发展因竞争利益而遭受停滞。自1996年起，HTML规范一直由万维网联盟（W3C）维护，并由商业软件厂商出资[15]。不过在2000年，HTML也成为国际标准（ISO/ IEC15445：2000）。HTML 4.01于1999年末发布，进一步的勘误版本于2001年发布。2004年，网页超文本应用技术工作小组（WHATWG）开始开发HTML5，并在2008年与W3C共同交付，2014年10月28日完成标准化[16]。\n' +
          '\n' +
          '## 参考资料\n' +
          '[维基百科](https://zh.wikipedia.org/wiki/HTML#发展)',
        createBy: 'xingge',
        createTime: '2020-12-31',
        updateBy: '-',
        updateTime: '-'
      }, {
        title: '什么是js?',
        type: 'js',
        level: 2,
        answer: '## 答案\n' +
          '在此输入答案\n' +
          '```javascript \n' +
          'const a = 1;\nlet b = 1 + 1;\n' +
          '```\n' +
          '## 解析\n' +
          '在此输入解析\n',
        createBy: 'xingge',
        createTime: '2020-12-31',
        updateBy: '-',
        updateTime: '-'
      }], // 表格数据
      listLoading: true, // 表格加载状态
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        title: '',
        type: '',
        level: '',
        createBy: '',
        updateBy: ''
      }, // 查询条件
      listQueryTemp: {
        pageNum: 1,
        pageSize: 10,
        title: '',
        type: '',
        level: '',
        createBy: '',
        updateBy: ''
      }, // 用于重置查询条件
      total: 0, // 总数据条数
      advanced: false, // 是否展开高级搜索条件
      optionGroup: {
        typeList: [
          {
            label: '条件1',
            value: '1'
          },
          {
            label: '条件2',
            value: '0'
          }
        ],
        levelList: options.questionLevel.list
      }, // 存放选项的数据
      createFormData: {
        title: '',
        type: 0,
        level: 0,
        answer: '',
        createBy: '',
        createTime: '',
        updateBy: '',
        updateTime: ''
      }, // 存储新增和编辑框的数据
      createFormDataTemp: {
        title: '',
        type: 0,
        level: 0,
        answer: '',
        createBy: '',
        createTime: '',
        updateBy: '',
        updateTime: ''
      }, // 用于重置新增的数据
      rules: {
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        type: [{ required: true, message: '请选择类型', trigger: 'change' }],
        level: [{ required: true, message: '请选择难度', trigger: 'change' }],
        answer: [{ required: true, message: '请输入答案', trigger: 'blur' }]
      }, // 新增和编辑框的规则
      textMap: {
        update: '编辑',
        create: '新增'
      }, // 弹出框标题
      dialogFormVisible: false,
      dialogStatus: ''
    }
  },
  created() {
    this.listLoading = false// fixme:对好接口后移除这行代码
    // this.getList()
  },

  methods: {
    // 题目预览
    handlePreview(row) {
      this.dialogFormVisible = true
      this.title = row.title
      this.answer = row.answer
    },
    // 点击搜索
    handleSearch() {
      this.listQuery.pageNum = 1 // 重置pageNum
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
    // 重置搜索条件
    resetQuery() {
      this.listQuery = { ...this.listQueryTemp }
      this.getList()
    },
    // 点击新增按钮
    handleCreate() {
      this.$router.push({
        name: 'AddQuestion'
      })
      // this.resetCreateFormData()
      // this.dialogStatus = 'create'
      // this.dialogFormVisible = true
      // this.$nextTick(() => {
      //   this.$refs['dataForm'].clearValidate()
      // })
    },
    // 重置新增表单数据
    resetCreateFormData() {
      this.createFormData = { ...this.createFormDataTemp }
    },
    // 新增数据
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createApi(this.createFormData).then(() => {
            this.dialogFormVisible = false
            this.getList()
            this.$notify({
              title: '成功',
              message: '新增成功',
              type: 'success',
              duration: 2000
            })
          }).catch((e) => {
            console.log(e)
          })
        }
      })
    },

    // 点击编辑
    handleUpdate(row) {
      const createFormData = { ...row }
      this.$router.push({
        name: 'EditQuestion',
        params: {
          createFormData: JSON.stringify(createFormData)
        }
      })
    },
    // 保存编辑
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = { ...this.createFormData }
          updateApi(tempData).then(() => {
            this.dialogFormVisible = false
            this.getList()
            this.$notify({
              title: '成功',
              message: '编辑成功',
              type: 'success',
              duration: 2000
            })
          }).catch((e) => {
            console.log(e)
          })
        }
      })
    },
    // 删除数据
    handleDelete(row, index) {
      deleteApi(row.id).then(() => {
        this.dialogFormVisible = false
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
        console.log(e)
      })
    }
  }
}
</script>

<!--局部样式-->
<style lang="scss" scoped>

.el-table{
  ::v-deep.cell{
    white-space: nowrap;
  }
}

.question-manage ::v-deep.question-manage-dialog {

  width: 1100px;

  .el-dialog__body {
    padding: 30px 40px;

    .title {
      margin-top: -40px;
      margin-bottom: 40px;
    }
  }
}
</style>
